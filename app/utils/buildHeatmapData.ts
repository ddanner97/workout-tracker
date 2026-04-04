import type { SavedWorkout } from '../types/types';

export type HeatmapDay = {
  date: string;
  volume: number;
  workoutCount: number;
};

export type HeatmapData = {
  days: Map<string, HeatmapDay>;
  maxVolume: number;
  totalWorkouts: number;
};

export function buildHeatmapData(workouts: SavedWorkout[]): HeatmapData {
  const days = new Map<string, HeatmapDay>();

  for (const workout of workouts) {
    const date = workout.performedAt.slice(0, 10);
    let volume = 0;

    for (const we of workout.workoutExercises) {
      for (const set of we.sets) {
        if (set.reps !== -1) {
          volume += set.weight * set.reps;
        }
      }
    }

    const existing = days.get(date);
    if (existing) {
      existing.volume += volume;
      existing.workoutCount += 1;
    } else {
      days.set(date, { date, volume, workoutCount: 1 });
    }
  }

  const maxVolume = Math.max(
    ...Array.from(days.values()).map((d) => d.volume),
    1
  );
  const totalWorkouts = Array.from(days.values()).reduce(
    (sum, d) => sum + d.workoutCount,
    0
  );

  return { days, maxVolume, totalWorkouts };
}
