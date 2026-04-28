import { NextRequest, NextResponse } from 'next/server';

// In HTTPS contexts (prod) better-auth prefixes its cookies with `__Secure-`.
// With cookieCache enabled both `session_token` and `session_data` are set;
// the presence of either is enough for this optimistic, no-DB proxy check.
const SESSION_COOKIE_NAMES = [
  'better-auth.session_token',
  '__Secure-better-auth.session_token',
  'better-auth.session_data',
  '__Secure-better-auth.session_data',
] as const;

function hasSessionCookie(request: NextRequest): boolean {
  return SESSION_COOKIE_NAMES.some((name) => request.cookies.has(name));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute =
    pathname.startsWith('/login') || pathname.startsWith('/verify-email');
  const hasCookie = hasSessionCookie(request);

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
