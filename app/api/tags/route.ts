import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getUserId, unauthorized } from '@/src/lib/session';

export async function GET() {
  const userId = await getUserId();
  if (!userId) return unauthorized();

  const tags = await prisma.tag.findMany({
    where: { workouts: { some: { userId } } },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(tags);
}
