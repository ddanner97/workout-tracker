import type { Metadata } from 'next';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

// ─── Components ───
import { NavMenu } from './components/component-library';
import {
  QueryProvider,
  ThemeRegistry,
  WorkoutFormProvider,
} from './components';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Workout Logger',
  description: 'Track your workouts and progress',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeRegistry>
          <QueryProvider>
            <WorkoutFormProvider>
              <div className="bg-background text-foreground min-h-screen">
                <header className="border-b border-black/10 dark:border-white/10">
                  <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
                    <Link
                      className="text-lg font-semibold tracking-tight"
                      href="/"
                    >
                      Workout Logger
                    </Link>
                    <NavMenu />
                  </div>
                </header>
                <main className="mx-auto w-full max-w-5xl px-6 py-8">
                  {children}
                </main>
              </div>
            </WorkoutFormProvider>
          </QueryProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
