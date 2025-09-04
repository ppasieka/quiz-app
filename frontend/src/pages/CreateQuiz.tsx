import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateQuizDTO } from '@shared/types';
import { api } from '../api';

type ChoiceLocal = { text: string; isCorrect: boolean };
type QuestionLocal = { text: string; choices: ChoiceLocal[] };

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<QuestionLocal[]>([
    { text: '', choices: [ { text: '', isCorrect: true }, { text: '', isCorrect: false } ] }
  ]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function addQuestion() {
    setQuestions(qs => [...qs, { text: '', choices: [ { text: '', isCorrect: true }, { text: '', isCorrect: false } ] }]);
  }
  function removeQuestion(idx: number) {
    setQuestions(qs => qs.filter((_, i) => i !== idx));
  }
  function addChoice(qi: number) {
    setQuestions(qs => qs.map((q, i) => i !== qi ? q : ({ ...q, choices: [...q.choices, { text: '', isCorrect: false }] })));
  }
  function removeChoice(qi: number, ci: number) {
    setQuestions(qs => qs.map((q, i) => {
      if (i !== qi) return q;
      const newChoices = q.choices.filter((_, j) => j !== ci);
      if (newChoices.length > 0 && !newChoices.some(c => c.isCorrect)) newChoices[0].isCorrect = true;
      return { ...q, choices: newChoices };
    }));
  }
  function updateQuestionText(qi: number, text: string) {
    setQuestions(qs => qs.map((q, i) => i !== qi ? q : ({ ...q, text })));
  }
  function updateChoiceText(qi: number, ci: number, text: string) {
    setQuestions(qs => qs.map((q, i) => {
      if (i !== qi) return q;
      return { ...q, choices: q.choices.map((c, j) => j !== ci ? c : ({ ...c, text })) };
    }));
  }
  function markCorrect(qi: number, ci: number) {
    setQuestions(qs => qs.map((q, i) => {
      if (i !== qi) return q;
      return { ...q, choices: q.choices.map((c, j) => ({ ...c, isCorrect: j === ci })) };
    }));
  }

  const valid = useMemo(() => {
    if (title.trim().length === 0) return false;
    if (questions.length < 1) return false;
    for (const q of questions) {
      if (q.text.trim().length === 0) return false;
      if (q.choices.length < 2) return false;
      if (!q.choices.some(c => c.isCorrect)) return false;
      if (q.choices.filter(c => c.isCorrect).length !== 1) return false;
      if (q.choices.some(c => c.text.trim().length === 0)) return false;
    }
    return true;
  }, [title, questions]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    setError(null);
    const dto: CreateQuizDTO = {
      title: title.trim(),
      description: description.trim() || undefined,
      questions: questions.map(q => ({ text: q.text.trim(), choices: q.choices.map(c => ({ text: c.text.trim(), isCorrect: c.isCorrect })) }))
    };
    try {
      const { id } = await api.createQuiz(dto);
      navigate(`/quiz/${id}`);
    } catch (e: any) {
      setError(e.message || 'Failed to create');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h2>Create Quiz</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={onSubmit} className="form">
        <label>
          <span>Title *</span>
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </label>
        <label>
          <span>Short description</span>
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional" />
        </label>

        <div className="questions">
          {questions.map((q, qi) => (
            <div className="card" key={qi}>
              <div className="row spread">
                <h3>Question {qi + 1}</h3>
                <div className="row">
                  {questions.length > 1 && (
                    <button type="button" className="danger" onClick={() => removeQuestion(qi)}>Remove</button>
                  )}
                </div>
              </div>
              <label>
                <span>Text *</span>
                <input value={q.text} onChange={e => updateQuestionText(qi, e.target.value)} required />
              </label>
              <div>
                <h4>Choices *</h4>
                {q.choices.map((c, ci) => (
                  <div className="row" key={ci}>
                    <input
                      type="radio"
                      name={`correct-${qi}`}
                      checked={c.isCorrect}
                      onChange={() => markCorrect(qi, ci)}
                      title="Mark as correct"
                    />
                    <input
                      className="flex-1"
                      value={c.text}
                      onChange={e => updateChoiceText(qi, ci, e.target.value)}
                      placeholder={`Choice ${ci + 1}`}
                      required
                    />
                    {q.choices.length > 2 && (
                      <button type="button" onClick={() => removeChoice(qi, ci)}>Remove</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addChoice(qi)}>Add choice</button>
              </div>
            </div>
          ))}
        </div>

        <div className="row">
          <button type="button" onClick={addQuestion}>Add question</button>
          <button type="submit" className="primary" disabled={!valid || submitting}>
            {submitting ? 'Creating…' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </section>
  );
}

