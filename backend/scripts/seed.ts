import { getDb } from '../src/db.js';
import type { CreateQuizDTO } from '@shared/types';

async function main() {
  const db = await getDb();
  const row = await db.get<{ count: number }>('SELECT COUNT(1) as count FROM quizzes');
  if (row && row.count > 0) {
    console.log('Database already seeded.');
    return;
  }

  const demo: CreateQuizDTO = {
    title: 'JavaScript Basics',
    description: 'A tiny quiz to get started',
    questions: [
      {
        text: 'Which keyword declares a constant?',
        choices: [
          { text: 'var', isCorrect: false },
          { text: 'let', isCorrect: false },
          { text: 'const', isCorrect: true },
        ],
      },
      {
        text: 'What is the result of typeof null?',
        choices: [
          { text: 'null', isCorrect: false },
          { text: 'object', isCorrect: true },
          { text: 'undefined', isCorrect: false },
        ],
      },
      {
        text: 'Which of these is NOT a primitive?',
        choices: [
          { text: 'number', isCorrect: false },
          { text: 'boolean', isCorrect: false },
          { text: 'object', isCorrect: true },
        ],
      },
    ],
  };

  await db.exec('BEGIN');
  try {
    const res = await db.run(
      'INSERT INTO quizzes (title, description) VALUES (?, ?)',
      demo.title,
      demo.description ?? null,
    );
    const quizId = res.lastID!;
    for (let qi = 0; qi < demo.questions.length; qi++) {
      const q = demo.questions[qi];
      const qRes = await db.run(
        'INSERT INTO questions (quiz_id, text, ord) VALUES (?, ?, ?)',
        quizId,
        q.text,
        qi,
      );
      const questionId = qRes.lastID!;
      for (let ci = 0; ci < q.choices.length; ci++) {
        const c = q.choices[ci];
        await db.run(
          'INSERT INTO choices (question_id, text, is_correct, ord) VALUES (?, ?, ?, ?)',
          questionId,
          c.text,
          c.isCorrect ? 1 : 0,
          ci,
        );
      }
    }
    await db.exec('COMMIT');
    console.log('Seeded demo quiz.');
  } catch (e) {
    await db.exec('ROLLBACK');
    throw e;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
