# AGENTS.md

## Core Principles

- Make the **smallest correct change**
- Follow **existing patterns in nearby files**
- Prefer **consistency over cleverness**
- Do not introduce new architecture unless asked

---

## Project Context

- Next.js App Router (no `pages/`)
- React 19 + TypeScript
- MUI + Tailwind (both are intentional)
- React Query for server state
- Prisma + PostgreSQL

---

## File Placement Rules

- Feature logic stays in its **feature folder**
- Reusable UI → `app/components/component-library/`
- API helpers → **`info.ts` in the same feature folder**
- Shared types → `app/types/types.ts`
- Shared utils → `app/utils/utils.ts`
- Context → `app/components/contexts/`

Do not move files across layers unless necessary.

---

## Fetching + API Rules

- Do NOT scatter raw `fetch()` calls in components
- Always create helpers in `info.ts` when reusable

Pattern:

```ts
export async function deleteWorkout(id: string): Promise<void> {
  const res = await fetch(`/api/workouts/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete workout');
}
```

- Return parsed JSON unless no body
- Throw on non-OK responses
- Keep helpers small and typed

---

## React Query Rules

- Use stable query keys:
  - `["workouts"]`
  - `["tags"]`
  - `["exercises"]`
  - `["workout", id]`
- After mutations:
  - Always invalidate relevant queries
  - Do NOT over-invalidate

---

## Component Rules

- Keep components small and focused
- Prefer composition over large components
- Do not add `"use client"` unless required

Use `"use client"` when:

- hooks
- MUI interactivity
- React Query
- browser APIs

---

## State Management

- Prefer local state first
- Use `WorkoutFormContext` ONLY for workout form

Avoid:

- unnecessary `useEffect`
- duplicated derived state

Use:

- `useMemo` → expensive derived values only
- `useCallback` → only when needed

---

## Form Rules (CRITICAL)

- `WorkoutFormContext` is the source of truth
- Do not duplicate form state elsewhere

---

## Reps Convention (DO NOT BREAK)

- UI: `"fail"`
- DB: `-1`

Always use:

- `displayReps()`
- `parseReps()`

---

## Tags

Before sending to API:

- remove `#`
- trim
- lowercase
- dedupe

Do not change this behavior.

---

## Exercises + Sets

- Preserve ordering (`order`, `setNumber`)
- Do not break Prisma constraints
- New logic must respect current structure

---

## API Rules

- Validate at the API boundary
- Reuse `shared.ts` for workouts
- Use proper HTTP status codes
- Do not silently fail

---

## Prisma

- Always use singleton (`src/lib/prisma.ts`)
- Never instantiate new clients

---

## UI + Styling

- Do NOT replace MUI or Tailwind
- Keep both working together

### Theming

Must stay synced:

- MUI theme
- `html.dark`
- localStorage

Do not introduce a new theme system.

### Responsive Pattern

Keep `ExerciseTable` split:

- Desktop
- Mobile

Do NOT merge into one layout.

`SET_FIELDS` is the single source of truth.

---

## TypeScript Rules

- No `any`
- Prefer explicit types
- Reuse shared types
- Keep form types separate from DB types

### Naming

- Components → `PascalCase`
- Functions → `camelCase`
- Use action names:
  - `fetchWorkout`
  - `postWorkout`
  - `putWorkout`
  - `deleteWorkout`

---

## Editing Rules

When modifying code:

- Do NOT refactor unrelated code
- Do NOT introduce new abstractions unless needed
- Do NOT move large blocks across files

When adding features:

1. Check existing patterns
2. Reuse feature structure
3. Add helpers to `info.ts` if needed

---

## Testing / Verification

After changes, ensure:

- app builds
- TypeScript passes
- lint passes
- create workout works
- edit workout works
- delete workout works
- React Query invalidation works
- mobile + desktop layouts still work

---

## Hard Constraints (DO NOT VIOLATE)

- Do not break `"fail"` ↔ `-1`
- Do not bypass API validation
- Do not put Prisma in client code
- Do not duplicate fetch logic unnecessarily
- Do not replace `WorkoutFormContext`
- Do not add unnecessary `useEffect`

---

## Agent Workflow

Always:

1. Read nearby files first
2. Match existing patterns
3. Keep diffs small
4. Update `info.ts` when touching API logic
5. Preserve query invalidation
6. Preserve responsive behavior

If unclear: → choose the simplest, most consistent solution
