# Repository Guidelines

## Project Structure & Module Organization
- Root: npm workspaces (`frontend`, `backend`, `shared`).
- `frontend/`: React 18 + Vite + TS. Source in `src/`, entry `src/main.tsx`, routes in `src/pages/`. Static `index.html`, styles in `src/styles.css`.
- `backend/`: Express 5 + TS + SQLite. Source in `src/` (`src/index.ts` server, `src/db.ts` DB). Seed script in `scripts/seed.ts`. Compiled output in `dist/`.
- `shared/`: Cross‑package types (`src/types.ts`, re‑exported via `src/index.ts`).

## Build, Test, and Development Commands
- Install: `npm i`
- Run both (dev): `npm run dev` (FE at 5173, BE at 3000)
- Frontend only: `npm run -w frontend dev`
- Backend only: `npm run -w backend dev` (builds once, then watches)
- Backend seed: `npm run -w backend seed` (populates one demo quiz)
- Build all: `npm run build`
- Frontend preview (after build): `npm run -w frontend preview`

## Coding Style & Naming Conventions
- Language: TypeScript everywhere; strict mode enabled.
- Modules: ESM in backend (`"type":"module"`); import shared as `@shared/...`.
- Indentation: 2 spaces; avoid overly long lines; prefer explicit types for public APIs.
- React: functional components, hooks, `PascalCase` for components, `camelCase` for variables.
- Files: `kebab-case` for non-components; `*.tsx` for React, `*.ts` otherwise.
- CSS: keep minimal; prefer semantic class names.

## Testing Guidelines
- No test framework is configured. If adding tests, use the package’s workspace:
  - Frontend: place tests near source, e.g., `src/pages/QuizList.test.tsx`.
  - Backend: place tests under `src/` or `tests/`, e.g., `src/index.test.ts`.
- Name with `.test.ts`/`.test.tsx`. Keep tests fast and deterministic.

## Commit & Pull Request Guidelines
- Commits: clear, imperative subject (e.g., "Add quiz submit route"). Group related changes; avoid noisy refactors.
- Prefer Conventional Commit prefixes when helpful (`feat:`, `fix:`, `docs:`), but not required.
- PRs: include purpose, summary of changes, screenshots for UI changes, and manual test steps (commands and expected results). Link related issues.

## Security & Configuration Tips
- CORS: backend allows `http://localhost:5173` only; adjust in `backend/src/index.ts` if needed.
- DB: SQLite file defaults to `data.sqlite`; override with `DATABASE_FILE` env.
- Do not expose correct answers via API responses; grading logic returns correctness only in submit results.

