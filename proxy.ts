import { auth } from '@/src/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'better-auth.session_token';

function unauthorizedJson() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname.startsWith('/login');
  const isApiRoute = pathname.startsWith('/api');

  // Strip any client-supplied x-user-id; only the proxy is allowed to set it.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete('x-user-id');

  const hasCookie = request.cookies.has(SESSION_COOKIE);

  if (!hasCookie) {
    if (isAuthRoute) {
      return NextResponse.next({ request: { headers: requestHeaders } });
    }
    if (isApiRoute) {
      return unauthorizedJson();
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    if (isAuthRoute) {
      return NextResponse.next({ request: { headers: requestHeaders } });
    }
    if (isApiRoute) {
      return unauthorizedJson();
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  requestHeaders.set('x-user-id', session.user.id);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
