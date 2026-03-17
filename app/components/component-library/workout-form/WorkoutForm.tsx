"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Paper, Stack, TextField, Typography } from "@mui/material";
import { ExerciseRow } from "../../../types/types";
import { useWorkoutForm } from "../../contexts/WorkoutFormContext";
import { postWorkout } from "./info";

// ─── Components ───
import { Button, ExerciseTable } from "..";

// TODO: Adjust these imports
import AddExerciseDialog from "./AddExerciseDialog";
import RemoveExerciseModal from "./RemoveExerciseModal";
import ExercisePicker from "./ExercisePicker";
import TagInput from "./TagInput";

export default function WorkoutForm() {
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

  // --- component-level state ───
  const [dialogExerciseName, setDialogExerciseName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingExerciseIndex, setPendingExerciseIndex] = useState<
    number | null
  >(null);

  // --- Mutations ───

  const workoutMutation = useMutation({
    mutationFn: postWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      resetForm();
    },
    onError: (err: { errors?: string[] }) => {
      setFormErrors(err.errors ?? ["An unexpected error occurred."]);
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
            multiline
            fullWidth
          />

          <TagInput value={tags} onChange={setTags} />

          <Box>
            <Typography variant="h6" gutterBottom>
              Exercises
            </Typography>
            <Stack spacing={2}>
              {exercises.map((ex: ExerciseRow, ei: number) => (
                <Paper key={ei} variant="outlined" sx={{ p: 2 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    alignItems={{ sm: "center" }}
                    mb={2}
                  >
                    <ExercisePicker
                      setPendingExerciseIndex={setPendingExerciseIndex}
                      setDialogExerciseName={setDialogExerciseName}
                      setDialogOpen={setDialogOpen}
                      exerciseIndex={ei}
                      exercise={ex}
                    />
                    {exercises.length > 1 && (
                      <RemoveExerciseModal exerciseIndex={ei} />
                    )}
                  </Stack>

                  <ExerciseTable
                    sets={ex.sets}
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
              sx={{ backgroundColor: "primary.main" }}
            />
          </Box>
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
    </Box>
  );
}
