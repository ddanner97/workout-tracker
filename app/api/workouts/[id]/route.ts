import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import {
  ExerciseInput,
  SetInput,
  WorkoutInput,
  parseReps,
  validateBody,
} from "../shared";

/**
 * API route handlers for retrieving, updating, and deleting 
 * a single workout by its ID.
**/

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const workout = await prisma.workout.findUnique({
    where: { id },
    include: {
      tags: { orderBy: { name: "asc" } },
      workoutExercises: {
        orderBy: { order: "asc" },
        include: {
          exercise: true,
          sets: { orderBy: { setNumber: "asc" } },
        },
      },
    },
  });

  if (!workout) {
    return NextResponse.json({ error: "Workout not found" }, { status: 404 });
  }

  return NextResponse.json(workout);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = await prisma.workout.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Workout not found" }, { status: 404 });
  }

  let body: WorkoutInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ errors: ["Invalid JSON"] }, { status: 400 });
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
            .filter((t) => typeof t === "string")
            .map((t) => (t as string).replace(/^#/, "").trim().toLowerCase())
            .filter(Boolean)
        ),
      ]
    : [];

  const workout = await prisma.$transaction(async (tx) => {
    await tx.set.deleteMany({
      where: { workoutExercise: { workoutId: id } },
    });
    await tx.workoutExercise.deleteMany({
      where: { workoutId: id },
    });

    return tx.workout.update({
      where: { id },
      data: {
        performedAt: new Date(String(body.performedAt)),
        notes: body.notes ? String(body.notes) : null,
        tags: {
          set: [],
          connectOrCreate: tagNames.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
        workoutExercises: {
          create: exercises.map((ex, idx) => ({
            exerciseId: String(ex.exerciseId),
            order: typeof ex.order === "number" ? ex.order : idx,
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
        tags: { orderBy: { name: "asc" } },
        workoutExercises: {
          orderBy: { order: "asc" },
          include: {
            exercise: true,
            sets: { orderBy: { setNumber: "asc" } },
          },
        },
      },
    });
  });

  return NextResponse.json(workout);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = await prisma.workout.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Workout not found" }, { status: 404 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.set.deleteMany({
      where: { workoutExercise: { workoutId: id } },
    });
    await tx.workoutExercise.deleteMany({ where: { workoutId: id } });
    await tx.workout.delete({ where: { id } });
  });

  return new NextResponse(null, { status: 204 });
}
