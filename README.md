# Memento

Web dashboard for the Memento Chrome extension. Capture the best things AI tells you — from Claude, ChatGPT, Gemini, and more — and organize them in one place.

## What it does

The Memento Chrome extension lets you select and save text snippets ("mementos") from AI conversations. This dashboard is where you view, organize, and revisit them.

- **Capture** — Select text blocks from any AI chat with a click or drag
- **Organize** — Create color-coded boxes to sort mementos by project, topic, or however you think
- **Revisit** — Browse compact cards with AI-generated summaries, expand to see full content, and jump back to the original conversation

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Vite + React 19 |
| Backend / DB | Supabase (Postgres, Auth, Row-Level Security) |
| AI Summaries | Claude Haiku via Supabase Edge Functions |
| Styling | Plain CSS with CSS variables, DM Sans font |
| Deploy | Vercel |

## Getting started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# Start dev server
npm run dev
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key |

For production, set these in your Vercel project settings.

## Features

- **Google OAuth** sign-in via Supabase Auth
- **Landing page** with product overview and how-it-works walkthrough
- **Dashboard** with compact memento cards showing tagline, source icon, and timestamp
- **Expandable cards** with full captured content, role-labeled as PROMPT / RESPONSE
- **Memento boxes** — color-coded categories for organizing captures
- **AI auto-summarize** — generate taglines with Claude Haiku in one click
- **Inline editing** — edit taglines directly on the card
- **Jump to source** — link back to the original AI conversation
- **Delete with confirmation** — no accidental deletions

## Project structure

```
src/
  App.jsx              Root component, auth state, routing
  App.css              All component styles
  index.css            Theme variables, reset, font
  supabase.js          Supabase client init
  main.jsx             React entry point
  components/
    Header.jsx         Sticky header with logo, nav, auth
    Landing.jsx        Landing page
    Dashboard.jsx      Dashboard with memento list and boxes
supabase/
  functions/
    generate-tagline/  Edge function for AI-powered tagline generation
migrations/
  001_boxes_and_taglines.sql
```
