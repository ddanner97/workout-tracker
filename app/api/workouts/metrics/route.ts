import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";
import { HistoryGraphRange } from "@/app/types/types";

function normalizeTags(values: string[]): string[] {
  return [...new Set(values.map((tag) => tag.replace(/^#/, "").trim().toLowerCase()).filter(Boolean))];
}

function parseTags(searchParams: URLSearchParams): string[] {
  const repeatedTags = searchParams.getAll("tags");
  const splitTags = repeatedTags.flatMap((value) => value.split(","));
  return normalizeTags(splitTags);
}

function parseRange(rangeParam: string | null): HistoryGraphRange {
  if (rangeParam === "30" || rangeParam === "90" || rangeParam === "180" || rangeParam === "365" || rangeParam === "custom") {
    return rangeParam;
  }

  return "all";
}

function getDateFilter(
  range: HistoryGraphRange,
  searchParams: URLSearchParams
): { gte?: Date; lte?: Date } | undefined {
  if (range === "custom") {
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    if (!startDate || !endDate) return undefined;

    const gte = new Date(startDate);
    const lte = new Date(endDate);
    lte.setUTCHours(23, 59, 59, 999);

    if (isNaN(gte.getTime()) || isNaN(lte.getTime())) return undefined;
    return { gte, lte };
  }

  if (range === "all") return undefined;

  const days = Number(range);
  const startDate = new Date();
  startDate.setUTCHours(0, 0, 0, 0);
  startDate.setUTCDate(startDate.getUTCDate() - (days - 1));
  return { gte: startDate };
}

export async function GET(req: NextRequest) {
  const tags = parseTags(req.nextUrl.searchParams);
  const range = parseRange(req.nextUrl.searchParams.get("range"));
  const dateFilter = getDateFilter(range, req.nextUrl.searchParams);

  const andFilters: Prisma.WorkoutWhereInput[] = tags.map((name) => ({
    tags: {
      some: { name },
    },
  }));

  if (dateFilter) {
    andFilters.push({ performedAt: dateFilter });
  }

  const workouts = await prisma.workout.findMany({
    where: andFilters.length > 0 ? { AND: andFilters } : undefined,
    orderBy: { performedAt: "asc" },
    include: {
      tags: { orderBy: { name: "asc" } },
      workoutExercises: {
        orderBy: { order: "asc" },
        include: {
          sets: { orderBy: { setNumber: "asc" } },
        },
      },
    },
  });

  const volumeSeries = workouts.map((workout) => {
    const volume = workout.workoutExercises.reduce((workoutTotal, workoutExercise) => {
      const exerciseTotal = workoutExercise.sets.reduce((setTotal, set) => {
        if (set.reps <= 0) {
          return setTotal;
        }

        return setTotal + set.weight * set.reps;
      }, 0);

      return workoutTotal + exerciseTotal;
    }, 0);

    return {
      workoutId: workout.id,
      performedAt: workout.performedAt.toISOString(),
      volume,
      tags: workout.tags.map((tag) => tag.name),
    };
  });

  // const exerciseMaxWeightSeries =
  //   exerciseId == null
  //     ? []
  //     : workouts.flatMap((workout) => {
  //         const successfulSets = workout.workoutExercises
  //           .filter((workoutExercise) => workoutExercise.exerciseId === exerciseId)
  //           .flatMap((workoutExercise) =>
  //             workoutExercise.sets
  //               .filter((set) => set.reps > 0)
  //               .map((set) => ({
  //                 weight: set.weight,
  //                 reps: set.reps,
  //                 setNumber: set.setNumber,
  //               }))
  //           )
  //           .sort((left, right) => {
  //             if (right.weight !== left.weight) {
  //               return right.weight - left.weight;
  //             }
  //
  //             return right.setNumber - left.setNumber;
  //           });
  //
  //         const heaviestSet = successfulSets[0];
  //         if (!heaviestSet) {
  //           return [];
  //         }
  //
  //         return [
  //           {
  //             workoutId: workout.id,
  //             performedAt: workout.performedAt.toISOString(),
  //             weight: heaviestSet.weight,
  //             reps: heaviestSet.reps,
  //           },
  //         ];
  //       });

  return NextResponse.json({
    volumeSeries,
    exerciseMaxWeightSeries: [],
  });
}
