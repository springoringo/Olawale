/**
 * populate.mjs
 * 1. Sets Public role permissions for Sermon (find + findOne) via SQLite
 * 2. Generates 4 sermon PNG images using sharp
 * 3. Re-logs into Strapi admin, uploads images, creates & publishes sermon entries
 */

import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const sharp = require('./node_modules/sharp');
const Database = require('../backend/node_modules/better-sqlite3');

const STRAPI_URL = 'http://localhost:1337';
const BACKEND_DIR = path.join(__dirname, '../backend');
const DB_PATH = path.join(BACKEND_DIR, '.tmp/data.db');
const IMAGES_DIR = path.join(__dirname, 'sermon-images');

// ─── Sermon data ────────────────────────────────────────────────────────────
const SERMONS = [
  {
    title: 'Spiritual Dominion',
    summary: 'In this powerful message, Pastor Femi Olawale explores what it means to walk in spiritual authority as a believer. Drawing from Scripture, he unpacks how God has positioned every Christian to rule in the spirit and overcome every work of darkness through Christ.',
    youtube_url: null,
  },
  {
    title: 'Open Heavens',
    summary: "Pastor Femi Olawale delivers a stirring message on accessing open heavens through consecration, prayer, and obedience to God's word. Learn the conditions for living under an open heaven and experiencing the supernatural favour and blessing of the Lord continuously.",
    youtube_url: null,
  },
  {
    title: 'Heart of Gratitude',
    summary: "Gratitude is a powerful spiritual discipline that positions us for more of God's goodness. In this sermon, Pastor Femi Olawale teaches on cultivating a lifestyle of thanksgiving and how a grateful heart opens doors that complaining closes.",
    youtube_url: null,
  },
  {
    title: 'New Songs',
    summary: 'God is always doing a new thing, and He calls His people to respond with fresh worship and new songs of praise. Pastor Femi Olawale encourages believers to leave behind spiritual stagnation and embrace the new moves of the Holy Spirit with open hearts and new melodies.',
    youtube_url: null,
  },
];

// ─── Step 1: Set Public permissions in SQLite ───────────────────────────────
function setPublicPermissions() {
  console.log('\n[1/4] Setting Public role permissions in SQLite…');
  const db = new Database(DB_PATH);

  const publicRole = db.prepare("SELECT id FROM up_roles WHERE type = 'public'").get();
  if (!publicRole) throw new Error('Public role not found');
  const roleId = publicRole.id;
  console.log(`    Public role id = ${roleId}`);

  const actions = ['api::sermon.sermon.find', 'api::sermon.sermon.findOne'];

  for (const action of actions) {
    const existing = db.prepare('SELECT id FROM up_permissions WHERE action = ?').get(action);
    if (existing) {
      console.log(`    Permission already exists: ${action} (id=${existing.id})`);
      // Ensure it's linked to Public role
      const linked = db.prepare('SELECT id FROM up_permissions_role_lnk WHERE permission_id = ? AND role_id = ?').get(existing.id, roleId);
      if (!linked) {
        db.prepare('INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord) VALUES (?, ?, 1)').run(existing.id, roleId);
        console.log(`    Linked existing permission to Public role`);
      }
      continue;
    }

    const docId = Math.random().toString(36).slice(2, 26);
    const now = Date.now();
    const result = db.prepare(
      'INSERT INTO up_permissions (document_id, action, created_at, updated_at, published_at) VALUES (?, ?, ?, ?, ?)'
    ).run(docId, action, now, now, now);

    const permId = result.lastInsertRowid;
    db.prepare('INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord) VALUES (?, ?, 1)').run(permId, roleId);
    console.log(`    ✓ Inserted permission: ${action}`);
  }

  db.close();
  console.log('    ✓ Permissions set.');
}

// ─── Step 2: Generate PNG images ────────────────────────────────────────────
const PALETTE = [
  { bg: '#1e3a5f', accent: '#f0a500' },  // Navy + Gold
  { bg: '#2d4a3e', accent: '#a8d5a2' },  // Forest + Sage
  { bg: '#4a1942', accent: '#e8b4d0' },  // Plum + Rose
  { bg: '#1a3c4d', accent: '#5bc8d4' },  // Deep Teal + Cyan
];

