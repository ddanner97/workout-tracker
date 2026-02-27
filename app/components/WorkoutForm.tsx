"use client";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Exercise,
  ExerciseRow,
  SetRow,
  SavedWorkout,
} from "../types/types";
import { emptyExercise, emptySet } from "../utils/utils";

// ─── Components ───
import { Button } from "../library";

async function fetchExercises(): Promise<Exercise[]> {
  const res = await fetch("/api/exercises");
  if (!res.ok) throw new Error("Failed to fetch exercises");
  return res.json();
}

async function postWorkout(body: unknown): Promise<SavedWorkout> {
  const res = await fetch("/api/workouts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json();
    throw data;
  }
  return res.json();
}

export default function WorkoutForm() {
  const queryClient = useQueryClient();

  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState<ExerciseRow[]>([
    emptyExercise(),
  ]);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const { data: availableExercises = [] } = useQuery({
    queryKey: ["exercises"],
    queryFn: fetchExercises,
  });

  const mutation = useMutation({
    mutationFn: postWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      setDate("");
      setNotes("");
      setExercises([emptyExercise()]);
      setFormErrors([]);
    },
    onError: (err: { errors?: string[] }) => {
      setFormErrors(err.errors ?? ["An unexpected error occurred."]);
    },
  });

  function addExercise() {
    setExercises((prev) => [...prev, emptyExercise()]);
  }

  function removeExercise(ei: number) {
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors([]);

    const body = {
      performedAt: date,
      notes: notes || undefined,
      exercises: exercises.map((ex, idx) => ({
        exerciseId: ex.exerciseId,
        order: idx,
        sets: ex.sets.map((set, si) => ({
          setNumber: si + 1,
          weight: Number(set.weight),
          reps: set.reps === "fail" ? "fail" : Number(set.reps),
          rpe: set.rpe !== "" ? Number(set.rpe) : undefined,
        })),
      })),
    };

    mutation.mutate(body);
  }

  return (
    <section>
      <h2>Log a Workout</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="notes">Notes (optional)</label>
          <input
            id="notes"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div>
          <h3>Exercises</h3>
          {exercises.map((ex, ei) => (
            <div
              key={ei}
              style={{
                border: "1px solid #ccc",
                padding: "8px",
                marginBottom: "8px",
              }}
            >
              <div>
                <label>Exercise</label>
                <select
                  value={ex.exerciseId}
                  onChange={(e) => updateExerciseId(ei, e.target.value)}
                  required
                >
                  <option value="">-- select --</option>
                  {availableExercises.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                      {opt.muscleGroup ? ` (${opt.muscleGroup})` : ""}
                    </option>
                  ))}
                </select>
                {exercises.length > 1 && (
                  <Button
                    type="button"
                    label="Remove Exercise"
                    onClick={() => removeExercise(ei)}
                    variant="outlined"
                    color="error"
                    size="small"
                  />
                )}
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Set</th>
                    <th>Weight (kg)</th>
                    <th>Reps</th>
                    <th>RPE</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {ex.sets.map((set, si) => (
                    <tr key={si}>
                      <td>{si + 1}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={set.weight}
                          onChange={(e) =>
                            updateSet(ei, si, "weight", e.target.value)
                          }
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="5 or fail"
                          value={set.reps}
                          onChange={(e) =>
                            updateSet(ei, si, "reps", e.target.value)
                          }
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          step="0.5"
                          placeholder="optional"
                          value={set.rpe}
                          onChange={(e) =>
                            updateSet(ei, si, "rpe", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        {ex.sets.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeSet(ei, si)}
                            label="x"
                            variant="contained"
                            color="error"
                            size="small"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button
                label="+ Add Set"
                type="button"
                onClick={() => addSet(ei)}
                variant="outlined"
              />
            </div>
          ))}
          <Button
            label="+ Add Exercise"
            type="button"
            onClick={addExercise}
            variant="outlined"
          />
        </div>

        {formErrors.length > 0 && (
          <ul style={{ color: "red" }}>
            {formErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )}

        <Button
          type="submit"
          label={mutation.isPending ? "Saving..." : "Save Workout"}
          disabled={mutation.isPending}
          variant="contained"
          color="primary"
        />
      </form>
    </section>
  );
}
