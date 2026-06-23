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

type HistoryGraphRange = 'all' | '30' | '90' | '180' | '365' | 'custom';

type GraphViewMode = 'workout' | 'week' | 'month' | 'year' | 'custom';

interface CustomDateRange {
  start: string;
  end: string;
}

interface WorkoutVolumePoint {
  workoutId: string;
  performedAt: string;
  volume: number;
  tags: string[];
}

interface AggregatedVolumePoint {
  performedAt: string;
  periodLabel: string;
  volume: number;
  workoutCount: number;
}

interface ExerciseMaxWeightPoint {
  workoutId: string;
  performedAt: string;
  weight: number;
  reps: number;
}

interface WorkoutMetricsResponse {
  volumeSeries: WorkoutVolumePoint[];
  exerciseMaxWeightSeries: ExerciseMaxWeightPoint[];
}

type WeightUnit = 'lbs' | 'kgs';

interface ExerciseHistorySet {
  setNumber: number;
  weight: number;
  reps: number;
  rpe: number | null;
}

interface ExerciseHistorySession {
  workoutId: string;
  performedAt: string;
  order: number | null;
  sets: ExerciseHistorySet[];
}

interface ExerciseHistoryResponse {
  sessions: ExerciseHistorySession[];
}

export type {
  Tag,
  Exercise,
  SetRow,
  ExerciseRow,
  SavedSet,
  SavedWorkoutExercise,
  SavedWorkout,
  WorkoutFormInitialValues,
  HistoryGraphRange,
  GraphViewMode,
  CustomDateRange,
  WorkoutVolumePoint,
  AggregatedVolumePoint,
  ExerciseMaxWeightPoint,
  WorkoutMetricsResponse,
  WeightUnit,
  ExerciseHistorySet,
  ExerciseHistorySession,
  ExerciseHistoryResponse,
};
