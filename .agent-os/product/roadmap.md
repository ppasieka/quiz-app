# Product Roadmap

## Phase 1: MVP

**Goal:** Deliver a minimal, type-safe quiz application with authoring, taking, and grading.
**Success Criteria:** Create and take a quiz end-to-end locally; automated grading with per-question correctness; simple results summary.

### Features

- [x] Quiz authoring with validation — Ensure exactly one correct answer per question. `M`
- [x] Take quiz + instant grading — Submit answers, receive score and per-question correctness. `M`
- [x] Quiz list and details pages — Browse and view quizzes to take. `S`
- [x] Typed REST API + shared TS models — FE/BE type safety via shared package. `S`
- [x] SQLite persistence + schema — Durable storage with FK constraints. `S`
- [x] Seed script — Demo quiz for quick start. `XS`

### Dependencies

- Node.js >= 20, Express 5, Vite 5, TypeScript 5, SQLite3

## Phase 2: Engagement and Competition

**Goal:** Introduce participant identity, rankings, and difficulty to enhance engagement.
**Success Criteria:** Users can enter a display name before taking; view a ranking page per quiz; quizzes show difficulty and can be filtered.

### Features

- [ ] Participant naming and result storage — Prompt for display name; persist `{ participantName, score, quizId, timestamp }`. `M`
- [ ] Ranking page and API — New page `/quiz/:id/ranking`; endpoint `GET /api/quizzes/:id/ranking`. `M`
- [ ] Difficulty levels — Add enum field (`easy|medium|hard`), show badges, enable filters. `M`
- [ ] Shareable quiz links — Stable URLs and improved navigation. `S`
- [ ] Import/export (JSON) — Move quizzes between envs; backup content. `M`
- [ ] Basic analytics — Aggregated results (accuracy by question, attempts). `M`
- [ ] Timers and randomization — Optional time limits and shuffled questions. `M`
- [ ] Authentication (owner role) — Protect authoring; simple session flows. `L`

### Dependencies

- Database migration: add `results` table; add `quizzes.difficulty` enum.
- Update shared types and DTOs.
- UI changes: Add name capture and ranking page.
- Persistent hosting provider (TBD) for uptime and data persistence.

## Phase 3: Scale and Polish

**Goal:** Operationalize the app and improve quality.
**Success Criteria:** CI/CD pipeline, deployable container, test suite coverage for core flows.

### Features

- [ ] Automated tests — Unit and integration tests for API and UI. `M`
- [ ] CI/CD — Lint/format/test and deploy pipeline. `M`
- [ ] Dockerization — Dockerfile + container-based deployment. `M`
- [ ] Deployment target(s) — Configure hosting (app/assets/DB). `M`
- [ ] Accessibility & performance polish — A11y checks and perf audits. `S`
- [ ] Internationalization (i18n) — Framework for translations. `L`

### Dependencies

- CI provider (e.g., GitHub Actions), container registry (TBD), hosting (TBD)
