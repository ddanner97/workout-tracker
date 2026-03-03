"use client";

import { useMediaQuery, useTheme } from "@mui/material";
import { SetRow } from "../../../types/types";
import ExerciseTableDesktop from "./Desktop";
import ExerciseTableMobile from "./Mobile";

/**
 * ExerciseTable component — responsive wrapper for exercise set entry.
 *
 * Depending on screen size, renders either the Desktop or Mobile version
 * of the exercise set entry table.
 *
 * Props:
 *   - sets: SetRow[] — array of set objects for a given exercise.
 *   - onAddSet: () => void — callback to add a new set.
 *   - onRemoveSet: (si: number) => void — callback to remove a set by index.
 *   - onUpdateSet: (si: number, field: keyof SetRow, value: string) => void
 *       — callback to update a set field (weight, reps, etc).
 *
 * Usage:
 *   <ExerciseTable
 *     sets={exercise.sets}
 *     onAddSet={addSet}
 *     onRemoveSet={removeSet}
 *     onUpdateSet={updateSet}
 *   />
 */

interface ExerciseTableProps {
  sets: SetRow[];
  onAddSet: () => void;
  onRemoveSet: (si: number) => void;
  onUpdateSet: (si: number, field: keyof SetRow, value: string) => void;
}

export default function ExerciseTable({
  sets,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
}: ExerciseTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const props = { sets, onAddSet, onRemoveSet, onUpdateSet };

  return isMobile ? (
    <ExerciseTableMobile {...props} />
  ) : (
    <ExerciseTableDesktop {...props} />
  );
}
