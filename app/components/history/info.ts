import {
  HistoryGraphRange,
  SavedWorkout,
  Tag,
  WorkoutMetricsResponse,
} from "../../types/types";

export async function fetchTags(): Promise<Tag[]> {
  const res = await fetch('/api/tags');
  if (!res.ok) throw new Error('Failed to fetch tags');
  return res.json();
}

export async function fetchWorkouts(): Promise<SavedWorkout[]> {
  const res = await fetch("/api/workouts");
  if (!res.ok) throw new Error("Failed to fetch workouts");
  return res.json();
}

// export async function fetchExercises(): Promise<Exercise[]> {
//   const res = await fetch("/api/exercises");
//   if (!res.ok) throw new Error("Failed to fetch exercises");
//   return res.json();
// }

export async function fetchWorkoutMetrics({
  tags,
  range,
  startDate,
  endDate,
}: {
  tags: string[];
  range: HistoryGraphRange;
  startDate?: string;
  endDate?: string;
}): Promise<WorkoutMetricsResponse> {
  const params = new URLSearchParams();

  if (tags.length > 0) {
    params.set("tags", tags.join(","));
  }

  params.set("range", range);

  if (range === "custom" && startDate && endDate) {
    params.set("startDate", startDate);
    params.set("endDate", endDate);
  }

  const queryString = params.toString();
  const res = await fetch(`/api/workouts/metrics${queryString ? `?${queryString}` : ""}`);
  if (!res.ok) throw new Error("Failed to fetch workout metrics");
  return res.json();
}

export async function deleteWorkout(id: string): Promise<void> {
  const res = await fetch(`/api/workouts/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete workout");
}
