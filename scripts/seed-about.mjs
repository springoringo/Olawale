import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const Database = require('../backend/node_modules/better-sqlite3');

const STRAPI_URL = 'http://localhost:1337';
const DB_PATH = path.join(__dirname, '../backend/.tmp/data.db');

const ABOUT_CONTENT = {
  pastor_name: 'Pastor Femi Olawale',
  pastor_title: 'Lead Pastor',
  quote: 'Impossibility does not exist with God.',
  bio: `Pastor Femi Olawale is a solid teacher of the Word who has served in ministry for over thirty years. His drive over all these years has been sustained by his unwavering belief in the infallibility of God's Word; this belief is deeply entrenched in his teachings and can be imparted to the heart of any believer who listens to him. God has been faithful to transform many lives through his ministry.

He believes God to a fault and is well known for the phrase "impossibility does not exist with God."

He is a man under authority and serves at various capacities in the Redeemed Christian Church of God (RCCG). As a shepherd he emphasises teaching, admonishing, correcting, and leading with love and Godly wisdom.

An experienced entrepreneur, Pastor Femi operates simultaneously in both the corporate sector and the ministry — a true expression of his conviction that faith and excellence belong together in every sphere of life.

He is married to Pastor Bukky (fondly called Mummy Pastor) and they are blessed with two children.`,
  roles: `Senior Pastor, RCCG Overcomers' Chapel\nRegional Pastor & Country Coordinator, RCCG Canada\nDeputy Continental Overseer, RCCG the Americas`,
  section_pharaoh: `Like Moses before Pharaoh, Pastor Femi Olawale carries a divine mandate to represent God's authority in every room — boardroom or sanctuary. His ministry bridges the sacred and the secular, demonstrating that God's power is not confined to church walls but extends into business, leadership, and every dimension of human endeavour.

Under his leadership as Regional Pastor and Country Coordinator, RCCG Canada has grown to encompass over one hundred churches, with provincial pastors being equipped and deployed to reach communities from coast to coast.`,
  section_ebenezer: `Over three decades of ministry, Pastor Femi's story is marked by one consistent thread: the faithfulness of God. From pioneering local assemblies to overseeing a national network of churches, each chapter has been an "Ebenezer" — a monument to the fact that the LORD has helped.

His teaching on faith, spiritual dominion, and open heavens flows not from theory but from lived experience — a testimony that God honours those who trust Him completely.`,
  section_loins: `Pastor Femi embodies the posture of a servant who is always ready — loins girded and lamp burning bright. Whether preaching on a Sunday morning, mentoring the next generation of pastors, or writing monthly devotionals sent across RCCG Canada, he remains alert, prepared, and expectant for what God will do next.

His monthly pastoral write-ups, distributed to the RCCG Canada network, continue to equip believers with timely, Word-based encouragement for the journey ahead.`,
  credentials: `B.Sc.|Mechanical Engineering\nMBA|Business Administration\nPhD|Organizational Leadership`,
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
  const action = 'api::about-page.about-page.find';
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
  console.log('  ✓ Public permission set for about-page.find');
}

(async () => {
  console.log('[1/2] Setting permission…');
  setPublicPermission();

  console.log('[2/2] Creating About Page entry…');
  const token = await getAdminToken();

  // Single types use PUT to create/update
  const res = await fetch(`${STRAPI_URL}/content-manager/single-types/api::about-page.about-page`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(ABOUT_CONTENT),
  });
  const result = await res.json();
  if (!result.documentId && !result.data?.documentId) {
    console.error('  ✗ Failed:', JSON.stringify(result).slice(0, 200));
    process.exit(1);
  }
  console.log('  ✓ About Page entry saved');

  // Publish
  await fetch(`${STRAPI_URL}/content-manager/single-types/api::about-page.about-page/actions/publish`, {
    method: 'POST', headers: { Authorization: `Bearer ${token}` },
  });
  console.log('  ✓ Published');

  console.log('\n✅ Done! About Page is now editable in Strapi admin → Content Manager → About Page');
})();
