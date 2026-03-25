'use client';

import { Paper, Stack, TextField, Typography } from '@mui/material';
import { SetRow } from '../../../types/types';
import { Button } from '../index';
import { SET_FIELDS } from './constants';

interface ExerciseTableMobileProps {
  sets: SetRow[];
  onAddSet: () => void;
  onRemoveSet: (si: number) => void;
  onUpdateSet: (si: number, field: keyof SetRow, value: string) => void;
}

export default function ExerciseTableMobile({
  sets,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
}: ExerciseTableMobileProps) {
  const handleFieldChange =
    (si: number, field: keyof SetRow) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onUpdateSet(si, field, e.target.value);

  return (
    <Stack spacing={1.5} mt={1}>
      {sets.map((set, si) => (
        <Paper key={si} variant="outlined" sx={{ p: 1.5 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="subtitle2" fontWeight="bold">
              Set {si + 1}
            </Typography>
            {sets.length > 1 && (
              <Button
                type="button"
                onClick={() => onRemoveSet(si)}
                label="-"
                variant="outlined"
                color="error"
                size="small"
              />
            )}
          </Stack>
          <Stack direction="row" spacing={1}>
            {SET_FIELDS.map((field) => (
              <TextField
                key={field.fieldName}
                label={field.label}
                type={field.type}
                size={field.size}
                required={field.required}
                slotProps={{
                  htmlInput: {
                    ...field.htmlInputProps,
                  },
                }}
                value={set[field.fieldName]}
                onChange={handleFieldChange(si, field.fieldName)}
                placeholder={field.placeholder}
                sx={field.fieldName === 'rpe' ? { flex: 0.75 } : { flex: 1 }}
              />
            ))}
          </Stack>
        </Paper>
      ))}
      <Button
        label="+ Add Set"
        type="button"
        onClick={onAddSet}
        variant="outlined"
        size="small"
      />
    </Stack>
  );
}
