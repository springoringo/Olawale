import { Suspense } from 'react';
import type { Metadata } from 'next';
import type { Sermon } from '@/lib/types';
import { getSermons } from '@/lib/strapi';
import SermonGrid from '@/components/SermonGrid';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';

export const metadata: Metadata = {
  title: 'Sermons',
  description: 'Browse and search all sermons from Femi Olawale.',
};

const PAGE_SIZE = 9;

interface SermonsPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SermonsPage({ searchParams }: SermonsPageProps) {
  const { q, page: pageParam } = await searchParams;
  const query = q?.trim() || undefined;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

  let sermons: Sermon[] = [];
  let pageCount = 1;
  let total = 0;
  try {
    const response = await getSermons(query, page, PAGE_SIZE);
    sermons = response.data;
    pageCount = response.meta.pagination.pageCount;
    total = response.meta.pagination.total;
  } catch {
    // graceful fallback if Strapi is offline
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Sermons</h1>
      <p className="text-gray-500 mb-8">
        {query
          ? `Search results for "${query}" — ${total} found`
          : 'Browse all our teachings and messages.'}
      </p>

      <div className="mb-8">
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
      </div>

      <SermonGrid
        sermons={sermons}
        emptyMessage={
          query
            ? `No sermons matched "${query}". Try a different search.`
            : 'No sermons published yet. Check back soon!'
        }
      />

      <Suspense fallback={null}>
        <Pagination page={page} pageCount={pageCount} />
      </Suspense>
    </div>
  );
}
