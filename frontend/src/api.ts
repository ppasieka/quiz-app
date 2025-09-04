import type { CreateQuizDTO, Quiz, QuizSummary, SubmitQuizDTO, SubmitResultDTO } from '@shared/types';

const BASE = '/api';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  getQuizzes: () => http<QuizSummary[]>('/quizzes'),
  createQuiz: (dto: CreateQuizDTO) => http<{ id: number }>('/quizzes', { method: 'POST', body: JSON.stringify(dto) }),
  getQuizById: (id: number) => http<Quiz>(`/quizzes/${id}`),
  submitQuiz: (id: number, dto: SubmitQuizDTO) => http<SubmitResultDTO>(`/quizzes/${id}/submit`, { method: 'POST', body: JSON.stringify(dto) })
};

