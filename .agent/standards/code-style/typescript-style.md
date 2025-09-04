# TypeScript Style Guide

## Imports & Modules
- Use ES Modules with explicit extensions in local imports when required by tooling.
- Prefer type-only imports for DTOs and shared shapes: `import type { SubmitQuizDTO } from '@shared/types';`
- Use the `@shared/*` alias for cross-package types; do not duplicate type definitions.

## Types, Interfaces, and Strictness
- Enable and honor `strict` everywhere; avoid `any`. Prefer `unknown` and narrow.
- Use `type` aliases for simple shapes and unions; use `interface` when you need extension/merging.
- Export types used across modules; keep implementation details unexported.

## Functions, Components, and Return Types
- Add explicit return types for exported functions and React components.
- React: functional components with hooks; type props with interfaces or type aliases.
- Prefer `const` and immutable patterns; avoid reassigning parameters.

## Naming & Conventions
- Components/Classes/Types: `PascalCase` (e.g., `QuizList`, `CreateQuizProps`).
- Variables/Functions: `camelCase` (e.g., `fetchQuizzes`, `questionCount`).
- Constants: `UPPER_SNAKE_CASE` (e.g., `DEFAULT_PORT`).

## Nullability, Errors, and Guards
- Handle `undefined` explicitly; avoid non-null assertions (`!`) unless proven safe.
- Validate external input at boundaries (API handlers, forms) with clear error messages.
- Use `Number.isInteger()` and `parseInt`/`Number()` carefully with guards.

## Async & Promises
- Mark async functions `async` and `await` results. Return `Promise<T>` with accurate `T`.
- Wrap multi-step DB operations in transactions; ensure `try/commit` and `catch/rollback`.

## Formatting
- Indentation: 2 spaces; keep lines ≤ 100 chars.
- Use Prettier; run `npm run format` before committing.

## Examples

```ts
// Example: Express route with shared DTOs
import express from 'express';
import type { SubmitQuizDTO, SubmitResultDTO } from '@shared/types';

const router = express.Router();

router.post('/api/quizzes/:id/submit', async (req, res) => {
  const id = Number(req.params.id);
  const body = req.body as SubmitQuizDTO;
  if (!Number.isInteger(id) || !Array.isArray(body?.answers)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  const result: SubmitResultDTO = { score: 0, total: 0, perQuestion: [] };
  return res.json(result);
});
```

```tsx
// Example: React component with typed props
import { useMemo } from 'react';

type ScoreProps = { correct: number; total: number };

export function ScoreBadge({ correct, total }: ScoreProps): JSX.Element {
  const pct = useMemo(() => (total ? Math.round((correct / total) * 100) : 0), [correct, total]);
  return <span aria-label={`Score ${pct}%`}>{correct} / {total} ({pct}%)</span>;
}
```

