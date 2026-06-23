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
import { fetchExerciseHistory } from '../info';

// components
import RoundedButton from './RoundedButton';
import SessionCarousel from './SessionCarousel';

interface ExerciseHistoryModalProps {
  exerciseId: string;
  exerciseName: string;
  isOpen: boolean;
  onClose: () => void;
}

const LBS_TO_KG = 0.453592;

const dateAxisFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

function sessionVolume(sets: ExerciseHistorySet[], unit: WeightUnit): number {
  const raw = sets.reduce((sum, s) => {
    if (s.reps <= 0) return sum;
    return sum + s.weight * s.reps;
  }, 0);
  return unit === 'kgs' ? raw * LBS_TO_KG : raw;
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
    <Modal
      open={isOpen}
      onClose={() => {
        setCurrentIndex(0);
        onClose();
      }}
    >
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
            onClick={() => {
              setCurrentIndex(0);
              onClose();
            }}
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
              <SessionCarousel
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                currentSession={currentSession}
                unit={unit}
                sessions={sessions}
              />
            )}
          </div>
        )}
      </Box>
    </Modal>
  );
}
