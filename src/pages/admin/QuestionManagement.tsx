import { useNavigate } from 'react-router-dom';
import { usePackages, useDeletePackage } from '@/hooks/usePackages';
import { useCategories } from '@/hooks/useCategories';
import { useAllQuestions } from '@/hooks/useQuestions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const QuestionManagement = () => {
  const { data: packages = [] } = usePackages();
  const { data: categories = [] } = useCategories();
  const { data: questions = [] } = useAllQuestions();
  const deletePackage = useDeletePackage();
  const navigate = useNavigate();
  const [filterCat, setFilterCat] = useState('all');

  const leafCategories = categories.filter(c => !categories.some(ch => ch.parent_id === c.id));
  const filteredPackages = filterCat === 'all' ? packages : packages.filter(p => p.category_id === filterCat);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Paket Soal</h1>
        <Button onClick={() => navigate('/admin/packages/new')}><Plus className="mr-2 h-4 w-4" /> Buat Paket</Button>
      </div>

      <div className="mb-4">
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {leafCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Paket</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Durasi</TableHead>
              <TableHead>Jumlah Soal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Label</TableHead>
              <TableHead className="w-32">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPackages.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Belum ada paket soal</TableCell></TableRow>
            ) : filteredPackages.map(pkg => {
              const cat = categories.find(c => c.id === pkg.category_id);
              const qCount = questions.filter(q => q.package_id === pkg.id).length;
              return (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">{pkg.name}</TableCell>
                  <TableCell>{cat?.icon} {cat?.name}</TableCell>
                  <TableCell>{pkg.duration} menit</TableCell>
                  <TableCell>{qCount}{pkg.target_questions ? ` / ${pkg.target_questions}` : ''}</TableCell>
                  <TableCell><Badge variant={pkg.is_published ? 'default' : 'secondary'}>{pkg.is_published ? 'Published' : 'Draft'}</Badge></TableCell>
                  <TableCell>{pkg.period_label ? <Badge variant="outline">{pkg.period_label}</Badge> : '—'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/packages/${pkg.id}/questions`)}><FileText className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deletePackage.mutate(pkg.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default QuestionManagement;
