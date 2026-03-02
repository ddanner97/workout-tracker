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
} from "@mui/material";
import { SetRow } from "../../../types/types";
import { Button } from "../index";
import { SET_FIELDS } from "./constants";

interface ExerciseTableDesktopProps {
  sets: SetRow[];
  onAddSet: () => void;
  onRemoveSet: (si: number) => void;
  onUpdateSet: (si: number, field: keyof SetRow, value: string) => void;
}

export default function ExerciseTableDesktop({
  sets,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
}: ExerciseTableDesktopProps) {
  const handleFieldChange =
    (si: number, field: keyof SetRow) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onUpdateSet(si, field, e.target.value);

  return (
    <Stack spacing={1} mt={1}>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width={40}>Set</TableCell>
              {SET_FIELDS.map((field) => (
                <TableCell key={field.key}>{field.label}</TableCell>
              ))}
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
