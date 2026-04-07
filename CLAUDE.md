# Capture Brick Web Dashboard

## Project overview
Web dashboard for the Capture Brick Chrome extension. The extension captures text snippets from AI tools (Claude, ChatGPT, Gemini, etc.) and saves them to Supabase. This dashboard lets users view and eventually organize those snippets.

## Stack
- **Frontend:** Vite + React
- **Backend/DB:** Supabase (Postgres + Auth)
- **Deploy:** Vercel

## Supabase
- Project URL: https://qzuqjnawcwvrhfafeypu.supabase.co
- Auth: Google OAuth (provider already configured in Supabase dashboard)
- Row-level security is enabled — users only see their own rows

## Database schema
```sql
captures (
  id          uuid primary key,
  user_id     uuid references auth.users,
  text        text,        -- the captured snippet
  url         text,        -- source page URL
  created_at  timestamptz
)
```

## Environment variables
Never committed. Set in `.env.local` for local dev and in Vercel project settings for production.
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

## Current features
- Google OAuth sign-in via Supabase Auth
- Single page listing all captures newest-first (text + source URL + timestamp)

## Roadmap / future work
- Organizing captures: the core next problem. Snippets need to be sortable, filterable, or groupable — likely by source (which AI tool), by topic/tag, or by date range. No schema changes have been made yet for this.
- The `captures` table may need tags, collections, or a category field once organization is scoped out.

## Auth flow
- Sign in via `supabase.auth.signInWithOAuth({ provider: 'google' })`
- Redirect URL must be whitelisted in Supabase → Auth → URL Configuration
- After Vercel deploy, add the production URL there
