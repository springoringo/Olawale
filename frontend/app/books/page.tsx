import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Books',
  description: 'Books by Pastor Femi Olawale.',
};

const BOOKS = [
  {
    title: 'Living As Saints In Babylon',
    author: 'Femi Olawale',
    note: 'Foreword by Pastor E. A. Adeboye',
    description: [
      'Living As A Saint in Babylon is a bold, prophetic guide for believers determined to stay faithful in a world drowning in compromise, pressure, and shifting values. Drawing deep wisdom from the lives of Daniel and his companions, Pastor Femi Olawale reveals how Christians can thrive, excel, and influence culture without losing their identity in Christ.',
      'This book is a battle cry for every believer who refuses to bow to the spirit of Babylon. Through powerful insights on prayer, righteousness, the Holy Spirit, and the Blood of Jesus, readers will discover how to stand firm, live with conviction, and carry the values of Zion into every sphere of life.',
      'If you’re longing for clarity, courage, and spiritual strength in a confusing age, this book will ignite your faith and anchor your soul. A must-read for anyone who wants to live unshaken.',
    ],
    cover: '/living-as-saints-in-babylon.png',
    href: 'https://www.amazon.ca/dp/B0HLY4XYDH',
  },
];

export default function BooksPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-indigo-800 to-indigo-600 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-indigo-200 text-sm font-semibold uppercase tracking-widest mb-3">Books</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">Books by Pastor Femi Olawale</h1>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {BOOKS.map((book) => (
            <article key={book.href} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
              <a href={book.href} target="_blank" rel="noopener noreferrer" className="block bg-indigo-50 p-8">
                <div className="relative mx-auto w-48 aspect-[505/726] shadow-xl">
                  <Image src={book.cover} alt={`${book.title} cover`} fill sizes="192px" className="object-cover" />
                </div>
              </a>
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-bold text-gray-900">{book.title}</h2>
                <p className="text-gray-600 mt-1">by {book.author}</p>
                <p className="text-sm text-gray-500 mt-1">{book.note}</p>
                <div className="mt-4 mb-6 space-y-3 text-sm text-gray-600 leading-relaxed">
                  {book.description.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <a
                  href={book.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-0 self-start inline-block text-center rounded-full bg-indigo-700 text-white font-semibold px-6 py-2.5 hover:bg-indigo-800 transition-colors"
                >
                  Buy on Amazon
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
