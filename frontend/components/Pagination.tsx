'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface PaginationProps {
  page: number;
  pageCount: number;
}

export default function Pagination({ page, pageCount }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (pageCount <= 1) return null;

  function goTo(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(newPage));
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  // Build page number array with ellipsis for large ranges
  function getPages(): (number | '…')[] {
    if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
    const pages: (number | '…')[] = [1];
    if (page > 3) pages.push('…');
    for (let p = Math.max(2, page - 1); p <= Math.min(pageCount - 1, page + 1); p++) {
      pages.push(p);
    }
    if (page < pageCount - 2) pages.push('…');
    pages.push(pageCount);
    return pages;
  }

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center justify-center gap-1 mt-10 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}
    >
      {/* Prev */}
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        ← Prev
      </button>

      {/* Page numbers */}
      {getPages().map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-2 text-gray-400 text-sm select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`min-w-[2.25rem] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= pageCount}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  );
}
