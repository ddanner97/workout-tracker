-- Backfill / cleanup before enforcing the NOT NULL + FK constraint.
-- Any Workout row without a `userId` is orphaned (predates auth) and is
-- removed here. Production deployments should backfill `userId` for any
-- rows that should be kept BEFORE running this migration.
--
-- Idempotent: safe to re-run on environments where an earlier (destructive)
-- version of the previous migration already applied NOT NULL and the FK.
DELETE FROM "Set"
WHERE "workoutExerciseId" IN (
  SELECT we."id"
  FROM "WorkoutExercise" we
  JOIN "Workout" w ON w."id" = we."workoutId"
  WHERE w."userId" IS NULL
);

DELETE FROM "WorkoutExercise"
WHERE "workoutId" IN (SELECT "id" FROM "Workout" WHERE "userId" IS NULL);

DELETE FROM "Workout" WHERE "userId" IS NULL;

-- AlterTable: no-op if the column is already NOT NULL.
ALTER TABLE "Workout" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey: skip if the constraint already exists.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'Workout_userId_fkey'
      AND conrelid = '"Workout"'::regclass
  ) THEN
    ALTER TABLE "Workout"
      ADD CONSTRAINT "Workout_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "user"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
