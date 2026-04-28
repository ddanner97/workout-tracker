import Link from 'next/link';
import { NavMenu } from '../components/component-library';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
      <main className="mx-auto w-full max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
