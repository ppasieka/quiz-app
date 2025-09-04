import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';

let dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>> | null = null;

export async function getDb() {
  if (!dbPromise) {
    const filename = process.env.DATABASE_FILE || 'data.sqlite';
    dbPromise = open({ filename, driver: sqlite3.Database });
    const db = await dbPromise;
    await db.exec('PRAGMA foreign_keys = ON');
    await initDb(db);
  }
  return dbPromise!;
}

export async function initDb(db?: Database) {
  const _db = db || (await getDb());
  await _db.exec(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      ord INTEGER NOT NULL,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON questions(quiz_id);
    CREATE TABLE IF NOT EXISTS choices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      is_correct INTEGER NOT NULL DEFAULT 0,
      ord INTEGER NOT NULL,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_choices_question_id ON choices(question_id);
  `);
}

