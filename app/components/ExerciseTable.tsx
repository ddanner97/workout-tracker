"use client";

import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TextFieldProps,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SetRow } from "../types/types";
import { Button } from "./index";

// ─── Constants ───
const SET_FIELDS: TextFieldProps[] = [
  {
    label: "Weight (lbs)",
    key: "weight",
    type: "number",
    size: "small",
    inputProps: { min: 0, step: 0.5 },
    required: true,
  },
  {
    label: "Reps",
    key: "reps",
    size: "small",
    placeholder: "5 or fail",
    required: true,
  },
  {
    label: "RPE (optional)",
    key: "rpe",
    type: "number",
    size: "small",
    inputProps: { min: 1, max: 10 },
    placeholder: "optional",
    required: false,
  },
];

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

  const handleFieldChange =
    (si: number, field: keyof SetRow) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onUpdateSet(si, field, e.target.value);

  if (isMobile) {
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
                  label="Remove"
                  variant="outlined"
                  color="error"
                  size="small"
                />
              )}
            </Stack>
            <Stack direction="row" spacing={2}>
              {SET_FIELDS.map((field) => {
                return (
                  <TextField
                    key={field.key}
                    label={field.label}
                    type={field.type}
                    size={field.size}
                    required={field.required}
                    slotProps={{
                      htmlInput: {
                        ...field.inputProps,
                      },
                    }}
                    value={set[field.key as keyof SetRow]}
                    onChange={handleFieldChange(
                      si,
                      field.key as keyof SetRow,
                    )}
                    placeholder={field.placeholder}
                  />
                );
              })}
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

  return (
    <Stack spacing={1} mt={1}>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width={40}>Set</TableCell>
              <TableCell>Weight (kg)</TableCell>
              <TableCell>Reps</TableCell>
              <TableCell>RPE</TableCell>
              <TableCell width={60} />
            </TableRow>
          </TableHead>
          <TableBody>
            {sets.map((set, si) => (
              <TableRow key={si}>
                <TableCell>{si + 1}</TableCell>
                {SET_FIELDS.map((field) => (
                  <TableCell key={field.key}>
                    <TextField
                      key={field.key}
                      label={field.label}
                      type={field.type}
                      size={field.size}
                      required={field.required}
                      slotProps={{
                        htmlInput: {
                          ...field.inputProps,
                        },
                      }}
                      value={set[field.key as keyof SetRow]}
                      onChange={handleFieldChange(
                        si,
                        field.key as keyof SetRow,
                      )}
                      placeholder={field.placeholder}
                      sx={{ width: 100 }}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  {sets.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => onRemoveSet(si)}
                      label="x"
                      variant="contained"
                      color="error"
                      size="small"
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
