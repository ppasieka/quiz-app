import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { SubmitResultDTO } from '@shared/types';

type LocationState = { result: SubmitResultDTO; title?: string } | null;

export default function QuizSummary() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || null;

  if (!state) {
    return (
      <section>
        <div className="enterprise-header">
          <h1>{t('quiz:summary.title')}</h1>
          <p>{t('quiz:summary.noSummary')}</p>
        </div>
        <div className="empty-state">
          <h3>{t('quiz:summary.unableToLoad')}</h3>
          <p>{t('quiz:summary.tryAgain')}</p>
          <button className="button primary" onClick={() => navigate(`/quiz/${id}`)}>
            {t('quiz:summary.backToQuiz')}
          </button>
        </div>
      </section>
    );
  }
  const { result, title } = state;

  const percentage = Math.round((result.score / result.total) * 100);
  const passed = percentage >= 70;

  return (
    <section>
      <div className="enterprise-header">
        <h1>{t('quiz:summary.complete')}</h1>
        {title && <h2>{title}</h2>}
      </div>
      
      <div className="card" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3>{t('quiz:summary.yourResults')}</h3>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0' }}>
          <span className={passed ? 'good' : 'bad'}>
            {t('quiz:summary.score', { score: result.score, total: result.total })}
          </span>
        </div>
        <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          <span className={passed ? 'good' : 'bad'}>
            {t('quiz:summary.percentage', { percentage })} {passed ? t('quiz:summary.passed') : t('quiz:summary.needsImprovement')}
          </span>
        </div>
        <div className="row" style={{ justifyContent: 'center', gap: '1rem' }}>
          <span className={`status-indicator ${passed ? 'status-success' : 'status-warning'}`}>
            {passed ? t('quiz:summary.excellent') : t('quiz:summary.keepPracticing')}
          </span>
        </div>
      </div>

      <div className="card">
        <h3>{t('quiz:summary.questionBreakdown')}</h3>
        <ul className="list">
          {result.perQuestion.map((pq, i) => (
            <li key={pq.questionId} className="row spread">
              <span><strong>{t('quiz:create.questionNumber', { number: i + 1 })}</strong></span>
              <span className={pq.correct ? 'good' : 'bad'}>
                {pq.correct ? t('quiz:summary.correct') : t('quiz:summary.incorrect')}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="row" style={{ justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
        <button className="button primary" onClick={() => navigate('/')}>
          {t('quiz:summary.backToList')}
        </button>
        <button className="button secondary" onClick={() => navigate(`/quiz/${id}`)}>
          {t('quiz:summary.retake')}
        </button>
      </div>
    </section>
  );
}
