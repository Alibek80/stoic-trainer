# Supabase Setup Guide

This guide will help you set up Supabase for the Stoic Trainer application.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose an organization or create one
5. Fill in the project details:
   - **Name**: stoic-trainer
   - **Database Password**: (save this securely)
   - **Region**: Choose the closest region to your users
6. Click "Create new project"
7. Wait 2-3 minutes for the project to be set up

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://your-project.supabase.co`
   - **anon/public key**: `eyJhbGc...` (long JWT token)

## Step 3: Set Up Environment Variables

1. In the `web/` directory, you'll find `.env.local.example`
2. Copy it to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

3. Open `.env.local` and replace the placeholders:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Create Database Tables

You have two options:

### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to **SQL Editor** in your Supabase project
2. Copy the contents of `web/supabase/schema.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the SQL

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push the schema
supabase db push
```

## Step 5: Verify the Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see the following tables:
   - `reflections`
   - `virtues`
   - `reframes`
   - `challenges`
   - `quotes`
   - `mood_logs`

## Step 6: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure settings:
   - **Enable email confirmations**: Optional (recommended: Disabled for development)
   - **Enable email change confirmations**: Optional
4. Save changes

## Step 7: Test the Connection

1. Start the Next.js development server:
   ```bash
   cd web
   npm run dev
   ```

2. The app should now be able to connect to Supabase!

## Troubleshooting

### "Missing Supabase environment variables"

- Make sure `.env.local` exists in the `web/` directory
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Restart the development server after changing environment variables

### "Permission denied for table"

- This usually means RLS policies aren't set up correctly
- Run the schema SQL again in Supabase SQL Editor

### "User not authenticated"

- Check that email authentication is enabled in Supabase dashboard
- Make sure you're calling `getCurrentUser()` before database operations

## Next Steps

Now that Supabase is set up, you can:

1. Implement authentication in the app (M4)
2. Start building features that save data to Supabase (M5)
3. Test the connection with sample data

For more information, see:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
