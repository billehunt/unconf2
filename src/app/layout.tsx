import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PageErrorBoundary } from '@/components/error-boundary';
import { GlobalErrorHandler } from '@/components/global-error-handler';
import { ThemeProvider } from '@/components/theme-provider';
import { AppShell } from '@/components/app-shell';
import { AuthProvider } from '@/components/auth-provider';

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <GlobalErrorHandler />
            <PageErrorBoundary context={{ route: 'root' }}>
              <AppShell>
                {children}
              </AppShell>
            </PageErrorBoundary>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
