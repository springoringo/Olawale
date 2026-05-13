import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = '0b4ab15ef30eac110295fee1d36ff2234edf68b78a1131a7c0a6656789bf91414100bbf50eef3a937d37c193e58a56ef7620f3a0f74e2baeccc6938a5030e4976319e0ed4a02ee4e48c7825461eb0d68f3e983b37074fdcb7ca6172d52cc06fe06a3f84c4c966b96521c7404f118d8be340504aaaeab339cfbfbe31d37eeca62';
const IMAGES_DIR = path.join(__dirname, 'sermon-images');

// documentIds from the previous run
const SERMONS = [
  { title: 'Spiritual Dominion',  documentId: 'p00u87xgxwlcjfu7a09ctqs3', image: 'spiritual-dominion.png' },
  { title: 'Open Heavens',        documentId: 'jggyx0ye41v2itk25op4dn1v', image: 'open-heavens.png' },
  { title: 'Heart of Gratitude',  documentId: 'ggxbki3l7p2n9shwbgebihec', image: 'heart-of-gratitude.png' },
  { title: 'New Songs',           documentId: 't248misplu9fr19vza9f0e3o', image: 'new-songs.png' },
];

async function uploadImage(imagePath) {
  const fileBuffer = fs.readFileSync(imagePath);
  const filename = path.basename(imagePath);
  const blob = new Blob([fileBuffer], { type: 'image/png' });
  const form = new FormData();
  form.append('files', blob, filename);

  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    body: form,
  });
  const json = await res.json();
  if (!Array.isArray(json) || !json[0]) throw new Error('Upload failed: ' + JSON.stringify(json).slice(0, 200));
  return json[0];
}

async function getAdminToken() {
  const res = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@gracechurch.com', password: 'Admin1234!' }),
  });
  const json = await res.json();
  return json.data.token;
}

async function attachImage(adminToken, documentId, imageId) {
  const res = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/api::sermon.sermon/${documentId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ image: imageId }),
    }
  );
  return res.json();
}

(async () => {
  const adminToken = await getAdminToken();
  console.log('Logged in as admin');

  for (const sermon of SERMONS) {
    const imgPath = path.join(IMAGES_DIR, sermon.image);

    // Upload
    let uploaded;
    try {
      uploaded = await uploadImage(imgPath);
      console.log(`✓ Uploaded: ${uploaded.name} (id=${uploaded.id})`);
    } catch (e) {
      console.error(`✗ Upload failed for "${sermon.title}": ${e.message}`);
      continue;
    }

    // Attach to sermon
    const result = await attachImage(adminToken, sermon.documentId, uploaded.id);
    if (result.documentId) {
      console.log(`✓ Attached image to "${sermon.title}"`);
    } else {
      console.error(`✗ Attach failed: ${JSON.stringify(result).slice(0, 200)}`);
    }
  }

  console.log('\n✅ All images attached.');
})();
