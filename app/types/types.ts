interface Exercise {
  id: string;
  name: string;
  muscleGroup: string | null;
}

interface SetRow {
  weight: string;
  reps: string;
  rpe: string;
}

interface ExerciseRow {
  exerciseId: string;
  sets: SetRow[];
}

interface SavedSet {
  id: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe: number | null;
}

interface SavedWorkoutExercise {
  id: string;
  order: number;
  exercise: Exercise;
  sets: SavedSet[];
}

interface SavedWorkout {
  id: string;
  performedAt: string;
  notes: string | null;
  workoutExercises: SavedWorkoutExercise[];
}

interface WorkoutFormInitialValues {
  date: string;
  notes: string;
  exercises: ExerciseRow[];
}

export type { Exercise, SetRow, ExerciseRow, SavedSet, SavedWorkoutExercise, SavedWorkout, WorkoutFormInitialValues };