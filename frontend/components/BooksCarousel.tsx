'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Book } from '@/lib/books';

export default function BooksCarousel({ books }: { books: Book[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = books.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(t);
  }, [count, paused]);

  const go = (i: number) => setIndex((i + count) % count);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {books.map((book) => (
            <article
              key={book.href}
              className="w-full shrink-0 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-center bg-white p-8 md:p-10"
            >
              <a
                href={book.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto md:mx-0"
              >
                <div className="relative w-44 sm:w-52 aspect-[505/726] shadow-xl">
                  <Image src={book.cover} alt={`${book.title} cover`} fill sizes="208px" className="object-cover" />
                </div>
              </a>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{book.title}</h3>
                <p className="text-gray-600 mt-1">by {book.author}</p>
                {book.note && <p className="text-sm text-gray-500 mt-1">{book.note}</p>}
                <p className="mt-4 text-gray-600 leading-relaxed line-clamp-5">{book.description[0]}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={book.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-indigo-700 text-white font-semibold px-6 py-2.5 hover:bg-indigo-800 transition-colors"
                  >
                    Buy on Amazon
                  </a>
                  <Link
                    href="/books"
                    className="rounded-full border border-indigo-200 text-indigo-700 font-semibold px-6 py-2.5 hover:bg-indigo-50 transition-colors"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous book"
            onClick={() => go(index - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow text-indigo-700 hover:bg-white"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next book"
            onClick={() => go(index + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow text-indigo-700 hover:bg-white"
          >
            ›
          </button>
          <div className="mt-4 flex justify-center gap-2">
            {books.map((b, i) => (
              <button
                key={b.href}
                type="button"
                aria-label={`Go to ${b.title}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all ${i === index ? 'w-6 bg-indigo-600' : 'w-2.5 bg-gray-300'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
