import { useNavigate } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { usePackages } from '@/hooks/usePackages';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const UserDashboard = () => {
  const { data: categories = [] } = useCategories();
  const { data: packages = [] } = usePackages();
  const navigate = useNavigate();
  const rootCategories = categories.filter(c => c.parent_id === null);
  const trendingPackages = packages.filter(p => p.is_published && p.period_label);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-6">Pilih kategori ujian untuk memulai latihan</p>

      {trendingPackages.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">🔥 Sedang Trending</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingPackages.map(pkg => {
              const cat = categories.find(c => c.id === pkg.category_id);
              return (
                <Card key={pkg.id} className="cursor-pointer hover:shadow-lg transition-shadow border-primary/20" onClick={() => navigate(`/exam/${pkg.id}`)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{pkg.period_label}</Badge>
                      <span className="text-sm text-muted-foreground">{pkg.duration} menit</span>
                    </div>
                    <CardTitle className="text-lg mt-2">{pkg.name}</CardTitle>
                    <CardDescription>{cat?.icon} {cat?.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-sm text-primary font-medium">Mulai Ujian →</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">📚 Pilih Kategori</h2>
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
