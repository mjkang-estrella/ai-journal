# Repository Guidelines

## Product intent
We are building a text-first AI journaling app. The core flow is:
- User writes a journal draft
- App asks an AI question (follow-up or new)
- User completes the session
- App extracts a structured daily summary and (later) weekly patterns
- App optionally offers 1–3 small, evidence-grounded suggestions

## Current stack (update when changed)
- Mobile: Expo (React Native)
- Language: TypeScript
- Backend: Supabase Edge Functions (TypeScript)
- Database: Supabase Postgres

## Architecture map (source of truth)
See docs/architecture.md and docs/prompts-runtime.md for the runtime AI module prompts:
- Context Reader
- Question Validator
- Question Engine Orchestrator (question DB, follow-up generator, new question generator)
- Extractor
- Advisor
- ME Database (Profile, State, Patterns, Trust Calibration)
Keep these docs updated whenever runtime behavior or module boundaries change.

## Engineering standards
- TypeScript everywhere; prefer explicit types and narrow interfaces.
- Keep features in “slices” (feature folder owns UI + state + data access).
- Prefer simple dependencies; avoid adding libraries unless needed.
- No logging of raw journal text or PII in production logs.

## Commands (keep updated)
- Install: pnpm install
- Run mobile: pnpm dev (or expo start)
- Lint: pnpm lint
- Typecheck: pnpm typecheck
- Tests: pnpm test (if present)

## Project Structure & Module Organization
Keep a clear, shallow structure:
- `src/` for application or library code
- `tests/` (or `spec/`) for automated tests
- `docs/` for design notes and specs
- `scripts/` for developer tooling
- `assets/` for static files (images, fixtures)

Keep modules focused and avoid deep nesting. Prefer one responsibility per directory.

## Coding Style & Naming Conventions
Unless a language toolchain dictates otherwise, use:
- 2‑space indentation, LF line endings, UTF‑8
- `kebab-case` for directories and non-code files
- `snake_case` or `camelCase` based on language norms for code symbols

Add a formatter/linter early (e.g., Prettier, RuboCop, Black) and treat it as authoritative.

## Testing Guidelines
- Keep tests alongside `tests/` or `spec/`
- Name tests as `*_test.ext` or `*.spec.ext`
- Ensure new features include tests and a single command runs the full suite

## Definition of done (features)
- Lint, typecheck, and relevant tests pass.
- Prompt or extraction changes are reflected in docs/architecture.md and docs/prompts-runtime.md.
- No raw journal text or PII in logs or analytics.
- User-facing copy is clear, non-judgmental, and consistent with product intent.

## Commit & Pull Request Guidelines
There is no established git history. Use Conventional Commits until a convention emerges:
- `feat:`, `fix:`, `chore:`, `docs:`

PRs should include:
- A concise summary of changes
- Test command(s) run and results
- Screenshots or recordings for UI changes

## Agent conduct

* Verify assumptions before executing commands; call out uncertainties first.
* Ask for clarification when the request is ambiguous, destructive, or risky.
* Summarize intent before performing multi-step fixes so the user can redirect early.
* Cite the source when using documentation; quote exact lines instead of paraphrasing from memory.
* Break work into incremental steps and confirm each step with the smallest relevant check before moving on.

## Agent-Specific Instructions
* Use **Context7** via MCP for up-to-date, version-specific docs.

## Security & Configuration
Never commit secrets. Use `.env` for local config and include a `.env.example` with required keys.
Do not store secrets in the mobile client. All LLM calls go through the backend.

## Privacy & data handling
- Treat journal text and derived summaries as sensitive by default.
- Store all journaling data in the backend database; local storage is only for short-lived drafts.
- Encrypt data in transit and at rest.
- Minimize retention; store only what is required for product functionality.
- Never send raw journal text to analytics or third-party telemetry.
- Use redaction or synthetic examples in logs, tests, and documentation.

## LLM safety & reliability
- Guard against prompt injection; never expose system prompts, tools, or user data.
- Validate AI questions for safety, tone, and relevance before showing to users.
- Provide a deterministic fallback when the model fails or returns unsafe output.

## State & living docs

Maintain:

* `README.md` — stable overview.
* `HANDOFF.md` — current status for continuity.

Refresh triggers: contradictions, omissions, flaky tests, or version uncertainty.

Refresh includes:

* `README.md`: purpose, architecture, stack with versions, run instructions, changelog-lite.
* `HANDOFF.md`: current status, next steps, test results, artifacts, environment details.

## Commands and checks

* Show plan before large edits.
* Capture exit codes and logs.
* Run impacted checks only:
  * lint → changed files
  * typecheck → touched modules
  * test → nearest tests, expand only if upstream failure
* Stop on failure; summarize root cause; propose smallest fix.
* If no automated checks apply, make that explicit and describe what manual validation was performed.
* After each incremental change, execute the quickest verifying command from the applicable AGENTS.md (for example, a focused test or lint target) before tackling the next task.
