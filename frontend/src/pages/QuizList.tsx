import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { QuizSummary } from '@shared/types';
import { api } from '../api';

export default function QuizList() {
  const { t } = useTranslation();
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
        <h1>{t('quiz:dashboard.title')}</h1>
        <p>{t('quiz:dashboard.subtitle')}</p>
      </div>
      
      {error && <p className="error">{error}</p>}
      {!quizzes && !error && <p className="loading">{t('common:status.loading')}</p>}
      {quizzes && quizzes.length === 0 && (
        <div className="empty-state">
          <h3>{t('quiz:dashboard.noQuizzes')}</h3>
          <p>{t('quiz:dashboard.createFirst')}</p>
          <Link to="/create" className="button primary pulse">
            {t('quiz:dashboard.createFirstButton')}
          </Link>
        </div>
      )}
      {quizzes && quizzes.length > 0 && (
        <div>
          <div className="row spread" style={{ marginBottom: '2rem' }}>
            <h2>{t('quiz:dashboard.availableQuizzes')}</h2>
            <Link to="/create" className="button primary">
              {t('quiz:dashboard.createNew')}
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
                        {q.questionCount === 1
                          ? t('quiz:dashboard.questionCount', { count: 1, plural: '' })
                          : t('quiz:dashboard.questionCount', { count: q.questionCount, plural: 's' })
                        }
                      </span>
                    </p>
                  </div>
                  <div className="row">
                    <Link className="button primary" to={`/quiz/${q.id}`}>
                      {t('quiz:dashboard.takeQuiz')}
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
