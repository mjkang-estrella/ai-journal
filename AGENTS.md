# Repository Guidelines

## Product intent
We are building a text-first AI journaling app. The core flow is:
- User writes a journal draft
- App asks an AI question (follow-up or new)
- User completes the session
- App extracts a structured daily summary and (later) weekly patterns
- App optionally offers 1–3 small, evidence-grounded suggestions

## Architecture map (source of truth)
See docs/architecture.md and docs/prompts-runtime.md for the runtime AI module prompts:
- Context Reader
- Question Validator
- Question Engine Orchestrator (question DB, follow-up generator, new question generator)
- Extractor
- Advisor
- ME Database (Profile, State, Patterns, Trust Calibration)

## Engineering standards
- TypeScript everywhere; prefer explicit types and narrow interfaces.
- Keep features in “slices” (feature folder owns UI + state + data access).
- Prefer simple dependencies; avoid adding libraries unless needed.
- Do not store secrets in the mobile client. All LLM calls go through the backend.
- No logging of raw journal text or PII in production logs.

## Commands (keep updated)
- Install: pnpm install
- Run mobile: pnpm dev (or expo start)
- Lint: pnpm lint
- Typecheck: pnpm typecheck
- Tests: pnpm test (if present)

## Project Structure & Module Organization
This repository is currently a skeleton with only this guide. As code is added, keep a clear, shallow structure:
- `src/` for application or library code
- `tests/` (or `spec/`) for automated tests
- `docs/` for design notes and specs
- `scripts/` for developer tooling
- `assets/` for static files (images, fixtures)

Keep modules focused and avoid deep nesting. Prefer one responsibility per directory.

## Build, Test, and Development Commands
No build or test runner is configured yet. When you add one, expose the primary workflows via a single entry point (e.g., `Makefile` or `package.json` scripts) and document them here. Example commands to standardize on:
- `make dev` or `npm run dev` — run locally
- `make test` or `npm test` — run the test suite
- `make lint` or `npm run lint` — run style checks

## Coding Style & Naming Conventions
Unless a language toolchain dictates otherwise, use:
- 2‑space indentation, LF line endings, UTF‑8
- `kebab-case` for directories and non-code files
- `snake_case` or `camelCase` based on language norms for code symbols

Add a formatter/linter early (e.g., Prettier, RuboCop, Black) and treat it as authoritative.

## Testing Guidelines
No test framework is set yet. When you add one:
- Keep tests alongside `tests/` or `spec/`
- Name tests as `*_test.ext` or `*.spec.ext`
- Ensure new features include tests and a single command runs the full suite

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
