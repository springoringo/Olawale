import Image from 'next/image';
import Link from 'next/link';
import type { Sermon } from '@/lib/types';
import { getStrapiMediaUrl } from '@/lib/strapi';

interface SermonCardProps {
  sermon: Sermon;
}

export default function SermonCard({ sermon }: SermonCardProps) {
  const imageUrl = getStrapiMediaUrl(sermon.image?.url ?? null);
  const detailPath = `/sermons/${sermon.documentId}`;

  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={sermon.image?.alternativeText ?? sermon.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-16 w-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <Link href={detailPath}>
          <h2 className="text-lg font-semibold text-gray-900 hover:text-indigo-700 transition-colors line-clamp-2">
            {sermon.title}
          </h2>
        </Link>
        {(sermon.date ?? sermon.publishedAt) && (
          <p className="text-xs font-medium text-indigo-500 uppercase tracking-wide">
            {new Date(sermon.date ?? sermon.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        )}
        <p className="text-sm text-gray-500 line-clamp-3 flex-1">{sermon.summary}</p>

        <div className="flex items-center gap-3 pt-1">
          <Link
            href={detailPath}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Read more →
          </Link>
          {sermon.youtube_url && (
            <a
              href={sermon.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              Watch
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
