import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAboutPage, getStrapiMediaUrl } from '@/lib/strapi';
import type { AboutPage } from '@/lib/types';

export const metadata: Metadata = {
  title: 'About',
  description:
    "Pastor Femi Olawale — solid teacher of the Word, Senior Pastor of RCCG Overcomers' Chapel, and Regional Pastor & Country Coordinator for RCCG Canada.",
};

// ─── Fallback content (used when Strapi has no entry yet) ───────────────────
const FALLBACK: AboutPage = {
  pastor_name: 'Pastor Femi Olawale',
  pastor_title: 'Lead Pastor',
  quote: 'Impossibility does not exist with God.',
  photo: null,
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
  publishedAt: new Date().toISOString(),
};

function renderBody(text: string) {
  return text.split(/\n{1,}/).map((para, i) => {
    const p = para.trim();
    if (!p) return null;
    return <p key={i} className="text-gray-600 leading-relaxed">{p}</p>;
  });
}

export default async function AboutPage() {
  let about: AboutPage = FALLBACK;
  try {
    const res = await getAboutPage();
    if (res.data?.pastor_name) about = res.data;
  } catch {
    // Strapi offline or entry not yet created — use fallback
  }

  const photoUrl = getStrapiMediaUrl(about.photo?.url ?? null);
  const roles = about.roles?.split('\n').filter(Boolean) ?? [];
  const credentials = about.credentials
    ?.split('\n')
    .filter(Boolean)
    .map((line) => {
      const [label, detail] = line.split('|');
      return { label: label?.trim() ?? '', detail: detail?.trim() ?? '' };
    }) ?? [];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-800 to-indigo-600 text-white py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-indigo-200 text-sm font-semibold uppercase tracking-widest mb-3">About</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
            {about.pastor_name}
          </h1>
          {about.quote && (
            <p className="text-indigo-200 text-lg italic">&ldquo;{about.quote}&rdquo;</p>
          )}
        </div>
      </section>

      {/* Bio */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Photo */}
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="relative w-56 h-56 rounded-2xl overflow-hidden shadow-lg bg-indigo-100">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={about.photo?.alternativeText ?? about.pastor_name}
                  fill
                  sizes="224px"
                  className="object-cover"
                  priority
                />
              ) : (
                <Image
                  src="https://femiolawale.com/content/images/femiolawale.webp"
                  alt={about.pastor_name}
                  fill
                  sizes="224px"
                  className="object-cover"
                  priority
                />
              )}
            </div>
            {roles.length > 0 && (
              <ul className="mt-6 space-y-2 max-w-xs">
                {roles.map((role) => (
                  <li key={role} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-indigo-500 mt-0.5">▸</span>
                    {role}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Text */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-1">
                {about.pastor_title}
              </p>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {about.pastor_name}</h2>
            </div>
            {renderBody(about.bio)}
          </div>
        </div>
      </section>

      {/* A God to Pharaoh */}
      {about.section_pharaoh && (
        <section className="bg-white border-t border-gray-100 py-20 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            <div className="md:col-span-1">
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-2">Ministry</p>
              <h2 className="text-2xl font-bold text-gray-900">A God to Pharaoh</h2>
            </div>
            <div className="md:col-span-2 space-y-4">{renderBody(about.section_pharaoh)}</div>
          </div>
        </section>
      )}

      {/* Ebenezer */}
      {about.section_ebenezer && (
        <section className="bg-indigo-50 border-t border-indigo-100 py-20 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            <div className="md:col-span-1">
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-2">Testimony</p>
              <h2 className="text-2xl font-bold text-gray-900">Ebenezer</h2>
              <p className="text-indigo-600 font-medium mt-1 text-sm italic">The LORD has helped us</p>
            </div>
            <div className="md:col-span-2 space-y-4">{renderBody(about.section_ebenezer)}</div>
          </div>
        </section>
      )}

      {/* Loins girded */}
      {about.section_loins && (
        <section className="bg-white border-t border-gray-100 py-20 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            <div className="md:col-span-1">
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-2">Readiness</p>
              <h2 className="text-2xl font-bold text-gray-900">Loins Girded, Light Burning</h2>
            </div>
            <div className="md:col-span-2 space-y-4">{renderBody(about.section_loins)}</div>
          </div>
        </section>
      )}

      {/* Credentials */}
      {credentials.length > 0 && (
        <section className="bg-gray-900 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-8 text-center">
              Academic Credentials
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {credentials.map((c) => (
                <div key={c.label} className="rounded-xl border border-gray-700 bg-gray-800 px-6 py-8 text-center">
                  <p className="text-3xl font-extrabold text-indigo-400 mb-2">{c.label}</p>
                  <p className="text-gray-300 text-sm">{c.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-indigo-700 text-white py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Hear {about.pastor_name.split(' ').slice(-1)[0]}&apos;s Teachings
          </h2>
          <p className="text-indigo-200 mb-8">
            Explore the full sermon archive and let God&apos;s Word speak directly to your situation.
          </p>
          <Link
            href="/sermons"
            className="inline-block rounded-full bg-white text-indigo-700 font-semibold px-8 py-3 hover:bg-indigo-50 transition-colors shadow"
          >
            Browse Sermons
          </Link>
        </div>
      </section>
    </div>
  );
}
