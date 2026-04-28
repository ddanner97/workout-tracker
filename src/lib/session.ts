import { NextRequest, NextResponse } from 'next/server';

export function getUserId(request: NextRequest): string | null {
  return request.headers.get('x-user-id');
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
