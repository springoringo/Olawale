import Link from 'next/link';
import type { Sermon, Homepage } from '@/lib/types';
import { getSermons, getHomepage, getStrapiMediaUrl } from '@/lib/strapi';
import SermonGrid from '@/components/SermonGrid';

const FALLBACK_HERO: Homepage = {
  hero_title: 'Grow in Faith &\nGod\'s Word',
  hero_subtitle:
    'Explore our weekly sermons and teachings to deepen your walk with God. Every message is rooted in Scripture and delivered with passion.',
  hero_cta_text: 'Browse Sermons',
  hero_cta_url: '/sermons',
  hero_image: null,
  publishedAt: new Date().toISOString(),
};

export default async function HomePage() {
  let sermons: Sermon[] = [];
  let hero: Homepage = FALLBACK_HERO;

  await Promise.allSettled([
    getSermons().then((r) => { sermons = r.data.slice(0, 6); }),
    getHomepage().then((r) => { if (r.data?.hero_title) hero = r.data; }),
  ]);

  const imageUrl = getStrapiMediaUrl(hero.hero_image?.url ?? null);
  const titleLines = hero.hero_title.split('\n');

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">

        {/* Background image */}
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        ) : (
          /* Fallback gradient when no image is set */
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900" />
        )}

        {/* Dark gradient overlay — heavier at bottom for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/75" />

        {/* Subtle colour tint to keep brand hue */}
        <div className="absolute inset-0 bg-indigo-900/30 mix-blend-multiply" />

        {/* Decorative radial glows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(99,102,241,0.18) 0%, transparent 70%)',
          }}
        />

        {/* ── Content ── */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white py-24">

          {/* Pill label */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-indigo-200 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Weekly Teachings
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6 drop-shadow-lg">
            {titleLines.map((line, i) => (
              <span
                key={i}
                className={
                  i === 0
                    ? 'block text-white'
                    : 'block text-indigo-300'
                }
              >
                {line}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          {hero.hero_subtitle && (
            <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow">
              {hero.hero_subtitle}
            </p>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={hero.hero_cta_url || '/sermons'}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-3.5 shadow-lg shadow-indigo-900/40 transition-colors"
            >
              {hero.hero_cta_text || 'Browse Sermons'}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-3.5 hover:bg-white/20 transition-colors"
            >
              Meet the Pastor
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/40 text-xs tracking-widest uppercase select-none">
          <span>Scroll</span>
          <svg className="h-4 w-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────── */}
      <section className="bg-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-3 divide-x divide-indigo-600 text-center">
          {[
            { value: '30+', label: 'Years of Ministry' },
            { value: '100+', label: 'Churches in Canada' },
            { value: 'Weekly', label: 'New Teachings' },
          ].map(({ value, label }) => (
            <div key={label} className="px-4 py-2">
              <p className="text-2xl font-extrabold">{value}</p>
              <p className="text-indigo-200 text-sm mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Recent Sermons ───────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-1">
              Latest Messages
            </p>
            <h2 className="text-2xl font-bold text-gray-900">Recent Sermons</h2>
          </div>
          <Link
            href="/sermons"
            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
          >
            View all →
          </Link>
        </div>
        <SermonGrid
          sermons={sermons}
          emptyMessage="No sermons published yet. Check back soon!"
        />
      </section>
    </div>
  );
}
