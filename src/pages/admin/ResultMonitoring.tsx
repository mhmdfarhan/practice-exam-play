import { useApp } from '@/contexts/AppContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const ResultMonitoring = () => {
  const { results, users, getCategoryById, getPackageById } = useApp();

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
                <TableHead>User</TableHead>
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
                const user = users.find(u => u.id === r.userId);
                const cat = getCategoryById(r.categoryId);
                const per = periods.find(p => p.id === r.periodId);
                return (
                  <TableRow key={r.id}>
                    <TableCell>{user?.name}</TableCell>
                    <TableCell>{cat?.icon} {cat?.name}</TableCell>
                    <TableCell>{per?.name}</TableCell>
                    <TableCell className="font-bold">{r.score}%</TableCell>
                    <TableCell>{r.correctAnswers}/{r.totalQuestions}</TableCell>
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
