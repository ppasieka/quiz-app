export type Choice = { id?: number; text: string; isCorrect: boolean; ord?: number };
export type Question = { id?: number; text: string; choices: Choice[]; ord?: number };
export type QuizSummary = { id: number; title: string; description?: string; questionCount: number };
export type Quiz = { id: number; title: string; description?: string; questions: Question[] };
export type CreateQuizDTO = {
  title: string;
  description?: string;
  questions: Array<{
    text: string;
    choices: Array<{ text: string; isCorrect: boolean }>;
  }>;
};
export type SubmitQuizDTO = { answers: Array<{ questionId: number; choiceId: number }> };
export type SubmitResultDTO = {
  score: number;
  total: number;
  perQuestion: Array<{ questionId: number; correct: boolean; correctChoiceId: number }>;
};

