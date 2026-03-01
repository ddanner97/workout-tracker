"use client";

import { useMediaQuery, useTheme } from "@mui/material";
import { SetRow } from "../types/types";
import {
  ExerciseTableDesktop,
  ExerciseTableMobile,
} from "./component-library";

interface ExerciseTableProps {
  sets: SetRow[];
  exerciseIndex: number;
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
