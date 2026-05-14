import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Femi Olawale',
    template: '%s | Femi Olawale',
  },
  description: 'Weekly sermons and teachings from Femi Olawale.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50 text-gray-900`}>
        <Navbar />
        <main>{children}</main>
        <footer className="mt-16 border-t border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Femi Olawale. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
