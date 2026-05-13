import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const sharp = require('./node_modules/sharp');

const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = '0b4ab15ef30eac110295fee1d36ff2234edf68b78a1131a7c0a6656789bf91414100bbf50eef3a937d37c193e58a56ef7620f3a0f74e2baeccc6938a5030e4976319e0ed4a02ee4e48c7825461eb0d68f3e983b37074fdcb7ca6172d52cc06fe06a3f84c4c966b96521c7404f118d8be340504aaaeab339cfbfbe31d37eeca62';
const IMAGES_DIR = path.join(__dirname, 'blog-images');

const POSTS = [
  {
    documentId: 'tkyus1dc4uj3n8hwqp4faqzr',
    title: 'A God to Pharaoh',
    subtitle: 'Exodus 7:1',
    filename: 'a-god-to-pharaoh.png',
    palette: { bg: '#1a1a2e', mid: '#16213e', accent: '#e2b96f', cross: '#c9a24e' },
    symbol: 'staff',
  },
  {
    documentId: 'xf2yrsq6e6ncjpa7x6faliwd',
    title: 'Ebenezer',
    subtitle: 'The LORD has helped us',
    filename: 'ebenezer-the-lord-has-helped-us.png',
    palette: { bg: '#1c3144', mid: '#102a43', accent: '#a8dadc', cross: '#81c3c8' },
    symbol: 'stone',
  },
  {
    documentId: 'htihseyx8ti7r44jq2dfoerb',
    title: 'Loins Girded,',
    subtitle: 'Light Burning',
    filename: 'loins-girded-light-burning.png',
    palette: { bg: '#1f1300', mid: '#2d1b00', accent: '#f4a61d', cross: '#e8941a' },
    symbol: 'flame',
  },
];

function escXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildSvg({ title, subtitle, palette, symbol }) {
  const W = 800, H = 450;
  const { bg, mid, accent, cross } = palette;

  // Symbol SVG paths
  const symbols = {
    staff: `
      <line x1="${W/2}" y1="60" x2="${W/2}" y2="160" stroke="${accent}" stroke-width="5" stroke-linecap="round" opacity="0.5"/>
      <path d="M${W/2 - 18} 68 Q${W/2} 52 ${W/2 + 18} 68" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round" opacity="0.5"/>
      <line x1="${W/2 - 28}" y1="95" x2="${W/2 + 28}" y2="95" stroke="${accent}" stroke-width="3" opacity="0.4"/>`,
    stone: `
      <ellipse cx="${W/2}" cy="115" rx="38" ry="28" fill="none" stroke="${accent}" stroke-width="4" opacity="0.5"/>
      <line x1="${W/2 - 20}" y1="102" x2="${W/2 + 10}" y2="128" stroke="${accent}" stroke-width="2" opacity="0.3"/>
      <line x1="${W/2 + 15}" y1="100" x2="${W/2 - 5}" y2="130" stroke="${accent}" stroke-width="2" opacity="0.25"/>`,
    flame: `
      <path d="M${W/2} 65 C${W/2 - 14} 80 ${W/2 - 22} 95 ${W/2 - 10} 110 C${W/2 - 16} 98 ${W/2} 92 ${W/2} 92 C${W/2} 92 ${W/2 + 16} 98 ${W/2 + 10} 110 C${W/2 + 22} 95 ${W/2 + 14} 80 ${W/2} 65Z"
        fill="${accent}" opacity="0.55"/>
      <path d="M${W/2} 82 C${W/2 - 7} 91 ${W/2 - 10} 102 ${W/2} 110 C${W/2 + 10} 102 ${W/2 + 7} 91 ${W/2} 82Z"
        fill="white" opacity="0.3"/>`,
  };

  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bg}"/>
      <stop offset="100%" style="stop-color:${mid}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="30%" r="45%">
      <stop offset="0%" style="stop-color:${accent};stop-opacity:0.12"/>
      <stop offset="100%" style="stop-color:${accent};stop-opacity:0"/>
    </radialGradient>
    <filter id="blur2"><feGaussianBlur stdDeviation="2"/></filter>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- Subtle grid lines -->
  <line x1="0" y1="${H/2}" x2="${W}" y2="${H/2}" stroke="${accent}" stroke-width="0.5" opacity="0.08"/>
  <line x1="${W/2}" y1="0" x2="${W/2}" y2="${H}" stroke="${accent}" stroke-width="0.5" opacity="0.08"/>

  <!-- Corner marks -->
  <polyline points="30,50 30,30 50,30" fill="none" stroke="${accent}" stroke-width="2" opacity="0.4"/>
  <polyline points="${W-50},30 ${W-30},30 ${W-30},50" fill="none" stroke="${accent}" stroke-width="2" opacity="0.4"/>
  <polyline points="30,${H-50} 30,${H-30} 50,${H-30}" fill="none" stroke="${accent}" stroke-width="2" opacity="0.4"/>
  <polyline points="${W-50},${H-30} ${W-30},${H-30} ${W-30},${H-50}" fill="none" stroke="${accent}" stroke-width="2" opacity="0.4"/>

  <!-- Symbol -->
  ${symbols[symbol]}

  <!-- Accent rule above title -->
  <rect x="${W/2 - 40}" y="172" width="80" height="2" rx="1" fill="${accent}" opacity="0.7"/>

  <!-- Main title -->
  <text x="${W/2}" y="228" font-family="Georgia, 'Times New Roman', serif" font-size="58"
    font-weight="bold" fill="white" text-anchor="middle"
    style="filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6))">${escXml(title)}</text>

  <!-- Subtitle -->
  <text x="${W/2}" y="274" font-family="Georgia, 'Times New Roman', serif" font-size="28"
    fill="${accent}" text-anchor="middle" opacity="0.9">${escXml(subtitle)}</text>

  <!-- Accent rule below subtitle -->
  <rect x="${W/2 - 40}" y="292" width="80" height="2" rx="1" fill="${accent}" opacity="0.5"/>

  <!-- Author -->
  <text x="${W/2}" y="360" font-family="Arial, sans-serif" font-size="15"
    fill="white" text-anchor="middle" opacity="0.55" letter-spacing="3">PASTOR FEMI OLAWALE</text>

  <!-- Bottom label -->
  <text x="${W/2}" y="410" font-family="Arial, sans-serif" font-size="12"
    fill="white" text-anchor="middle" opacity="0.35" letter-spacing="2">RCCG OVERCOMERS&apos; CHAPEL</text>
