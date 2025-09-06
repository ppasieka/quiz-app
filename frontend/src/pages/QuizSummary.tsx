import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { SubmitResultDTO } from '@shared/types';

type LocationState = { result: SubmitResultDTO; title?: string } | null;

export default function QuizSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || null;

  if (!state) {
    return (
      <section>
        <div className="enterprise-header">
          <h1>Quiz Summary</h1>
          <p>No summary available for this quiz</p>
        </div>
        <div className="empty-state">
          <h3>Unable to load results</h3>
          <p>Please try taking the quiz again to view your results.</p>
          <button className="button primary" onClick={() => navigate(`/quiz/${id}`)}>
            Back to Quiz
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
        <h1>Quiz Complete!</h1>
        {title && <h2>{title}</h2>}
      </div>
      
      <div className="card" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3>Your Results</h3>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0' }}>
          <span className={passed ? 'good' : 'bad'}>
            {result.score} / {result.total}
          </span>
        </div>
        <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          <span className={passed ? 'good' : 'bad'}>
            {percentage}% {passed ? 'Passed!' : 'Needs Improvement'}
          </span>
        </div>
        <div className="row" style={{ justifyContent: 'center', gap: '1rem' }}>
          <span className={`status-indicator ${passed ? 'status-success' : 'status-warning'}`}>
            {passed ? '🎉 Excellent Work!' : '📚 Keep Practicing'}
          </span>
        </div>
      </div>

      <div className="card">
        <h3>Question Breakdown</h3>
        <ul className="list">
          {result.perQuestion.map((pq, i) => (
            <li key={pq.questionId} className="row spread">
              <span><strong>Question {i + 1}</strong></span>
              <span className={pq.correct ? 'good' : 'bad'}>
                {pq.correct ? '✓ Correct' : '✗ Incorrect'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="row" style={{ justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
        <button className="button primary" onClick={() => navigate('/')}>
          Back to Quiz List
        </button>
        <button className="button secondary" onClick={() => navigate(`/quiz/${id}`)}>
          Retake Quiz
        </button>
      </div>
    </section>
  );
}
