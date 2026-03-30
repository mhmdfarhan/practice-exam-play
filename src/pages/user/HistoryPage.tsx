import { useApp } from '@/contexts/AppContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const HistoryPage = () => {
  const { currentUser, getResultsByUser, getCategoryById, periods } = useApp();
  const results = getResultsByUser(currentUser!.id);

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
                <TableHead>Periode</TableHead>
                <TableHead>Skor</TableHead>
                <TableHead>Benar/Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map(r => {
                const cat = getCategoryById(r.categoryId);
                const period = periods.find(p => p.id === r.periodId);
                return (
                  <TableRow key={r.id}>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{cat?.icon} {cat?.name}</TableCell>
                    <TableCell>{period?.name}</TableCell>
                    <TableCell className="font-bold">{r.score}%</TableCell>
                    <TableCell>{r.correctAnswers}/{r.totalQuestions}</TableCell>
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
