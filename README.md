# Workout Tracker — Codebase Documentation

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Routes & Pages](#routes--pages)
4. [Components](#components)
5. [API Layer](#api-layer)
6. [Database & Data Model](#database--data-model)
7. [Types & Utilities](#types--utilities)
8. [Theming](#theming)
9. [Notable Patterns & Conventions](#notable-patterns--conventions)

---

## Tech Stack

| Category      | Technology                                      |
| ------------- | ----------------------------------------------- |
| Framework     | Next.js 16 (App Router)                         |
| Language      | TypeScript 5                                    |
| UI Library    | MUI v7 (`@mui/material`, `@mui/icons-material`) |
| Styling       | Tailwind CSS v4 + Emotion (for MUI)             |
| Data Fetching | TanStack React Query v5                         |
| ORM           | Prisma v6                                       |
| Database      | PostgreSQL (production), SQLite (legacy dev)    |
| React         | React 19                                        |
| Fonts         | Geist Sans / Geist Mono (Next.js)               |

---

## Project Structure

```
workout-tracker/
├── app/
│   ├── api/
│   │   ├── exercises/route.ts        # GET all / POST create exercise
│   │   └── workouts/route.ts         # GET all (nested) / POST create workout
│   ├── components/
│   │   ├── component-library/
│   │   │   ├── Button.tsx            # MUI Button wrapper
│   │   │   ├── Container.tsx         # Flex container (row/column)
│   │   │   ├── exercise-table/
│   │   │   │   ├── ExerciseTable.tsx # Responsive router (Desktop vs Mobile)
│   │   │   │   ├── Desktop.tsx       # MUI Table layout for sets
│   │   │   │   ├── Mobile.tsx        # Paper card layout for sets
│   │   │   │   └── constants.ts      # SET_FIELDS config array
│   │   │   └── index.ts              # Barrel export
│   │   ├── history/
│   │   │   └── WorkoutList.tsx       # History page component
│   │   ├── QueryProvider.tsx         # React Query client provider
│   │   ├── ThemeRegistry.tsx         # Light/dark theme state + MUI ThemeProvider
│   │   ├── ThemeToggle.tsx           # Dark/light mode toggle button
│   │   ├── WorkoutForm.tsx           # Main workout logging form
│   │   └── index.ts                  # Barrel export
│   ├── history/
│   │   └── page.tsx                  # /history route
│   ├── theme/
│   │   └── themes.ts                 # MUI light & dark theme definitions
│   ├── types/
│   │   └── types.ts                  # Shared TypeScript interfaces
│   ├── utils/
│   │   └── utils.ts                  # Helper functions
│   ├── globals.css                   # Tailwind v4 import + CSS custom properties
│   ├── layout.tsx                    # Root layout (nav, providers)
│   └── page.tsx                      # / (home) route
├── prisma/
│   ├── schema.prisma                 # DB schema (PostgreSQL)
│   ├── seed.ts                       # 17 pre-loaded exercises
│   ├── dev.db                        # Legacy SQLite dev database
│   ├── migrations/                   # PostgreSQL migration history
│   └── migrations_sqlite_backup/     # Old SQLite migrations (archived)
├── src/
│   └── lib/
│       └── prisma.ts                 # Singleton PrismaClient
├── public/                           # Static SVG assets
├── next.config.ts
├── prisma.config.ts
├── tsconfig.json
├── postcss.config.mjs
└── eslint.config.mjs
```

---

## Routes & Pages

| Path             | File                         | Description                                                |
| ---------------- | ---------------------------- | ---------------------------------------------------------- |
| `/`              | `app/page.tsx`               | Log a new workout (renders `<WorkoutForm />`)              |
| `/history`       | `app/history/page.tsx`       | View saved workout history (renders `<WorkoutList />`)     |
| `/api/exercises` | `app/api/exercises/route.ts` | `GET` all exercises, `POST` create exercise                |
| `/api/workouts`  | `app/api/workouts/route.ts`  | `GET` all workouts with nested data, `POST` create workout |

---

## Components

### Providers & Global Wrappers

**`QueryProvider.tsx`**
Wraps the app with `QueryClientProvider` from TanStack React Query. Configured with `staleTime: 60s`. Instantiated inside `useState` to remain stable across renders.

**`ThemeRegistry.tsx`**
Manages light/dark mode. On first load, reads `localStorage` and falls back to `prefers-color-scheme`. Toggles the `html.dark` class for Tailwind and provides MUI's `ThemeProvider` + `CssBaseline`. Exposes a `useColorMode()` hook via React context.

**`ThemeToggle.tsx`**
An MUI `IconButton` that calls `toggleColorMode()` from `useColorMode`. Shows `LightModeIcon` in dark mode and `DarkModeIcon` in light mode.

---

### Feature Components

**`WorkoutForm.tsx`** (`"use client"`)
The main workout logging form on the home page. Responsibilities:

- Fetch available exercises via `useQuery` → `GET /api/exercises`
- Create a new exercise inline via MUI `Dialog` + `useMutation`
- Submit a full workout (date, optional notes, exercises + sets) via `useMutation` → `POST /api/workouts`
- Dynamic add/remove of exercises and sets per exercise
- MUI `Autocomplete` with a "Add new exercise" freeSolo option
- Uses `<ExerciseTable>` for per-exercise set management

**`WorkoutList.tsx`** (`"use client"`)
History page component. Fetches all workouts via `useQuery` → `GET /api/workouts`. Renders each workout with its date, optional notes, and a plain HTML table showing set number, weight, reps, and RPE per exercise.

---

### Component Library (`app/components/component-library/`)

**`Button.tsx`**
Thin wrapper around MUI `Button`. Enforces a required `label: string` prop instead of `children`. All other `ButtonProps` are passed through.

**`Container.tsx`**
Emotion-styled `div` that renders as either `flex-direction: row` or `flex-direction: column` based on a `column` boolean prop.

**`ExerciseTable.tsx`**
Responsive router component. Uses MUI `useMediaQuery` to render either `ExerciseTableDesktop` or `ExerciseTableMobile`. Both receive the same props.

**`Desktop.tsx`**
Renders a workout's sets as an MUI `Table` (one row per set). Each row has inline `TextField`s for weight, reps, and RPE plus an "×" remove button. An "+ Add Set" button sits below the table.

**`Mobile.tsx`**
Renders sets as stacked MUI `Paper` cards (one card per set). Inline `TextField`s and a remove button per card — optimized for small screen layouts.

**`constants.ts`**
Defines `SET_FIELDS: SetFieldConfig[]`, the single source of truth for set input fields. Each entry contains `fieldName`, `label`, `type`, `size`, `required`, `htmlInputProps`, and `placeholder`. Both `Desktop` and `Mobile` iterate over this array, keeping field definitions in sync.

---

## API Layer

### `GET /api/exercises`

Returns all exercises ordered by name.

### `POST /api/exercises`

Creates a new exercise. Accepts `{ name, muscleGroup? }`.

### `GET /api/workouts`

Returns all workouts in descending date order, with fully nested `workoutExercises → exercise + sets`.

### `POST /api/workouts`

Creates a complete workout in one operation. Handles server-side encoding of `"fail"` reps → `-1` before calling `prisma.workout.create` with nested writes.

---

## Database & Data Model

The project uses **PostgreSQL** in production (migrated from SQLite in February 2026).

```
Workout
  id           String   (cuid, PK)
  performedAt  DateTime
  notes        String?
  workoutExercises → WorkoutExercise[]

Exercise
  id           String   (cuid, PK)
  name         String   (unique)
  muscleGroup  String?
  workoutExercises → WorkoutExercise[]

WorkoutExercise  (join table with ordering)
  id           String   (cuid, PK)
  workoutId    → Workout
  exerciseId   → Exercise
  order        Int
  sets         → Set[]
  UNIQUE (workoutId, order)

Set
  id                  String   (cuid, PK)
  workoutExerciseId   → WorkoutExercise
  setNumber           Int
  weight              Float
  reps                Int      (-1 sentinel = "failure" set)
  rpe                 Float?
  notes               String?
  UNIQUE (workoutExerciseId, setNumber)
```

**Seed data** (`prisma/seed.ts`): 17 exercises pre-loaded via `upsert` across muscle groups (Chest, Shoulders, Back, Legs, etc.).

**Prisma singleton** (`src/lib/prisma.ts`): Uses the standard `globalForPrisma` pattern to attach the `PrismaClient` to `global` in development, preventing duplicate connections across Next.js HMR reloads.

---

## Types & Utilities

### `app/types/types.ts`

| Interface              | Description                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| `Exercise`             | `{ id, name, muscleGroup }` — DB exercise record                   |
| `SetRow`               | `{ weight, reps, rpe }` (strings) — form-level set state           |
| `ExerciseRow`          | `{ exerciseId, sets: SetRow[] }` — form-level exercise state       |
| `SavedSet`             | `{ id, setNumber, weight, reps, rpe }` — DB set record             |
| `SavedWorkoutExercise` | `{ id, order, exercise, sets }` — DB join record                   |
| `SavedWorkout`         | `{ id, performedAt, notes, workoutExercises }` — DB workout record |

> **Note:** `SetRow` uses `string` types for all fields because they come directly from controlled text inputs. Parsing to numbers happens at submission time.

### `app/utils/utils.ts`

| Function                    | Description                                                                        |
| --------------------------- | ---------------------------------------------------------------------------------- |
| `emptySet()`                | Returns a blank `SetRow` for initializing a new set row in the form                |
| `emptyExercise()`           | Returns a blank `ExerciseRow` with one empty set                                   |
| `displayReps(reps: number)` | Converts `-1` → `"fail"`, otherwise returns the number as a string                 |
| `formatDate(iso: string)`   | Formats an ISO date string to a human-readable locale string (e.g. "Feb 27, 2026") |

---

## Theming

The project uses a **dual theming** approach to keep MUI and Tailwind CSS in sync:

- **`app/theme/themes.ts`** — Defines MUI `lightTheme` and `darkTheme` objects with matching color palettes.
- **`app/globals.css`** — Defines `--background` and `--foreground` CSS custom properties for both `:root` (light) and `.dark` (dark). Tailwind utilities consume these variables.
- **`ThemeRegistry.tsx`** — Bridges the two: toggles the `html.dark` class (for Tailwind) and swaps the MUI `ThemeProvider` theme simultaneously. Persists preference to `localStorage`.

---

## Notable Patterns & Conventions

**App Router only** — No `pages/` directory. All routes live under `app/`.

**`"use client"` on all interactive components** — `WorkoutForm`, `WorkoutList`, all exercise table variants, `QueryProvider`, `ThemeRegistry`, `ThemeToggle`, and `Container` all explicitly declare themselves as client components.

**Reps sentinel value** — `-1` is stored in the DB to represent a "failure" rep (a set where the lifter couldn't complete a full rep). `displayReps()` and server-side `parseReps()` handle the conversion at both ends.

**Responsive component splitting** — Rather than CSS media queries, `ExerciseTable` uses MUI's `useMediaQuery` hook to render entirely different components (`Desktop` vs `Mobile`), each layout-optimized for its target screen size.

**Data-driven field config** — `SET_FIELDS` in `constants.ts` is the single source of truth for set input fields. Both `Desktop` and `Mobile` iterate over this array, so adding or changing a field only requires editing one place.

**Inline exercise creation** — `WorkoutForm` allows adding a brand-new exercise on the fly via a dialog without leaving the page. After creation, `queryClient.invalidateQueries` automatically refreshes the exercise dropdown.

**TanStack Query cache invalidation** — After a successful mutation (new workout or new exercise), `invalidateQueries` is called to trigger a background refetch of the relevant lists.

**Barrel exports** — `app/components/index.ts` and `app/components/component-library/index.ts` provide clean single-import entry points for all components.
