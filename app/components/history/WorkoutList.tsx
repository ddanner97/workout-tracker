'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { GraphViewMode, CustomDateRange, HistoryGraphRange } from '../../types/types';
import { formatDate } from '../../utils/utils';
import {
  fetchTags,
  fetchWorkoutMetrics,
  fetchWorkouts,
  deleteWorkout,
} from './info';

// ─── Components ───
import GraphView from './GraphView';
import ExerciseTable from './ExerciseTable';
import { Button, Container, ViewToggle } from '../component-library';
import DeleteWorkoutDialog from './DeleteWorkoutDialog';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
  Box,
  Chip,
  TextField,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

type HistoryViewMode = 'list' | 'graphs';

// ─── WorkoutList component ───
export default function WorkoutList() {
  const [viewMode, setViewMode] = useState<HistoryViewMode>('list');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [graphViewMode, setGraphViewMode] = useState<GraphViewMode>('workout');
  const [customRange, setCustomRange] = useState<CustomDateRange | null>(null);

  const queryClient = useQueryClient();
  const sortedSelectedTags = [...selectedTags].sort();

  const apiRange: HistoryGraphRange = useMemo(() => {
    if (graphViewMode === 'year') return '365';
    if (graphViewMode === 'custom') return 'custom';
    return 'all';
  }, [graphViewMode]);

  // Mutations and Queries
  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['workoutMetrics'] });
      setDeleteTargetId(null);
    },
  });

  const { data: workouts = [], isPending: isLoadingWorkouts } = useQuery({
    queryKey: ['workouts'],
    queryFn: fetchWorkouts,
  });

  const { data: allTags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  });

  const isCustomReady =
    graphViewMode !== 'custom' || (customRange?.start != null && customRange?.end != null);

  const { data: metrics, isPending: isLoadingMetrics } = useQuery({
    queryKey: ['workoutMetrics', sortedSelectedTags, apiRange, customRange?.start, customRange?.end],
    queryFn: () =>
      fetchWorkoutMetrics({
        tags: sortedSelectedTags,
        range: apiRange,
        startDate: customRange?.start,
        endDate: customRange?.end,
      }),
    enabled: viewMode === 'graphs' && isCustomReady,
  });

  const filteredWorkouts =
    selectedTags.length === 0
      ? workouts
      : workouts.filter((w) =>
          selectedTags.every((tag) => w.tags.some((t) => t.name === tag))
        );

  return (
    <>
      <h1 className="mb-5 text-center text-2xl font-bold">Saved Workouts</h1>

      {allTags.length > 0 && (
        <Container gap={8} className="mb-5">
          <Autocomplete
            className="flex-grow"
            multiple
            options={allTags.map((t) => t.name)}
            value={selectedTags}
            onChange={(_e, newValue) => setSelectedTags(newValue)}
            renderTags={(tagValues, getTagProps) =>
              tagValues.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    label={`#${option}`}
                    size="small"
                    {...tagProps}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filter by tag"
                placeholder="Select tags..."
              />
            )}
          />
          <ViewToggle
            value={viewMode}
            onChange={setViewMode}
            ariaLabel="Switch history view"
            options={[
              { value: 'list', label: 'List' },
              { value: 'graphs', label: 'Graphs' },
            ]}
          />
        </Container>
      )}

      {viewMode === 'graphs' ? (
        // TODO: Add loading state using isLoadingMetrics
        <GraphView
          metrics={metrics ?? { volumeSeries: [], exerciseMaxWeightSeries: [] }}
          viewMode={graphViewMode}
          onViewModeChange={setGraphViewMode}
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
        />
      ) : (
        <section>
          {isLoadingWorkouts && <p>Loading...</p>}
          {!isLoadingWorkouts && filteredWorkouts.length === 0 && (
            <p>
              {selectedTags.length > 0
                ? 'No workouts match the selected tags.'
                : 'No workouts logged yet.'}
            </p>
          )}
          {filteredWorkouts.map((workout) => (
            <Accordion key={workout.id}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 0.75,
                  }}
                >
                  <span>{formatDate(workout.performedAt)}</span>
                  <Container>
                    {workout.tags.slice(0, 2).map((tag) => (
                      <Chip
                        key={tag.id}
                        label={`#${tag.name}`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Container>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <p>{workout.notes}</p>
                {workout.workoutExercises.map((exercise) => (
                  <div key={exercise.id} style={{ marginBottom: '6px' }}>
                    <strong>{exercise.exercise.name}</strong>
                    {exercise.exercise.muscleGroup && (
                      <span> - {exercise.exercise.muscleGroup}</span>
                    )}
                    <ExerciseTable exercise={exercise} />
                  </div>
                ))}
                <Box mt={2} sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    label="Edit"
                    variant="outlined"
                    size="small"
                    href={`/workouts/${workout.id}/edit`}
                  />
                  <Button
                    label="Delete"
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => setDeleteTargetId(workout.id)}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </section>
      )}

      <DeleteWorkoutDialog
        open={deleteTargetId !== null}
        isDeleting={isDeleting}
        onConfirm={() => deleteTargetId && handleDelete(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
      />
    </>
  );
}
