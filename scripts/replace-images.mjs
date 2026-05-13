import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STRAPI_URL = 'http://localhost:1337';
// Full-access API token (from attach-images.mjs)
const API_TOKEN = '0b4ab15ef30eac110295fee1d36ff2234edf68b78a1131a7c0a6656789bf91414100bbf50eef3a937d37c193e58a56ef7620f3a0f74e2baeccc6938a5030e4976319e0ed4a02ee4e48c7825461eb0d68f3e983b37074fdcb7ca6172d52cc06fe06a3f84c4c966b96521c7404f118d8be340504aaaeab339cfbfbe31d37eeca62';

// ── Real images from Wikimedia Commons (free/open licence) ──────────────────
const ITEMS = [
  // ── Sermons ──
  {
    type: 'sermon',
    title: 'People',
    documentId: 'jmdjbfhys119056uh50zh2og',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Calvary_Baptist_Church_worship_service.jpg',
    filename: 'people-worship-service.jpg',
  },
  {
    type: 'sermon',
    title: 'Spiritual Dominion',
    documentId: 'p00u87xgxwlcjfu7a09ctqs3',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Prayer_Pillars_Serge_on_Olkhon_Island.jpg',
    filename: 'spiritual-dominion-prayer.jpg',
  },
  {
    type: 'sermon',
    title: 'Open Heavens',
    documentId: 'jggyx0ye41v2itk25op4dn1v',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Light_rays_filtering_through_the_clouds_in_the_sky.jpg/1280px-Light_rays_filtering_through_the_clouds_in_the_sky.jpg',
    filename: 'open-heavens-light-rays.jpg',
  },
  {
    type: 'sermon',
    title: 'Heart of Gratitude',
    documentId: 'ggxbki3l7p2n9shwbgebihec',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/O_Praise_Him.jpg/1280px-O_Praise_Him.jpg',
    filename: 'heart-of-gratitude-praise.jpg',
  },
  {
    type: 'sermon',
    title: 'New Songs',
    documentId: 't248misplu9fr19vza9f0e3o',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Serenity_Worship_Group%2C_the_worship_group_in_Hamburg_led_by_Daniel_Jeddman.jpg/1280px-Serenity_Worship_Group%2C_the_worship_group_in_Hamburg_led_by_Daniel_Jeddman.jpg',
    filename: 'new-songs-worship-group.jpg',
  },

  // ── Blog posts ──
  {
    type: 'post',
    title: 'A God to Pharaoh',
    documentId: 'tkyus1dc4uj3n8hwqp4faqzr',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Galilee_Missionary_Baptist_Church.jpg/1280px-Galilee_Missionary_Baptist_Church.jpg',
    filename: 'a-god-to-pharaoh-church.jpg',
  },
  {
    type: 'post',
    title: 'Ebenezer',
    documentId: 'xf2yrsq6e6ncjpa7x6faliwd',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Stone_pile_near_Alesjaurestugorna_-_panoramio.jpg/1280px-Stone_pile_near_Alesjaurestugorna_-_panoramio.jpg',
    filename: 'ebenezer-memorial-stones.jpg',
  },
  {
    type: 'post',
    title: 'Loins Girded, Light Burning',
    documentId: 'htihseyx8ti7r44jq2dfoerb',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Burning_In_Wind_%2819536039%29.jpeg/1280px-Burning_In_Wind_%2819536039%29.jpeg',
    filename: 'loins-girded-candle.jpg',
  },
];

async function getAdminToken() {
  const res = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@gracechurch.com', password: 'Admin1234!' }),
  });
  const json = await res.json();
  if (!json.data?.token) throw new Error('Login failed: ' + JSON.stringify(json).slice(0, 200));
  return json.data.token;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function downloadImage(url, filename, attempt = 1) {
  console.log(`  Downloading ${filename}…`);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SiteBuilder/1.0)' },
  });
  if (res.status === 429 && attempt <= 3) {
    const wait = attempt * 8000;
    console.log(`  Rate limited — waiting ${wait / 1000}s…`);
    await sleep(wait);
    return downloadImage(url, filename, attempt + 1);
  }
  if (!res.ok) throw new Error(`Download failed: ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  console.log(`  Downloaded ${(buf.length / 1024).toFixed(0)} KB`);
  return buf;
}

async function uploadToStrapi(buf, filename) {
  const mime = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';
  const blob = new Blob([buf], { type: mime });
  const form = new FormData();
  form.append('files', blob, filename);

  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    body: form,
  });
  const json = await res.json();
  if (!Array.isArray(json) || !json[0]) throw new Error('Upload failed: ' + JSON.stringify(json).slice(0, 200));
  return json[0]; // { id, url, name, … }
}

async function attachAndPublish(adminToken, item, imageId) {
  const apiName = item.type === 'sermon' ? 'api::sermon.sermon' : 'api::post.post';
  const base = `${STRAPI_URL}/content-manager/collection-types/${apiName}/${item.documentId}`;

  // Update draft with new image
  const putRes = await fetch(base, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ image: imageId }),
  });
  const putJson = await putRes.json();
  const docId = putJson.documentId ?? putJson.data?.documentId;
  if (!docId) throw new Error('Attach failed: ' + JSON.stringify(putJson).slice(0, 200));

  // Publish to sync draft → published
  const pubRes = await fetch(`${base}/actions/publish`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  if (!pubRes.ok) throw new Error('Publish failed: ' + pubRes.status);
}

(async () => {
  console.log('Logging in…');
  const adminToken = await getAdminToken();
  console.log('✓ Admin token acquired\n');

  for (const item of ITEMS) {
    console.log(`[${item.type.toUpperCase()}] "${item.title}"`);
    try {
      const buf = await downloadImage(item.imageUrl, item.filename);
      const uploaded = await uploadToStrapi(buf, item.filename);
      console.log(`  ✓ Uploaded → id=${uploaded.id} (${uploaded.name})`);
      await attachAndPublish(adminToken, item, uploaded.id);
      console.log(`  ✓ Attached & published\n`);
    } catch (e) {
      console.error(`  ✗ Failed: ${e.message}\n`);
    }
    await sleep(3000); // avoid rate limiting between items
  }

  console.log('✅ Done! All images replaced with real photos.');
})();
