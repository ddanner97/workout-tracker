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
| Database      | PostgreSQL                                      |
| React         | React 19                                        |
| Fonts         | Geist Sans / Geist Mono (Next.js)               |

---

## Project Structure

```
workout-tracker/
├── app/
│   ├── api/
│   │   ├── exercises/route.ts        # GET all / POST create exercise
│   │   ├── tags/route.ts             # GET all tags
│   │   └── workouts/
│   │       ├── route.ts              # GET all (nested) / POST create workout
│   │       ├── shared.ts             # Shared input types + validation utils
│   │       └── [id]/route.ts         # GET / PUT / DELETE a single workout
│   ├── components/
│   │   ├── component-library/
│   │   │   ├── Button.tsx            # MUI Button wrapper
│   │   │   ├── Container.tsx         # Flex container (row/column)
│   │   │   ├── ThemeToggle.tsx       # Dark/light mode toggle button
│   │   │   ├── exercise-table/
│   │   │   │   ├── ExerciseTable.tsx # Responsive router (Desktop vs Mobile)
│   │   │   │   ├── Desktop.tsx       # MUI Table layout for sets
│   │   │   │   ├── Mobile.tsx        # Paper card layout for sets
│   │   │   │   └── constants.ts      # SET_FIELDS config array
│   │   │   ├── workout-form/
│   │   │   │   ├── WorkoutForm.tsx   # Main workout logging / edit form
│   │   │   │   ├── AddExerciseDialog.tsx  # Inline new-exercise creation dialog
│   │   │   │   ├── ExercisePicker.tsx     # Autocomplete for selecting an exercise
│   │   │   │   ├── RemoveExerciseModal.tsx # Confirm-remove exercise modal
│   │   │   │   ├── TagInput.tsx      # Tag autocomplete input
│   │   │   │   └── info.ts           # Fetch/mutate helpers for the form
│   │   │   └── index.ts              # Barrel export
│   │   ├── contexts/
│   │   │   ├── ThemeRegistry.tsx     # Light/dark theme state + MUI ThemeProvider
│   │   │   └── WorkoutFormContext.tsx # Form state context + provider + hook
│   │   ├── history/
│   │   │   ├── WorkoutList.tsx       # History page component
│   │   │   ├── DeleteWorkoutDialog.tsx # Confirm-delete workout dialog
│   │   │   └── info.ts               # Fetch/mutate helpers for history
│   │   ├── QueryProvider.tsx         # React Query client provider
│   │   └── index.ts                  # Barrel export
│   ├── history/
│   │   └── page.tsx                  # /history route
│   ├── workouts/
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx          # /workouts/[id]/edit route
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

| Path                   | File                              | Description                                                    |
| ---------------------- | --------------------------------- | -------------------------------------------------------------- |
| `/`                    | `app/page.tsx`                    | Log a new workout (renders `<WorkoutForm />`)                  |
| `/history`             | `app/history/page.tsx`            | View saved workout history (renders `<WorkoutList />`)         |
| `/workouts/[id]/edit`  | `app/workouts/[id]/edit/page.tsx` | Edit an existing workout by ID                                 |
| `/api/exercises`       | `app/api/exercises/route.ts`      | `GET` all exercises, `POST` create exercise                    |
| `/api/tags`            | `app/api/tags/route.ts`           | `GET` all tags ordered by name                                 |
| `/api/workouts`        | `app/api/workouts/route.ts`       | `GET` all workouts with nested data, `POST` create workout     |
| `/api/workouts/[id]`   | `app/api/workouts/[id]/route.ts`  | `GET` single workout, `PUT` full update, `DELETE` workout      |

---

## Components

### Providers & Global Wrappers

**`QueryProvider.tsx`**
Wraps the app with `QueryClientProvider` from TanStack React Query. Configured with `staleTime: 60s`. Instantiated inside `useState` to remain stable across renders.

**`contexts/ThemeRegistry.tsx`**
Manages light/dark mode. On first load, reads `localStorage` and falls back to `prefers-color-scheme`. Toggles the `html.dark` class for Tailwind and provides MUI's `ThemeProvider` + `CssBaseline`. Exposes a `useColorMode()` hook via React context.

**`contexts/WorkoutFormContext.tsx`**
Provides all form state (date, notes, tags, exercises) and mutators (addExercise, removeExercise, updateExerciseId, addSet, removeSet, updateSet, resetForm) via React context. Accepts optional `initialValues` for pre-populating the form in edit mode. Exposes a `useWorkoutForm()` hook; throws if used outside `<WorkoutFormProvider>`.

---

### Feature Components

**`workout-form/WorkoutForm.tsx`** (`"use client"`)
The main workout logging and editing form. Reads all state from `useWorkoutForm()`. Responsibilities:

- Submit a new workout via `useMutation` → `POST /api/workouts`
- Update an existing workout via `useMutation` → `PUT /api/workouts/[id]` (when `workoutId` prop is provided)
- Dynamic add/remove of exercises and sets per exercise
- Delegates exercise selection to `<ExercisePicker>`, inline exercise creation to `<AddExerciseDialog>`, and remove confirmation to `<RemoveExerciseModal>`
- Renders `<TagInput>` for workout tags
- Uses `<ExerciseTable>` for per-exercise set management
- On success, invalidates `workouts` and `tags` query caches; redirects to `/history` in edit mode or resets form in create mode

**`workout-form/ExercisePicker.tsx`**
MUI `Autocomplete` for selecting an exercise per exercise row. Fetches exercises via `useQuery` → `GET /api/exercises`. Includes a "Add new exercise" free-solo option that opens `AddExerciseDialog`.

**`workout-form/AddExerciseDialog.tsx`**
MUI `Dialog` for creating a new exercise inline. Submits via `useMutation` → `POST /api/exercises`, then invalidates the exercises cache and sets the newly created exercise on the pending exercise row.

**`workout-form/RemoveExerciseModal.tsx`**
Confirmation modal for removing an exercise row from the form. Calls `removeExercise` from `useWorkoutForm()`.

**`workout-form/TagInput.tsx`**
MUI `Autocomplete` (free-solo, multiple) for adding workout tags. Fetches existing tags via `useQuery` → `GET /api/tags` to offer autocomplete suggestions. Normalizes tag strings (strips `#`, lowercases).

