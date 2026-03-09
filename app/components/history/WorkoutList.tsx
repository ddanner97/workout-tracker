"use client";

import { useQuery } from "@tanstack/react-query";
import { SavedWorkout, SavedWorkoutExercise } from "../../types/types";
import { displayReps, formatDate } from "../../utils/utils";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

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
        <Accordion key={workout.id}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <div>
              {formatDate(workout.performedAt)}
              {workout.notes && (
                <>
                  {" - "}
                  {workout.notes.slice(0, 10)} ...
                </>
              )}
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <p>{workout.notes}</p>
            {workout.workoutExercises.map((exercise) => (
              <div key={exercise.id} style={{ marginBottom: "6px" }}>
                <strong>{exercise.exercise.name}</strong>
                {exercise.exercise.muscleGroup && (
                  <span> - {exercise.exercise.muscleGroup}</span>
                )}
                <ExerciseTable exercise={exercise} />
              </div>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </section>
  );
}
