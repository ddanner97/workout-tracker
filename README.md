# Workout Tracker

A full-stack workout logging app built for lifters who want to track progressive overload over time — not just log sets - providing real time flexibilty to create your workouts on the fly.

🔗 **[Live App](#)** ← replace with your Vercel URL

---

## Tech Stack

| Layer         | Technology               |
| ------------- | ------------------------ |
| Framework     | Next.js 16 (App Router)  |
| Language      | TypeScript 5             |
| Auth          | Better Auth              |
| UI            | MUI v7 + Tailwind CSS v4 |
| Data Fetching | TanStack React Query v5  |
| ORM           | Prisma v6                |
| Database      | PostgreSQL               |
| Charts        | MUI X Charts             |
| Deployment    | Vercel                   |

---

## Features

- **Workout logging** — Log exercises, sets, weight, reps, and RPE in a dynamic form with inline exercise creation
- **User authentication** — Secure sign-up/login with per-user data isolation via Better Auth
- **Progressive overload tracking** — View your heaviest set and total volume over time per exercise
- **Exercise history** — Per-exercise session history modal with a volume trend line chart, accessible inline while logging
- **Analytics graphs** — History page graph mode with date range filtering, tag filtering, and exercise-specific trend lines
- **Responsive design** — Fully optimized layouts for desktop and mobile with a themeable palette system (4 built-in color palettes)
- **lbs / kgs toggle** — Display-layer unit conversion with preference persisted to localStorage; DB always stores in lbs

---

## Notable Technical Decisions

**Display-layer unit conversion** — Weight is always stored in lbs in the database. The lbs/kgs toggle converts at render time using `lbsToKgs()` / `kgsToLbs()`, eliminating rounding drift and submit-time conversion bugs.

**Reps sentinel value** — "Failure" sets (where the lifter couldn't complete a full rep) are stored as `-1` in the DB. `displayReps()` and `parseReps()` handle conversion at both ends, keeping the data model clean without a separate boolean column.

**Prefetch on hover** — The exercise history modal prefetches session data on `mouseEnter` via `queryClient.prefetchQuery`, so by the time the modal opens the data is already cached and no loading spinner is shown.

**Form state via context** — `WorkoutFormContext` centralizes all form state and mutators, making `WorkoutForm` stateless and reusable for both create and edit flows without prop drilling.

**Responsive component splitting** — Rather than CSS media queries, `ExerciseTable` uses MUI's `useMediaQuery` hook to render entirely separate `Desktop` and `Mobile` components, each layout-optimized for its target screen size.

---

## Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/workout-tracker.git
cd workout-tracker

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your DATABASE_URL and Better Auth secrets

# 4. Run migrations and seed the database
npx prisma migrate dev
npx prisma db seed

# 5. Start the dev server
npm run dev
```

App runs at `http://localhost:3000`

---

## Documentation

For a full technical breakdown of the architecture, API layer, data model, component library, and theming system see [DOCUMENTATION.md](./DOCUMENTATION.md).