**`workout-form/info.ts`**
Client-side fetch/mutate helpers for the workout form: `fetchExercises`, `fetchTags`, `postExercise`, `postWorkout`, `fetchWorkout`, `putWorkout`.

**`WorkoutList.tsx`** (`"use client"`)
History page component. Fetches all workouts via `useQuery` → `GET /api/workouts`. Renders each workout with its date, tags, optional notes, and a plain HTML table showing set number, weight, reps, and RPE per exercise. Includes a delete button that opens `<DeleteWorkoutDialog>`.

**`history/DeleteWorkoutDialog.tsx`**
Confirmation dialog for deleting a workout. Receives `open`, `isDeleting`, `onConfirm`, and `onClose` props. On confirm, calls `DELETE /api/workouts/[id]` and invalidates the workouts cache.

**`history/info.ts`**
Client-side fetch/mutate helpers for the history page: `fetchWorkouts`, `fetchTags`, `deleteWorkout`.

---

### Component Library (`app/components/component-library/`)

**`Button.tsx`**
Thin wrapper around MUI `Button`. Enforces a required `label: string` prop instead of `children`. All other `ButtonProps` are passed through.

**`Container.tsx`**
Emotion-styled `div` that renders as either `flex-direction: row` or `flex-direction: column` based on a `column` boolean prop.

**`ThemeToggle.tsx`**
An MUI `IconButton` that calls `toggleColorMode()` from `useColorMode`. Shows `LightModeIcon` in dark mode and `DarkModeIcon` in light mode.

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

