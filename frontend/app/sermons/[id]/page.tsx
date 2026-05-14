import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getSermon, getStrapiMediaUrl } from '@/lib/strapi';

interface SermonDetailPageProps {
  params: Promise<{ id: string }>;
}

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    // youtu.be/<id>
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1) || null;
    }
    // youtube.com/watch?v=<id>
    if (parsed.searchParams.has('v')) {
      return parsed.searchParams.get('v');
    }
    // youtube.com/embed/<id> or /shorts/<id>
    const match = parsed.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/);
    if (match) return match[1];
  } catch {
    // invalid URL — ignore
  }
  return null;
}

export async function generateMetadata({ params }: SermonDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const { data: sermon } = await getSermon(id);
    const imageUrl = getStrapiMediaUrl(sermon.image?.url ?? null);
    return {
      title: sermon.title,
      description: sermon.summary.slice(0, 160),
      openGraph: imageUrl
        ? { images: [{ url: imageUrl, width: sermon.image?.width, height: sermon.image?.height }] }
        : undefined,
    };
  } catch {
    return { title: 'Sermon' };
  }
}

export default async function SermonDetailPage({ params }: SermonDetailPageProps) {
  const { id } = await params;

  let sermon;
  try {
    const response = await getSermon(id);
    sermon = response.data;
  } catch {
    notFound();
  }

  const imageUrl = getStrapiMediaUrl(sermon.image?.url ?? null);
  const youtubeId = sermon.youtube_url ? extractYouTubeId(sermon.youtube_url) : null;

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      {/* Back link */}
      <Link href="/sermons" className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-8 transition-colors">
        ← Back to Sermons
      </Link>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
        {sermon.title}
      </h1>
      {(sermon.date ?? sermon.publishedAt) && (
        <p className="text-sm font-medium text-indigo-500 uppercase tracking-wide mb-6">
          {new Date(sermon.date ?? sermon.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </p>
      )}

      {/* Thumbnail */}
      {imageUrl && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 bg-gray-100">
          <Image
            src={imageUrl}
            alt={sermon.image?.alternativeText ?? sermon.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Summary */}
      <div className="prose prose-lg max-w-none text-gray-700 mb-10 whitespace-pre-wrap">
        {sermon.summary}
      </div>

      {/* YouTube embed */}
      {youtubeId && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Watch the Sermon</h2>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={sermon.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <a
            href={sermon.youtube_url!}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            Open on YouTube
          </a>
        </section>
      )}
    </article>
  );
}
