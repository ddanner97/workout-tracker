/**
 * One-time recovery script:
 *   - Reads workout data from a Neon recovery branch (OLD schema, no userId)
 *   - Inserts it into the current prod DB, attaching every workout to USER_ID
 *
 * Required env vars:
 *   OLD_DATABASE_URL  — recovery branch connection string
 *   DATABASE_URL      — prod connection string (already in .env)
 *   USER_ID           — id of the new user in prod to assign workouts to
 *
 * Run dry-run first:
 *   OLD_DATABASE_URL=... USER_ID=... npx ts-node scripts/restore-workouts.ts --dry-run
 *
 * Then for real:
 *   OLD_DATABASE_URL=... USER_ID=... npx ts-node scripts/restore-workouts.ts
 */
import 'dotenv/config';
import { Client } from 'pg';

const DRY_RUN = process.argv.includes('--dry-run');

const OLD_URL = process.env.OLD_DATABASE_URL;
const NEW_URL = process.env.DATABASE_URL;
const USER_ID = process.env.USER_ID;

if (!OLD_URL || !NEW_URL || !USER_ID) {
  console.error(
    'Missing env vars. Need OLD_DATABASE_URL, DATABASE_URL, USER_ID.'
  );
  process.exit(1);
}

async function main() {
  const oldDb = new Client({ connectionString: OLD_URL });
  const newDb = new Client({ connectionString: NEW_URL });

  await oldDb.connect();
  await newDb.connect();

  try {
    console.log('Reading from recovery branch...');
    const workouts = (
      await oldDb.query(
        'SELECT id, "performedAt", notes, "createdAt", "updatedAt" FROM "Workout" ORDER BY "createdAt"'
      )
    ).rows;

    const workoutExercises = (
      await oldDb.query(
        'SELECT id, "workoutId", "exerciseId", "order", "createdAt", "updatedAt" FROM "WorkoutExercise" ORDER BY "createdAt"'
      )
    ).rows;

    const sets = (
      await oldDb.query(
        'SELECT id, "workoutExerciseId", "setNumber", weight, reps, rpe, notes, "createdAt", "updatedAt" FROM "Set" ORDER BY "createdAt"'
      )
    ).rows;

    const tags = (
      await oldDb.query('SELECT id, name FROM "Tag" ORDER BY name')
    ).rows;

    // Implicit M:N join table — Prisma names it _<First>To<Second> alphabetically
    const tagWorkoutLinks = (
      await oldDb.query('SELECT "A", "B" FROM "_TagToWorkout"')
    ).rows;

    const exercises = (
      await oldDb.query('SELECT id, name, "muscleGroup", "createdAt", "updatedAt" FROM "Exercise"')
    ).rows;

    console.log('Found in recovery branch:');
    console.log(`  ${workouts.length} workouts`);
    console.log(`  ${workoutExercises.length} workout exercises`);
    console.log(`  ${sets.length} sets`);
    console.log(`  ${tags.length} tags`);
    console.log(`  ${tagWorkoutLinks.length} tag <-> workout links`);
    console.log(`  ${exercises.length} exercises`);
    console.log();

    if (DRY_RUN) {
      console.log('DRY RUN — exiting without writing to prod.');
      return;
    }

    console.log('Verifying USER_ID exists in prod...');
    const { rows: userRows } = await newDb.query(
      'SELECT id, email FROM "user" WHERE id = $1',
      [USER_ID]
    );
    if (userRows.length === 0) {
      throw new Error(`User ${USER_ID} not found in prod DB. Aborting.`);
    }
    console.log(`  Target user: ${userRows[0].email} (${userRows[0].id})`);
    console.log();

    console.log('Writing to prod (single transaction)...');
    await newDb.query('BEGIN');

    // Exercises — upsert by id (skip if already exists with same id)
    for (const ex of exercises) {
      await newDb.query(
        `INSERT INTO "Exercise" (id, name, "muscleGroup", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [ex.id, ex.name, ex.muscleGroup, ex.createdAt, ex.updatedAt]
      );
    }

    // Tags — upsert by unique name (preserve recovery id when creating new)
    for (const t of tags) {
      await newDb.query(
        `INSERT INTO "Tag" (id, name)
         VALUES ($1, $2)
         ON CONFLICT (name) DO NOTHING`,
        [t.id, t.name]
      );
    }

    // Workouts — stamp every row with the new userId, skip if id already exists
    let insertedWorkouts = 0;
    for (const w of workouts) {
      const result = await newDb.query(
        `INSERT INTO "Workout" (id, "userId", "performedAt", notes, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [w.id, USER_ID, w.performedAt, w.notes, w.createdAt, w.updatedAt]
      );
      if (result.rowCount && result.rowCount > 0) insertedWorkouts++;
    }

    // Workout exercises
    for (const we of workoutExercises) {
      await newDb.query(
        `INSERT INTO "WorkoutExercise" (id, "workoutId", "exerciseId", "order", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [
          we.id,
          we.workoutId,
          we.exerciseId,
          we.order,
          we.createdAt,
          we.updatedAt,
        ]
      );
    }

    // Sets
    for (const s of sets) {
      await newDb.query(
        `INSERT INTO "Set" (id, "workoutExerciseId", "setNumber", weight, reps, rpe, notes, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO NOTHING`,
        [
          s.id,
          s.workoutExerciseId,
          s.setNumber,
          s.weight,
          s.reps,
          s.rpe,
          s.notes,
          s.createdAt,
          s.updatedAt,
        ]
      );
    }

    // Tag <-> Workout links — A is Tag.id, B is Workout.id (alphabetical)
    for (const link of tagWorkoutLinks) {
      await newDb.query(
        `INSERT INTO "_TagToWorkout" ("A", "B")
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [link.A, link.B]
      );
    }

    await newDb.query('COMMIT');
    console.log(`Recovery complete — ${insertedWorkouts} new workouts inserted.`);
  } catch (e) {
    await newDb.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    await oldDb.end();
    await newDb.end();
  }
}

main().catch((e) => {
  console.error('Recovery FAILED:', e);
  process.exit(1);
});
