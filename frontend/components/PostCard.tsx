import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/types';
import { getStrapiMediaUrl } from '@/lib/strapi';

interface PostCardProps {
  post: Post;
}

function excerpt(body: string, maxLength = 160): string {
  // strip markdown then truncate
  const plain = body.replace(/#{1,6}\s+/g, '').replace(/\*+/g, '').replace(/\n+/g, ' ').trim();
  return plain.length <= maxLength ? plain : plain.slice(0, maxLength).trimEnd() + '…';
}

export default function PostCard({ post }: PostCardProps) {
  const imageUrl = getStrapiMediaUrl(post.image?.url ?? null);
  const detailPath = `/blog/${post.documentId}`;
  const displayDate = post.date ?? post.publishedAt;

  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.image?.alternativeText ?? post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100">
            <svg className="h-14 w-14 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-2">
        <p className="text-xs font-medium text-indigo-500 uppercase tracking-wide">
          {new Date(displayDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <Link href={detailPath}>
          <h2 className="text-lg font-semibold text-gray-900 hover:text-indigo-700 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>
        <p className="text-sm text-gray-500 line-clamp-3 flex-1">{excerpt(post.body)}</p>
        <div className="pt-2">
          <Link href={detailPath} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
