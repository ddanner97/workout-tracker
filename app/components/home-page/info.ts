import {Exercise, SavedWorkout} from "../../types/types";

export async function fetchExercises(): Promise<Exercise[]> {
  const res = await fetch("/api/exercises");
  if (!res.ok) throw new Error("Failed to fetch exercises");
  return res.json();
}

export async function postWorkout(body: unknown): Promise<SavedWorkout> {
  const res = await fetch("/api/workouts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json();
    throw data;
  }
  return res.json();
}