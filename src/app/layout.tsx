import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PageErrorBoundary } from '@/components/error-boundary';
import { GlobalErrorHandler } from '@/components/global-error-handler';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Unconf2 - Unconference Event Management',
  description: 'Modern unconference event management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalErrorHandler />
        <PageErrorBoundary context={{ route: 'root' }}>
          {children}
        </PageErrorBoundary>
      </body>
    </html>
  );
}
