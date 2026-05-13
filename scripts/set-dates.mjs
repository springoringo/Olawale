const STRAPI_URL = 'http://localhost:1337';

const SERMON_DATES = [
  { documentId: 'p00u87xgxwlcjfu7a09ctqs3', date: '2021-02-09' }, // Spiritual Dominion
  { documentId: 'jggyx0ye41v2itk25op4dn1v', date: '2023-10-29' }, // Open Heavens
  { documentId: 'ggxbki3l7p2n9shwbgebihec', date: '2023-12-03' }, // Heart of Gratitude
  { documentId: 't248misplu9fr19vza9f0e3o', date: '2024-06-02' }, // New Songs
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

  for (const { documentId, date } of SERMON_DATES) {
    // Update draft
    const res = await fetch(
      `${STRAPI_URL}/content-manager/collection-types/api::sermon.sermon/${documentId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ date }),
      }
    );
    const updated = await res.json();

    // Re-publish so date shows on the public API
    const pub = await fetch(
      `${STRAPI_URL}/content-manager/collection-types/api::sermon.sermon/${documentId}/actions/publish`,
      { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
    );
    const published = await pub.json();
    const title = published.title ?? documentId;
    console.log(`✓ ${title} → ${date}`);
  }
})();
