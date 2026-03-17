// ─── Types ────────────────────────────────────────────────────────────────────

export interface SetInput {
  setNumber: unknown;
  weight: unknown;
  reps: unknown;
  rpe?: unknown;
  notes?: unknown;
}

export interface ExerciseInput {
  exerciseId: unknown;
  order?: unknown;
  sets: unknown;
}

export interface WorkoutInput {
  performedAt: unknown;
  notes?: unknown;
  exercises: unknown;
  tags?: unknown;
}

// ─── Utils ────────────────────────────────────────────────────────────────────

export function parseReps(reps: unknown): number {
  if (reps === "fail") return -1;
  if (typeof reps === "number" && Number.isInteger(reps) && reps > 0) return reps;
  throw new Error("reps must be a positive integer or 'fail'");
}

export function validateBody(body: WorkoutInput): string[] {
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
