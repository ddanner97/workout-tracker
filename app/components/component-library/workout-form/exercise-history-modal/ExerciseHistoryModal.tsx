'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Modal, Box, CircularProgress } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import {
  ExerciseHistorySession,
  ExerciseHistorySet,
  WeightUnit,
} from '../../../../types/types';
import { lbsToKgs } from '../../../../utils/utils';
import { fetchExerciseHistory } from '../info';

interface ExerciseHistoryModalProps {
  exerciseId: string;
  exerciseName: string;
  isOpen: boolean;
  onClose: () => void;
}

const LBS_TO_KG = 0.453592;

// components
interface RoundedButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
  color: string;
}

function RoundedButton({
  children,
  onClick,
  disabled,
  ariaLabel,
  color,
}: RoundedButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-7 w-7 items-center justify-center rounded-full text-[18px] font-bold disabled:opacity-30"
      aria-label={ariaLabel}
      style={{
        color: color,
        backgroundColor: 'var(--color-surface-alt)',
      }}
    >
      {children}
    </button>
  );
}

const dateAxisFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

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
  const formattedOrder = Math.abs(order) + 1;
  if (formattedOrder === 1) return '1st exercise in the workout';
  if (formattedOrder === 2) return '2nd exercise in the workout';
  if (formattedOrder === 3) return '3rd exercise in the workout';
  return `${formattedOrder}th exercise in the workout`;
}

function sessionVolume(sets: ExerciseHistorySet[], unit: WeightUnit): number {
  const raw = sets.reduce((sum, s) => {
    if (s.reps <= 0) return sum;
    return sum + s.weight * s.reps;
  }, 0);
  return unit === 'kgs' ? raw * LBS_TO_KG : raw;
}

function displayWeight(weight: number, unit: WeightUnit): string {
  if (unit === 'kgs') return lbsToKgs(String(weight));
  return String(weight);
}

export default function ExerciseHistoryModal({
  exerciseId,
  exerciseName,
  isOpen,
  onClose,
}: ExerciseHistoryModalProps) {
  const [unit, setUnit] = useState<WeightUnit>(() => {
    if (typeof window === 'undefined') return 'lbs';
    return (localStorage.getItem('weightUnit') as WeightUnit) ?? 'lbs';
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isPending } = useQuery({
    queryKey: ['exerciseHistory', exerciseId],
    queryFn: () => fetchExerciseHistory(exerciseId),
    enabled: isOpen && !!exerciseId,
  });

  const sessions = data?.sessions ?? [];

  const chartData = useMemo(() => {
    if (sessions.length === 0) return { dates: [], volumes: [] };
    const chronological = [...sessions].reverse();
    return {
      dates: chronological.map((s) => new Date(s.performedAt)),
      volumes: chronological.map((s) => sessionVolume(s.sets, unit)),
    };
  }, [sessions, unit]);

  const currentSession: ExerciseHistorySession | undefined =
    sessions[currentIndex];

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '95%',
          maxWidth: 480,
          maxHeight: '85vh',
          overflowY: 'auto',
          bgcolor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '20px',
          boxShadow: 24,
          p: 3,
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2
              className="font-serif text-[22px] leading-tight font-semibold"
              style={{ color: 'var(--color-heading)' }}
            >
              {exerciseName}
            </h2>
            {!isPending && (
              <p
                className="mt-1 text-[12px]"
                style={{ color: 'var(--color-muted)' }}
              >
                {sessions.length} session{sessions.length !== 1 ? 's' : ''}{' '}
                logged
              </p>
            )}
          </div>
          <RoundedButton
            onClick={onClose}
            disabled={false}
            ariaLabel="Close"
            color="var(--color-placeholder)"
          >
            &times;
          </RoundedButton>
        </div>

        {/* Loading */}
        {isPending && (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress size={28} />
          </Box>
        )}

        {/* Empty state */}
        {!isPending && sessions.length === 0 && (
          <p
            className="py-8 text-center text-[13px]"
            style={{ color: 'var(--color-muted)' }}
          >
            No history found for this exercise.
          </p>
        )}

        {/* Content */}
        {!isPending && sessions.length > 0 && (
          <div className="mt-4 flex flex-col gap-4">
            {/* Unit toggle */}
            <div className="flex justify-center">
              <div
                className="inline-flex overflow-hidden rounded-lg"
                style={{ border: '1px solid var(--color-border)' }}
              >
                {(['lbs', 'kgs'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className="px-4 py-1.5 text-[11px] font-bold tracking-[1px] uppercase"
                    style={{
                      backgroundColor:
                        unit === u
                          ? 'var(--color-accent)'
                          : 'var(--color-surface-alt)',
                      color: unit === u ? '#fff' : 'var(--color-muted)',
                      border: 'none',
                    }}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Volume chart */}
            {chartData.dates.length > 1 && (
              <div>
                <p
                  className="mb-1 text-[10px] font-bold tracking-[1px] uppercase"
                  style={{ color: 'var(--color-muted)' }}
                >
                  Volume trend
                </p>
                <LineChart
                  height={180}
                  grid={{ horizontal: true }}
                  hideLegend
                  xAxis={[
                    {
                      data: chartData.dates,
                      scaleType: 'time',
                      valueFormatter: (value: Date) =>
                        value instanceof Date
                          ? dateAxisFormatter.format(value)
                          : '',
                    },
                  ]}
                  yAxis={[
                    {
                      valueFormatter: (value: number) =>
                        typeof value === 'number'
                          ? Math.round(value).toLocaleString()
                          : '',
                    },
                  ]}
                  series={[
                    {
                      data: chartData.volumes,
                      color: 'var(--color-accent)',
                      curve: 'monotoneX',
                      showMark: true,
                      valueFormatter: (value) =>
                        typeof value === 'number'
                          ? `${Math.round(value).toLocaleString()} ${unit}`
                          : '',
                    },
                  ]}
                  margin={{ top: 12, right: 12, bottom: 24, left: 48 }}
                />
              </div>
            )}

            {/* Session carousel */}
            {currentSession && (
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
                    <p
                      className="text-[11px]"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      {currentSession.sets.length} set
                      {currentSession.sets.length !== 1 ? 's' : ''} logged
                      {currentSession.order != null &&
                        ` - ${formattedOrder(currentSession.order)}`}
                    </p>
                  </div>
                  <RoundedButton
                    onClick={() =>
                      setCurrentIndex((i) =>
                        Math.min(sessions.length - 1, i + 1)
                      )
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
            )}
          </div>
        )}
      </Box>
    </Modal>
  );
}
