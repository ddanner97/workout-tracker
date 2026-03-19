'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ExerciseMaxWeightPoint,
  HistoryGraphRange,
  SavedWorkoutExercise,
  WorkoutVolumePoint,
} from '../../types/types';
import { displayReps, formatDate } from '../../utils/utils';
import {
  fetchExercises,
  fetchTags,
  fetchWorkoutMetrics,
  fetchWorkouts,
  deleteWorkout,
} from './info';

// ─── Components ───
import {
  Button,
  Container,
  GraphFilters,
  LineGraph,
  ViewToggle,
} from '../component-library';
import DeleteWorkoutDialog from './DeleteWorkoutDialog';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
  Box,
  Chip,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

type HistoryViewMode = 'list' | 'graphs';

// ─── ExerciseTable component ───
const ExerciseTable = ({ exercise }: { exercise: SavedWorkoutExercise }) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Set</TableCell>
            <TableCell>Weight</TableCell>
            <TableCell>Reps</TableCell>
            <TableCell>RPE</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {exercise.sets.map((set) => (
            <TableRow key={set.id}>
              <TableCell>{set.setNumber}</TableCell>
              <TableCell>{set.weight}</TableCell>
              <TableCell>{displayReps(set.reps)}</TableCell>
              <TableCell>{set.rpe ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// ─── WorkoutList component ───
export default function WorkoutList() {
  const [viewMode, setViewMode] = useState<HistoryViewMode>('list');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [range, setRange] = useState<HistoryGraphRange>('all');
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const sortedSelectedTags = [...selectedTags].sort();

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

  const { data: exercises = [], isPending: isLoadingExercises } = useQuery({
    queryKey: ['exercises'],
    queryFn: fetchExercises,
    enabled: viewMode === 'graphs',
  });

  const { data: metrics, isPending: isLoadingMetrics } = useQuery({
    queryKey: ['workoutMetrics', sortedSelectedTags, range, selectedExerciseId],
    queryFn: () =>
      fetchWorkoutMetrics({
        tags: sortedSelectedTags,
        range,
        exerciseId: selectedExerciseId || undefined,
      }),
    enabled: viewMode === 'graphs',
  });

  const filteredWorkouts =
    selectedTags.length === 0
      ? workouts
      : workouts.filter((w) =>
          selectedTags.every((tag) => w.tags.some((t) => t.name === tag))
        );

  const volumeSeries = metrics?.volumeSeries ?? [];
  const exerciseSeries = metrics?.exerciseMaxWeightSeries ?? [];

  function renderGraphView() {
    if (isLoadingMetrics || isLoadingExercises) {
      return <p>Loading graphs...</p>;
    }

    return (
      <Box sx={{ display: 'grid', gap: 3 }}>
        <GraphFilters
          range={range}
          onRangeChange={setRange}
          exerciseId={selectedExerciseId}
          exercises={exercises}
          onExerciseChange={setSelectedExerciseId}
        />

        <LineGraph<WorkoutVolumePoint>
          title="Workout Volume Over Time"
          subtitle="Tracks total successful volume for each workout in the filtered range."
          points={volumeSeries}
          emptyMessage="No workouts match the current graph filters."
          yAxisLabel="Volume"
          formatValue={(value) => `${Math.round(value).toLocaleString()} lb-reps`}
          getPointValue={(point) => point.volume}
          getTooltipRows={(point) => [
            {
              label: 'Volume',
              value: `${Math.round(point.volume).toLocaleString()} lb-reps`,
            },
            {
              label: 'Tags',
              value:
                point.tags.length > 0
                  ? point.tags.map((tag) => `#${tag}`).join(', ')
                  : 'None',
            },
          ]}
          lineColor="#2563eb"
        />

        <LineGraph<ExerciseMaxWeightPoint>
          title="Heaviest Set Over Time"
          subtitle="Shows the heaviest successful set for the selected exercise in each workout."
          points={selectedExerciseId ? exerciseSeries : []}
          emptyMessage={
            selectedExerciseId
              ? 'No matching exercise data was found for the current filters.'
              : 'Select an exercise to see its heaviest set over time.'
          }
          yAxisLabel="Weight (lbs)"
          formatValue={(value) => `${value.toLocaleString()} lbs`}
          getPointValue={(point) => point.weight}
          getTooltipRows={(point) => [
            {
              label: 'Weight',
              value: `${point.weight.toLocaleString()} lbs`,
            },
            {
              label: 'Reps',
              value: String(point.reps),
            },
          ]}
          lineColor="#0f766e"
        />
      </Box>
    );
  }

  return (
    <>
      <Box
        mb={3}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <h1 className="text-center text-2xl font-bold">Saved Workouts</h1>
        <ViewToggle
          value={viewMode}
          onChange={setViewMode}
          ariaLabel="Switch history view"
          options={[
            { value: 'list', label: 'List' },
            { value: 'graphs', label: 'Graphs' },
          ]}
        />
      </Box>

      {allTags.length > 0 && (
        <Box mb={3}>
          <Autocomplete
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
        </Box>
      )}

      {viewMode === 'graphs' ? (
        <section>{renderGraphView()}</section>
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
