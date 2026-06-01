import type { Metadata } from 'next';
import { Navbar, Footer } from '@/components/layout';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Unissential - Modern Productivity Platform',
  description: 'A production-grade startup platform built with Next.js, React, and TypeScript.',
  keywords: 'productivity, startup, modern, platform',
  authors: [{ name: 'Unissential' }],
  creator: 'Unissential',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://unissential.com',
    title: 'Unissential - Modern Productivity Platform',
    description: 'A production-grade startup platform built with Next.js, React, and TypeScript.',
    siteName: 'Unissential',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unissential - Modern Productivity Platform',
    description: 'A production-grade startup platform built with Next.js, React, and TypeScript.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
