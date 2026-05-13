// Re-publish sermons so the image (attached to draft) propagates to the published version
const STRAPI_URL = 'http://localhost:1337';

const DOCUMENT_IDS = [
  'p00u87xgxwlcjfu7a09ctqs3', // Spiritual Dominion
  'jggyx0ye41v2itk25op4dn1v', // Open Heavens
  'ggxbki3l7p2n9shwbgebihec', // Heart of Gratitude
  't248misplu9fr19vza9f0e3o', // New Songs
];

async function getAdminToken() {
  const res = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@gracechurch.com', password: 'Admin1234!' }),
  });
  return (await res.json()).data.token;
}

(async () => {
  const token = await getAdminToken();
  console.log('Logged in');

  for (const docId of DOCUMENT_IDS) {
    // Re-publish triggers Strapi to copy draft → published
    const res = await fetch(
      `${STRAPI_URL}/content-manager/collection-types/api::sermon.sermon/${docId}/actions/publish`,
      { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
    );
    const json = await res.json();
    const title = json.title || json.data?.title || docId;
    const hasImage = !!(json.image?.url || json.data?.image?.url);
    console.log(`${hasImage ? '✓' : '~'} Re-published: "${title}" | image: ${hasImage}`);
  }
})();
