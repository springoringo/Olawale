import { Suspense } from 'react';
import type { Metadata } from 'next';
import type { Post } from '@/lib/types';
import { getPosts } from '@/lib/strapi';
import PostCard from '@/components/PostCard';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Pastoral write-ups and monthly devotionals from Pastor Femi Olawale.',
};

const PAGE_SIZE = 6;

interface BlogPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { q, page: pageParam } = await searchParams;
  const query = q?.trim() || undefined;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

  let posts: Post[] = [];
  let pageCount = 1;
  let total = 0;

  try {
    const response = await getPosts(query, page, PAGE_SIZE);
    posts = response.data;
    pageCount = response.meta.pagination.pageCount;
    total = response.meta.pagination.total;
  } catch {
    // graceful fallback if Strapi is offline
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-800 to-indigo-600 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-indigo-200 text-sm font-semibold uppercase tracking-widest mb-3">
            Pastoral Writings
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">Blog</h1>
          <p className="text-indigo-200 text-lg max-w-xl mx-auto">
            Monthly devotionals and pastoral write-ups sent to the RCCG Canada network — Word-based
            encouragement for the journey ahead.
          </p>
        </div>
      </section>

      {/* Search + Results */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        {/* Search bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <Suspense fallback={null}>
            <SearchBar placeholder="Search posts by title or content…" />
          </Suspense>
          {total > 0 && (
            <p className="text-sm text-gray-500 shrink-0">
              {query ? `${total} result${total !== 1 ? 's' : ''} for "${query}"` : `${total} post${total !== 1 ? 's' : ''}`}
            </p>
          )}
        </div>

        {/* Grid */}
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg
              className="h-12 w-12 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <p className="text-gray-500 text-lg">
              {query
                ? `No posts matched "${query}". Try a different search.`
                : 'No posts published yet. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.documentId} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Suspense fallback={null}>
          <Pagination page={page} pageCount={pageCount} />
        </Suspense>
      </section>
    </div>
  );
}
