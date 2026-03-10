"use client";

import { createContext, useContext, useState } from "react";
import { ExerciseRow, SetRow } from "../../types/types";
import { emptyExercise, emptySet } from "../../utils/utils";

interface WorkoutFormContextType {
  date: string;
  setDate: (date: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  exercises: ExerciseRow[];
  formErrors: string[];
  setFormErrors: (errors: string[]) => void;
  addExercise: () => void;
  removeExercise: (ei: number) => void;
  updateExerciseId: (ei: number, exerciseId: string) => void;
  addSet: (ei: number) => void;
  removeSet: (ei: number, si: number) => void;
  updateSet: (
    ei: number,
    si: number,
    field: keyof SetRow,
    value: string,
  ) => void;
  resetForm: () => void;
}

const WorkoutFormContext = createContext<WorkoutFormContextType | null>(
  null,
);

export function WorkoutFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState<ExerciseRow[]>([
    emptyExercise(),
  ]);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  function addExercise() {
    setExercises((prev) => [...prev, emptyExercise()]);
  }

  function removeExercise(ei: number) {
    console.log(ei);
    setExercises((prev) => prev.filter((_, i) => i !== ei));
  }

  function updateExerciseId(ei: number, exerciseId: string) {
    setExercises((prev) =>
      prev.map((ex, i) => (i === ei ? { ...ex, exerciseId } : ex)),
    );
  }

  function addSet(ei: number) {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === ei ? { ...ex, sets: [...ex.sets, emptySet()] } : ex,
      ),
    );
  }

  function removeSet(ei: number, si: number) {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === ei
          ? { ...ex, sets: ex.sets.filter((_, j) => j !== si) }
          : ex,
      ),
    );
  }

  function updateSet(
    ei: number,
    si: number,
    field: keyof SetRow,
    value: string,
  ) {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === ei
          ? {
              ...ex,
              sets: ex.sets.map((set, j) =>
                j === si ? { ...set, [field]: value } : set,
              ),
            }
          : ex,
      ),
    );
  }

  function resetForm() {
    setDate("");
    setNotes("");
    setExercises([emptyExercise()]);
    setFormErrors([]);
  }

  return (
    <WorkoutFormContext.Provider
      value={{
        date,
        setDate,
        notes,
        setNotes,
        exercises,
        formErrors,
        setFormErrors,
        addExercise,
        removeExercise,
        updateExerciseId,
        addSet,
        removeSet,
        updateSet,
        resetForm,
      }}
    >
      {children}
    </WorkoutFormContext.Provider>
  );
}

export function useWorkoutForm() {
  const ctx = useContext(WorkoutFormContext);
  if (!ctx) {
    throw new Error(
      "useWorkoutForm must be used within a WorkoutFormProvider",
    );
  }
  return ctx;
}
