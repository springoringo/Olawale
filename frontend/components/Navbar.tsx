import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-indigo-700 hover:text-indigo-800 transition-colors">
          Femi Olawale
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-indigo-700 font-medium transition-colors">
            Home
          </Link>
          <Link href="/sermons" className="text-gray-600 hover:text-indigo-700 font-medium transition-colors">
            Sermons
          </Link>
          <Link href="/blog" className="text-gray-600 hover:text-indigo-700 font-medium transition-colors">
            Blog
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-indigo-700 font-medium transition-colors">
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
