## Stoic Trainer — Mobile-first Stoicism coach

Daily stoic practices to build resilience, mindfulness, and rational thinking.


### Features (MVP)
- Reflections: morning/evening steps with autosave and Supabase storage
- Virtues journal: 4 sliders (1–5), daily save, recent history
- Cognitive reframing: situation → reaction → rational response, history
- Stoic challenges: create daily challenge, accept/complete toggles
- Quotes: search by author, favorites; import + RU translation via OpenAI
- Analytics: last 7 days for virtues, reflection counts

### Tech Stack
- Frontend: Next.js 15 (App Router, TypeScript), React 18
- Styling: Tailwind CSS, mobile-first
- Backend: Supabase (Postgres + RLS, Auth)
- Data: IndexedDB helpers for offline/autosave
- Analytics: Mixpanel (browser)
- AI: OpenAI API for quote translation (server-side)
- Deploy: Vercel

### Project structure
- `web/src/app/` — routes (tabs, auth, api), layouts
- `web/src/components/` — UI, providers, error boundary
- `web/src/contexts/` — auth context
- `web/src/lib/` — supabase client + helpers, analytics, constants
- `web/src/hooks/` — `useAutosave`
- `web/supabase/schema.sql` — DB schema and policies

### Environment variables
Create `web/.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_MIXPANEL_TOKEN=...
# Optional (EU projects)
NEXT_PUBLIC_MIXPANEL_API_HOST=https://api-eu.mixpanel.com
```

### Development
```bash
cd web
npm install
npm run dev
# http://localhost:3000
```

Supabase setup instructions: see `web/SUPABASE_SETUP.md`.
Vercel deployment steps: see `web/VERCEL_SETUP.md`.

### Notes
- Auth uses magic link. Add your domain to Supabase Auth redirect URLs.
- Quotes seeding/translation endpoints:
  - `POST /api/seed-quotes` — import + translate (uses OPENAI_API_KEY if set)
  - `POST /api/translate-missing` — translate existing English quotes
- Admin seeding UI: `/admin/seed`


