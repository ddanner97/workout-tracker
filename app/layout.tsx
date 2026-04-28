import type { Metadata } from 'next';
import { Fraunces, Nunito } from 'next/font/google';
import './globals.css';

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
              <WorkoutFormProvider>{children}</WorkoutFormProvider>
            </QueryProvider>
          </ThemeRegistry>
        </PaletteProvider>
      </body>
    </html>
  );
}
