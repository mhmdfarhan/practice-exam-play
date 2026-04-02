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

export interface QuestionPackage {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  duration: number; // minutes
  targetQuestions?: number;
  periodLabel?: string; // optional label e.g. "JFT April 2026"
  isPublished: boolean;
  createdAt: string;
}

export interface Question {
  id: string;
  packageId: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface ExamResult {
  id: string;
  userId: string;
  packageId: string;
  categoryId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  answers: Record<string, number>;
  date: string;
}

export interface BankQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  categoryId: string;
  tags: string[];
}

export interface ExamState {
  currentQuestionIndex: number;
  answers: Record<string, number>;
  startTime: number;
  timeLimit: number;
}
