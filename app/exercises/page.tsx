'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchExercises, postExercise, putExercise, deleteExercise } from './info';
import type { Exercise } from '../types/types';

import {
  Box,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Edit, Delete, Check, Close, Add } from '@mui/icons-material';
import { Button } from '../components/component-library';

const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Legs',
  'Core',
] as const;

type EditingState = {
  id: string;
  name: string;
  muscleGroup: string;
};

export default function ExercisesPage() {
  const queryClient = useQueryClient();

  const { data: exercises = [], isPending } = useQuery({
    queryKey: ['exercises'],
    queryFn: fetchExercises,
  });

  const [editing, setEditing] = useState<EditingState | null>(null);
  const [newName, setNewName] = useState('');
  const [newMuscleGroup, setNewMuscleGroup] = useState('');
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: 'success' | 'error';
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Exercise | null>(null);

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: { name: string; muscleGroup: string | null };
    }) => putExercise(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      setEditing(null);
      setSnackbar({ message: 'Exercise updated', severity: 'success' });
    },
    onError: (err: Error) => {
      setSnackbar({ message: err.message, severity: 'error' });
    },
  });

  const createMutation = useMutation({
    mutationFn: postExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      setNewName('');
      setNewMuscleGroup('');
      setSnackbar({ message: 'Exercise created', severity: 'success' });
    },
    onError: (err: Error) => {
      setSnackbar({ message: err.message, severity: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      setDeleteTarget(null);
      setSnackbar({ message: 'Exercise deleted', severity: 'success' });
    },
    onError: (err: Error) => {
      setDeleteTarget(null);
      setSnackbar({ message: err.message, severity: 'error' });
    },
  });

  function startEditing(exercise: Exercise) {
    setEditing({
      id: exercise.id,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup ?? '',
    });
  }

  function handleSave() {
    if (!editing || !editing.name.trim()) return;
    updateMutation.mutate({
      id: editing.id,
      body: {
        name: editing.name.trim(),
        muscleGroup: editing.muscleGroup || null,
      },
    });
  }

  function handleCreate() {
    if (!newName.trim()) return;
    createMutation.mutate({
      name: newName.trim(),
      muscleGroup: newMuscleGroup,
    });
  }

  return (
    <div>
      <h1 className="mb-5 text-center text-2xl font-bold">Manage Exercises</h1>

      {isPending && <p>Loading...</p>}

      {!isPending && (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Muscle Group</TableCell>
                <TableCell align="right" sx={{ width: 120 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Add new exercise row */}
              <TableRow>
                <TableCell>
                  <TextField
                    size="small"
                    placeholder="New exercise name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreate();
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={newMuscleGroup}
                    onChange={(e) => setNewMuscleGroup(e.target.value)}
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {MUSCLE_GROUPS.map((mg) => (
                      <MenuItem key={mg} value={mg}>
                        {mg}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={handleCreate}
                    disabled={!newName.trim() || createMutation.isPending}
                    title="Add exercise"
                  >
                    <Add />
                  </IconButton>
                </TableCell>
              </TableRow>

              {/* Existing exercises */}
              {exercises.map((exercise) => {
                const isEditing = editing?.id === exercise.id;

                return (
                  <TableRow key={exercise.id}>
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          size="small"
                          value={editing.name}
                          onChange={(e) =>
                            setEditing({ ...editing, name: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                            if (e.key === 'Escape') setEditing(null);
                          }}
                          fullWidth
                          variant="outlined"
                          autoFocus
                        />
                      ) : (
                        exercise.name
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Select
                          size="small"
                          value={editing.muscleGroup}
                          onChange={(e) =>
                            setEditing({
                              ...editing,
                              muscleGroup: e.target.value,
                            })
                          }
                          displayEmpty
                          fullWidth
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {MUSCLE_GROUPS.map((mg) => (
                            <MenuItem key={mg} value={mg}>
                              {mg}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        exercise.muscleGroup ?? '—'
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {isEditing ? (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 0.5,
                          }}
                        >
                          <IconButton
                            color="primary"
                            onClick={handleSave}
                            disabled={
                              !editing.name.trim() || updateMutation.isPending
                            }
                            title="Save"
                          >
                            <Check />
                          </IconButton>
                          <IconButton
                            onClick={() => setEditing(null)}
                            title="Cancel"
                          >
                            <Close />
                          </IconButton>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 0.5,
                          }}
                        >
                          <IconButton
                            onClick={() => startEditing(exercise)}
                            title="Edit"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => setDeleteTarget(exercise)}
                            title="Delete"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
      >
        <DialogTitle>Delete Exercise</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &ldquo;{deleteTarget?.name}&rdquo;?
            This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            label="Cancel"
            onClick={() => setDeleteTarget(null)}
            variant="outlined"
          />
          <Button
            label={deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            onClick={() =>
              deleteTarget && deleteMutation.mutate(deleteTarget.id)
            }
            disabled={deleteMutation.isPending}
            variant="contained"
            color="error"
          />
        </DialogActions>
      </Dialog>

      {/* Feedback snackbar */}
      <Snackbar
        open={snackbar !== null}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(null)}
          severity={snackbar?.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
