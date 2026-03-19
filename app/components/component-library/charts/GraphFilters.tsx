"use client";

import { Autocomplete, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Exercise, HistoryGraphRange } from "../../../types/types";

const RANGE_OPTIONS: { value: HistoryGraphRange; label: string }[] = [
  { value: "all", label: "All" },
  { value: "30", label: "30d" },
  { value: "90", label: "90d" },
  { value: "180", label: "180d" },
];

interface GraphFiltersProps {
  range: HistoryGraphRange;
  onRangeChange: (range: HistoryGraphRange) => void;
  exerciseId: string;
  exercises: Exercise[];
  onExerciseChange: (exerciseId: string) => void;
}

export default function GraphFilters({
  range,
  onRangeChange,
  exerciseId,
  exercises,
  onExerciseChange,
}: GraphFiltersProps) {
  const selectedExercise =
    exercises.find((exercise) => exercise.id === exerciseId) ?? null;

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={range}
          onChange={(_event, nextRange: HistoryGraphRange | null) => {
            if (nextRange) {
              onRangeChange(nextRange);
            }
          }}
          aria-label="Select graph time range"
        >
          {RANGE_OPTIONS.map((option) => (
            <ToggleButton key={option.value} value={option.value}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Autocomplete
          fullWidth
          options={exercises}
          value={selectedExercise}
          onChange={(_event, exercise) => onExerciseChange(exercise?.id ?? "")}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Exercise"
              placeholder="Select exercise..."
            />
          )}
        />
      </Stack>
    </Paper>
  );
}
