import React from 'react';
import { Exercise, ExerciseRow } from '../../../types/types';
import { useQuery } from '@tanstack/react-query';
import { fetchExercises } from './info';
import { useWorkoutForm } from '../../contexts/WorkoutFormContext';

import { Autocomplete, TextField, createFilterOptions } from '@mui/material';

interface ExerciseOption extends Exercise {
  inputValue?: string;
}

const filter = createFilterOptions<ExerciseOption>();

const ExercisePicker = ({
  setPendingExerciseIndex,
  setDialogExerciseName,
  setDialogOpen,
  exercise,
  exerciseIndex,
}: {
  setPendingExerciseIndex: (index: number) => void;
  setDialogExerciseName: (name: string) => void;
  setDialogOpen: (open: boolean) => void;
  exercise: ExerciseRow;
  exerciseIndex: number;
}) => {
  const { updateExerciseId } = useWorkoutForm();

  const { data: availableExercises = [] } = useQuery({
    queryKey: ['exercises'],
    queryFn: fetchExercises,
  });

  return (
    <Autocomplete
      options={availableExercises as ExerciseOption[]}
      value={
        (availableExercises as ExerciseOption[]).find(
          (e) => e.id === exercise.exerciseId
        ) ?? null
      }
      onChange={(_, option) => {
        if (!option) {
          updateExerciseId(exerciseIndex, '');
          return;
        }
        if (option.inputValue) {
          setPendingExerciseIndex(exerciseIndex);
          setDialogExerciseName(option.inputValue);
          setDialogOpen(true);
        } else {
          updateExerciseId(exerciseIndex, option.id);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        const { inputValue } = params;
        const alreadyExists = options.some(
          (o) => o.name.toLowerCase() === inputValue.toLowerCase()
        );
        if (inputValue && !alreadyExists) {
          filtered.push({
            id: '',
            name: `Add "${inputValue}"`,
            muscleGroup: null,
            inputValue,
          });
        }
        return filtered;
      }}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        if (option.inputValue) return option.inputValue;
        return option.muscleGroup
          ? `${option.name} (${option.muscleGroup})`
          : option.name;
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Choose exercise…"
          required={!exercise.exerciseId}
          variant="standard"
          sx={{
            '& .MuiInput-underline:before': { borderBottom: 'none' },
            '& .MuiInput-underline:after': { borderBottom: 'none' },
            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
              borderBottom: 'none',
            },
            '& .MuiInputBase-input': {
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--color-heading)',
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'var(--color-heading)',
              opacity: 1,
            },
          }}
        />
      )}
      sx={{
        minWidth: 240,
        flex: 1,
        '& .MuiAutocomplete-popupIndicator': {
          display: 'none',
        },
      }}
    />
  );
};

export default ExercisePicker;
