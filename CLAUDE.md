# Memento Web Dashboard

## Project overview
Web dashboard for the Memento Chrome extension. The extension captures text snippets ("mementos") from AI tools (Claude, ChatGPT, Gemini, etc.) and saves them to Supabase. This dashboard lets users view, organize, and manage those mementos.

## Stack
- **Frontend:** Vite + React 19
- **Backend/DB:** Supabase (Postgres + Auth + RLS)
- **Styling:** Plain CSS with CSS variables (DM Sans font)
- **Deploy:** Vercel

## Supabase
- Project URL: https://qzuqjnawcwvrhfafeypu.supabase.co
- Auth: Google OAuth (provider configured in Supabase dashboard)
- Row-level security enabled — users only see their own rows

## Database schema
```sql
captures (
  id          uuid primary key,
  user_id     uuid references auth.users,
  text        text,
  blocks      jsonb,       -- array of { text, role }
  source_text text,        -- first 80 chars for jump-to-source
  url         text,
  tagline     text,        -- short summary (manual or AI-generated)
  box_id      uuid references memento_boxes(id) on delete set null,
  created_at  timestamptz
)

memento_boxes (
  id          uuid primary key,
  user_id     uuid references auth.users,
  name        text,
  color       text,        -- hex color
  created_at  timestamptz
)
```

## Environment variables
Set in `.env.local` for local dev and in Vercel project settings for production.
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

## File structure
```
src/
  App.jsx            - Root component, auth state, view routing
  App.css            - All component styling
  index.css          - Theme variables, reset, font
  supabase.js        - Supabase client init
  main.jsx           - React entry point
  components/
    Header.jsx       - Sticky header with logo, nav, auth
    Landing.jsx      - Landing page (hero, how-it-works, crossover)
    Dashboard.jsx    - Dashboard (memento list, boxes, drag-to-sort)
migrations/
  001_boxes_and_taglines.sql - DB migration for boxes + taglines
```

## Theme
Based on the Chrome extension's visual identity:
- **Charcoal:** #292524, #44403c (primary dark)
- **Green accent:** #4aba6a (from extension bookmark icon)
- **Stone palette:** warm grays for text, borders, backgrounds
- **Font:** DM Sans (Google Fonts)

## Key features
- Google OAuth sign-in via Supabase Auth
- Landing page explaining the product and extension
- Dashboard with compact memento cards (tagline + source + time)
- Expand cards to see full captured content with role coloring
- Memento boxes: color-coded categories for organizing
- Drag mementos onto box chips to categorize
- Double-click taglines to edit inline
- Delete with confirmation modal

## Auth flow
- Sign in via `supabase.auth.signInWithOAuth({ provider: 'google' })`
- Redirect URL must be whitelisted in Supabase > Auth > URL Configuration
- After Vercel deploy, add the production URL there
