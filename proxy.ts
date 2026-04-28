import { auth } from '@/src/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// The default session cookie name used by better-auth
const SESSION_COOKIE = 'better-auth.session_token';

export async function proxy(request: NextRequest) {
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login');
  const hasCookie = request.cookies.has(SESSION_COOKIE);

  if (!hasCookie && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (hasCookie && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (hasCookie) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      // Cookie exists but session is invalid/expired
      if (!isAuthRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      return NextResponse.next();
    }
    // Forward the verified userId so API routes don't need a second DB hit
    const response = NextResponse.next();
    response.headers.set('x-user-id', session.user.id);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
