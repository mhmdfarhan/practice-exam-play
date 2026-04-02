import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Category, QuestionPackage, Question, ExamResult, BankQuestion } from '@/lib/types';
import { dummyUsers, dummyCategories, dummyPackages, dummyQuestions, dummyResults, dummyBankQuestions } from '@/lib/dummy-data';

interface AppContextType {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  users: User[];
  categories: Category[];
  packages: QuestionPackage[];
  questions: Question[];
  results: ExamResult[];
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (cat: Category) => void;
  deleteCategory: (id: string) => void;
  addPackage: (p: Omit<QuestionPackage, 'id'>) => void;
  updatePackage: (p: QuestionPackage) => void;
  deletePackage: (id: string) => void;
  addQuestion: (q: Omit<Question, 'id'>) => void;
  updateQuestion: (q: Question) => void;
  deleteQuestion: (id: string) => void;
  addResult: (r: Omit<ExamResult, 'id'>) => void;
  getCategoryById: (id: string) => Category | undefined;
  getSubCategories: (parentId: string) => Category[];
  getPackagesByCategory: (categoryId: string) => QuestionPackage[];
  getPackageById: (id: string) => QuestionPackage | undefined;
  getQuestionsByPackage: (packageId: string) => Question[];
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
  const [packages, setPackages] = useState<QuestionPackage[]>(() => loadFromStorage('cbt_packages', dummyPackages));
  const [questions, setQuestions] = useState<Question[]>(() => loadFromStorage('cbt_questions', dummyQuestions));
  const [results, setResults] = useState<ExamResult[]>(() => loadFromStorage('cbt_results', dummyResults));

  useEffect(() => { localStorage.setItem('cbt_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('cbt_packages', JSON.stringify(packages)); }, [packages]);
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

  const addPackage = (p: Omit<QuestionPackage, 'id'>) => setPackages(prev => [...prev, { ...p, id: uid() }]);
  const updatePackage = (p: QuestionPackage) => setPackages(prev => prev.map(x => x.id === p.id ? p : x));
  const deletePackage = (id: string) => setPackages(prev => prev.filter(x => x.id !== id));

  const addQuestion = (q: Omit<Question, 'id'>) => setQuestions(prev => [...prev, { ...q, id: uid() }]);
  const updateQuestion = (q: Question) => setQuestions(prev => prev.map(x => x.id === q.id ? q : x));
  const deleteQuestion = (id: string) => setQuestions(prev => prev.filter(x => x.id !== id));

  const addResult = (r: Omit<ExamResult, 'id'>) => setResults(prev => [...prev, { ...r, id: uid() }]);

  const getCategoryById = (id: string) => categories.find(c => c.id === id);
  const getSubCategories = (parentId: string) => categories.filter(c => c.parentId === parentId);
  const getPackagesByCategory = (categoryId: string) => packages.filter(p => p.categoryId === categoryId);
  const getPackageById = (id: string) => packages.find(p => p.id === id);
  const getQuestionsByPackage = (packageId: string) => questions.filter(q => q.packageId === packageId);
  const getResultsByUser = (userId: string) => results.filter(r => r.userId === userId);

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      users, categories, packages, questions, results,
      addCategory, updateCategory, deleteCategory,
      addPackage, updatePackage, deletePackage,
      addQuestion, updateQuestion, deleteQuestion,
      addResult,
      getCategoryById, getSubCategories, getPackagesByCategory, getPackageById, getQuestionsByPackage, getResultsByUser,
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
