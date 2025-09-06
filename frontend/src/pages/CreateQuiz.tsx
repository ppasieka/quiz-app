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
    {
      text: '',
      choices: [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
      ],
    },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function addQuestion() {
    setQuestions((qs) => [
      ...qs,
      {
        text: '',
        choices: [
          { text: '', isCorrect: true },
          { text: '', isCorrect: false },
        ],
      },
    ]);
  }
  function removeQuestion(idx: number) {
    setQuestions((qs) => qs.filter((_, i) => i !== idx));
  }
  function addChoice(qi: number) {
    setQuestions((qs) =>
      qs.map((q, i) =>
        i !== qi ? q : { ...q, choices: [...q.choices, { text: '', isCorrect: false }] },
      ),
    );
  }
  function removeChoice(qi: number, ci: number) {
    setQuestions((qs) =>
      qs.map((q, i) => {
        if (i !== qi) return q;
        const newChoices = q.choices.filter((_, j) => j !== ci);
        if (newChoices.length > 0 && !newChoices.some((c) => c.isCorrect))
          newChoices[0].isCorrect = true;
        return { ...q, choices: newChoices };
      }),
    );
  }
  function updateQuestionText(qi: number, text: string) {
    setQuestions((qs) => qs.map((q, i) => (i !== qi ? q : { ...q, text })));
  }
  function updateChoiceText(qi: number, ci: number, text: string) {
    setQuestions((qs) =>
      qs.map((q, i) => {
        if (i !== qi) return q;
        return {
          ...q,
          choices: q.choices.map((c, j) => (j !== ci ? c : { ...c, text })),
        };
      }),
    );
  }
  function markCorrect(qi: number, ci: number) {
    setQuestions((qs) =>
      qs.map((q, i) => {
        if (i !== qi) return q;
        return {
          ...q,
          choices: q.choices.map((c, j) => ({ ...c, isCorrect: j === ci })),
        };
      }),
    );
  }

  const valid = useMemo(() => {
    if (title.trim().length === 0) return false;
    if (questions.length < 1) return false;
    for (const q of questions) {
      if (q.text.trim().length === 0) return false;
      if (q.choices.length < 2) return false;
      if (!q.choices.some((c) => c.isCorrect)) return false;
      if (q.choices.filter((c) => c.isCorrect).length !== 1) return false;
      if (q.choices.some((c) => c.text.trim().length === 0)) return false;
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
      questions: questions.map((q) => ({
        text: q.text.trim(),
        choices: q.choices.map((c) => ({
          text: c.text.trim(),
          isCorrect: c.isCorrect,
        })),
      })),
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
      <div className="enterprise-header">
        <h1>Create New Quiz</h1>
        <p>Design engaging quizzes with multiple choice questions</p>
      </div>
      
      {error && <p className="error">{error}</p>}
      <form onSubmit={onSubmit} className="form">
        <div className="card">
          <h3>Quiz Details</h3>
          <label>
            <span>Quiz Title *</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
              required
            />
          </label>
          <label>
            <span>Description</span>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your quiz (optional)"
            />
          </label>
        </div>

        <div className="questions">
          <div className="row spread">
            <h3>Questions</h3>
            <span className="muted">{questions.length} question{questions.length !== 1 ? 's' : ''}</span>
          </div>
          
          {questions.map((q, qi) => (
            <div className="card" key={qi}>
              <div className="row spread">
                <h4>Question {qi + 1}</h4>
                <div className="row">
                  {questions.length > 1 && (
                    <button
                      type="button"
                      className="button danger"
                      onClick={() => removeQuestion(qi)}
                    >
                      Remove Question
                    </button>
                  )}
                </div>
              </div>
              <label>
                <span>Question Text *</span>
                <input
                  value={q.text}
                  onChange={(e) => updateQuestionText(qi, e.target.value)}
                  placeholder="Enter your question"
                  required
                />
              </label>
              <div className="choices">
                <div className="row spread">
                  <h4>Answer Choices *</h4>
                  <span className="muted">Select the correct answer</span>
                </div>
                {q.choices.map((c, ci) => (
                  <div className="choice-row" key={ci}>
                    <label className="choice-check" title="Mark as correct answer">
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        checked={c.isCorrect}
                        onChange={() => markCorrect(qi, ci)}
                        aria-label={`Mark choice ${ci + 1} as correct`}
                      />
                      <span className="dot" aria-hidden="true"></span>
                    </label>
                    <input
                      className="flex-1"
                      value={c.text}
                      onChange={(e) => updateChoiceText(qi, ci, e.target.value)}
                      placeholder={`Answer choice ${ci + 1}`}
                      required
                    />
                    {q.choices.length > 2 && (
                      <button
                        type="button"
                        className="button danger"
                        onClick={() => removeChoice(qi, ci)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="button secondary" onClick={() => addChoice(qi)}>
                  + Add Choice
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="row">
          <button type="button" className="button" onClick={addQuestion}>
            + Add Question
          </button>
          <button
            type="submit"
            className="button primary pulse"
            disabled={!valid || submitting}
          >
            {submitting ? 'Creating Quiz...' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </section>
  );
}
