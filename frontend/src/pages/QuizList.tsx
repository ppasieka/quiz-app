import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { QuizSummary } from '@shared/types';
import { api } from '../api';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<QuizSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getQuizzes()
      .then(setQuizzes)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <section>
      {error && <p className="error">{error}</p>}
      {!quizzes && !error && <p>Loading...</p>}
      {quizzes && quizzes.length === 0 && <p>No quizzes yet. Create one!</p>}
      {quizzes && quizzes.length > 0 && (
        <ul className="list">
          {quizzes.map((q) => (
            <li key={q.id} className="card">
              <div>
                <h3>{q.title}</h3>
                {q.description && <p className="muted">{q.description}</p>}
                <p className="muted">
                  {q.questionCount} question{q.questionCount !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="row">
                <Link className="button primary" to={`/quiz/${q.id}`}>
                  Take Quiz
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
