"use client";

import { useQuery } from "@tanstack/react-query";
import { SavedWorkout } from "../types/types";
import { displayReps, formatDate } from "../utils/utils";

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
          {workout.workoutExercises.map((we) => (
            <div key={we.id} style={{ marginBottom: "6px" }}>
              <strong>{we.exercise.name}</strong>
              {we.exercise.muscleGroup && (
                <span> - {we.exercise.muscleGroup}</span>
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
                      <td>{set.rpe ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
