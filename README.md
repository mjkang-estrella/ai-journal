# Journal2

Text-first AI journaling app (Expo + Supabase). Users write a draft, receive an AI nudge, and complete the session to get a structured daily summary and small suggestions.

## Architecture
- Mobile: Expo + TypeScript + expo-router
- Backend: Supabase Edge Functions (TypeScript)
- Database: Supabase Postgres
- AI modules: Context Reader, Question Validator, Question Engine Orchestrator, Extractor, Advisor, ME Database

See `docs/architecture.md` and `docs/prompts-runtime.md` for module details.

## Stack (versions)
- Expo SDK 54
- React Native 0.81.x
- React 19.x
- Supabase JS 2.x

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

## Scripts
- `pnpm dev` — run Expo dev server
- `pnpm lint` — lint
- `pnpm typecheck` — typecheck

## Changelog (recent)
- Scaffolded Expo Router app under `src/`
- Added Supabase auth, data layer, AI stubs, and edge function placeholder
