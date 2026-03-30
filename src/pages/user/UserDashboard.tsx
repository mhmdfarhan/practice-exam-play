import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const UserDashboard = () => {
  const { categories } = useApp();
  const navigate = useNavigate();
  const rootCategories = categories.filter(c => c.parentId === null);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-6">Pilih kategori ujian untuk memulai latihan</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rootCategories.map(cat => (
          <Card key={cat.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/category/${cat.id}`)}>
            <CardHeader>
              <div className="text-4xl mb-2">{cat.icon}</div>
              <CardTitle>{cat.name}</CardTitle>
              <CardDescription>{cat.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-sm text-primary font-medium">Pilih Kategori →</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
