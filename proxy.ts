import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'better-auth.session_token';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute =
    pathname.startsWith('/login') || pathname.startsWith('/verify-email');
  const hasCookie = request.cookies.has(SESSION_COOKIE);

  if (!hasCookie && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (hasCookie && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on every page navigation EXCEPT:
  //   - /api/auth/*  (better-auth callbacks)
  //   - /api/*       (API routes auth themselves via requireUser)
  //   - /_next/*     (Next.js internals: static, image, data, etc.)
  //   - *.<ext>      (any path with a file extension: favicons, public assets)
  matcher: ['/((?!api/auth|api|_next|.*\\.).*)'],
};
