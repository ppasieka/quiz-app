# Quiz App (TS React + Express + SQLite)

A modern, minimal monorepo starter for a quiz application.

- Frontend: React 18, Vite, TypeScript 5
- Backend: Express 5 (TS), SQLite via `sqlite` + `sqlite3`
- Shared: TypeScript types shared between FE/BE

Minimal deps: React, react-router-dom, Express, sqlite/sqlite3, cors, typescript (and concurrently to run both apps). Type packages are dev-only.

## Repository Layout

- `frontend/` – Vite + React + TS
- `backend/` – Express + TS + SQLite
- `shared/` – Shared TypeScript types

## Prerequisites

- Node.js 20+
- npm 10+ (comes with Node)

## Quick Start (npm)

```bash
npm i
npm run -w backend seed          # initialize DB with one demo quiz
npm run dev                      # runs FE (5173) + BE (3000)
```

If you prefer two terminals instead of `concurrently`:

```bash
# Terminal 1
npm run -w backend dev

# Terminal 2
npm run -w frontend dev
```

Backend will be available at `http://localhost:3000`, and frontend at `http://localhost:5173`.

## Scripts

- Root
  - `npm run build` – builds all workspaces
  - `npm run dev` – runs FE + BE together
  - `npm run dev:fe` – frontend dev only
  - `npm run dev:be` – backend dev only
- Backend (`backend/`)
  - `npm run dev` – prebuild once, then watch (`tsc -w`) and run Node with watch
  - `npm run build` – type check and emit to `dist/` (preserves folder structure)
  - `npm run start` – run compiled server (`node dist/src/index.js`)
  - `npm run seed` – build then seed demo quiz (`dist/scripts/seed.js`)
- Frontend (`frontend/`)
  - `npm run dev` – Vite dev server (proxies `/api` to `http://localhost:3000`)
  - `npm run build` – type check and Vite build
  - `npm run preview` – preview built app

## API

Base URL: `http://localhost:3000/api`

- `GET /quizzes` → `200 QuizSummary[]`
  - `QuizSummary`: `{ id, title, description?, questionCount }`
- `POST /quizzes` (CreateQuizDTO) → `201 { id: number }`
  - `CreateQuizDTO`:
    ```ts
    {
      title: string;
      description?: string;
      questions: Array<{ text: string; choices: Array<{ text: string; isCorrect: boolean }> }>;
    }
    ```
- `GET /quizzes/:id` → `200 Quiz`
  - Includes questions and choices; correctness is NOT exposed (server returns `isCorrect: false` for all choices).
- `POST /quizzes/:id/submit` (SubmitQuizDTO) → `200 SubmitResultDTO`
  - `SubmitQuizDTO`:
    ```ts
    { answers: Array<{ questionId: number; choiceId: number }> }
    ```
  - `SubmitResultDTO`:
    ```ts
    { score: number; total: number; perQuestion: Array<{ questionId: number; correct: boolean; correctChoiceId: number }> }
    ```

## Data Model (SQLite)

Tables:

- `quizzes(id PK, title TEXT NOT NULL, description TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`
- `questions(id PK, quiz_id FK, text TEXT NOT NULL, ord INTEGER NOT NULL)`
- `choices(id PK, question_id FK, text TEXT NOT NULL, is_correct INTEGER NOT NULL DEFAULT 0, ord INTEGER NOT NULL)`

On create, server validates there’s exactly one `is_correct` per question.

## Security & Privacy

- Demo only; no authentication.
- Server does not expose which choice is correct in `GET /api/quizzes/:id`.

## Notes

- Strict TypeScript across packages.
- ES modules in the backend (`"type": "module"`).
- Path alias `@shared/*` set in TS configs and Vite alias for FE.
- Vite dev server proxies `/api` → `http://localhost:3000`.
- Override DB path with `DATABASE_FILE` env; default is `data.sqlite`.
