import { Suspense } from 'react';
import type { Metadata } from 'next';
import type { Sermon } from '@/lib/types';
import { getSermons } from '@/lib/strapi';
import SermonGrid from '@/components/SermonGrid';
import SearchBar from '@/components/SearchBar';

export const metadata: Metadata = {
  title: 'Sermons',
  description: 'Browse and search all sermons from Femi Olawale.',
};

interface SermonsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SermonsPage({ searchParams }: SermonsPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || undefined;

  let sermons: Sermon[] = [];
  try {
    const response = await getSermons(query);
    sermons = response.data;
  } catch {
    // graceful fallback if Strapi is offline
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Sermons</h1>
      <p className="text-gray-500 mb-8">
        {query
          ? `Search results for "${query}" — ${sermons.length} found`
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
    </div>
  );
}
