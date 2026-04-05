import { useAuth } from '@/contexts/AuthContext';
import { useExamResults } from '@/hooks/useExamResults';
import { useCategories } from '@/hooks/useCategories';
import { usePackages } from '@/hooks/usePackages';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const HistoryPage = () => {
  const { profile } = useAuth();
  const { data: results = [] } = useExamResults(profile?.id);
  const { data: categories = [] } = useCategories();
  const { data: packages = [] } = usePackages();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Riwayat Ujian</h1>
      <p className="text-muted-foreground mb-6">Daftar ujian yang pernah dikerjakan</p>

      {results.length === 0 ? (
        <p className="text-muted-foreground">Belum ada riwayat ujian.</p>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Paket</TableHead>
                <TableHead>Skor</TableHead>
                <TableHead>Benar/Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map(r => {
                const cat = categories.find(c => c.id === r.category_id);
                const pkg = packages.find(p => p.id === r.package_id);
                return (
                  <TableRow key={r.id}>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{cat?.icon} {cat?.name}</TableCell>
                    <TableCell>{pkg?.name}</TableCell>
                    <TableCell className="font-bold">{r.score}%</TableCell>
                    <TableCell>{r.correct_answers}/{r.total_questions}</TableCell>
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

export default HistoryPage;
