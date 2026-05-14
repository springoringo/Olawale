import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPost, getStrapiMediaUrl } from '@/lib/strapi';

interface BlogDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const { data: post } = await getPost(id);
    const imageUrl = getStrapiMediaUrl(post.image?.url ?? null);
    const plain = post.body.replace(/#{1,6}\s+/g, '').replace(/\*+/g, '').replace(/\n+/g, ' ').trim();
    return {
      title: post.title,
      description: plain.slice(0, 160),
      openGraph: imageUrl ? { images: [{ url: imageUrl }] } : undefined,
    };
  } catch {
    return { title: 'Blog Post' };
  }
}

function renderBody(body: string) {
  // Split on double newlines into paragraphs, render markdown headings simply
  return body.split(/\n{2,}/).map((block, i) => {
    const heading = block.match(/^(#{1,3})\s+(.+)/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2];
      const cls = level === 1
        ? 'text-2xl font-bold text-gray-900 mt-8 mb-3'
        : level === 2
        ? 'text-xl font-semibold text-gray-900 mt-6 mb-2'
        : 'text-lg font-semibold text-gray-800 mt-4 mb-2';
      return <p key={i} className={cls}>{text}</p>;
    }
    const text = block.replace(/\*\*(.+?)\*\*/g, '$1').trim();
    if (!text) return null;
    return (
      <p key={i} className="text-gray-700 leading-relaxed">
        {text}
      </p>
    );
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params;

  let post;
  try {
    const response = await getPost(id);
    post = response.data;
  } catch {
    notFound();
  }

  const imageUrl = getStrapiMediaUrl(post.image?.url ?? null);
  const displayDate = post.date ?? post.publishedAt;

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      {/* Back */}
      <Link href="/blog" className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-8 transition-colors">
        ← Back to Blog
      </Link>

      {/* Date */}
      <p className="text-xs font-medium text-indigo-500 uppercase tracking-wide mb-3">
        {new Date(displayDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
        {post.title}
      </h1>

      {/* Author */}
      <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-200">
        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
          FO
        </div>
        <span className="text-sm font-medium text-gray-700">Pastor Femi Olawale</span>
      </div>

      {/* Cover image */}
      {imageUrl && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-10 bg-gray-100">
          <Image
            src={imageUrl}
            alt={post.image?.alternativeText ?? post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Body */}
      <div className="space-y-5 text-base">
        {renderBody(post.body)}
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link href="/blog" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
          ← Back to all posts
        </Link>
      </div>
    </article>
  );
}