</svg>`;
}

async function getAdminToken() {
  const res = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@gracechurch.com', password: 'Admin1234!' }),
  });
  return (await res.json()).data.token;
}

async function uploadImage(imgPath) {
  const blob = new Blob([fs.readFileSync(imgPath)], { type: 'image/png' });
  const form = new FormData();
  form.append('files', blob, path.basename(imgPath));
  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    body: form,
  });
  const json = await res.json();
  if (!Array.isArray(json) || !json[0]) throw new Error('Upload failed: ' + JSON.stringify(json).slice(0,200));
  return json[0];
}

async function attachAndRepublish(adminToken, documentId, imageId) {
  await fetch(`${STRAPI_URL}/content-manager/collection-types/api::post.post/${documentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ image: imageId }),
  });
  await fetch(`${STRAPI_URL}/content-manager/collection-types/api::post.post/${documentId}/actions/publish`, {
    method: 'POST', headers: { Authorization: `Bearer ${adminToken}` },
  });
}

(async () => {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  console.log('[1/3] Generating images…');
  for (const post of POSTS) {
    const svg = buildSvg(post);
    const outPath = path.join(IMAGES_DIR, post.filename);
    await sharp(Buffer.from(svg)).png({ compressionLevel: 8 }).toFile(outPath);
    console.log(`  ✓ ${post.filename}`);
  }

  console.log('[2/3] Uploading to Strapi…');
  const adminToken = await getAdminToken();
  for (const post of POSTS) {
    const imgPath = path.join(IMAGES_DIR, post.filename);
    const uploaded = await uploadImage(imgPath);
    console.log(`  ✓ Uploaded: ${uploaded.name} (id=${uploaded.id})`);

    await attachAndRepublish(adminToken, post.documentId, uploaded.id);
    console.log(`  ✓ Attached to "${post.title}"`);
  }

  console.log('\n✅ Done!');
})();
