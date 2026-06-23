import React from 'react';
import { lbsToKgs } from '../../../../utils/utils';
import { ExerciseHistorySession, WeightUnit } from '../../../../types/types';

// components
import RoundedButton from './RoundedButton';

interface SessionCarouselProps {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  currentSession: ExerciseHistorySession;
  unit: WeightUnit;
  sessions: ExerciseHistorySession[];
}

function displayWeight(weight: number, unit: WeightUnit): string {
  if (unit === 'kgs') return lbsToKgs(String(weight));
  return String(weight);
}

function formatSessionDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function formattedOrder(order: number): string {
  const position = order + 1;
  const mod100 = position % 100;
  const suffix =
    mod100 >= 11 && mod100 <= 13
      ? 'th'
      : position % 10 === 1
        ? 'st'
        : position % 10 === 2
          ? 'nd'
          : position % 10 === 3
            ? 'rd'
            : 'th';
  return `${position}${suffix} exercise in the workout`;
}

export default function SessionCarousel({
  currentIndex,
  setCurrentIndex,
  currentSession,
  unit,
  sessions,
}: SessionCarouselProps) {
  return (
    <div>
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <RoundedButton
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          ariaLabel="Previous session"
          color="var(--color-heading)"
        >
          &#8592;
        </RoundedButton>
        <div className="text-center">
          <p
            className="text-[13px] font-bold"
            style={{ color: 'var(--color-heading)' }}
          >
            {formatSessionDate(currentSession.performedAt)}
          </p>
          <p className="text-[11px]" style={{ color: 'var(--color-muted)' }}>
            {currentSession.sets.length} set
            {currentSession.sets.length !== 1 ? 's' : ''} logged
            {currentSession.order != null &&
              ` - ${formattedOrder(currentSession.order)}`}
          </p>
        </div>
        <RoundedButton
          onClick={() =>
            setCurrentIndex((i) => Math.min(sessions.length - 1, i + 1))
          }
          disabled={currentIndex === sessions.length - 1}
          ariaLabel="Next session"
          color="var(--color-heading)"
        >
          &#8594;
        </RoundedButton>
      </div>

      {/* Sets table */}
      <div
        className="mt-3 overflow-hidden rounded-xl"
        style={{ border: '1px solid var(--color-border)' }}
      >
        {/* Table header */}
        <div
          className="grid grid-cols-4 px-3 py-2 text-[10px] font-bold tracking-[1px] uppercase"
          style={{
            backgroundColor: 'var(--color-surface-alt)',
            color: 'var(--color-muted)',
          }}
        >
          <span>Set</span>
          <span className="text-right">Weight</span>
          <span className="text-right">Reps</span>
          <span className="text-right">RPE</span>
        </div>

        {/* Table rows */}
        {currentSession.sets.map((set, idx) => (
          <div
            key={set.setNumber}
            className="grid grid-cols-4 px-3 py-2 text-[12px]"
            style={{
              backgroundColor:
                idx % 2 === 0
                  ? 'var(--color-surface)'
                  : 'var(--color-surface-alt)',
              color: 'var(--color-body)',
            }}
          >
            <span>{set.setNumber}</span>
            <span className="text-right">
              {displayWeight(set.weight, unit)}
            </span>
            <span className="text-right">
              {set.reps === -1 ? 'fail' : set.reps}
            </span>
            <span className="text-right">
              {set.rpe != null ? set.rpe : '—'}
            </span>
          </div>
        ))}
      </div>

      {/* Carousel dots */}
      {sessions.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {sessions.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  idx === currentIndex
                    ? 'var(--color-accent)'
                    : 'var(--color-border)',
              }}
              aria-label={`Go to session ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
