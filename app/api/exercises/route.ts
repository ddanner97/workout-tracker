import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
  const exercises = await prisma.exercise.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(exercises);
}

export async function POST(req: Request) {
  const { name, muscleGroup } = await req.json();
  const exercise = await prisma.exercise.create({
    data: { name, muscleGroup: muscleGroup || null },
  });
  return NextResponse.json(exercise, { status: 201 });
}
