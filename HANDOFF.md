# Handoff

## Current status
- Expo Router scaffold lives under `src/app` with routes: onboarding, journal, history, settings.
- Supabase auth + data layer wired; mock AI toggle in Settings.
- Edge Function placeholder scaffolded under `src/backend/edge-functions/ai-run-pipeline`.

## Next steps
- Create Supabase schema (`journal_sessions`, `journal_entries`, `daily_summaries`, `me_db`).
- Add proper error handling + loading states for Supabase calls.
- Implement real AI pipeline in the Edge Function.

## Tests
- Not run (no automated test suite configured).

## Artifacts
- `.env.example` for Supabase config.

## Environment
- Expo SDK 54
- Requires Supabase project URL + publishable key
