'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SavedWorkoutExercise, Tag } from '../../types/types';
import { displayReps, formatDate } from '../../utils/utils';
import { fetchWorkouts } from './info';
import { ExpandMore } from '@mui/icons-material';

// ─── Components ───
import { Button, Container } from '../component-library';
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

async function fetchTags(): Promise<Tag[]> {
  const res = await fetch('/api/tags');
  if (!res.ok) throw new Error('Failed to fetch tags');
  return res.json();
}

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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: workouts = [], isPending } = useQuery({
    queryKey: ['workouts'],
    queryFn: fetchWorkouts,
  });

  const { data: allTags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  });

  const filteredWorkouts =
    selectedTags.length === 0
      ? workouts
      : workouts.filter((w) =>
          selectedTags.every((tag) => w.tags.some((t) => t.name === tag))
        );

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold">Saved Workouts</h1>

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

      <section>
        {isPending && <p>Loading...</p>}
        {!isPending && filteredWorkouts.length === 0 && (
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
              <Box mt={2}>
                <Button
                  label="Edit"
                  variant="outlined"
                  size="small"
                  href={`/workouts/${workout.id}/edit`}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </section>
    </>
  );
}
