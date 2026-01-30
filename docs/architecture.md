# Architecture

## Purpose

This repo builds a text-first AI journaling app. The user writes a journal entry during a session, the system asks occasional questions (“nudges”), and when the session completes the system produces a structured daily summary and optional small suggestions.

Audio is explicitly out of scope for the MVP.

## Goals

- Fast journaling experience that feels lightweight.
- “Nudges” that are:
  - optional (non-blocking),
  - concise,
  - grounded in the user’s own text,
  - not overly proactive unless user opts in.
- Session completion produces:
  - structured daily summary,
  - detected signals (energy/stress/avoidance patterns),
  - ME Database updates (profile/state/patterns/trust calibration),
  - optional 0–3 tiny suggestions.
- Cloud-first: all journaling data is stored in the backend database.

## Non-goals for MVP

- Audio capture and real-time streaming.
- Calendar/email integrations (we’ll stub the interfaces).
- Full multi-device sync conflict resolution (we’ll design the data model to support it later).

## High-level system overview

### Components

1) **Mobile app (Expo + TypeScript)**
- UI flows: onboarding, journaling session, history, settings.
- Remote persistence: Supabase Postgres (source of truth).
- Local draft cache is allowed for UX, but not the primary store.

2) **Backend AI Gateway**
- Single responsibility: handle LLM calls and pipeline orchestration.
- Keeps API keys and model routing out of the mobile client.
- Produces strict JSON outputs that are schema-validated.

3) **Persistence**
- Supabase Postgres is the source of truth for all journaling data.
- Store raw journal text and derived artifacts (summaries, ME DB) in the database.

4) **Runtime AI modules (conceptual)**
- Context Reader
- Question Validator
- Question Engine Orchestrator
  - Question Database
  - Follow-up Generator
  - New Question Generator
- Extractor
- Advisor
- ME Database
  - Profile
  - State
  - Patterns
  - Trust Calibration
- External Context (future)
  - Calendar Events
  - Email metadata

### Data flow

```mermaid
flowchart LR
  A[User Draft Text] --> B[Context Reader]
  B --> C[Question Validator]
  C --> D[Question Engine Orchestrator]
  D --> E[AI Question shown in UI]
  A --> F[Extractor on Complete]
  F --> G[Daily Summary + ME Updates]
  G --> H[Advisor Suggestions]
  H --> I[UI shows Summary + Suggestions]
  G --> J[(Supabase DB)]
  E --> J
  A --> J
  ```

## Key concepts
- Session: a journaling interaction with start/end time.
- Draft: current editable text in the session.
- AI Question (Nudge): a single question shown to the user; should never block typing.
- Chunk: a snapshot of text at certain times (optional); useful for later “evidence” and debugging.
- Daily Summary: structured extraction from the final draft.
- ME Database: user personalization state (profile/state/patterns/trust calibration).

## Mobile app architecture

### Screens
- `/onboarding`
  - capture basic profile & boundaries (tone, proactivity, topics to avoid).
- `/journal`
  - date header, draft editor, nudge dock, “Next question”, “Complete”.
- `/history`
  - list sessions + open summary.
- `/settings`
  - trust/proactivity controls, export/delete, debug toggles.

### State management (recommended)
- **Session state** (local store): current sessionId, current draft text, last question, questions history, whether the last question is answered.
- **Data state** (React Query): history list, session details, summaries, ME DB read/write.
- **Persistence**: Supabase client with typed queries and a small local cache for drafts.

### Session State Machine

```mermaid
stateDiagram-v2
  [*] --> Drafting
  Drafting --> QuestionShown: user requests next OR pause heuristic (optional)
  QuestionShown --> Drafting: user continues typing
  QuestionShown --> AnswerDetected: validator returns answered=true
  AnswerDetected --> QuestionShown: follow-up/new question
  Drafting --> Completed: user taps Complete
  QuestionShown --> Completed: user taps Complete
  Completed --> [*]
```
Notes:
- MVP can trigger questions only via a button (“Next question”).
- Later you can add a pause-based heuristic (e.g., 2–4 seconds idle) if desired.

## Database schema (Supabase Postgres)

Keep schema simple and evolve later. Suggested tables:

### `journal_sessions`
- id (uuid)
- user_id (uuid)
- started_at (iso)
- ended_at (iso, nullable)
- status (draft | completed)
- mode (text | voice future)
- title (nullable; derived later)

### `journal_entries`
- id (uuid)
- session_id (uuid)
- created_at (iso)
- text (string)
- source (user | ai) — optional if you store AI messages too

### `session_questions`
- id (uuid)
- session_id (uuid)
- created_at (iso)
- question (string)
- coverage_tag (string)
- status (shown | answered | ignored)
- answered_text (nullable)

### `daily_summaries`
- session_id (uuid)
- created_at (iso)
- summary_json (string JSON)

### me_db
- user_id (uuid)
- profile_json (string JSON)
- state_json (string JSON)
- patterns_json (string JSON)
- trust_json (string JSON)
- updated_at (iso)

## Backend architecture (Supabase + TypeScript)

### Why a backend even for MVP
- Avoid shipping model keys to client.
- Centralize prompt templates, schemas, and safety logic.
- Enable consistent behavior across clients and future platforms.

### Endpoint contract
We can start with a single endpoint (Supabase Edge Function):

`POST /ai/runPipeline`

Use mode to indicate which pipeline stage you want.

Request:
```json
{
  "mode": "next_question",
  "sessionId": "uuid",
  "draftText": "string",
  "askedQuestions": ["string"],
  "lastQuestion": "string|null",
  "meDb": {
    "profile": {},
    "state": {},
    "patterns": {},
    "trust": {}
  }
}
```

Response (next question):
```json
{
  "nextQuestion": {
    "question": "string",
    "coverageTag": "events|emotions|meaning|actions|commitments|friction|wins",
    "whyThisNow": "string"
  },
  "validator": {
    "answered": false,
    "evidence": []
  },
  "debug": {
    "usedFallback": false
  }
}
```

Request (complete session):
```json
{
  "mode": "complete_session",
  "sessionId": "uuid",
  "finalText": "string",
  "meDb": { "profile": {}, "state": {}, "patterns": {}, "trust": {} }
}
```

Response (completion):
```json
{
  "extracted": {
    "dailySummary": { "headline": "string", "bullets": ["string"] },
    "signals": [],
    "meDbUpdates": {},
    "followUpsForTomorrow": []
  },
  "advice": {
    "suggestions": []
  }
}
```

## Validation and fallbacks
- All backend responses must be schema-validated.
- If the model returns invalid JSON or violates schema:
  - fallback to safe defaults (e.g., pick from Question Database),
  - log a sanitized error (no raw user text),
  - return debug.usedFallback = true.

## Observability
- Client: Sentry for crashes, PostHog/Amplitude for events.
- Backend: structured logs (request id, mode, latency, fallback flags) without raw text.

## Future extensions
- Audio mode: native audio module + real-time pipeline; keep current service boundaries.
- External Context: add ingestion interfaces and user-granted scopes.
- Weekly patterns: scheduled job to aggregate daily summaries -> weekly pattern artifact.
