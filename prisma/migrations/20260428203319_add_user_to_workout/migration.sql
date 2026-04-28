-- AlterTable
-- Add `userId` as nullable so existing workout rows are preserved.
-- A follow-up migration backfills, then sets the column NOT NULL and adds the FK.
ALTER TABLE "Workout" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "Workout_userId_idx" ON "Workout"("userId");
