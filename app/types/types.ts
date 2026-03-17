interface Tag {
  id: string;
  name: string;
}

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
  tags: Tag[];
}

interface WorkoutFormInitialValues {
  date: string;
  notes: string;
  exercises: ExerciseRow[];
  tags: string[];
}

export type { Tag, Exercise, SetRow, ExerciseRow, SavedSet, SavedWorkoutExercise, SavedWorkout, WorkoutFormInitialValues };