'use client';

import { useMediaQuery, useTheme } from '@mui/material';
import { SetRow, WeightUnit } from '../../../types/types';
import ExerciseTableDesktop from './Desktop';
import ExerciseTableMobile from './Mobile';

interface ExerciseTableProps {
  sets: SetRow[];
  onAddSet: () => void;
  onRemoveSet: (si: number) => void;
  onUpdateSet: (si: number, field: keyof SetRow, value: string) => void;
  weightUnit: WeightUnit;
  onToggleWeightUnit: () => void;
}

export default function ExerciseTable({
  sets,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
  weightUnit,
  onToggleWeightUnit,
}: ExerciseTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const props = {
    sets,
    onAddSet,
    onRemoveSet,
    onUpdateSet,
    weightUnit,
    onToggleWeightUnit,
  };

  return isMobile ? (
    <ExerciseTableMobile {...props} />
  ) : (
    <ExerciseTableDesktop {...props} />
  );
}
