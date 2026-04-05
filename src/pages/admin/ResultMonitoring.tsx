import { useExamResults } from '@/hooks/useExamResults';
import { useCategories } from '@/hooks/useCategories';
import { usePackages } from '@/hooks/usePackages';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const ResultMonitoring = () => {
  const { data: results = [] } = useExamResults();
  const { data: categories = [] } = useCategories();
  const { data: packages = [] } = usePackages();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Hasil Ujian</h1>
      {results.length === 0 ? (
        <p className="text-muted-foreground">Belum ada hasil ujian.</p>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kategori</TableHead>
                <TableHead>Paket</TableHead>
                <TableHead>Skor</TableHead>
                <TableHead>Benar/Total</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map(r => {
                const cat = categories.find(c => c.id === r.category_id);
                const pkg = packages.find(p => p.id === r.package_id);
                return (
                  <TableRow key={r.id}>
                    <TableCell>{cat?.icon} {cat?.name}</TableCell>
                    <TableCell>{pkg?.name}</TableCell>
                    <TableCell className="font-bold">{r.score}%</TableCell>
                    <TableCell>{r.correct_answers}/{r.total_questions}</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>
                      <Badge variant={r.score >= 60 ? 'default' : 'destructive'}>
                        {r.score >= 60 ? 'Lulus' : 'Tidak Lulus'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ResultMonitoring;
