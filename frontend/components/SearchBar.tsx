'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect } from 'react';

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({ placeholder = 'Search by title or topic…' }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    setValue(searchParams.get('q') ?? '');
  }, [searchParams]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page'); // reset to first page on new search
    if (value.trim()) {
      params.set('q', value.trim());
    } else {
      params.delete('q');
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleClear() {
    setValue('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    params.delete('page');
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xl">
      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-indigo-600 px-5 py-2 text-white font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors"
      >
        {isPending ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}
