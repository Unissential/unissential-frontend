import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Not Found - Unissential',
  description: 'Page not found',
};

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px-200px)] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-neutral-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-700 mb-4">Page Not Found</h2>
        <p className="text-neutral-600 max-w-md mb-8">
          Sorry, we could not find the page you&apos;re looking for. It might have been moved or
          deleted.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-smooth"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
