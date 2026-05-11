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
9. [History Graph Workflow](#history-graph-workflow)
10. [Notable Patterns & Conventions](#notable-patterns--conventions)

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
| Charts        | MUI X Charts (`@mui/x-charts`)                  |
| Fonts         | Fraunces (serif headings) / Nunito (body text)  |

---

## Project Structure

```
workout-tracker/
├── app/
│   ├── api/
│   │   ├── exercises/
│   │   │   ├── route.ts              # GET all / POST create exercise
│   │   │   └── [id]/
│   │   │       ├── route.ts          # PUT / DELETE a single exercise
│   │   │       └── history/route.ts  # GET recent session history for exercise
│   │   ├── tags/route.ts             # GET all tags
│   │   └── workouts/
│   │       ├── metrics/route.ts      # GET analytics series for history graphs
│   │       ├── route.ts              # GET all (nested) / POST create workout
│   │       ├── shared.ts             # Shared input types + validation utils
│   │       └── [id]/route.ts         # GET / PUT / DELETE a single workout
│   ├── components/
│   │   ├── component-library/
│   │   │   ├── Button.tsx            # MUI Button wrapper
│   │   │   ├── Container.tsx         # Flex container (row/column)
│   │   │   ├── NavMenu.tsx           # Responsive nav with drawer (desktop + mobile)
│   │   │   ├── PalettePicker.tsx     # Color palette selector
│   │   │   ├── ViewToggle.tsx        # Reusable segmented toggle control
│   │   │   ├── charts/
│   │   │   │   ├── GraphFilters.tsx  # Reusable graph filter controls
│   │   │   │   ├── GraphTooltipContent.tsx # Shared chart tooltip layout
│   │   │   │   └── LineGraph.tsx     # Reusable line-chart wrapper (MUI X Charts)
│   │   │   ├── exercise-table/
│   │   │   │   ├── ExerciseTable.tsx # Responsive router (Desktop vs Mobile)
│   │   │   │   ├── Desktop.tsx       # Desktop grid layout for sets + lbs/kgs toggle
│   │   │   │   ├── Mobile.tsx        # Mobile grid layout for sets + lbs/kgs toggle
│   │   │   │   └── constants.ts      # SET_FIELDS config array
│   │   │   ├── workout-form/
│   │   │   │   ├── WorkoutForm.tsx   # Main workout logging / edit form
│   │   │   │   ├── AddExerciseDialog.tsx       # Inline new-exercise creation dialog
│   │   │   │   ├── ExerciseHistoryModal.tsx    # Exercise session history modal
│   │   │   │   ├── ExercisePicker.tsx          # Autocomplete for selecting an exercise
│   │   │   │   ├── RemoveExerciseModal.tsx     # Confirm-remove exercise modal
│   │   │   │   ├── TagInput.tsx      # Tag autocomplete input
│   │   │   │   ├── WorkoutStats.tsx  # Stats summary row in the form
│   │   │   │   └── info.ts           # Fetch/mutate helpers for the form
│   │   │   └── index.ts              # Barrel export
│   │   ├── contexts/
│   │   │   ├── PaletteContext.tsx    # Palette state + provider + usePalette hook
│   │   │   ├── ThemeRegistry.tsx     # MUI ThemeProvider built from active palette
│   │   │   └── WorkoutFormContext.tsx # Form state context + provider + hook
│   │   ├── history/
│   │   │   ├── WorkoutList.tsx       # History page component
│   │   │   ├── DeleteWorkoutDialog.tsx # Confirm-delete workout dialog
│   │   │   └── info.ts               # Fetch/mutate helpers for history
│   │   ├── QueryProvider.tsx         # React Query client provider
│   │   └── index.ts                  # Barrel export
│   ├── exercises/
│   │   ├── page.tsx                  # /exercises route (exercise library CRUD)
│   │   └── info.ts                   # Fetch/mutate helpers for exercises page
│   ├── history/
│   │   └── page.tsx                  # /history route
│   ├── workouts/
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx          # /workouts/[id]/edit route
│   ├── theme/
│   │   ├── palettes.ts              # Palette definitions + CSS variable application
│   │   └── themes.ts                # MUI theme factory from palette
│   ├── types/
│   │   └── types.ts                  # Shared TypeScript interfaces
│   ├── utils/
│   │   ├── utils.ts                  # Helper functions
│   │   └── buildHeatmapData.ts       # Heatmap data builder for history view
│   ├── globals.css                   # Tailwind v4 import + CSS custom properties
│   ├── layout.tsx                    # Root layout (nav, providers, fonts)
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

| Path                          | File                                      | Description                                                |
| ----------------------------- | ----------------------------------------- | ---------------------------------------------------------- |
| `/`                           | `app/page.tsx`                            | Log a new workout (renders `<WorkoutForm />`)              |
| `/history`                    | `app/history/page.tsx`                    | View saved workout history (renders `<WorkoutList />`)     |
| `/exercises`                  | `app/exercises/page.tsx`                  | Manage exercise library (create, edit, delete)             |
| `/workouts/[id]/edit`         | `app/workouts/[id]/edit/page.tsx`         | Edit an existing workout by ID                             |
| `/api/exercises`              | `app/api/exercises/route.ts`              | `GET` all exercises, `POST` create exercise                |
| `/api/exercises/[id]`         | `app/api/exercises/[id]/route.ts`         | `PUT` update exercise, `DELETE` exercise                   |
| `/api/exercises/[id]/history` | `app/api/exercises/[id]/history/route.ts` | `GET` 10 most recent sessions for an exercise              |
| `/api/tags`                   | `app/api/tags/route.ts`                   | `GET` all tags ordered by name                             |
| `/api/workouts`               | `app/api/workouts/route.ts`               | `GET` all workouts with nested data, `POST` create workout |
| `/api/workouts/metrics`       | `app/api/workouts/metrics/route.ts`       | `GET` analytics series for history graphs                  |
| `/api/workouts/[id]`          | `app/api/workouts/[id]/route.ts`          | `GET` single workout, `PUT` full update, `DELETE` workout  |

---

## Components

### Providers & Global Wrappers

**`QueryProvider.tsx`**
Wraps the app with `QueryClientProvider` from TanStack React Query. Configured with `staleTime: 60s`. Instantiated inside `useState` to remain stable across renders.

**`contexts/PaletteContext.tsx`**
Manages the active color palette. Persists the selected palette ID in `localStorage`. On mount, reads the stored preference and applies CSS variables to `:root` via `applyPaletteToDocument()`. Exposes a `usePalette()` hook returning the current palette and a setter.

**`contexts/ThemeRegistry.tsx`**
Bridges the palette system and MUI. Reads the active palette from `usePalette()` and creates a MUI theme via `createThemeFromPalette()`. Provides `ThemeProvider` + `CssBaseline` to the component tree.

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
- Uses `<ExerciseTable>` for per-exercise set management with lbs/kgs weight unit toggle (display-layer conversion; form state always in lbs)
- Shows a history icon button (clock) next to each selected exercise that opens `<ExerciseHistoryModal>`, with prefetch-on-hover via `queryClient.prefetchQuery`
- In edit mode, shows a Cancel button alongside the Save button that navigates back to `/history`
- On success, invalidates `workouts`, `workoutMetrics`, and `tags` query caches; redirects to `/history` in edit mode or resets form in create mode

**`workout-form/ExercisePicker.tsx`**
MUI `Autocomplete` for selecting an exercise per exercise row. Fetches exercises via `useQuery` → `GET /api/exercises`. Includes a "Add new exercise" free-solo option that opens `AddExerciseDialog`.

**`workout-form/AddExerciseDialog.tsx`**
MUI `Dialog` for creating a new exercise inline. Submits via `useMutation` → `POST /api/exercises`, then invalidates the exercises cache and sets the newly created exercise on the pending exercise row.

**`workout-form/RemoveExerciseModal.tsx`**
Confirmation modal for removing an exercise row from the form. Calls `removeExercise` from `useWorkoutForm()`.

**`workout-form/TagInput.tsx`**
MUI `Autocomplete` (free-solo, multiple) for adding workout tags. Fetches existing tags via `useQuery` → `GET /api/tags` to offer autocomplete suggestions. Normalizes tag strings (strips `#`, lowercases).

**`workout-form/ExerciseHistoryModal.tsx`** (`"use client"`)
Modal showing the last 10 sessions for a given exercise. Opens via the history icon in each exercise card header. Features a lbs/kgs pill toggle (initialized from `localStorage`), a volume trend line chart (MUI X `LineChart`), and a session carousel with prev/next navigation, a sets table (Set / Weight / Reps / RPE), and indicator dots. Uses `useQuery` with `enabled: isOpen` so data is only fetched when the modal is visible. Data is typically already cached thanks to the prefetch-on-hover in `WorkoutForm`.

**`workout-form/WorkoutStats.tsx`**
Stats summary row rendered at the top of the workout form.

**`workout-form/info.ts`**
Client-side fetch/mutate helpers for the workout form: `fetchExercises`, `fetchTags`, `postExercise`, `postWorkout`, `fetchWorkout`, `putWorkout`, `fetchExerciseHistory`.

**`WorkoutList.tsx`** (`"use client"`)
History page component. Owns the shared tag filter plus a page-level `List / Graphs` toggle. In list mode it renders the saved workout accordions and exercise tables. In graph mode it fetches analytics via `GET /api/workouts/metrics`, applies graph-only date/exercise filters, and renders reusable line-chart components.

**`history/DeleteWorkoutDialog.tsx`**
Confirmation dialog for deleting a workout. Receives `open`, `isDeleting`, `onConfirm`, and `onClose` props. On confirm, calls `DELETE /api/workouts/[id]` and invalidates the workouts cache.

**`history/info.ts`**
Client-side fetch/mutate helpers for the history page: `fetchWorkouts`, `fetchTags`, `fetchExercises`, `fetchWorkoutMetrics`, `deleteWorkout`.

---

### Component Library (`app/components/component-library/`)

**`Button.tsx`**
Thin wrapper around MUI `Button`. Enforces a required `label: string` prop instead of `children`. All other `ButtonProps` are passed through.

**`Container.tsx`**
Emotion-styled `div` that renders as either `flex-direction: row` or `flex-direction: column` based on a `column` boolean prop.

**`PalettePicker.tsx`**
Color palette selector rendered in the `NavMenu` (both desktop nav and mobile drawer). Displays small color swatches for each available palette. Clicking a swatch calls `setPalette()` from `usePalette()`, which applies CSS variables and persists the choice.

**`NavMenu.tsx`** (`"use client"`)
Responsive navigation component. Desktop: horizontal link bar with a `PalettePicker`. Mobile: hamburger icon that opens an MUI `Drawer` with nav links and palette picker. Uses `usePathname` for active-link highlighting.

**`ViewToggle.tsx`**
Reusable segmented toggle built with MUI `ToggleButtonGroup`. Used by the History page to switch between `List` and `Graphs` mode without coupling the control to a specific feature.

**`charts/GraphFilters.tsx`**
Reusable graph filter bar for line-chart views. Provides date-range selection (`All`, `30d`, `90d`, `180d`) and an exercise autocomplete.

**`charts/GraphTooltipContent.tsx`**
Shared tooltip card layout used by graph tooltips to render a date title and key/value detail rows.

**`charts/LineGraph.tsx`**
Reusable wrapper around MUI X `LineChart`. Handles chart framing, empty states, item-triggered tooltips, and injected tooltip row formatting.

**`ExerciseTable.tsx`**
Responsive router component. Uses MUI `useMediaQuery` to render either `ExerciseTableDesktop` or `ExerciseTableMobile`. Threads `weightUnit` and `onToggleWeightUnit` props to both variants.

**`Desktop.tsx`**
Renders a workout's sets as a CSS grid (one row per set). Each row has inline `TextField`s for weight, reps, and RPE plus an "×" remove button. The weight column header is a clickable lbs/kgs toggle that applies display-layer conversion (form state always stays in lbs). An "+ Add Set" button sits below the table.

**`Mobile.tsx`**
Same structure as Desktop but with smaller font sizes, tighter grid columns, and compact row heights optimized for small screens. Also includes the clickable lbs/kgs weight unit toggle in the column header.

**`constants.ts`**
Defines `SET_FIELDS: SetFieldConfig[]`, the single source of truth for set input fields. Each entry contains `fieldName`, `label`, `type`, `size`, `required`, `htmlInputProps`, and `placeholder`. Both `Desktop` and `Mobile` iterate over this array, keeping field definitions in sync.

---

## API Layer

### `GET /api/exercises`

Returns all exercises ordered by name.

### `POST /api/exercises`

Creates a new exercise. Accepts `{ name, muscleGroup? }`.

### `PUT /api/exercises/[id]`

Updates an existing exercise's name and/or muscle group. Returns the updated exercise. Returns 404 if not found, 409 if the new name conflicts with an existing exercise (Prisma `P2002`).

### `DELETE /api/exercises/[id]`

Deletes an exercise by ID. Returns 204 on success. Returns 404 if not found, 409 if the exercise is currently used in any workouts (prevents orphaning workout data).

### `GET /api/exercises/[id]/history`

Returns the 10 most recent workout sessions that include the given exercise, ordered by `performedAt` descending. Each session includes the workout ID, date, and all sets (setNumber, weight, reps, rpe). Returns 404 if the exercise does not exist.

Response shape: `{ sessions: [{ workoutId, performedAt, sets: [{ setNumber, weight, reps, rpe }] }] }`

### `GET /api/tags`

Returns all tags ordered by name.

### `GET /api/workouts`

Returns all workouts in descending date order, with fully nested `workoutExercises → exercise + sets` and `tags`.

### `GET /api/workouts/metrics`

Returns precomputed analytics series for the History page graph mode. Supports tag filtering, date-range filtering, and an optional `exerciseId` for the heaviest-set trend line.

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

| Export          | Description                                                       |
| --------------- | ----------------------------------------------------------------- |
| `SetInput`      | Interface for raw set payload from request body                   |
| `ExerciseInput` | Interface for raw exercise payload from request body              |
| `WorkoutInput`  | Interface for the full workout request body                       |
| `parseReps`     | Converts `"fail"` → `-1`; validates positive integer reps         |
| `validateBody`  | Returns an array of validation error strings for a `WorkoutInput` |

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

| Interface / Type           | Description                                                       |
| -------------------------- | ----------------------------------------------------------------- |
| `Tag`                      | `{ id, name }` — DB tag record                                    |
| `Exercise`                 | `{ id, name, muscleGroup }` — DB exercise record                  |
| `SetRow`                   | `{ weight, reps, rpe }` (strings) — form-level set state          |
| `ExerciseRow`              | `{ exerciseId, sets: SetRow[] }` — form-level exercise state      |
| `SavedSet`                 | `{ id, setNumber, weight, reps, rpe }` — DB set record            |
| `SavedWorkoutExercise`     | `{ id, order, exercise, sets }` — DB join record                  |
| `SavedWorkout`             | `{ id, performedAt, notes, workoutExercises, tags }` — DB workout |
| `WorkoutFormInitialValues` | `{ date, notes, exercises, tags }` — for pre-populating edit form |
| `WeightUnit`               | `'lbs' \| 'kgs'` — weight display preference                      |
| `ExerciseHistorySet`       | `{ setNumber, weight, reps, rpe }` — set in exercise history      |
| `ExerciseHistorySession`   | `{ workoutId, performedAt, sets }` — single session in history    |
| `ExerciseHistoryResponse`  | `{ sessions: ExerciseHistorySession[] }` — API response shape     |

> **Note:** `SetRow` uses `string` types for all fields because they come directly from controlled text inputs. Parsing to numbers happens at submission time.

### `app/utils/utils.ts`

| Function                            | Description                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------------ |
| `emptySet()`                        | Returns a blank `SetRow` for initializing a new set row in the form                  |
| `emptyExercise()`                   | Returns a blank `ExerciseRow` with one empty set                                     |
| `displayReps(reps: number)`         | Converts `-1` → `"fail"`, otherwise returns the number as a string                   |
| `formatDate(iso: string)`           | Formats an ISO date string to a human-readable locale string (e.g. "Feb 27, 2026")   |
| `lbsToKgs(lbs: string)`             | Converts a weight string from lbs to kgs (× 0.453592), rounded to 1 decimal          |
| `kgsToLbs(kgs: string)`             | Converts a weight string from kgs to lbs (× 2.20462), rounded to 1 decimal           |
| `savedWorkoutToFormValues(workout)` | Converts a `SavedWorkout` to `WorkoutFormInitialValues` for pre-populating edit form |

### `app/utils/buildHeatmapData.ts`

Utility that transforms raw workout data into a heatmap-compatible format for the history view, mapping workout dates to activity intensity.

---

## Theming

The project uses a **palette-based theming** system that keeps MUI, Tailwind CSS, and raw CSS variables in sync:

- **`app/theme/palettes.ts`** — Defines a `Palette` interface with 14 color slots (bg, surface, surfaceAlt, border, accentLight, accent, badgeBg, heading, bodyText, muted, placeholder, inputBg, plus metadata like `isDark`). Ships with 4 built-in palettes: `purple` (light), `green` (light), `blue` (light), and `purple-dark` (dark). The `applyPaletteToDocument()` function writes each palette key to a `--color-*` CSS variable on `:root` and toggles the `html` `dark` class based on `palette.isDark`.
- **`app/theme/themes.ts`** — Exports `createThemeFromPalette(palette)` which builds a MUI `createTheme` object from a `Palette`, mapping palette colors to MUI's `palette.primary`, `palette.background`, typography (Nunito via `--font-nunito`), and component overrides (Paper, OutlinedInput, InputLabel, Button).
- **`app/globals.css`** — Tailwind v4 `@import "tailwindcss"` plus default `:root` CSS variables matching the default purple palette. Tailwind utilities consume `--color-background`, `--color-foreground`, etc. via `@theme inline`.
- **`contexts/PaletteContext.tsx`** — Stores the selected palette ID in `localStorage` under `paletteId`. On mount, reads the preference, applies the palette, and provides `usePalette()` (current palette + setter).
- **`contexts/ThemeRegistry.tsx`** — Reads the active palette from `usePalette()`, calls `createThemeFromPalette()`, and wraps the tree with MUI `ThemeProvider` + `CssBaseline`.
- **`PalettePicker.tsx`** — UI for selecting palettes. Renders in the `NavMenu` on both desktop and mobile. Displays color swatches for each palette; clicking one applies it instantly.

All components use CSS variables (e.g. `var(--color-accent)`, `var(--color-surface)`) for colors — no hardcoded hex values.

---

## History Graph Workflow

The History page now has a page-level `List / Graphs` toggle. `List` preserves the original saved-workout accordion view. `Graphs` switches the page into analytics mode without changing routes.

The tag filter at the top of History is shared across both modes. It keeps the existing AND semantics, so selecting multiple tags only includes workouts that contain every selected tag. In graph mode, two additional controls appear:

- Date range: `All`, `30d`, `90d`, `180d`
- Exercise selector: used by the exercise-specific trend chart

Graph mode renders two reusable line charts from the component library:

- `Workout Volume Over Time`
- `Heaviest Set Over Time`

`Workout Volume Over Time` is calculated on the server as the sum of `weight * reps` for every successful set in each filtered workout. Failed sets (`reps = -1`, shown as `fail` in the UI) are excluded from the volume total. Each tooltip shows:

- Workout date
- Total volume for that workout
- All tags attached to that workout

`Heaviest Set Over Time` uses the selected exercise and finds the heaviest successful set from each filtered workout that contains that exercise. If multiple successful sets share the same top weight, the set with the highest `setNumber` wins. Each tooltip shows:

- Workout date
- Heaviest-set weight in lbs
- Reps completed on that heaviest set

The graph UI is built from reusable component-library pieces:

- `ViewToggle` for switching History modes
- `charts/GraphFilters` for graph-only controls
- `charts/LineGraph` for the line-chart shell
- `charts/GraphTooltipContent` for chart tooltip layout

The History feature owns the filter/query orchestration and fetches analytics from `GET /api/workouts/metrics` via `app/components/history/info.ts`.

---

## Notable Patterns & Conventions

**App Router only** — No `pages/` directory. All routes live under `app/`.

**`"use client"` on all interactive components** — `WorkoutForm`, `WorkoutList`, all exercise table variants, all workout-form sub-components, `ExerciseHistoryModal`, `QueryProvider`, `ThemeRegistry`, `PaletteContext`, `NavMenu`, `WorkoutFormContext`, and `Container` all explicitly declare themselves as client components.

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

**Co-located fetch helpers (`info.ts`)** — Each feature folder (`workout-form/`, `history/`, `exercises/`) has its own `info.ts` with typed fetch/mutate functions, keeping API client code close to the components that use it.

**Weight unit toggle (display-layer)** — Form state always stores weight in lbs (the DB unit). `ExerciseTable`'s `Desktop` and `Mobile` variants convert at the display layer using `lbsToKgs()` when kgs is selected, and convert user input back to lbs via `kgsToLbs()` on change. This eliminates rounding drift, submit-time conversion, and edit-load conversion. Preference is persisted in `localStorage` under `weightUnit`.

**Prefetch on hover** — The exercise history icon button uses `queryClient.prefetchQuery` on `onMouseEnter` to load exercise history data before the user clicks. By the time the modal opens, the data is already cached and no loading spinner is shown.

**Cancel edit** — In edit mode, `WorkoutForm` renders a Cancel button alongside the Update Workout button. Clicking Cancel navigates back to `/history` via `router.push`.

**Palette system** — Replaces the old light/dark toggle. Four built-in color palettes are applied via CSS variables on `:root`. The selected palette is persisted in `localStorage` and applied on mount by `PaletteContext`. MUI theme is rebuilt from the active palette by `ThemeRegistry`.

**Exercise library page** — `/exercises` provides a dedicated CRUD interface for managing exercises outside the workout form. Supports inline editing, creation with muscle group selection, and deletion with confirmation (server prevents deleting exercises in use).
