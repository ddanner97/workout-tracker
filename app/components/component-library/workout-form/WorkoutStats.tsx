'use client';

import { useMemo } from 'react';
import { useWorkoutForm } from '../../contexts/WorkoutFormContext';

interface StatCardProps {
  value: string | number;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 rounded-[14px] px-3 py-3"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <span
        className="font-serif text-[22px] font-semibold"
        style={{ color: 'var(--color-accent)' }}
      >
        {value}
      </span>
      <span
        className="text-[10px] font-bold uppercase tracking-wider"
        style={{ color: 'var(--color-muted)' }}
      >
        {label}
      </span>
    </div>
  );
}

export default function WorkoutStats() {
  const { exercises } = useWorkoutForm();

  const stats = useMemo(() => {
    const exerciseCount = exercises.length;
    let setCount = 0;
    let volume = 0;
    let hasVolume = false;

    for (const ex of exercises) {
      setCount += ex.sets.length;
      for (const set of ex.sets) {
        const w = parseFloat(set.weight);
        const r = set.reps === 'fail' ? 0 : parseFloat(set.reps);
        if (w > 0 && r > 0) {
          volume += w * r;
          hasVolume = true;
        }
      }
    }

    return {
      exercises: exerciseCount,
      sets: setCount,
      volume: hasVolume ? volume.toLocaleString() : '\u2014',
    };
  }, [exercises]);

  return (
    <div className="grid grid-cols-3 gap-2.5">
      <StatCard value={stats.exercises} label="Exercises" />
      <StatCard value={stats.sets} label="Sets" />
      <StatCard value={stats.volume} label="Volume" />
    </div>
  );
}
