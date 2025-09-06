import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { CreateQuizDTO } from '@shared/types';
import { api } from '../api';

type ChoiceLocal = { text: string; isCorrect: boolean };
type QuestionLocal = { text: string; choices: ChoiceLocal[] };

export default function CreateQuiz() {
  const { t } = useTranslation();
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
      setError(e.message || t('errors:failedToCreate'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <div className="enterprise-header">
        <h1>{t('quiz:create.title')}</h1>
        <p>{t('quiz:create.subtitle')}</p>
      </div>
      
      {error && <p className="error">{error}</p>}
      <form onSubmit={onSubmit} className="form">
        <div className="card">
          <h3>{t('quiz:create.details')}</h3>
          <label>
            <span>{t('quiz:create.quizTitle')}</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('quiz:create.quizTitlePlaceholder')}
              required
            />
          </label>
          <label>
            <span>{t('quiz:create.description')}</span>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('quiz:create.descriptionPlaceholder')}
            />
          </label>
        </div>

        <div className="questions">
          <div className="row spread">
            <h3>{t('quiz:create.questions')}</h3>
            <span className="muted">
              {questions.length === 1
                ? t('quiz:dashboard.questionCount', { count: 1, plural: '' })
                : t('quiz:dashboard.questionCount', { count: questions.length, plural: 's' })
              }
            </span>
          </div>
          
          {questions.map((q, qi) => (
            <div className="card" key={qi}>
              <div className="row spread">
                <h4>{t('quiz:create.questionNumber', { number: qi + 1 })}</h4>
                <div className="row">
                  {questions.length > 1 && (
                    <button
                      type="button"
                      className="button danger"
                      onClick={() => removeQuestion(qi)}
                    >
                      {t('common:buttons.remove')} {t('quiz:create.questions').toLowerCase()}
                    </button>
                  )}
                </div>
              </div>
              <label>
                <span>{t('quiz:create.questionText')}</span>
                <input
                  value={q.text}
                  onChange={(e) => updateQuestionText(qi, e.target.value)}
                  placeholder={t('quiz:create.questionPlaceholder')}
                  required
                />
              </label>
              <div className="choices">
                <div className="row spread">
                  <h4>{t('quiz:create.answerChoices')}</h4>
                  <span className="muted">{t('quiz:create.selectCorrect')}</span>
                </div>
                {q.choices.map((c, ci) => (
                  <div className="choice-row" key={ci}>
                    <label className="choice-check" title={t('quiz:create.selectCorrect')}>
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        checked={c.isCorrect}
                        onChange={() => markCorrect(qi, ci)}
                        aria-label={t('quiz:create.selectCorrect') + ` ${ci + 1}`}
                      />
                      <span className="dot" aria-hidden="true"></span>
                    </label>
                    <input
                      className="flex-1"
                      value={c.text}
                      onChange={(e) => updateChoiceText(qi, ci, e.target.value)}
                      placeholder={t('quiz:create.answerPlaceholder', { number: ci + 1 })}
                      required
                    />
                    {q.choices.length > 2 && (
                      <button
                        type="button"
                        className="button danger"
                        onClick={() => removeChoice(qi, ci)}
                      >
                        {t('common:buttons.remove')}
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="button secondary" onClick={() => addChoice(qi)}>
                  {t('quiz:create.addChoice')}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="row">
          <button type="button" className="button" onClick={addQuestion}>
            {t('quiz:create.addQuestion')}
          </button>
          <button
            type="submit"
            className="button primary pulse"
            disabled={!valid || submitting}
          >
            {submitting ? t('quiz:create.creating') : t('quiz:create.create')}
          </button>
        </div>
      </form>
    </section>
  );
}
