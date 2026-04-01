import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, FileText, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const QuestionManagement = () => {
  const { packages, categories, questions, deletePackage, getCategoryById } = useApp();
  const navigate = useNavigate();
  const [filterCat, setFilterCat] = useState('all');

  const leafCategories = categories.filter(c => !categories.some(ch => ch.parentId === c.id));
  const filteredPackages = filterCat === 'all' ? packages : packages.filter(p => p.categoryId === filterCat);

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
              const cat = getCategoryById(pkg.categoryId);
              const qCount = questions.filter(q => q.packageId === pkg.id).length;
              return (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">{pkg.name}</TableCell>
                  <TableCell>{cat?.icon} {cat?.name}</TableCell>
                  <TableCell>{pkg.duration} menit</TableCell>
                  <TableCell>{qCount}{pkg.targetQuestions ? ` / ${pkg.targetQuestions}` : ''}</TableCell>
                  <TableCell><Badge variant={pkg.isPublished ? 'default' : 'secondary'}>{pkg.isPublished ? 'Published' : 'Draft'}</Badge></TableCell>
                  <TableCell>{pkg.periodLabel ? <Badge variant="outline">{pkg.periodLabel}</Badge> : '—'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/packages/${pkg.id}/questions`)}><FileText className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deletePackage(pkg.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
