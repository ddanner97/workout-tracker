'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ExerciseRow, WeightUnit } from '../../../types/types';
import { useWorkoutForm } from '../../contexts/WorkoutFormContext';
import { fetchExerciseHistory, postWorkout, putWorkout } from './info';

import { ExerciseTable, TextField } from '..';
import AddExerciseDialog from './AddExerciseDialog';
import ExerciseHistoryModal from './exercise-history-modal/ExerciseHistoryModal';
import RemoveExerciseModal from './RemoveExerciseModal';
import ExercisePicker from './ExercisePicker';
import { Box, Stack } from '@mui/material';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import TagInput from './TagInput';
import WorkoutStats from './WorkoutStats';

export default function WorkoutForm({
  workoutId,
}: { workoutId?: string } = {}) {
  const isEditMode = !!workoutId;
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    date,
    setDate,
    notes,
    setNotes,
    tags,
    setTags,
    exercises,
    formErrors,
    setFormErrors,
    addExercise,
    addSet,
    removeSet,
    updateSet,
    resetForm,
  } = useWorkoutForm();

  const [weightUnit, setWeightUnit] = useState<WeightUnit>(() => {
    if (typeof window === 'undefined') return 'lbs';
    return (localStorage.getItem('weightUnit') as WeightUnit) ?? 'lbs';
  });

  function handleToggleWeightUnit() {
    setWeightUnit((prev) => {
      const next = prev === 'lbs' ? 'kgs' : 'lbs';
      localStorage.setItem('weightUnit', next);
      return next;
    });
  }

  const [dialogExerciseName, setDialogExerciseName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingExerciseIndex, setPendingExerciseIndex] = useState<
    number | null
  >(null);

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyExerciseId, setHistoryExerciseId] = useState('');
  const [historyExerciseName, setHistoryExerciseName] = useState('');

  const workoutMutation = useMutation({
    mutationFn: (body: unknown) =>
      isEditMode ? putWorkout(workoutId!, body) : postWorkout(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['workoutMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      if (isEditMode) {
        router.push('/history');
      } else {
        resetForm();
      }
    },
    onError: (err: { errors?: string[] }) => {
      setFormErrors(err.errors ?? ['An unexpected error occurred.']);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors([]);

    const body = {
      performedAt: date,
      notes: notes || undefined,
      tags,
      exercises: exercises.map((ex, idx) => ({
        exerciseId: ex.exerciseId,
        order: idx,
        sets: ex.sets.map((set, si) => ({
          setNumber: si + 1,
          weight: Number(set.weight),
          reps: set.reps === 'fail' ? 'fail' : Number(set.reps),
          rpe: set.rpe !== '' ? Number(set.rpe) : undefined,
        })),
      })),
    };

    workoutMutation.mutate(body);
  }

  return (
    <Box component="section">
      {/* Eyebrow + Heading */}
      <p
        className="text-[11px] font-bold tracking-[2px] uppercase"
        style={{ color: 'var(--color-accent-light)' }}
      >
        {isEditMode ? 'Edit session' : 'New session'}
      </p>
      <h1
        className="mt-1 font-serif text-[34px] leading-[37.4px] font-semibold tracking-[-0.5px]"
        style={{ color: 'var(--color-heading)' }}
      >
        {isEditMode ? 'Edit Workout' : 'Log a Workout'}
      </h1>

      {/* Stats row */}
      <div className="mt-6">
        <WorkoutStats />
      </div>

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Stack spacing={2.5}>
          {/* Date + Time row */}
          <div className="grid grid-cols-2 gap-2.5">
            <TextField
              id="date"
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <TextField
              id="time"
              label="Time"
              type="time"
              defaultValue={new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1">
            <label
              className="text-[11px] font-bold tracking-[1px] uppercase"
              style={{ color: 'var(--color-muted)' }}
            >
              Tags
            </label>
            <TagInput value={tags} onChange={setTags} />
          </div>

          {/* Notes */}
          <TextField
            id="notes"
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            minRows={2}
            fullWidth
            placeholder="How are you feeling today?"
          />

          {/* Divider */}
          <div
            className="h-px"
            style={{ backgroundColor: 'var(--color-border)' }}
          />

          {/* Exercises section */}
          <div>
            <div className="flex items-center justify-between">
              <h2
                className="font-serif text-[20px] font-semibold tracking-[-0.2px]"
                style={{ color: 'var(--color-heading)' }}
              >
                Exercises
              </h2>
              <span
                className="rounded-full px-3 py-1 text-[11px] font-bold"
                style={{
                  backgroundColor: 'var(--color-badge-bg)',
                  color: 'var(--color-accent)',
                }}
              >
                {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
              </span>
            </div>

            <Stack spacing={2} sx={{ mt: 2 }}>
              {exercises.map((ex: ExerciseRow, ei: number) => (
                <div
                  key={ei}
                  className="overflow-hidden rounded-2xl"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {/* Card header */}
                  <div
                    className="flex items-center justify-between px-4 py-3"
                    style={{
                      backgroundColor: 'var(--color-surface-alt)',
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      <span
                        className="text-[10px] font-bold tracking-[1.5px] uppercase"
                        style={{ color: 'var(--color-accent-light)' }}
                      >
                        Exercise {ei + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <ExercisePicker
                          setPendingExerciseIndex={setPendingExerciseIndex}
                          setDialogExerciseName={setDialogExerciseName}
                          setDialogOpen={setDialogOpen}
                          exerciseIndex={ei}
                          exercise={ex}
                        />
                        {ex.exerciseId && (
                          <button
                            type="button"
                            onClick={() => {
                              const exercises = queryClient.getQueryData<
                                { id: string; name: string }[]
                              >(['exercises']);
                              const name =
                                exercises?.find((e) => e.id === ex.exerciseId)
                                  ?.name ?? '';
                              setHistoryExerciseId(ex.exerciseId);
                              setHistoryExerciseName(name);
                              setHistoryModalOpen(true);
                            }}
                            onMouseEnter={() =>
                              queryClient.prefetchQuery({
                                queryKey: ['exerciseHistory', ex.exerciseId],
                                queryFn: () =>
                                  fetchExerciseHistory(ex.exerciseId),
                              })
                            }
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                            style={{
                              backgroundColor: 'var(--color-input-bg)',
                              color: 'var(--color-placeholder)',
                            }}
                            aria-label="View exercise history"
                          >
                            <HistoryOutlined sx={{ fontSize: 16 }} />
                          </button>
                        )}
                      </div>
                    </div>
                    {exercises.length > 1 && (
                      <RemoveExerciseModal exerciseIndex={ei} />
                    )}
                  </div>

                  {/* Sets */}
                  <div className="px-4 py-3">
                    <ExerciseTable
                      sets={ex.sets}
                      onAddSet={() => addSet(ei)}
                      onRemoveSet={(si) => removeSet(ei, si)}
                      onUpdateSet={(si, field, val) =>
                        updateSet(ei, si, field, val)
                      }
                      weightUnit={weightUnit}
                      onToggleWeightUnit={handleToggleWeightUnit}
                    />
                  </div>
                </div>
              ))}

              {/* Add exercise button */}
              <button
                type="button"
                onClick={addExercise}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-[14px] font-bold text-white"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-xl text-[16px] text-white"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  +
                </span>
                Add exercise
              </button>
            </Stack>
          </div>

          {/* Error messages */}
          {formErrors.length > 0 && (
            <Box component="ul" sx={{ color: 'error.main', pl: 2, m: 0 }}>
              {formErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </Box>
          )}

          {/* Action buttons */}
          <div className={isEditMode ? 'flex gap-3' : ''}>
            {isEditMode && (
              <button
                type="button"
                onClick={() => router.push('/history')}
                className="w-full rounded-2xl py-4 text-[15px] font-bold tracking-[0.3px]"
                style={{
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-muted)',
                  backgroundColor: 'var(--color-surface)',
                }}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={workoutMutation.isPending}
              className="w-full rounded-2xl py-4 text-[15px] font-bold tracking-[0.3px] text-white disabled:opacity-60"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              {workoutMutation.isPending
                ? 'Saving...'
                : isEditMode
                  ? 'Update Workout'
                  : 'Save Workout'}
            </button>
          </div>
        </Stack>
      </Box>

      <AddExerciseDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        dialogExerciseName={dialogExerciseName}
        setDialogExerciseName={setDialogExerciseName}
        pendingExerciseIndex={pendingExerciseIndex}
        setPendingExerciseIndex={setPendingExerciseIndex}
      />

      <ExerciseHistoryModal
        exerciseId={historyExerciseId}
        exerciseName={historyExerciseName}
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
      />
    </Box>
  );
}
