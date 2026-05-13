import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const Database = require('../backend/node_modules/better-sqlite3');

const STRAPI_URL = 'http://localhost:1337';
const DB_PATH = path.join(__dirname, '../backend/.tmp/data.db');
const API_TOKEN = '0b4ab15ef30eac110295fee1d36ff2234edf68b78a1131a7c0a6656789bf91414100bbf50eef3a937d37c193e58a56ef7620f3a0f74e2baeccc6938a5030e4976319e0ed4a02ee4e48c7825461eb0d68f3e983b37074fdcb7ca6172d52cc06fe06a3f84c4c966b96521c7404f118d8be340504aaaeab339cfbfbe31d37eeca62';

const CONTENT = {
  hero_title: 'Grow in Faith &\nGod\'s Word',
  hero_subtitle: 'Explore our weekly sermons and teachings to deepen your walk with God. Every message is rooted in Scripture and delivered with passion.',
  hero_cta_text: 'Browse Sermons',
  hero_cta_url: '/sermons',
};

async function getAdminToken() {
  const res = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@gracechurch.com', password: 'Admin1234!' }),
  });
  return (await res.json()).data.token;
}

function setPublicPermission() {
  const db = new Database(DB_PATH);
  const publicRole = db.prepare("SELECT id FROM up_roles WHERE type = 'public'").get();
  const action = 'api::homepage.homepage.find';
  const existing = db.prepare('SELECT id FROM up_permissions WHERE action = ?').get(action);
  if (existing) {
    const linked = db.prepare('SELECT id FROM up_permissions_role_lnk WHERE permission_id = ? AND role_id = ?').get(existing.id, publicRole.id);
    if (!linked) db.prepare('INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord) VALUES (?, ?, 1)').run(existing.id, publicRole.id);
  } else {
    const docId = Math.random().toString(36).slice(2, 26);
    const now = Date.now();
    const r = db.prepare('INSERT INTO up_permissions (document_id, action, created_at, updated_at, published_at) VALUES (?, ?, ?, ?, ?)').run(docId, action, now, now, now);
    db.prepare('INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord) VALUES (?, ?, 1)').run(r.lastInsertRowid, publicRole.id);
  }
  db.close();
  console.log('  ✓ Public permission set for homepage.find');
}

async function getHeroImageId() {
  // Find the already-uploaded open-heavens image in the Strapi media library
  const res = await fetch(`${STRAPI_URL}/api/upload/files?filters[name][$containsi]=open-heavens`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
  const files = await res.json();
  if (Array.isArray(files) && files.length > 0) {
    console.log(`  ✓ Found hero image: ${files[0].name} (id=${files[0].id})`);
    return files[0].id;
  }

  // Fallback: download and upload a fresh landscape church/sky image
  console.log('  Uploading fresh hero image from Wikimedia…');
  const imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Light_rays_filtering_through_the_clouds_in_the_sky.jpg/1280px-Light_rays_filtering_through_the_clouds_in_the_sky.jpg';
  const imgRes = await fetch(imgUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!imgRes.ok) throw new Error('Failed to download hero image');
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const blob = new Blob([buf], { type: 'image/jpeg' });
  const form = new FormData();
  form.append('files', blob, 'hero-open-heavens.jpg');
  const uploadRes = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    body: form,
  });
  const uploaded = await uploadRes.json();
  if (!Array.isArray(uploaded) || !uploaded[0]) throw new Error('Upload failed: ' + JSON.stringify(uploaded).slice(0, 200));
  console.log(`  ✓ Uploaded hero image: ${uploaded[0].name} (id=${uploaded[0].id})`);
  return uploaded[0].id;
}

(async () => {
  console.log('[1/3] Setting public permission…');
  setPublicPermission();

  console.log('[2/3] Resolving hero image…');
  const imageId = await getHeroImageId();

  console.log('[3/3] Creating Homepage entry…');
  const token = await getAdminToken();

  const res = await fetch(`${STRAPI_URL}/content-manager/single-types/api::homepage.homepage`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ...CONTENT, hero_image: imageId }),
  });
  const result = await res.json();
  const docId = result.documentId ?? result.data?.documentId;
  if (!docId) {
    console.error('  ✗ Failed:', JSON.stringify(result).slice(0, 300));
    process.exit(1);
  }
  console.log('  ✓ Homepage entry saved');

  await fetch(`${STRAPI_URL}/content-manager/single-types/api::homepage.homepage/actions/publish`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('  ✓ Published');

  console.log('\n✅ Done! Homepage is editable in Strapi admin → Content Manager → Homepage');
})();
