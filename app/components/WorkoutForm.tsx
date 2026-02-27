"use client";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Autocomplete,
  Box,
  createFilterOptions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Exercise,
  ExerciseRow,
  SetRow,
  SavedWorkout,
} from "../types/types";
import { emptyExercise, emptySet } from "../utils/utils";

// ─── Components ───
import { Button } from "./index";
import ExerciseTable from "./ExerciseTable";

// ─── Types ───
interface ExerciseOption extends Exercise {
  inputValue?: string;
}

const filter = createFilterOptions<ExerciseOption>();

async function fetchExercises(): Promise<Exercise[]> {
  const res = await fetch("/api/exercises");
  if (!res.ok) throw new Error("Failed to fetch exercises");
  return res.json();
}

async function postWorkout(body: unknown): Promise<SavedWorkout> {
  const res = await fetch("/api/workouts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json();
    throw data;
  }
  return res.json();
}

async function postExercise(body: {
  name: string;
  muscleGroup: string;
}): Promise<Exercise> {
  const res = await fetch("/api/exercises", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to create exercise");
  return res.json();
}

export default function WorkoutForm() {
  const queryClient = useQueryClient();

  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState<ExerciseRow[]>([
    emptyExercise(),
  ]);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // ─── Add-exercise dialog state ───
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogExerciseName, setDialogExerciseName] = useState("");
  const [dialogMuscleGroup, setDialogMuscleGroup] = useState("");
  const [pendingExerciseIndex, setPendingExerciseIndex] = useState<
    number | null
  >(null);

  const { data: availableExercises = [] } = useQuery({
    queryKey: ["exercises"],
    queryFn: fetchExercises,
  });

  const workoutMutation = useMutation({
    mutationFn: postWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      setDate("");
      setNotes("");
      setExercises([emptyExercise()]);
      setFormErrors([]);
    },
    onError: (err: { errors?: string[] }) => {
      setFormErrors(err.errors ?? ["An unexpected error occurred."]);
    },
  });

  const addExerciseMutation = useMutation({
    mutationFn: postExercise,
    onSuccess: (newExercise) => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      if (pendingExerciseIndex !== null) {
        updateExerciseId(pendingExerciseIndex, newExercise.id);
      }
      handleDialogClose();
    },
  });

  function addExercise() {
    setExercises((prev) => [...prev, emptyExercise()]);
  }

  function removeExercise(ei: number) {
    setExercises((prev) => prev.filter((_, i) => i !== ei));
  }

  function updateExerciseId(ei: number, exerciseId: string) {
    setExercises((prev) =>
      prev.map((ex, i) => (i === ei ? { ...ex, exerciseId } : ex)),
    );
  }

  function addSet(ei: number) {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === ei ? { ...ex, sets: [...ex.sets, emptySet()] } : ex,
      ),
    );
  }

  function removeSet(ei: number, si: number) {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === ei
          ? { ...ex, sets: ex.sets.filter((_, j) => j !== si) }
          : ex,
      ),
    );
  }

  function updateSet(
    ei: number,
    si: number,
    field: keyof SetRow,
    value: string,
  ) {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === ei
          ? {
              ...ex,
              sets: ex.sets.map((set, j) =>
                j === si ? { ...set, [field]: value } : set,
              ),
            }
          : ex,
      ),
    );
  }

  function handleDialogClose() {
    setDialogOpen(false);
    setDialogExerciseName("");
    setDialogMuscleGroup("");
    setPendingExerciseIndex(null);
  }

  function handleDialogSave() {
    addExerciseMutation.mutate({
      name: dialogExerciseName,
      muscleGroup: dialogMuscleGroup,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors([]);

    const body = {
      performedAt: date,
      notes: notes || undefined,
      exercises: exercises.map((ex, idx) => ({
        exerciseId: ex.exerciseId,
        order: idx,
        sets: ex.sets.map((set, si) => ({
          setNumber: si + 1,
          weight: Number(set.weight),
          reps: set.reps === "fail" ? "fail" : Number(set.reps),
          rpe: set.rpe !== "" ? Number(set.rpe) : undefined,
        })),
      })),
    };

    workoutMutation.mutate(body);
  }

  return (
    <Box component="section">
      <Typography variant="h5" gutterBottom>
        Log a Workout
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            id="date"
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ maxWidth: 220 }}
          />

          <TextField
            id="notes"
            label="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
          />

          <Box>
            <Typography variant="h6" gutterBottom>
              Exercises
            </Typography>
            <Stack spacing={2}>
              {exercises.map((ex, ei) => (
                <Paper key={ei} variant="outlined" sx={{ p: 2 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    alignItems={{ sm: "center" }}
                    mb={2}
                  >
                    <Autocomplete
                      options={availableExercises as ExerciseOption[]}
                      value={
                        (availableExercises as ExerciseOption[]).find(
                          (e) => e.id === ex.exerciseId,
                        ) ?? null
                      }
                      onChange={(_, option) => {
                        if (!option) {
                          updateExerciseId(ei, "");
                          return;
                        }
                        if (option.inputValue) {
                          setPendingExerciseIndex(ei);
                          setDialogExerciseName(option.inputValue);
                          setDialogOpen(true);
                        } else {
                          updateExerciseId(ei, option.id);
                        }
                      }}
                      filterOptions={(options, params) => {
                        const filtered = filter(options, params);
                        const { inputValue } = params;
                        const alreadyExists = options.some(
                          (o) =>
                            o.name.toLowerCase() ===
                            inputValue.toLowerCase(),
                        );
                        if (inputValue && !alreadyExists) {
                          filtered.push({
                            id: "",
                            name: `Add "${inputValue}"`,
                            muscleGroup: null,
                            inputValue,
                          });
                        }
                        return filtered;
                      }}
                      getOptionLabel={(option) => {
                        if (typeof option === "string") return option;
                        if (option.inputValue) return option.inputValue;
                        return option.muscleGroup
                          ? `${option.name} (${option.muscleGroup})`
                          : option.name;
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Exercise"
                          required={!ex.exerciseId}
                        />
                      )}
                      sx={{ minWidth: 220, flex: 1 }}
                    />
                    {exercises.length > 1 && (
                      <Button
                        type="button"
                        label="Remove Exercise"
                        onClick={() => removeExercise(ei)}
                        variant="outlined"
                        color="error"
                        size="small"
                      />
                    )}
                  </Stack>

                  <ExerciseTable
                    sets={ex.sets}
                    exerciseIndex={ei}
                    onAddSet={() => addSet(ei)}
                    onRemoveSet={(si) => removeSet(ei, si)}
                    onUpdateSet={(si, field, val) =>
                      updateSet(ei, si, field, val)
                    }
                  />
                </Paper>
              ))}
              <Box>
                <Button
                  label="+ Add Exercise"
                  type="button"
                  onClick={addExercise}
                  variant="outlined"
                />
              </Box>
            </Stack>
          </Box>

          {formErrors.length > 0 && (
            <Box component="ul" sx={{ color: "error.main", pl: 2, m: 0 }}>
              {formErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </Box>
          )}

          <Box>
            <Button
              type="submit"
              label={
                workoutMutation.isPending ? "Saving..." : "Save Workout"
              }
              disabled={workoutMutation.isPending}
              variant="contained"
              color="primary"
            />
          </Box>
        </Stack>
      </Box>

      {/* ─── Add New Exercise Dialog ─── */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Add New Exercise</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Exercise Name"
              value={dialogExerciseName}
              onChange={(e) => setDialogExerciseName(e.target.value)}
              required
              autoFocus
              fullWidth
            />
            <TextField
              label="Muscle Group (optional)"
              value={dialogMuscleGroup}
              onChange={(e) => setDialogMuscleGroup(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            label="Cancel"
            onClick={handleDialogClose}
            variant="outlined"
          />
          <Button
            type="button"
            label={addExerciseMutation.isPending ? "Saving..." : "Save"}
            onClick={handleDialogSave}
            disabled={
              !dialogExerciseName.trim() || addExerciseMutation.isPending
            }
            variant="contained"
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
}
