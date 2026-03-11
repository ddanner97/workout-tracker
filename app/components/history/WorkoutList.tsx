"use client";

import { useQuery } from "@tanstack/react-query";
import { SavedWorkoutExercise } from "../../types/types";
import { displayReps, formatDate } from "../../utils/utils";
import { fetchWorkouts } from "./info";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { Button } from "../component-library";

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

// ─── ExerciseTable component ───
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

// ─── WorkoutList component ───
export default function WorkoutList() {
  const { data: workouts = [], isPending } = useQuery({
    queryKey: ["workouts"],
    queryFn: fetchWorkouts,
  });

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-4">
        Saved Workouts
      </h1>
      <section>
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
              <Box mt={2}>
                <Button
                  label="Edit"
                  variant="outlined"
                  size="small"
                  href={`/workouts/${workout.id}/edit`}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </section>
    </>
  );
}
