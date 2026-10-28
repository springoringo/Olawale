import type { Metadata } from 'next';
import Image from 'next/image';
import { BOOKS } from '@/lib/books';

export const metadata: Metadata = {
  title: 'Books',
  description: 'Books by Pastor Femi Olawale.',
};

export default function BooksPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-indigo-800 to-indigo-600 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-indigo-200 text-sm font-semibold uppercase tracking-widest mb-3">Books</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">Books by Pastor Femi Olawale</h1>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-12">
        {BOOKS.map((book) => (
          <article
            key={book.href}
            className="bg-white rounded-2xl shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-[320px_1fr]"
          >
            <a
              href={book.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-indigo-50 p-8 md:p-12"
            >
              <div className="relative w-52 md:w-56 aspect-[505/726] shadow-xl">
                <Image src={book.cover} alt={`${book.title} cover`} fill sizes="224px" className="object-cover" />
              </div>
            </a>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{book.title}</h2>
              <p className="text-gray-600 mt-2">by {book.author}</p>
              {book.note && <p className="text-sm text-gray-500 mt-1">{book.note}</p>}
              <div className="mt-6 mb-8 space-y-4 text-gray-600 leading-relaxed">
                {book.description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <a
                href={book.href}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start inline-block text-center rounded-full bg-indigo-700 text-white font-semibold px-8 py-3 hover:bg-indigo-800 transition-colors"
              >
                Buy on Amazon
              </a>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
