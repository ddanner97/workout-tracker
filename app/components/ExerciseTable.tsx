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
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SetRow } from "../types/types";
import { Button } from "./index";

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
            <Stack spacing={1}>
              <TextField
                label="Weight (kg)"
                type="number"
                size="small"
                fullWidth
                inputProps={{ min: 0, step: 0.5 }}
                value={set.weight}
                onChange={(e) => onUpdateSet(si, "weight", e.target.value)}
                required
              />
              <TextField
                label="Reps"
                size="small"
                fullWidth
                placeholder="5 or fail"
                value={set.reps}
                onChange={(e) => onUpdateSet(si, "reps", e.target.value)}
                required
              />
              <TextField
                label="RPE (optional)"
                type="number"
                size="small"
                fullWidth
                inputProps={{ min: 1, max: 10, step: 0.5 }}
                value={set.rpe}
                onChange={(e) => onUpdateSet(si, "rpe", e.target.value)}
              />
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
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    inputProps={{ min: 0, step: 0.5 }}
                    value={set.weight}
                    onChange={(e) =>
                      onUpdateSet(si, "weight", e.target.value)
                    }
                    required
                    sx={{ width: 100 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    placeholder="5 or fail"
                    value={set.reps}
                    onChange={(e) =>
                      onUpdateSet(si, "reps", e.target.value)
                    }
                    required
                    sx={{ width: 100 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    inputProps={{ min: 1, max: 10, step: 0.5 }}
                    placeholder="optional"
                    value={set.rpe}
                    onChange={(e) =>
                      onUpdateSet(si, "rpe", e.target.value)
                    }
                    sx={{ width: 100 }}
                  />
                </TableCell>
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
