import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const { getCategoryById, getSubCategories, getPeriodsByCategory } = useApp();
  const navigate = useNavigate();

  const category = getCategoryById(categoryId!);
  if (!category) return <div>Kategori tidak ditemukan</div>;

  const subCategories = getSubCategories(category.id);
  const hasSubCategories = subCategories.length > 0;

  // If no sub-categories, go directly to periods
  if (!hasSubCategories) {
    const periods = getPeriodsByCategory(category.id);
    return (
      <div>
        <Button variant="ghost" className="mb-4" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
        <h1 className="text-3xl font-bold mb-2">{category.icon} {category.name}</h1>
        <p className="text-muted-foreground mb-6">{category.description}</p>
        <h2 className="text-xl font-semibold mb-4">Pilih Periode</h2>
        {periods.length === 0 ? (
          <p className="text-muted-foreground">Belum ada periode tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {periods.map(p => (
              <Card key={p.id} className={!p.isActive ? 'opacity-60' : ''}>
                <CardHeader>
                  <CardTitle className="text-lg">{p.name}</CardTitle>
                  <CardDescription>{p.startDate} — {p.endDate}</CardDescription>
                </CardHeader>
                <CardContent>
                  {p.isActive ? (
                    <Button onClick={() => navigate(`/exam/${category.id}/${p.id}`)}>
                      Mulai Ujian
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">Tidak Aktif</span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Show sub-categories
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
