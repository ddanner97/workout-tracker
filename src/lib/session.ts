import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/src/lib/auth';

export async function getUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user.id ?? null;
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
