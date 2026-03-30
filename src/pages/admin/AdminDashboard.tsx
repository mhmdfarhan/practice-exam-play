import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, HelpCircle, BarChart3, FolderOpen } from 'lucide-react';

const AdminDashboard = () => {
  const { users, questions, results, categories } = useApp();

  const stats = [
    { title: 'Total User', value: users.filter(u => u.role === 'user').length, icon: Users, color: 'text-blue-600' },
    { title: 'Total Kategori', value: categories.length, icon: FolderOpen, color: 'text-green-600' },
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
