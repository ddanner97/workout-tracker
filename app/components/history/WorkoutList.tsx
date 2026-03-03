"use client";

import { useQuery } from "@tanstack/react-query";
import { SavedWorkout, SavedWorkoutExercise } from "../../types/types";
import { displayReps, formatDate } from "../../utils/utils";

// ─── Components ───
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const ExerciseTable = ({
  exercise,
}: {
  exercise: SavedWorkoutExercise;
}) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Set</TableCell>
            <TableCell>Weight</TableCell>
            <TableCell>Reps</TableCell>
            <TableCell>RPE</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {exercise.sets.map((set) => (
            <TableRow key={set.id}>
              <TableCell>{set.setNumber}</TableCell>
              <TableCell>{set.weight}</TableCell>
              <TableCell>{displayReps(set.reps)}</TableCell>
              <TableCell>{set.rpe ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

async function fetchWorkouts(): Promise<SavedWorkout[]> {
  const res = await fetch("/api/workouts");
  if (!res.ok) throw new Error("Failed to fetch workouts");
  return res.json();
}

export default function WorkoutList() {
  const { data: workouts = [], isPending } = useQuery({
    queryKey: ["workouts"],
    queryFn: fetchWorkouts,
  });

  return (
    <section>
      <h2>Saved Workouts</h2>
      {isPending && <p>Loading...</p>}
      {!isPending && workouts.length === 0 && (
        <p>No workouts logged yet.</p>
      )}
      {workouts.map((workout) => (
        <div
          key={workout.id}
          style={{
            border: "1px solid #ccc",
            padding: "8px",
            marginBottom: "8px",
          }}
        >
          <h3>{formatDate(workout.performedAt)}</h3>
          {workout.notes && <p>{workout.notes}</p>}
          {workout.workoutExercises.map((exercise) => (
            <div key={exercise.id} style={{ marginBottom: "6px" }}>
              <strong>{exercise.exercise.name}</strong>
              {exercise.exercise.muscleGroup && (
                <span> - {exercise.exercise.muscleGroup}</span>
              )}
              <ExerciseTable exercise={exercise} />
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