### `GET /api/tags`

Returns all tags ordered by name.

### `GET /api/workouts`

Returns all workouts in descending date order, with fully nested `workoutExercises → exercise + sets` and `tags`.

### `POST /api/workouts`

Creates a complete workout in one operation. Validates the request body via `validateBody` from `shared.ts`. Handles server-side encoding of `"fail"` reps → `-1`. Supports optional `tags` array (strings, normalized and upserted).

### `GET /api/workouts/[id]`

Returns a single workout by ID with fully nested `workoutExercises → exercise + sets` and `tags`. Returns 404 if not found.

### `PUT /api/workouts/[id]`

Fully replaces an existing workout in a Prisma transaction: deletes all existing sets and workoutExercises, then updates the workout with new data (date, notes, tags, exercises + sets). Returns 404 if not found.

### `DELETE /api/workouts/[id]`

Transactionally deletes all sets, workoutExercises, and the workout itself. Returns 204 on success, 404 if not found.

### `app/api/workouts/shared.ts`

Shared module used by both `workouts/route.ts` and `workouts/[id]/route.ts`:

| Export          | Description                                                          |
| --------------- | -------------------------------------------------------------------- |
| `SetInput`      | Interface for raw set payload from request body                      |
| `ExerciseInput` | Interface for raw exercise payload from request body                 |
| `WorkoutInput`  | Interface for the full workout request body                          |
| `parseReps`     | Converts `"fail"` → `-1`; validates positive integer reps            |
| `validateBody`  | Returns an array of validation error strings for a `WorkoutInput`    |

---

## Database & Data Model

The project uses **PostgreSQL**.

```
Workout
  id               String   (cuid, PK)
  performedAt      DateTime
  notes            String?
  createdAt        DateTime
  updatedAt        DateTime
  tags             → Tag[]             (many-to-many)
  workoutExercises → WorkoutExercise[]

Tag
  id       String   (cuid, PK)
  name     String   (unique)
  workouts → Workout[]

Exercise
  id               String   (cuid, PK)
  name             String   (unique)
  muscleGroup      String?
  createdAt        DateTime
  updatedAt        DateTime
  workoutExercises → WorkoutExercise[]

WorkoutExercise  (join table with ordering)
  id           String   (cuid, PK)
  workoutId    → Workout
  exerciseId   → Exercise
  order        Int
  createdAt    DateTime
  updatedAt    DateTime
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
  createdAt           DateTime
  updatedAt           DateTime
  UNIQUE (workoutExerciseId, setNumber)
```

**Seed data** (`prisma/seed.ts`): 17 exercises pre-loaded via `upsert` across muscle groups (Chest, Shoulders, Back, Legs, etc.).

**Prisma singleton** (`src/lib/prisma.ts`): Uses the standard `globalForPrisma` pattern to attach the `PrismaClient` to `global` in development, preventing duplicate connections across Next.js HMR reloads.

---

## Types & Utilities

### `app/types/types.ts`

| Interface                | Description                                                          |
| ------------------------ | -------------------------------------------------------------------- |
| `Tag`                    | `{ id, name }` — DB tag record                                       |
| `Exercise`               | `{ id, name, muscleGroup }` — DB exercise record                     |
| `SetRow`                 | `{ weight, reps, rpe }` (strings) — form-level set state             |
| `ExerciseRow`            | `{ exerciseId, sets: SetRow[] }` — form-level exercise state         |
| `SavedSet`               | `{ id, setNumber, weight, reps, rpe }` — DB set record               |
| `SavedWorkoutExercise`   | `{ id, order, exercise, sets }` — DB join record                     |
| `SavedWorkout`           | `{ id, performedAt, notes, workoutExercises, tags }` — DB workout    |
| `WorkoutFormInitialValues` | `{ date, notes, exercises, tags }` — for pre-populating edit form  |

> **Note:** `SetRow` uses `string` types for all fields because they come directly from controlled text inputs. Parsing to numbers happens at submission time.

