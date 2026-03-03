import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider, ThemeRegistry } from "./components";
import { ThemeToggle } from "./components/component-library";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Workout Logger",
  description: "Track your workouts and progress",
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
            <div className="min-h-screen bg-background text-foreground">
              <header className="border-b border-black/10 dark:border-white/10">
                <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
                  <Link
                    className="text-lg font-semibold tracking-tight"
                    href="/"
                  >
                    Workout Logger
                  </Link>
                  <nav className="flex items-center gap-4 text-sm font-medium">
                    <Link className="hover:underline" href="/history">
                      History
                    </Link>
                    <Link
                      className="rounded-md bg-foreground px-3 py-1.5 text-background hover:opacity-90"
                      href="/"
                    >
                      New Workout
                    </Link>
                    <ThemeToggle />
                  </nav>
                </div>
              </header>
              <main className="mx-auto w-full max-w-5xl px-6 py-8">
                {children}
              </main>
            </div>
          </QueryProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
