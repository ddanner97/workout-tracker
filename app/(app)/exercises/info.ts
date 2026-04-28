import type { Exercise } from '../../types/types';

export async function fetchExercises(): Promise<Exercise[]> {
  const res = await fetch('/api/exercises');
  if (!res.ok) throw new Error('Failed to fetch exercises');
  return res.json();
}

export async function postExercise(body: {
  name: string;
  muscleGroup: string;
}): Promise<Exercise> {
  const res = await fetch('/api/exercises', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to create exercise');
  return res.json();
}

export async function putExercise(
  id: string,
  body: { name: string; muscleGroup: string | null }
): Promise<Exercise> {
  const res = await fetch(`/api/exercises/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? 'Failed to update exercise');
  }
  return res.json();
}

export async function deleteExercise(id: string): Promise<void> {
  const res = await fetch(`/api/exercises/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? 'Failed to delete exercise');
  }
}
