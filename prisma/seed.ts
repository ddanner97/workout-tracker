import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const exercises = [
  { name: "Bench Press", muscleGroup: "Chest" },
  { name: "Incline Dumbbell Press", muscleGroup: "Chest" },
  { name: "Dips", muscleGroup: "Chest" },
  { name: "Overhead Press", muscleGroup: "Shoulders" },
  { name: "Lateral Raise", muscleGroup: "Shoulders" },
  { name: "Face Pull", muscleGroup: "Shoulders" },
  { name: "Pull-Up", muscleGroup: "Back" },
  { name: "Barbell Row", muscleGroup: "Back" },
  { name: "Lat Pulldown", muscleGroup: "Back" },
  { name: "Squat", muscleGroup: "Legs" },
  { name: "Leg Press", muscleGroup: "Legs" },
  { name: "Romanian Deadlift", muscleGroup: "Hamstrings" },
  { name: "Lunges", muscleGroup: "Legs" },
  { name: "Calf Raise", muscleGroup: "Calves" },
  { name: "Deadlift", muscleGroup: "Posterior Chain" },
  { name: "Bicep Curl", muscleGroup: "Biceps" },
  { name: "Tricep Extension", muscleGroup: "Triceps" }
];

async function main() {
  await Promise.all(
    exercises.map((exercise) =>
      prisma.exercise.upsert({
        where: { name: exercise.name },
        update: {
          muscleGroup: exercise.muscleGroup
        },
        create: exercise
      })
    )
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