function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length <= maxChars) {
      current = (current + ' ' + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function generateImages() {
  console.log('\n[2/4] Generating sermon PNG images…');
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const paths = [];

  for (let i = 0; i < SERMONS.length; i++) {
    const sermon = SERMONS[i];
    const { bg, accent } = PALETTE[i % PALETTE.length];
    const titleLines = wrapText(sermon.title, 18);
    const W = 800, H = 450;

    // Build title tspans
    const lineH = 64;
    const totalTitleH = titleLines.length * lineH;
    const titleY = (H / 2) - (totalTitleH / 2) + 20;

    const tspans = titleLines.map((line, idx) =>
      `<tspan x="${W / 2}" dy="${idx === 0 ? 0 : lineH}">${escapeXml(line)}</tspan>`
    ).join('');

    const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bg};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:${bg}CC;stop-opacity:1"/>
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#00000066"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Decorative cross -->
  <line x1="${W/2}" y1="40" x2="${W/2}" y2="100" stroke="${accent}" stroke-width="3" opacity="0.6"/>
  <line x1="${W/2 - 20}" y1="60" x2="${W/2 + 20}" y2="60" stroke="${accent}" stroke-width="3" opacity="0.6"/>

  <!-- Top accent bar -->
  <rect x="60" y="30" width="120" height="4" fill="${accent}" rx="2"/>

  <!-- Bottom accent bar -->
  <rect x="${W - 180}" y="${H - 34}" width="120" height="4" fill="${accent}" rx="2"/>

  <!-- Preacher name -->
  <text x="${W/2}" y="${titleY - 50}" font-family="Georgia, serif" font-size="18" fill="${accent}" text-anchor="middle" letter-spacing="3" opacity="0.9">PASTOR FEMI OLAWALE</text>

  <!-- Title -->
  <text x="${W/2}" y="${titleY}" font-family="Georgia, serif" font-size="56" font-weight="bold" fill="white" text-anchor="middle" filter="url(#shadow)">${tspans}</text>

  <!-- Divider -->
  <line x1="${W/2 - 80}" y1="${titleY + totalTitleH + 20}" x2="${W/2 + 80}" y2="${titleY + totalTitleH + 20}" stroke="${accent}" stroke-width="2" opacity="0.7"/>

  <!-- Church name -->
  <text x="${W/2}" y="${H - 50}" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" opacity="0.7" letter-spacing="1">RCCG OVERCOMERS' CHAPEL</text>
</svg>`;

    const outPath = path.join(IMAGES_DIR, `${sermon.title.toLowerCase().replace(/\s+/g, '-')}.png`);
    await sharp(Buffer.from(svg)).png().toFile(outPath);
    console.log(`    ✓ ${path.basename(outPath)}`);
    paths.push(outPath);
  }

  return paths;
}

// ─── Helpers ────────────────────────────────────────────────────────────────
async function strapiLogin() {
  const res = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@gracechurch.com', password: 'Admin1234!' }),
  });
  const json = await res.json();
  if (!json.data?.token) throw new Error('Login failed: ' + JSON.stringify(json));
  return json.data.token;
}

async function uploadImage(token, imagePath) {
  // Use Node 18+ built-in FormData + Blob
  const fileBuffer = fs.readFileSync(imagePath);
  const filename = path.basename(imagePath);
  const blob = new Blob([fileBuffer], { type: 'image/png' });

  const form = new FormData();
  form.append('files', blob, filename);

  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const json = await res.json();
  if (!Array.isArray(json) || !json[0]) throw new Error('Upload failed: ' + JSON.stringify(json));
  return json[0];
}

async function createSermon(token, sermonData) {
  // Use admin content-manager API — accepts admin JWT token
  const res = await fetch(`${STRAPI_URL}/content-manager/collection-types/api::sermon.sermon`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(sermonData),
  });
  return res.json();
}

async function publishSermon(token, documentId) {
  // Admin content-manager publish action
  const res = await fetch(`${STRAPI_URL}/content-manager/collection-types/api::sermon.sermon/${documentId}/actions/publish`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// ─── Step 3 + 4: Upload images & create sermons ─────────────────────────────
async function populateSermons(imagePaths) {
  console.log('\n[3/4] Logging into Strapi admin…');
  const token = await strapiLogin();
  console.log('    ✓ Authenticated');

  console.log('\n[4/4] Uploading images and creating sermons…');
  for (let i = 0; i < SERMONS.length; i++) {
    const sermon = SERMONS[i];
    const imgPath = imagePaths[i];

    // Upload image
    let uploadedFile = null;
    try {
      uploadedFile = await uploadImage(token, imgPath);
      console.log(`    ✓ Uploaded image: ${uploadedFile.name}`);
    } catch (e) {
      console.warn(`    ⚠ Image upload failed for "${sermon.title}": ${e.message}`);
    }

    // Create sermon entry
    const sermonPayload = {
      title: sermon.title,
      summary: sermon.summary,
      ...(sermon.youtube_url ? { youtube_url: sermon.youtube_url } : {}),
      ...(uploadedFile ? { image: uploadedFile.id } : {}),
    };

    const created = await createSermon(token, sermonPayload);
    // content-manager returns the entry directly (not nested under .data)
    const docId = created.documentId || created.data?.documentId;
    if (!docId) {
      console.error(`    ✗ Failed to create "${sermon.title}": ${JSON.stringify(created).slice(0,200)}`);
      continue;
    }

    // Publish it
    const published = await publishSermon(token, docId);
    const pubAt = published.publishedAt || published.data?.publishedAt;
    if (pubAt) {
      console.log(`    ✓ Created & published: "${sermon.title}" (${docId})`);
    } else {
      console.log(`    ~ Created (publish status unclear): "${sermon.title}" — ${JSON.stringify(published).slice(0,100)}`);
    }
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────
(async () => {
  try {
    setPublicPermissions();
    const imagePaths = await generateImages();
    await populateSermons(imagePaths);
    console.log('\n✅ Done! 4 sermons created and published.\n');
  } catch (e) {
    console.error('\n❌ Error:', e.message);
    process.exit(1);
  }
})();
