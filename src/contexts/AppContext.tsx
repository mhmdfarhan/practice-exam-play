import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Category, Period, Question, ExamResult, UserRole } from '@/lib/types';
import { dummyUsers, dummyCategories, dummyPeriods, dummyQuestions, dummyResults } from '@/lib/dummy-data';

interface AppContextType {
  // Auth
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  // Data
  users: User[];
  categories: Category[];
  periods: Period[];
  questions: Question[];
  results: ExamResult[];
  // CRUD
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (cat: Category) => void;
  deleteCategory: (id: string) => void;
  addPeriod: (p: Omit<Period, 'id'>) => void;
  updatePeriod: (p: Period) => void;
  deletePeriod: (id: string) => void;
  addQuestion: (q: Omit<Question, 'id'>) => void;
  updateQuestion: (q: Question) => void;
  deleteQuestion: (id: string) => void;
  addResult: (r: Omit<ExamResult, 'id'>) => void;
  // Helpers
  getCategoryById: (id: string) => Category | undefined;
  getSubCategories: (parentId: string) => Category[];
  getPeriodsByCategory: (categoryId: string) => Period[];
  getQuestionsByPeriod: (categoryId: string, periodId: string) => Question[];
  getResultsByUser: (userId: string) => ExamResult[];
}

const AppContext = createContext<AppContextType | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch { return fallback; }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadFromStorage('cbt_user', null));
  const [users] = useState<User[]>(dummyUsers);
  const [categories, setCategories] = useState<Category[]>(() => loadFromStorage('cbt_categories', dummyCategories));
  const [periods, setPeriods] = useState<Period[]>(() => loadFromStorage('cbt_periods', dummyPeriods));
  const [questions, setQuestions] = useState<Question[]>(() => loadFromStorage('cbt_questions', dummyQuestions));
  const [results, setResults] = useState<ExamResult[]>(() => loadFromStorage('cbt_results', dummyResults));

  useEffect(() => { localStorage.setItem('cbt_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('cbt_periods', JSON.stringify(periods)); }, [periods]);
  useEffect(() => { localStorage.setItem('cbt_questions', JSON.stringify(questions)); }, [questions]);
  useEffect(() => { localStorage.setItem('cbt_results', JSON.stringify(results)); }, [results]);
  useEffect(() => { if (currentUser) localStorage.setItem('cbt_user', JSON.stringify(currentUser)); else localStorage.removeItem('cbt_user'); }, [currentUser]);

  const login = (email: string, password: string) => {
    const u = users.find(u => u.email === email && u.password === password);
    if (u) { setCurrentUser(u); return true; }
    return false;
  };
  const logout = () => setCurrentUser(null);

  const uid = () => crypto.randomUUID();

  const addCategory = (c: Omit<Category, 'id'>) => setCategories(prev => [...prev, { ...c, id: uid() }]);
  const updateCategory = (c: Category) => setCategories(prev => prev.map(x => x.id === c.id ? c : x));
  const deleteCategory = (id: string) => setCategories(prev => prev.filter(x => x.id !== id));

  const addPeriod = (p: Omit<Period, 'id'>) => setPeriods(prev => [...prev, { ...p, id: uid() }]);
  const updatePeriod = (p: Period) => setPeriods(prev => prev.map(x => x.id === p.id ? p : x));
  const deletePeriod = (id: string) => setPeriods(prev => prev.filter(x => x.id !== id));

  const addQuestion = (q: Omit<Question, 'id'>) => setQuestions(prev => [...prev, { ...q, id: uid() }]);
  const updateQuestion = (q: Question) => setQuestions(prev => prev.map(x => x.id === q.id ? q : x));
  const deleteQuestion = (id: string) => setQuestions(prev => prev.filter(x => x.id !== id));

  const addResult = (r: Omit<ExamResult, 'id'>) => setResults(prev => [...prev, { ...r, id: uid() }]);

  const getCategoryById = (id: string) => categories.find(c => c.id === id);
  const getSubCategories = (parentId: string) => categories.filter(c => c.parentId === parentId);
  const getPeriodsByCategory = (categoryId: string) => periods.filter(p => p.categoryId === categoryId);
  const getQuestionsByPeriod = (categoryId: string, periodId: string) => questions.filter(q => q.categoryId === categoryId && q.periodId === periodId);
  const getResultsByUser = (userId: string) => results.filter(r => r.userId === userId);

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      users, categories, periods, questions, results,
      addCategory, updateCategory, deleteCategory,
      addPeriod, updatePeriod, deletePeriod,
      addQuestion, updateQuestion, deleteQuestion,
      addResult,
      getCategoryById, getSubCategories, getPeriodsByCategory, getQuestionsByPeriod, getResultsByUser,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
