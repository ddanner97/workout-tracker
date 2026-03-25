import type { WorkoutVolumePoint, AggregatedVolumePoint } from '../types/types';

type GroupBy = 'week' | 'month';

const weekLabelFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

const monthLabelFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

function getISOWeekStart(iso: string): string {
  const date = new Date(iso);
  const day = date.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day;
  const monday = new Date(date);
  monday.setUTCDate(monday.getUTCDate() + diff);
  return monday.toISOString().slice(0, 10);
}

function getMonthKey(iso: string): string {
  return iso.slice(0, 7);
}

function buildWeekLabel(weekStart: string): string {
  const start = new Date(weekStart + 'T00:00:00Z');
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  return `${weekLabelFormatter.format(start)} – ${weekLabelFormatter.format(end)}`;
}

function buildMonthLabel(monthKey: string): string {
  const date = new Date(monthKey + '-01T00:00:00Z');
  return monthLabelFormatter.format(date);
}

export function aggregateVolume(
  points: WorkoutVolumePoint[],
  groupBy: GroupBy
): AggregatedVolumePoint[] {
  const buckets = new Map<string, { volume: number; workoutCount: number }>();
  const bucketOrder: string[] = [];

  for (const point of points) {
    const key =
      groupBy === 'week'
        ? getISOWeekStart(point.performedAt)
        : getMonthKey(point.performedAt);

    const existing = buckets.get(key);
    if (existing) {
      existing.volume += point.volume;
      existing.workoutCount += 1;
    } else {
      buckets.set(key, { volume: point.volume, workoutCount: 1 });
      bucketOrder.push(key);
    }
  }

  return bucketOrder.map((key) => {
    const { volume, workoutCount } = buckets.get(key)!;
    const performedAt =
      groupBy === 'week' ? `${key}T00:00:00.000Z` : `${key}-01T00:00:00.000Z`;
    const periodLabel =
      groupBy === 'week' ? buildWeekLabel(key) : buildMonthLabel(key);

    return { performedAt, periodLabel, volume, workoutCount };
  });
}

export function autoGroupBy(daySpan: number): GroupBy {
  return daySpan < 365 ? 'week' : 'month';
}