### `app/utils/utils.ts`

| Function                              | Description                                                                           |
| ------------------------------------- | ------------------------------------------------------------------------------------- |
| `emptySet()`                          | Returns a blank `SetRow` for initializing a new set row in the form                   |
| `emptyExercise()`                     | Returns a blank `ExerciseRow` with one empty set                                      |
| `displayReps(reps: number)`           | Converts `-1` → `"fail"`, otherwise returns the number as a string                    |
| `formatDate(iso: string)`             | Formats an ISO date string to a human-readable locale string (e.g. "Feb 27, 2026")   |
| `savedWorkoutToFormValues(workout)`   | Converts a `SavedWorkout` to `WorkoutFormInitialValues` for pre-populating edit form  |

---

## Theming

The project uses a **dual theming** approach to keep MUI and Tailwind CSS in sync:

- **`app/theme/themes.ts`** — Defines MUI `lightTheme` and `darkTheme` objects with matching color palettes.
- **`app/globals.css`** — Defines `--background` and `--foreground` CSS custom properties for both `:root` (light) and `.dark` (dark). Tailwind utilities consume these variables.
- **`contexts/ThemeRegistry.tsx`** — Bridges the two: toggles the `html.dark` class (for Tailwind) and swaps the MUI `ThemeProvider` theme simultaneously. Persists preference to `localStorage`.

---

## Notable Patterns & Conventions

**App Router only** — No `pages/` directory. All routes live under `app/`.

**`"use client"` on all interactive components** — `WorkoutForm`, `WorkoutList`, all exercise table variants, all workout-form sub-components, `QueryProvider`, `ThemeRegistry`, `ThemeToggle`, `WorkoutFormContext`, and `Container` all explicitly declare themselves as client components.

**Reps sentinel value** — `-1` is stored in the DB to represent a "failure" rep (a set where the lifter couldn't complete a full rep). `displayReps()` and server-side `parseReps()` handle the conversion at both ends.

**Responsive component splitting** — Rather than CSS media queries, `ExerciseTable` uses MUI's `useMediaQuery` hook to render entirely different components (`Desktop` vs `Mobile`), each layout-optimized for its target screen size.

**Data-driven field config** — `SET_FIELDS` in `constants.ts` is the single source of truth for set input fields. Both `Desktop` and `Mobile` iterate over this array, so adding or changing a field only requires editing one place.

**Form state via context** — `WorkoutFormContext` centralizes all form state and mutators. `WorkoutForm` consumes the context via `useWorkoutForm()`, making it stateless and reusable for both create and edit flows.

**Edit mode via `workoutId` prop** — `WorkoutForm` accepts an optional `workoutId`. When present, submission calls `PUT /api/workouts/[id]` instead of `POST /api/workouts` and redirects to `/history` on success.

**Shared API validation** — `app/api/workouts/shared.ts` centralizes request body types (`WorkoutInput`, `ExerciseInput`, `SetInput`) and validation (`validateBody`, `parseReps`) so both the create and update routes stay consistent.

**Inline exercise creation** — `WorkoutForm` allows adding a brand-new exercise on the fly via `AddExerciseDialog` without leaving the page. After creation, `queryClient.invalidateQueries` automatically refreshes the exercise dropdown.

**Tag normalization** — Tags are stripped of leading `#`, lowercased, trimmed, and deduplicated before being sent to the API. On the server, tags are upserted by name (case-sensitive unique constraint).

**TanStack Query cache invalidation** — After a successful mutation (new/updated workout, new exercise), `invalidateQueries` is called to trigger a background refetch of the relevant lists.

**Barrel exports** — `app/components/index.ts` and `app/components/component-library/index.ts` provide clean single-import entry points for all components.

**Co-located fetch helpers (`info.ts`)** — Each feature folder (`workout-form/`, `history/`) has its own `info.ts` with typed fetch/mutate functions, keeping API client code close to the components that use it.
