import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import UserDashboard from "@/pages/user/UserDashboard";
import CategoryPage from "@/pages/user/CategoryPage";
import ExamPage from "@/pages/user/ExamPage";
import ResultPage from "@/pages/user/ResultPage";
import HistoryPage from "@/pages/user/HistoryPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import CategoryManagement from "@/pages/admin/CategoryManagement";
import QuestionManagement from "@/pages/admin/QuestionManagement";
import PackageCreate from "@/pages/admin/PackageCreate";
import PackageQuestions from "@/pages/admin/PackageQuestions";
import QuestionBank from "@/pages/admin/QuestionBank";
import ResultMonitoring from "@/pages/admin/ResultMonitoring";
import UserManagement from "@/pages/admin/UserManagement";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function AuthenticatedRoutes() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  if (profile.role === 'admin') {
    return (
      <AppLayout>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/questions" element={<QuestionManagement />} />
          <Route path="/admin/packages/new" element={<PackageCreate />} />
          <Route path="/admin/packages/:packageId/questions" element={<PackageQuestions />} />
          <Route path="/admin/bank" element={<QuestionBank />} />
          <Route path="/admin/results" element={<ResultMonitoring />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/exam/:packageId" element={<ExamPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AuthenticatedRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
