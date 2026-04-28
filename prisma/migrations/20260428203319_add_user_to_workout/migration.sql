/*
  Warnings:

  - Added the required column `userId` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- Truncate existing workout data (dev only) so the non-nullable userId column can be added
TRUNCATE TABLE "Set", "WorkoutExercise", "Workout" CASCADE;

-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Workout_userId_idx" ON "Workout"("userId");

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
