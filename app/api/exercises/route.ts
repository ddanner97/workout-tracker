import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getUserId, unauthorized } from '@/src/lib/session';

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return unauthorized();

  const exercises = await prisma.exercise.findMany({
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(exercises);
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return unauthorized();

  const { name, muscleGroup } = await req.json();
  const exercise = await prisma.exercise.create({
    data: { name, muscleGroup: muscleGroup || null },
  });
  return NextResponse.json(exercise, { status: 201 });
}
