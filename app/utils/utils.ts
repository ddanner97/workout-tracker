import { ExerciseRow, SetRow, SavedWorkout, WorkoutFormInitialValues, SavedSet } from "../types/types";

export function emptySet(): SetRow {
  return { weight: "", reps: "", rpe: "" };
}

export function emptyExercise(): ExerciseRow {
  return { exerciseId: "", sets: [emptySet()] };
}

export function displayReps(reps: number): string {
  return reps === -1 ? "fail" : String(reps);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function savedWorkoutToFormValues(workout: SavedWorkout): WorkoutFormInitialValues {
  return {
    date: workout.performedAt.slice(0, 10),
    notes: workout.notes ?? "",
    exercises: workout.workoutExercises
      .sort((a, b) => a.order - b.order)
      .map((we) => ({
        exerciseId: we.exercise.id,
        sets: we.sets.map((s: SavedSet) => ({
          weight: String(s.weight),
          reps: s.reps === -1 ? "fail" : String(s.reps),
          rpe: s.rpe != null ? String(s.rpe) : "",
        })),
      })),
  };
}
