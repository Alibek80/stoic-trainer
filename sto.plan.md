# PROJECT PLAN — Stoic Trainer (Next.js + Supabase + Vercel)

## Scope

- Mobile-first Next.js 15 (TypeScript) PWA
- Styling: Tailwind CSS + Framer Motion
- Data/Auth: Supabase (Postgres, Auth)
- Analytics: Mixpanel (optional Firebase Analytics later)
- Deployment: Vercel
- Offline: IndexedDB via `idb`

## File/Folder Layout

- `web/` — Next.js 15 project root
- `next.config.ts`, `tailwind.config.js`, `postcss.config.mjs`
- `src/app/`
  - `layout.tsx`, `page.tsx`, `globals.css`
  - `(tabs)/` (route groups)
    - `reflections/page.tsx`
    - `virtues/page.tsx`
    - `cognitive/page.tsx`
    - `challenges/page.tsx`
    - `quotes/page.tsx`
    - `analytics/page.tsx`
  - `components/ui/`
    - `bottom-nav.tsx`, `card.tsx`, `progress-bar.tsx`, `stepper.tsx`
  - `lib/`
    - `supabase.ts`
    - `storage.ts` (IndexedDB helpers)
    - `analytics.ts` (Mixpanel)
    - `ai.ts` (OpenAI calls)
    - `types.ts`
    - `constants.ts`
  - `hooks/` (e.g., `useAutosave.ts`, `useStreak.ts`)

## Dependencies

- UI: `next`, `tailwindcss`, `@tailwindcss/forms`, `framer-motion`, `lucide-react`
- Charts: `recharts`
- Data: `@supabase/supabase-js`, `idb`
- Utils: `zod`, `react-hook-form`, `dayjs`
- Analytics: `mixpanel-browser`
- PWA: Next.js built-in PWA capabilities

## Environment

- `.env.local` in `web/`:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MIXPANEL_TOKEN` (optional)
- `NEXT_PUBLIC_OPENAI_API_KEY`

## TASKS.md content (to be created)

- A numbered checklist with subtasks per milestone
- Use `[ ]` and `[x]` to track progress

## Milestones & Steps

### M1 — Scaffold & Tooling ✅ COMPLETED

1. ✅ Create Next.js 15 TS app in `web/`
2. ✅ Install deps (Tailwind, Framer Motion, lucide-react, recharts, supabase-js, idb, zod, react-hook-form, dayjs, mixpanel-browser)
3. ✅ Configure Tailwind (`tailwind.config.js`, `postcss.config.mjs`, `globals.css`) with Inter
4. ✅ Add base theme tokens (colors from PRD) and global styles
5. ✅ Add PWA config in Next.js + manifest
6. ✅ Add Prettier + ESLint config and scripts

### M2 — Platform Setup

1. Initialize Supabase project (dashboard)
2. Create tables: `reflections`, `virtues`, `challenges`, `quotes`, `mood_logs`
3. Policies (RLS) for user isolation; enable email auth
4. Seed default quotes (optional)
5. Create service role for server actions if needed (not for client)

### M3 — App Skeleton & Navigation ✅ COMPLETED

1. ✅ Set up Next.js App Router with route groups
2. ✅ Implement `bottom-nav.tsx` per PRD icons/labels
3. ✅ Create `card`, `progress-bar`, `stepper` components (basic styles)
4. ✅ Create screen placeholders with clean, modern design
5. ✅ Fix UI/UX issues: icons display, gradients, responsive design

### M4 — Auth & Data Layer

1. Implement `supabase.ts` and simple auth UI (email magic link)
2. Add anonymous local mode fallback (store to IndexedDB when signed out)
3. Add `storage.ts` for offline cache/sync primitives
4. Add `useAutosave` hook (localStorage->DB sync on auth)

### M5 — Features

1. Reflections (morning/evening) with stepper, autosave, write to Supabase
2. Virtues journal (4 sliders 1–5), save with date; weekly Recharts
3. Cognitive reframing: input scenario + reaction; call OpenAI for stoic reframe; typing animation; history table
4. Stoic Challenges: daily challenge, accept + checkbox; 7-day streak; history list
5. Quotes library: search by author, favorite to profile; infinite scroll
6. Analytics: mood/stress/virtues graphs, weekly summary, CSV export

### M6 — PWA & Offline

1. Configure service worker (Next.js PWA) precache routes/assets
2. Cache API responses (basic strategy) and fallback to IndexedDB
3. Basic offline banner and retry UX

### M7 — Analytics & DX

1. Mixpanel init and key events (screen_view, completed_reflection, saved_virtue, accepted_challenge)
2. Error boundaries, loading skeletons, empty states
3. Accessibility pass (touch targets ≥48px)

### M8 — Deploy

1. Push to GitHub
2. Configure Vercel project (build `npm run build`, output `out`)
3. Set env vars in Vercel
4. Test on real devices (320–430 px)

## Data Model (Supabase)

- `reflections`: id, user_id, type('morning'|'evening'), steps JSON, created_at
- `virtues`: id, user_id, wisdom, courage, justice, temperance, date
- `reframes`: id, user_id, situation, reaction, ai_response, created_at
- `challenges`: id, user_id, title, date, accepted, completed
- `quotes`: id, author, text, favorited_by array<uuid> (or junction table)
- `mood_logs`: id, user_id, mood(1–5), stress(1–5), date

## Theming & UI Tokens

- Colors: background `#F9FAFB`, accent `#F59E0B`, text `#111827`, secondary `#6B7280`
- Radius: 8px; shadows `shadow-sm`; 4pt spacing grid
- Fonts: Inter for UI; clean, modern design
- Design: Simple white cards with subtle shadows, light colored icon containers

## Acceptance Criteria (MVP)

- 6 core screens implemented and navigable via bottom nav ✅
- Auth works (email magic link) and data writes to Supabase
- Reflections autosave locally and sync when online
- Virtues weekly chart renders from DB
- Cognitive reframing calls OpenAI and stores history
- Challenges streak logic works (7 days)
- Quotes infinite scroll + favorites per user
- PWA installable; basic offline read/write
- Deployed on Vercel

### To-dos

- [x] Create TASKS.md with milestone checklist
- [x] Scaffold Next.js 15 TS app under web/ and commit
- [x] Install deps: Tailwind, Framer, lucide, recharts, supabase, idb, zod, rhf, dayjs, mixpanel
- [x] Configure Tailwind and base theme styles
- [x] Add Next.js PWA capabilities and web manifest
- [ ] Create Supabase project, tables, RLS policies
- [x] Set up routes and BottomNav skeleton
- [x] Build Card, ProgressBar, Stepper components
- [ ] Wire Supabase auth (email link) and client
- [ ] Implement IndexedDB storage helpers and autosave hook
- [ ] Build Morning/Evening reflections with autosave & sync
- [ ] Build Virtues sliders + weekly chart
- [ ] Build Cognitive reframing with OpenAI and history
- [ ] Build Stoic Challenges with streak logic
- [ ] Build Quotes library with favorites and infinite scroll
- [ ] Build Analytics dashboard and CSV export
- [ ] Configure SW caching and offline UX
- [ ] Add Mixpanel events and initialize
- [ ] Deploy to Vercel with env vars set
