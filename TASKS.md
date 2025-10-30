# TASKS — Stoic Trainer (Next.js + Supabase + Vercel)

Track progress by checking items as you complete them. Keep tasks short and actionable.

## M1 — Scaffold & Tooling ✅ COMPLETED
- [x] Create Next.js 15 TS app in `web/`
- [x] Install deps (Tailwind, Framer Motion, lucide-react, recharts, @supabase/supabase-js, idb, zod, react-hook-form, dayjs, mixpanel-browser)
- [x] Configure Tailwind (`tailwind.config.js`, `postcss.config.mjs`, `src/app/globals.css`) with Inter
- [x] Add base theme tokens and global styles
- [x] Add PWA capabilities for Next.js
- [x] Add Prettier + ESLint config
- [x] Clean up old Vite project files

## M2 — Platform Setup ✅ COMPLETED
- [x] Create `lib/supabase.ts` with client initialization and helper functions
- [x] Create `lib/types.ts` with TypeScript interfaces for all data models
- [x] Create `lib/constants.ts` with app constants (virtues, reflection steps, etc.)
- [x] Create `supabase/schema.sql` with complete database schema
- [x] Create `.env.local.example` with environment variable templates
- [x] Create `SUPABASE_SETUP.md` with detailed setup instructions
- [x] User initialized Supabase project (dashboard)
- [x] User created tables using `supabase/schema.sql`
- [x] User set up environment variables in `.env.local`

## M3 — App Skeleton & Navigation ✅ COMPLETED
- [x] Set up Next.js App Router with route groups
- [x] Implement `components/ui/bottom-nav.tsx` with icons/labels
- [x] Create `card`, `progress-bar`, `stepper` components (basic)
- [x] Create screen placeholders: Dashboard, Reflections, Virtues, Cognitive, Challenges, Quotes, Analytics
- [x] Fix UI/UX issues: icons display, gradients, responsive design
- [x] Implement clean, modern design with proper icon containers

## M4 — Auth & Data Layer ✅ COMPLETED
- [x] Create `lib/storage.ts` with IndexedDB helpers for offline storage
- [x] Create `hooks/useAutosave.ts` for autosaving and local->DB sync
- [x] Create `contexts/auth-context.tsx` for auth state management
- [x] Create `components/auth/auth-form.tsx` for email authentication UI
- [x] Create `components/providers.tsx` for wrapping app with context providers
- [x] Create `app/auth/page.tsx` and `app/auth/callback/page.tsx` for auth flow
- [x] Update root layout to include AuthProvider

## M5 — Features ✅ COMPLETED
- [x] Reflections: stepper, autosave, write to Supabase
- [x] Virtues journal: 4 sliders 1–5; recent history
- [x] Cognitive reframing: form + history; Supabase storage
- [x] Stoic Challenges: create; accept/complete toggles; list
- [x] Quotes: search by author; favorites per user
- [x] Quotes import: fetch JSON, translate to RU, store categories
- [x] Analytics: weekly virtues bars; reflections counts

## M6 — PWA & Offline ⏸ POSTPONED
- [ ] Configure service worker (Next.js PWA) precache
- [ ] Cache API responses; fallback to IndexedDB
- [ ] Offline banner and retry UX

## M7 — Analytics & DX ✅ COMPLETED
- [x] Mixpanel init and key events
- [x] Error boundaries, loading skeletons, empty states
- [x] Accessibility pass (touch targets ≥48px)

## M8 — Deploy
- [ ] Push repo to GitHub
- [ ] Connect repo to Vercel (root: `web/`)
- [ ] Set env vars in Vercel (Prod + Preview)
- [ ] Configure Supabase Auth redirect (Vercel domain)
- [ ] Deploy and run smoke test

## Technology Stack Changes
- ✅ **Migrated from Vite to Next.js 15**: Better SSR, built-in PWA, App Router
- ✅ **Updated file structure**: `web/src/app/` with route groups
- ✅ **Simplified design**: Clean white cards, light colored icon containers
- ✅ **Fixed UI issues**: Proper icon alignment and responsive design