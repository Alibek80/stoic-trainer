## Deploy to Vercel — Stoic Trainer

### 1) Requirements
- GitHub repo with this project pushed (root contains `web/` app)
- Vercel account
- Supabase project (URL + anon key)

### 2) Project on Vercel
1. Import GitHub repo in Vercel
2. Framework Preset: Next.js
3. Root directory: `web`
4. Build command: `npm run build`
5. Output: `.next`

### 3) Environment variables (Production)
Set in Vercel → Project → Settings → Environment Variables:
- NEXT_PUBLIC_SUPABASE_URL = https://XXXX.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
- OPENAI_API_KEY = sk-...
- NEXT_PUBLIC_MIXPANEL_TOKEN = your-mixpanel-token
- (optional EU) NEXT_PUBLIC_MIXPANEL_API_HOST = https://api-eu.mixpanel.com

Tip: Add the same to Preview env for preview builds.

### 4) Supabase config
- SQL schema already in `supabase/schema.sql`
- In Supabase dashboard: confirm tables and RLS policies applied
- Auth redirect: add your Vercel domain to Allowed URLs (Auth → URL Configuration)
  - `https://YOUR_DOMAIN.vercel.app/auth/callback`

### 5) Domains and CORS
- Ensure Supabase Project Settings → Auth → Redirect URLs include your Vercel domain

### 6) Deploy
- Click Deploy in Vercel
- After deploy, test:
  - Sign-in via magic link
  - Create reflection, virtues entry
  - Reframe save
  - Challenge create + toggle
  - Quotes search + favorite

### 7) Troubleshooting
- 500 on auth pages: check env vars in Vercel
- Supabase invalid URL: ensure full https URL
- Mixpanel no events: set token (and EU api host if needed)


