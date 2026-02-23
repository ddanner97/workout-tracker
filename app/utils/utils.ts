import { ExerciseRow, SetRow } from "../types/types";

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
  });
}