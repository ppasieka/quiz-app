# TypeScript Style Guide

## Structure Rules
- Use 2 spaces for indentation; keep lines ≤ 100 chars.
- Prefer small, focused modules; export only what’s needed.
- Use ES Modules; keep relative imports readable and stable.

## Import & Type Formatting
- Prefer type-only imports for DTOs/shared shapes:
  `import type { SubmitQuizDTO } from '@shared/types';`
- Group imports: std libs, third‑party, local. Separate groups with a blank line.
- Avoid default exports for complex modules; prefer named exports.

## Naming Conventions
- Components/Classes/Types: PascalCase (`QuizList`, `SubmitResultDTO`).
- Variables/Functions: camelCase (`getQuizzes`, `questionCount`).
- Constants: UPPER_SNAKE_CASE (`DEFAULT_PORT`).

## Strictness & Safety
- Enable `strict` everywhere. Avoid `any`; prefer `unknown` + narrowing.
- Handle `undefined` explicitly; avoid non‑null assertions except when proven safe.
- Validate all external inputs (API bodies, params) with clear messages.

## React Components
- Functional components with hooks.
- Type props via `type`/`interface`; add explicit return type `JSX.Element`.
- Keep components pure; derive values with `useMemo` as needed.

## Example TypeScript Structure

```ts
// Express handler with shared types
import type { SubmitQuizDTO, SubmitResultDTO } from '@shared/types';

app.post('/api/quizzes/:id/submit', async (req, res) => {
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
// React component with typed props
type ScoreProps = { correct: number; total: number };

export function ScoreBadge({ correct, total }: ScoreProps): JSX.Element {
  const pct = total ? Math.round((correct / total) * 100) : 0;
  return <span aria-label={`Score ${pct}%`}>{correct} / {total} ({pct}%)</span>;
}
```

