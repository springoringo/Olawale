import type { Sermon } from '@/lib/types';
import SermonCard from './SermonCard';

interface SermonGridProps {
  sermons: Sermon[];
  emptyMessage?: string;
}

export default function SermonGrid({
  sermons,
  emptyMessage = 'No sermons found.',
}: SermonGridProps) {
  if (sermons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
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
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sermons.map((sermon) => (
        <SermonCard key={sermon.documentId} sermon={sermon} />
      ))}
    </div>
  );
}
