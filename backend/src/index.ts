import express from 'express';
import cors from 'cors';
import { getDb } from './db.js';
import type {
  CreateQuizDTO,
  SubmitQuizDTO,
  SubmitResultDTO,
  Quiz,
  QuizSummary,
} from '@shared/types';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// GET /api/quizzes -> summaries
app.get('/api/quizzes', async (_req, res, next) => {
  try {
    const db = await getDb();
    const rows = await db.all<
      { id: number; title: string; description: string | null; questionCount: number }[]
    >(
      `SELECT q.id, q.title, q.description, COUNT(que.id) AS questionCount
       FROM quizzes q
       LEFT JOIN questions que ON que.quiz_id = q.id
       GROUP BY q.id
       ORDER BY q.created_at DESC`,
    );
    const out: QuizSummary[] = rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description ?? undefined,
      questionCount: r.questionCount,
    }));
    res.json(out);
  } catch (err) {
    next(err);
  }
});

// POST /api/quizzes -> create quiz
app.post('/api/quizzes', async (req, res, next) => {
  try {
    const body = req.body as CreateQuizDTO;
    validateCreateQuiz(body);
    const db = await getDb();
    await db.exec('BEGIN');
    try {
      const result = await db.run(
        'INSERT INTO quizzes (title, description) VALUES (?, ?)',
        body.title.trim(),
        body.description?.trim() ?? null,
      );
      const quizId = result.lastID!;
      for (let qi = 0; qi < body.questions.length; qi++) {
        const q = body.questions[qi];
        const qRes = await db.run(
          'INSERT INTO questions (quiz_id, text, ord) VALUES (?, ?, ?)',
          quizId,
          q.text.trim(),
          qi,
        );
        const questionId = qRes.lastID!;
        for (let ci = 0; ci < q.choices.length; ci++) {
          const c = q.choices[ci];
          await db.run(
            'INSERT INTO choices (question_id, text, is_correct, ord) VALUES (?, ?, ?, ?)',
            questionId,
            c.text.trim(),
            c.isCorrect ? 1 : 0,
            ci,
          );
        }
      }
      await db.exec('COMMIT');
      res.status(201).json({ id: quizId });
    } catch (e) {
      await db.exec('ROLLBACK');
      throw e;
    }
  } catch (err) {
    next(err);
  }
});

// GET /api/quizzes/:id -> full quiz (choices without correctness)
app.get('/api/quizzes/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, 'Invalid id');
    const db = await getDb();
    const quiz = await db.get<{ id: number; title: string; description: string | null }>(
      'SELECT id, title, description FROM quizzes WHERE id = ? LIMIT 1',
      id,
    );
    if (!quiz) throw new ApiError(404, 'Quiz not found');
    const questions = await db.all<{ id: number; text: string; ord: number }[]>(
      'SELECT id, text, ord FROM questions WHERE quiz_id = ? ORDER BY ord ASC, id ASC',
      id,
    );
    const qIds = questions.map((q) => q.id);
    const choices = qIds.length
      ? await db.all<{ id: number; question_id: number; text: string; ord: number }[]>(
          `SELECT id, question_id, text, ord FROM choices WHERE question_id IN (${qIds.map(() => '?').join(',')}) ORDER BY ord ASC, id ASC`,
          ...qIds,
        )
      : [];
    const quizOut: Quiz = {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description ?? undefined,
      questions: questions.map((q) => ({
        id: q.id,
        text: q.text,
        ord: q.ord,
        choices: choices
          .filter((c) => c.question_id === q.id)
          .map((c) => ({ id: c.id, text: c.text, ord: c.ord, isCorrect: false })), // do not leak correctness
      })),
    };
    res.json(quizOut);
  } catch (err) {
    next(err);
  }
});

// POST /api/quizzes/:id/submit -> grade quiz
app.post('/api/quizzes/:id/submit', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, 'Invalid id');
    const body = req.body as SubmitQuizDTO;
    if (!body || !Array.isArray(body.answers)) throw new ApiError(400, 'Invalid payload');

    const db = await getDb();
    const questions = await db.all<{ id: number }[]>(
      'SELECT id FROM questions WHERE quiz_id = ? ORDER BY ord ASC, id ASC',
      id,
    );
    if (questions.length === 0) throw new ApiError(404, 'Quiz not found');
    const qIds = questions.map((q) => q.id);
    const correctRows = await db.all<{ question_id: number; id: number }[]>(
      `SELECT question_id, id FROM choices WHERE question_id IN (${qIds.map(() => '?').join(',')}) AND is_correct = 1`,
      ...qIds,
    );

    const correctByQ = new Map<number, number>();
    for (const row of correctRows) correctByQ.set(row.question_id, row.id);

    const answersByQ = new Map<number, number>();
    for (const a of body.answers) {
      if (!qIds.includes(a.questionId)) continue;
      answersByQ.set(a.questionId, a.choiceId);
    }

    const perQuestion = qIds.map((qid) => {
      const correctChoiceId = correctByQ.get(qid)!;
      const answered = answersByQ.get(qid);
      const correct = answered === correctChoiceId;
      return { questionId: qid, correct, correctChoiceId };
    });

    const result: SubmitResultDTO = {
      score: perQuestion.filter((p) => p.correct).length,
      total: perQuestion.length,
      perQuestion,
    };

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Basic validation for creating a quiz
function validateCreateQuiz(body: CreateQuizDTO) {
  if (!body || typeof body.title !== 'string' || body.title.trim().length === 0) {
    throw new ApiError(400, 'Title is required');
  }
  if (!Array.isArray(body.questions) || body.questions.length < 1) {
    throw new ApiError(400, 'At least one question is required');
  }
  for (const [i, q] of body.questions.entries()) {
    if (!q || typeof q.text !== 'string' || q.text.trim().length === 0) {
      throw new ApiError(400, `Question ${i + 1} text is required`);
    }
    if (!Array.isArray(q.choices) || q.choices.length < 2) {
      throw new ApiError(400, `Question ${i + 1} must have at least two choices`);
    }
    let trueCount = 0;
    for (const [j, c] of q.choices.entries()) {
      if (!c || typeof c.text !== 'string' || c.text.trim().length === 0) {
        throw new ApiError(400, `Choice ${j + 1} of question ${i + 1} must have text`);
      }
      if (c.isCorrect) trueCount++;
    }
    if (trueCount !== 1) {
      throw new ApiError(400, `Question ${i + 1} must have exactly one correct choice`);
    }
  }
}

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = typeof err?.status === 'number' ? err.status : 500;
  const message = typeof err?.message === 'string' ? err.message : 'Internal Server Error';
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
