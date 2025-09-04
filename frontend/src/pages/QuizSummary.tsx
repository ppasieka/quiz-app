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
        <p className="error">No summary available. Try taking the quiz again.</p>
        <button onClick={() => navigate(`/quiz/${id}`)}>Back to quiz</button>
      </section>
    );
  }
  const { result, title } = state;

  return (
    <section>
      <h2>Summary{title ? ` — ${title}` : ''}</h2>
      <p>
        Score: <strong>{result.score}</strong> / {result.total}
      </p>
      <ul className="list">
        {result.perQuestion.map((pq, i) => (
          <li key={pq.questionId} className="row spread">
            <span>Q{i + 1}</span>
            <span className={pq.correct ? 'good' : 'bad'}>{pq.correct ? 'Correct' : 'Wrong'}</span>
          </li>
        ))}
      </ul>
      <div className="row">
        <button className="primary" onClick={() => navigate('/')}>
          Back to list
        </button>
      </div>
    </section>
  );
}
