import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { AppLayout } from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
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
import ResultMonitoring from "@/pages/admin/ResultMonitoring";
import NotFound from "./pages/NotFound.tsx";
import ComingSoon from "./pages/ComingSoon.tsx";

const queryClient = new QueryClient();

function AuthenticatedRoutes() {
  const { currentUser } = useApp();

  if (!currentUser) return <LoginPage />;

  if (currentUser.role === 'admin') {
    return (
      <AppLayout>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/questions" element={<QuestionManagement />} />
          <Route path="/admin/packages/new" element={<PackageCreate />} />
          <Route path="/admin/packages/:packageId/questions" element={<PackageQuestions />} />
          <Route path="/admin/results" element={<ResultMonitoring />} />
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
      <AppProvider>
        <BrowserRouter>
          {/* <AuthenticatedRoutes /> */}
          <ComingSoon />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
