import { Exercise } from "../../../types/types";

export async function postExercise(body: {
  name: string;
  muscleGroup: string;
}): Promise<Exercise> {
  const res = await fetch("/api/exercises", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to create exercise");
  return res.json();
}

export async function fetchExercises(): Promise<Exercise[]> {
  const res = await fetch("/api/exercises");
  if (!res.ok) throw new Error("Failed to fetch exercises");
  return res.json();
}