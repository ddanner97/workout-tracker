import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SetInput {
  setNumber: unknown;
  weight: unknown;
  reps: unknown;
  rpe?: unknown;
  notes?: unknown;
}

interface ExerciseInput {
  exerciseId: unknown;
  order?: unknown;
  sets: unknown;
}

interface WorkoutInput {
  performedAt: unknown;
  notes?: unknown;
  exercises: unknown;
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function parseReps(reps: unknown): number {
  if (reps === "fail") return -1;
  if (typeof reps === "number" && Number.isInteger(reps) && reps > 0) return reps;
  throw new Error("reps must be a positive integer or 'fail'");
}

function validateBody(body: WorkoutInput): string[] {
  const errors: string[] = [];

  if (!body.performedAt || isNaN(Date.parse(String(body.performedAt)))) {
    errors.push("performedAt must be a valid date string");
  }

  if (!Array.isArray(body.exercises) || body.exercises.length === 0) {
    errors.push("exercises must be a non-empty array");
    return errors;
  }

  (body.exercises as ExerciseInput[]).forEach((ex, ei) => {
    if (!ex.exerciseId || typeof ex.exerciseId !== "string") {
      errors.push(`exercises[${ei}].exerciseId is required`);
    }

    if (!Array.isArray(ex.sets) || (ex.sets as unknown[]).length === 0) {
      errors.push(`exercises[${ei}].sets must be a non-empty array`);
    } else {
      (ex.sets as SetInput[]).forEach((set, si) => {
        try {
          parseReps(set.reps);
        } catch {
          errors.push(
            `exercises[${ei}].sets[${si}].reps must be a positive integer or 'fail'`
          );
        }
      });
    }
  });

  return errors;
}

// ─── Route handlers ───────────────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const workout = await prisma.workout.findUnique({
    where: { id },
    include: {
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
