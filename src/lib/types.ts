export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  parentId: string | null;
}

export interface Period {
  id: string;
  categoryId: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Question {
  id: string;
  categoryId: string;
  periodId: string;
  text: string;
  options: string[];
  correctAnswer: number; // index of correct option
}

export interface ExamResult {
  id: string;
  userId: string;
  categoryId: string;
  periodId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  answers: Record<string, number>; // questionId -> selected option index
  date: string;
}

export interface ExamState {
  currentQuestionIndex: number;
  answers: Record<string, number>;
  startTime: number;
  timeLimit: number; // in seconds
}
