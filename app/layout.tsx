import type { Metadata } from 'next';
import Link from 'next/link';
import { Fraunces, Nunito } from 'next/font/google';
import './globals.css';

import { NavMenu } from './components/component-library';
import { QueryProvider, ThemeRegistry, WorkoutFormProvider } from './components';
import { PaletteProvider } from './components/contexts/PaletteContext';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  weight: ['600'],
});

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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
      <body className={`${fraunces.variable} ${nunito.variable} antialiased`}>
        <PaletteProvider>
          <ThemeRegistry>
            <QueryProvider>
              <WorkoutFormProvider>
                <div className="min-h-screen bg-background text-foreground">
                  <header className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
                      <Link className="flex items-center" href="/">
                        <span
                          className="font-serif text-lg font-semibold tracking-tight"
                          style={{ color: 'var(--color-heading)' }}
                        >
                          Workout
                        </span>
                        <span
                          className="font-serif text-lg font-semibold"
                          style={{ color: 'var(--color-accent-light)' }}
                        >
                          .
                        </span>
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
        </PaletteProvider>
      </body>
    </html>
  );
}
