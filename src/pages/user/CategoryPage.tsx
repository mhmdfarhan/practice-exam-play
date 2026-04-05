import { useParams, useNavigate } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { usePackages } from '@/hooks/usePackages';
import { useQuestions } from '@/hooks/useQuestions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const { data: categories = [] } = useCategories();
  const { data: packages = [] } = usePackages();
  const navigate = useNavigate();

  const category = categories.find(c => c.id === categoryId);
  if (!category) return <div>Kategori tidak ditemukan</div>;

  const subCategories = categories.filter(c => c.parent_id === category.id);
  const hasSubCategories = subCategories.length > 0;

  if (!hasSubCategories) {
    const pkgs = packages.filter(p => p.category_id === category.id && p.is_published);
    return (
      <div>
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
        <h1 className="text-3xl font-bold mb-2">{category.icon} {category.name}</h1>
        <p className="text-muted-foreground mb-6">{category.description}</p>
        <h2 className="text-xl font-semibold mb-4">Pilih Paket Soal</h2>
        {pkgs.length === 0 ? (
          <p className="text-muted-foreground">Belum ada paket soal tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pkgs.map(pkg => (
              <Card key={pkg.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/exam/${pkg.id}`)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    {pkg.period_label && <Badge variant="outline">{pkg.period_label}</Badge>}
                  </div>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{pkg.duration} menit</span>
                    <Button size="sm">Mulai Ujian</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <Button variant="ghost" className="mb-4" onClick={() => navigate('/')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
      </Button>
      <h1 className="text-3xl font-bold mb-2">{category.icon} {category.name}</h1>
      <p className="text-muted-foreground mb-6">{category.description}</p>
      <h2 className="text-xl font-semibold mb-4">Pilih Sub Kategori</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subCategories.map(sub => (
          <Card key={sub.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/category/${sub.id}`)}>
            <CardHeader>
              <div className="text-3xl mb-1">{sub.icon}</div>
              <CardTitle className="text-lg">{sub.name}</CardTitle>
              <CardDescription>{sub.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
