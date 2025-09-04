# Tech Stack

Project‑specific technology choices for this repository. Keep dependencies minimal, TypeScript strict, and builds fast.

## Runtime & Tooling
- Node.js: 20+ (tested on v23)
- Language: TypeScript (strict in all packages)
- Package manager: npm workspaces
- Formatting: Prettier (scripts: `format`, `format:check`)

## Workspace Layout
- Frontend: React 18 + Vite + TS (`frontend/`)
- Backend: Express 5 + TS (`backend/`)
- Shared types: TypeScript package (`shared/`) consumed via `@shared/*`

## Frontend (Vite + React)
- Router: `react-router-dom` (routes: `/`, `/create`, `/quiz/:id`, `/quiz/:id/summary`)
- Styling: plain CSS (no UI framework); modern, accessible components
- Dev server: Vite, port 5173, proxy `/api` → `http://localhost:3000`
- Build: `tsc` type check + `vite build`

## Backend (Express + SQLite)
- HTTP: Express 5 (ESM), CORS enabled for `http://localhost:5173`
- Persistence: SQLite via `sqlite` + `sqlite3` (no ORM)
- DB init/migrate: `backend/src/db.ts` (runs on first open)
- Seed: `backend/scripts/seed.ts` (demo quiz)
- Env: `PORT` (default 3000), `DATABASE_FILE` (default `data.sqlite`)
- Dev: build first, then `tsc -w` + `node --watch dist/src/index.js`
- Build: `tsc` emits to `backend/dist/` (preserving folder structure)

## Shared Types
- `shared/src/types.ts` exports API contracts: Quiz/Question/Choice DTOs, Submit payload/result
- Consumption: type‑only imports in backend, direct imports in frontend via alias

## Minimal Dependencies
- Frontend: `react`, `react-dom`, `react-router-dom`, `vite`
- Backend: `express`, `cors`, `sqlite`, `sqlite3`
- Dev: `typescript`, `concurrently`, `prettier`, `@types/*`

## Constraints & Security
- No auth or profiles (demo scope)
- Do not expose correct answers in GET endpoints (only during grading)
- Keep additional libraries to a minimum; prefer simple, explicit code
