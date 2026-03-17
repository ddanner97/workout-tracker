"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress, Box, Typography } from "@mui/material";
import { WorkoutFormProvider } from "../../../components/contexts/WorkoutFormContext";
import WorkoutForm from "../../../components/component-library/workout-form/WorkoutForm";
import { fetchWorkout } from "../../../components/component-library/workout-form/info";
import { savedWorkoutToFormValues } from "../../../utils/utils";

export default function EditWorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: workout, isPending, isError } = useQuery({
    queryKey: ["workout", id],
    queryFn: () => fetchWorkout(id),
  });

  if (isPending) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !workout) {
    return (
      <Box mt={4}>
        <Typography color="error">Failed to load workout.</Typography>
      </Box>
    );
  }

  const initialValues = savedWorkoutToFormValues(workout);

  return (
    <WorkoutFormProvider initialValues={initialValues}>
      <WorkoutForm workoutId={id} />
    </WorkoutFormProvider>
  );
}
