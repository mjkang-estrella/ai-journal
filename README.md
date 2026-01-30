# Journal2

Text-first AI journaling app (Expo + Supabase). Users write a draft, receive a single AI nudge, and complete the session to get a structured daily summary and small suggestions.

## Product flow
1) Write a journal draft
2) Request a question (nudge)
3) Complete the session
4) Store raw text + summary in Supabase

## Architecture
- Mobile: Expo + TypeScript + expo-router
- Backend: Supabase Edge Functions (TypeScript)
- Database: Supabase Postgres
- AI modules: Context Reader, Question Validator, Question Engine Orchestrator, Extractor, Advisor, ME Database

See `docs/architecture.md` and `docs/prompts-runtime.md` for module details.

## Repo structure
- `src/app` — routes (`/onboarding`, `/journal`, `/history`, `/settings`)
- `src/features` — screen implementations
- `src/services` — AI gateway + stubs
- `src/data` — Supabase repositories
- `src/state` — app state (auth, settings, journal)
- `src/backend` — Edge Function placeholder

## Setup
1) Install dependencies
```sh
pnpm install
```

2) Configure env vars
```sh
cp .env.example .env
```
Fill in:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

3) Run the app
```sh
pnpm dev
```

### Supabase setup (required)
Create these tables (names match code):
- `journal_sessions`
- `journal_entries`
- `daily_summaries`
- `me_db`

RLS is not configured yet — add policies before using real data.

## Scripts
- `pnpm dev` — run Expo dev server
- `pnpm lint` — lint
- `pnpm typecheck` — typecheck

## Notes
- Mock AI mode is a Settings toggle so the UI works before the backend is wired.
- All source code lives under `src/` (including routes).
