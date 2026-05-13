import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const Database = require('../backend/node_modules/better-sqlite3');

const STRAPI_URL = 'http://localhost:1337';
const DB_PATH = path.join(__dirname, '../backend/.tmp/data.db');

const POSTS = [
  {
    title: 'A God to Pharaoh',
    date: '2022-06-13',
    body: `This was extracted from write-ups that our Pastor, Pastor Femi Olawale sends out to the Redeemed Christian Church of God in Canada on a monthly basis. Read and be Blessed!!

Pastor Femi Olawale begins by referencing Exodus 7:1, where God tells Moses, "See, I have made thee a god to Pharaoh: and Aaron your brother shall be your prophet."

Moses confronted Pharaoh, who dismissed both Moses and the God he represented. Pharaoh refused to release Israel after four hundred and thirty years of bondage, hardening his heart against every appeal and enlisting Egyptian magicians and gods to oppose Moses.

God intervened by establishing Moses as a divine figure to Pharaoh. Since humans naturally revere and consult gods for guidance, both Pharaoh and his magicians were compelled to bow before this man-god. The Egyptians eventually recognised the devastation Moses brought: "How long shall this man be a snare unto us?... Egypt is destroyed."

The pastor draws parallels between Pharaoh and modern obstacles — authority challenges, workplace conflicts, and relational difficulties. He suggests these represent personal "pharaohs" that God can help believers overcome.

Pastor Femi references Daniel becoming a god to the authorities in Babylon and Persia, and Mordecai becoming untouchable to Haman, who faced destruction for opposing him.

He concludes that believers who trust God will become vessels through which His lordship manifests, transforming their circumstances and becoming "god-men" to their situations. Impossibility does not exist with God.`,
  },
  {
    title: 'Ebenezer: The LORD has helped us',
    date: '2022-06-13',
    body: `This was extracted from write-ups that our Pastor, Pastor Femi Olawale sends out to the Redeemed Christian Church of God in Canada on a monthly basis. Read and be Blessed!!

The sermon draws from 1 Samuel 7:9, describing how Prophet Samuel led Israel against the Philistines through unconventional means. Rather than relying on military strength, Samuel "offered it as a whole burnt offering to the LORD" and "cried out to the LORD for Israel, and the LORD answered him."

The Philistines assembled against Israel with great intimidation of size and number and as expected, they were all fearful, except Prophet Samuel. The prophet engaged a none conventional weapon of prayer — total surrender and complete trust in God.

After God's miraculous intervention through thunder that confused their enemies, Samuel established a memorial stone called Ebenezer, meaning "Thus far the LORD has helped us."

Pastor Olawale applies this biblical account to contemporary believers. He emphasises that despite widespread death and suffering around them, those still living should recognise divine preservation. He encourages readers to acknowledge God's deliverance by establishing their own spiritual "stones" — metaphorical monuments of gratitude.

Look around you today. Consider how far God has brought you. Consider the dangers you have passed through, the illnesses you have survived, the crises that did not consume you. Every single one of those moments is an Ebenezer — a stone of remembrance.

The closing exhortation calls believers to become "that grateful soul who recognises the mighty deliverance God has wrought" and declare EBENEZER in acknowledgment of God's faithfulness.`,
  },
  {
    title: 'Loins Girded, Light Burning',
    date: '2022-06-13',
    body: `This was extracted from write-ups that our Pastor, Pastor Femi Olawale sends out to the Redeemed Christian Church of God in Canada on a monthly basis. Read and be Blessed!!

The darkest moment of the day is said to be the midnight, the point at which a new day begins to dawn. Coincidentally, that is the time most people tend to enjoy their sleep and would frown at any disturbance. Midnight is the hour of deep unconsciousness — a time of vulnerability to spiritual attack and deception.

The sermon discusses spiritual preparedness for Christ's return, using the midnight hour as a metaphor for the present age. Pastor Olawale emphasises two key directives from Luke 12:35: maintaining girded loins (spiritual discipline) and burning lights (godly character).

## Girded Loins

To have your loins girded means to be disciplined, focused, and ready for action. It speaks of a believer who has tightened up against worldly excess and materialism. The Bible warns against being overcharged with surfeiting, drunkenness, and the cares of this life — for these things dull the spirit and leave one unprepared.

In a season like this, when the world offers endless distractions and comfort, the call is to tighten up. To gird your loins is to choose intentional living over passive drifting.

## Light Burning

Regarding the light, Pastor Femi clarifies it is not eloquence or charisma, but rather outstanding and uncompromising godly character that showcases Christ. The light should manifest through good works visible to others, fulfilling Matthew 5:16's call to "let your light so shine before men, that they may see your good works and glorify your Father which is in heaven."

The sermon concludes by suggesting contemporary events signal the approaching midnight hour, calling believers to spiritually refuel to maintain their flame. The question is not whether midnight is coming — it is whether you will be found with your loins girded and your light burning when it arrives.`,
  },
];

async function getAdminToken() {
  const res = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@gracechurch.com', password: 'Admin1234!' }),
  });
  return (await res.json()).data.token;
}

function setPublicPermissions() {
  const db = new Database(DB_PATH);
  const publicRole = db.prepare("SELECT id FROM up_roles WHERE type = 'public'").get();
  const actions = ['api::post.post.find', 'api::post.post.findOne'];
  for (const action of actions) {
    const existing = db.prepare('SELECT id FROM up_permissions WHERE action = ?').get(action);
    if (existing) {
      const linked = db.prepare('SELECT id FROM up_permissions_role_lnk WHERE permission_id = ? AND role_id = ?').get(existing.id, publicRole.id);
      if (!linked) db.prepare('INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord) VALUES (?, ?, 1)').run(existing.id, publicRole.id);
      continue;
    }
    const docId = Math.random().toString(36).slice(2, 26);
    const now = Date.now();
    const result = db.prepare('INSERT INTO up_permissions (document_id, action, created_at, updated_at, published_at) VALUES (?, ?, ?, ?, ?)').run(docId, action, now, now, now);
    db.prepare('INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord) VALUES (?, ?, 1)').run(result.lastInsertRowid, publicRole.id);
    console.log(`  ✓ Permission: ${action}`);
  }
  db.close();
}

(async () => {
  console.log('[1/2] Setting public permissions…');
  setPublicPermissions();

  console.log('[2/2] Creating blog posts…');
  const token = await getAdminToken();

  for (const post of POSTS) {
    // Create draft
    const res = await fetch(`${STRAPI_URL}/content-manager/collection-types/api::post.post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(post),
    });
    const created = await res.json();
    const docId = created.documentId ?? created.data?.documentId;
    if (!docId) { console.error(`  ✗ Failed: "${post.title}" — ${JSON.stringify(created).slice(0,150)}`); continue; }

    // Publish
    await fetch(`${STRAPI_URL}/content-manager/collection-types/api::post.post/${docId}/actions/publish`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`  ✓ "${post.title}" (${post.date})`);
  }

  console.log('\n✅ Done!');
})();
