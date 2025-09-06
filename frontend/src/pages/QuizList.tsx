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
      <div className="enterprise-header">
        <h1>Quiz Dashboard</h1>
        <p>Test your knowledge with our interactive quizzes</p>
      </div>
      
      {error && <p className="error">{error}</p>}
      {!quizzes && !error && <p className="loading">Loading quizzes...</p>}
      {quizzes && quizzes.length === 0 && (
        <div className="empty-state">
          <h3>No quizzes available</h3>
          <p>Create your first quiz to get started!</p>
          <Link to="/create" className="button primary pulse">
            Create Your First Quiz
          </Link>
        </div>
      )}
      {quizzes && quizzes.length > 0 && (
        <div>
          <div className="row spread" style={{ marginBottom: '2rem' }}>
            <h2>Available Quizzes</h2>
            <Link to="/create" className="button primary">
              Create New Quiz
            </Link>
          </div>
          <ul className="list">
            {quizzes.map((q) => (
              <li key={q.id} className="card">
                <div className="row spread">
                  <div>
                    <h3>{q.title}</h3>
                    {q.description && <p className="muted">{q.description}</p>}
                    <p className="muted">
                      <span className="status-indicator status-success">
                        {q.questionCount} question{q.questionCount !== 1 ? 's' : ''}
                      </span>
                    </p>
                  </div>
                  <div className="row">
                    <Link className="button primary" to={`/quiz/${q.id}`}>
                      Take Quiz
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
