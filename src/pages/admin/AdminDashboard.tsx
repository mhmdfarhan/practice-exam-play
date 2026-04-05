import { useAuth } from '@/contexts/AuthContext';
import { useCategories } from '@/hooks/useCategories';
import { usePackages } from '@/hooks/usePackages';
import { useAllQuestions } from '@/hooks/useQuestions';
import { useExamResults } from '@/hooks/useExamResults';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, HelpCircle, BarChart3, FolderOpen, Package } from 'lucide-react';

const AdminDashboard = () => {
  const { data: categories = [] } = useCategories();
  const { data: packages = [] } = usePackages();
  const { data: questions = [] } = useAllQuestions();
  const { data: results = [] } = useExamResults();

  const stats = [
    { title: 'Total Kategori', value: categories.length, icon: FolderOpen, color: 'text-green-600' },
    { title: 'Paket Soal', value: packages.length, icon: Package, color: 'text-indigo-600' },
    { title: 'Total Soal', value: questions.length, icon: HelpCircle, color: 'text-orange-600' },
    { title: 'Ujian Selesai', value: results.length, icon: BarChart3, color: 'text-purple-600' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.title}</CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
