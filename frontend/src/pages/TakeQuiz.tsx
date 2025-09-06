import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Quiz } from '@shared/types';
import { api } from '../api';

export default function TakeQuiz() {
  const { id } = useParams();
  const quizId = Number(id);
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, number | undefined>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(quizId)) return;
    api
      .getQuizById(quizId)
      .then(setQuiz)
      .catch((e) => setError(e.message));
  }, [quizId]);

  const valid = useMemo(() => {
    if (!quiz) return false;
    return quiz.questions.every((q) => !!answers[q.id!]);
  }, [quiz, answers]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!quiz) return;
    setSubmitting(true);
    try {
      const dto = {
        answers: quiz.questions.map((q) => ({ questionId: q.id!, choiceId: answers[q.id!]! })),
      };
      const result = await api.submitQuiz(quiz.id, dto);
      navigate(`/quiz/${quiz.id}/summary`, { state: { result, title: quiz.title } });
    } catch (e: any) {
      setError(e.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      {error && <p className="error">{error}</p>}
      {!quiz && !error && <p className="loading">Loading quiz...</p>}
      {quiz && (
        <form onSubmit={onSubmit} className="form">
          <div className="enterprise-header">
            <h1>{quiz.title}</h1>
            {quiz.description && <p>{quiz.description}</p>}
            <div className="row" style={{ marginTop: '1rem', justifyContent: 'center' }}>
              <span className="status-indicator status-success">
                {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <div className="questions">
            {quiz.questions.map((q, i) => (
              <div key={q.id} className="card">
                <h3>
                  Question {i + 1}: {q.text}
                </h3>
                <p className="muted">Select the best answer from the choices below:</p>
                <div className="choices">
                  {q.choices.map((c) => (
                    <label key={c.id} className="row">
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        checked={answers[q.id!] === c.id}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id!]: c.id }))}
                        required
                      />
                      <span>{c.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <h3>Ready to submit?</h3>
            <p className="muted">
              {Object.keys(answers).length} of {quiz.questions.length} questions answered
            </p>
            <div className="row" style={{ justifyContent: 'center', marginTop: '1rem' }}>
              <button
                type="submit"
                className="button primary pulse"
                disabled={!valid || submitting}
              >
                {submitting ? 'Submitting Quiz...' : 'Submit Quiz'}
              </button>
            </div>
            {!valid && (
              <p className="muted" style={{ marginTop: '1rem', fontSize: '14px' }}>
                Please answer all questions before submitting
              </p>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
