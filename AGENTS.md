# Repository Guidelines

## Project Structure & Module Organization
- Root: npm workspaces for `frontend`, `backend`, and `shared`.
- `frontend/`: React 18 + Vite + TS. Source in `src/` (entry `src/main.tsx`, routes under `src/pages/`), static `index.html`, styles in `src/styles.css`, build to `dist/`.
- `backend/`: Express 5 + TS + SQLite. Source in `src/` (`src/index.ts` server, `src/db.ts` DB), seed in `scripts/seed.ts`, build output in `dist/` (preserves folder structure, e.g., `dist/src/index.js`). SQLite file defaults to `data.sqlite`.
- `shared/`: Cross‑package types (`src/types.ts`, re‑exported via `src/index.ts`). Import via `@shared/...`.

## Build, Test, and Development Commands
- Install: `npm i`
- Dev (both): `npm run dev` (FE 5173, BE 3000)
- Frontend only: `npm run -w frontend dev`
- Backend only: `npm run -w backend dev`
- Seed DB: `npm run -w backend seed`
- Build all: `npm run build`
- Start prod backend: `npm run -w backend start`
- Preview built FE: `npm run -w frontend preview`

## Coding Style & Naming Conventions
- TypeScript strict across all packages; ESM in backend.
- Imports: use `@shared/*` for shared types.
- Indentation: 2 spaces; keep public APIs explicitly typed.
- React: functional components + hooks; Components `PascalCase`, variables `camelCase`.
- Files: components `PascalCase.tsx`; other files `kebab-case.ts`; minimal, semantic CSS.

## Testing Guidelines
- No test framework configured. If adding tests:
  - Frontend: colocate `*.test.tsx` with source files.
  - Backend: `*.test.ts` under `src/` or `tests/`.
  - Add an `npm test` script in the affected workspace; keep tests fast and deterministic.

## Commit & Pull Request Guidelines
- Commits: clear, imperative subject (e.g., `feat: add submit endpoint`). Keep scope focused; update types/docs with API or schema changes.
- PRs: include purpose, linked issues, screenshots for UI, and manual test steps (commands + expected results). Avoid unrelated refactors.

## Security & Configuration Tips
- CORS: backend allows `http://localhost:5173` by default (adjust in `backend/src/index.ts`).
- DB: set `DATABASE_FILE` to override default `data.sqlite`.
- Do not leak correct answers in any GET response; correctness only appears in submit results.

## Agent‑Specific Notes
- Change contracts by updating `shared` types first; then update backend routes and `frontend/src/api.ts` accordingly.
- After schema changes: rebuild + reseed: `npm run -w backend seed`.

