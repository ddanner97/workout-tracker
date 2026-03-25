import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import {
  ExerciseInput,
  SetInput,
  WorkoutInput,
  parseReps,
  validateBody,
} from './shared';

/**
 * API route handlers for retrieving and creating multiple workouts.
 **/

export async function GET() {
  const workouts = await prisma.workout.findMany({
    orderBy: { performedAt: 'desc' },
    include: {
      tags: { orderBy: { name: 'asc' } },
      workoutExercises: {
        orderBy: { order: 'asc' },
        include: {
          exercise: true,
          sets: { orderBy: { setNumber: 'asc' } },
        },
      },
    },
  });
  return NextResponse.json(workouts);
}

export async function POST(req: NextRequest) {
  let body: WorkoutInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ errors: ['Invalid JSON'] }, { status: 400 });
  }

  const errors = validateBody(body);
  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const exercises = body.exercises as ExerciseInput[];

  const tagNames = Array.isArray(body.tags)
    ? [
        ...new Set(
          (body.tags as unknown[])
            .filter((t) => typeof t === 'string')
            .map((t) => (t as string).replace(/^#/, '').trim().toLowerCase())
            .filter(Boolean)
        ),
      ]
    : [];

  const workout = await prisma.workout.create({
    data: {
      performedAt: new Date(String(body.performedAt)),
      notes: body.notes ? String(body.notes) : null,
      tags: {
        connectOrCreate: tagNames.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
      workoutExercises: {
        create: exercises.map((ex, idx) => ({
          exerciseId: String(ex.exerciseId),
          order: typeof ex.order === 'number' ? ex.order : idx,
          sets: {
            create: (ex.sets as SetInput[]).map((set) => ({
              setNumber: Number(set.setNumber),
              weight: Number(set.weight),
              reps: parseReps(set.reps),
              rpe: set.rpe != null ? Number(set.rpe) : null,
              notes: set.notes ? String(set.notes) : null,
            })),
          },
        })),
      },
    },
    include: {
      tags: { orderBy: { name: 'asc' } },
      workoutExercises: {
        orderBy: { order: 'asc' },
        include: {
          exercise: true,
          sets: { orderBy: { setNumber: 'asc' } },
        },
      },
    },
  });

  return NextResponse.json(workout, { status: 201 });
}
