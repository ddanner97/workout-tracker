import { NextRequest, NextResponse } from 'next/server';

// Trusts `x-user-id` only because `proxy.ts` strips any client-supplied copy
// before forwarding the request. Do not read this header from any code path
// that bypasses the proxy.
export function getUserId(request: NextRequest): string | null {
  return request.headers.get('x-user-id');
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
