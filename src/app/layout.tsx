import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Scend',
  description: 'Tools to make life simpler.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Minimal header – compliant Link usage */}
        <header className="p-4">
          <Link href="/">Home</Link>
        </header>
        {children}
      </body>
    </html>
  );
}
