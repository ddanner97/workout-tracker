import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getUserId, unauthorized } from '@/src/lib/session';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId();
  if (!userId) return unauthorized();

  const { id } = await params;

  const exercise = await prisma.exercise.findUnique({ where: { id } });
  if (!exercise) {
    return NextResponse.json(
      { error: 'Exercise not found' },
      { status: 404 }
    );
  }

  const workoutExercises = await prisma.workoutExercise.findMany({
    where: { exerciseId: id, workout: { userId } },
    orderBy: { workout: { performedAt: 'desc' } },
    take: 10,
    include: {
      workout: { select: { id: true, performedAt: true } },
      sets: {
        orderBy: { setNumber: 'asc' },
        select: { setNumber: true, weight: true, reps: true, rpe: true },
      },
    },
  });

  const sessions = workoutExercises.map((we) => ({
    workoutId: we.workout.id,
    performedAt: we.workout.performedAt.toISOString(),
    sets: we.sets,
  }));

  return NextResponse.json({ sessions });
}
