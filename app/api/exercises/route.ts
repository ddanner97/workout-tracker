import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
  const exercises = await prisma.exercise.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(exercises);
}
