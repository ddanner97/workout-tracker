import React from 'react';
import { displayReps } from '../../utils/utils';
import { SavedWorkoutExercise } from '../../types/types';

// ─── Component Imports ───
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

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

export default ExerciseTable;
