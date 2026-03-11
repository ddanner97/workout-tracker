import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postExercise } from "./info";
import { useWorkoutForm } from "../../contexts/WorkoutFormContext";

// ─── Components ───
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { Button } from "../../component-library";

const AddExerciseDialog = ({
  dialogOpen,
  setDialogOpen,
  dialogExerciseName,
  setDialogExerciseName,
  pendingExerciseIndex,
  setPendingExerciseIndex,
}: {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  dialogExerciseName: string;
  setDialogExerciseName: (name: string) => void;
  pendingExerciseIndex: number | null;
  setPendingExerciseIndex: (index: number | null) => void;
}) => {
  const queryClient = useQueryClient();
  const { updateExerciseId } = useWorkoutForm();

  // ─── Add-exercise dialog state (transient UI, no need to persist) ───
  const [dialogMuscleGroup, setDialogMuscleGroup] = useState("");

  // ─── Mutations ───
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

  // --- Event Handlers ───
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

  return (
    <>
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
    </>
  );
};

export default AddExerciseDialog;
