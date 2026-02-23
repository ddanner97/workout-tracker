"use client";

import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Utils ────────────────────────────────────────────────────────────────────

function emptySet(): SetRow {
  return { weight: "", reps: "", rpe: "" };
}

function emptyExercise(): ExerciseRow {
  return { exerciseId: "", sets: [emptySet()] };
}

function displayReps(reps: number): string {
  return reps === -1 ? "fail" : String(reps);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>(
    [],
  );
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState<ExerciseRow[]>([
    emptyExercise(),
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/exercises").then((r) => r.json()),
      fetch("/api/workouts").then((r) => r.json()),
    ]).then(([exList, wkList]) => {
      setAvailableExercises(exList);
      setSavedWorkouts(wkList);
      setLoadingData(false);
    });
  }, []);

  // ── Exercise / set mutations ──

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

  // ── Submit ──

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors([]);
    setSubmitting(true);

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

    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json();
      setFormErrors(data.errors ?? ["An unexpected error occurred."]);
      return;
    }

    const created: SavedWorkout = await res.json();
    setSavedWorkouts((prev) => [created, ...prev]);
    setDate("");
    setNotes("");
    setExercises([emptyExercise()]);
  }

  // ── Render ──

  return (
    <div>
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
                    <button
                      type="button"
                      onClick={() => removeExercise(ei)}
                    >
                      Remove Exercise
                    </button>
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
                            <button
                              type="button"
                              onClick={() => removeSet(ei, si)}
                            >
                              ×
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" onClick={() => addSet(ei)}>
                  + Add Set
                </button>
              </div>
            ))}
            <button type="button" onClick={addExercise}>
              + Add Exercise
            </button>
          </div>

          {formErrors.length > 0 && (
            <ul style={{ color: "red" }}>
              {formErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}

          <button type="submit" disabled={submitting}>
            {submitting ? "Saving…" : "Save Workout"}
          </button>
        </form>
      </section>

      <hr />

      <section>
        <h2>Saved Workouts</h2>
        {loadingData && <p>Loading…</p>}
        {!loadingData && savedWorkouts.length === 0 && (
          <p>No workouts logged yet.</p>
        )}
        {savedWorkouts.map((workout) => (
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
            {workout.workoutExercises.map((we) => (
              <div key={we.id} style={{ marginBottom: "6px" }}>
                <strong>{we.exercise.name}</strong>
                {we.exercise.muscleGroup && (
                  <span> — {we.exercise.muscleGroup}</span>
                )}
                <table>
                  <thead>
                    <tr>
                      <th>Set</th>
                      <th>Weight</th>
                      <th>Reps</th>
                      <th>RPE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {we.sets.map((set) => (
                      <tr key={set.id}>
                        <td>{set.setNumber}</td>
                        <td>{set.weight}</td>
                        <td>{displayReps(set.reps)}</td>
                        <td>{set.rpe ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}
