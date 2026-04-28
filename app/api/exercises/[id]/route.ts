import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getUserId, unauthorized } from '@/src/lib/session';
import { Prisma } from '@prisma/client';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserId(req);
  if (!userId) return unauthorized();

  const { id } = await params;

  const existing = await prisma.exercise.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json(
      { error: 'Exercise not found' },
      { status: 404 }
    );
  }

  let body: { name?: string; muscleGroup?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : undefined;
  if (name !== undefined && name.length === 0) {
    return NextResponse.json(
      { error: 'Exercise name cannot be empty' },
      { status: 400 }
    );
  }

  const muscleGroup =
    body.muscleGroup === undefined
      ? undefined
      : body.muscleGroup
        ? String(body.muscleGroup).trim()
        : null;

  try {
    const exercise = await prisma.exercise.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(muscleGroup !== undefined && { muscleGroup }),
      },
    });
    return NextResponse.json(exercise);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'An exercise with that name already exists' },
        { status: 409 }
      );
    }
    throw e;
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserId(req);
  if (!userId) return unauthorized();

  const { id } = await params;

  const existing = await prisma.exercise.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json(
      { error: 'Exercise not found' },
      { status: 404 }
    );
  }

  const usageCount = await prisma.workoutExercise.count({
    where: { exerciseId: id },
  });
  if (usageCount > 0) {
    return NextResponse.json(
      {
        error: `Cannot delete: exercise is used in ${usageCount} workout(s)`,
      },
      { status: 409 }
    );
  }

  await prisma.exercise.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
