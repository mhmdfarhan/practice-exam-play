import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Question } from '@/lib/types';

const QuestionManagement = () => {
  const { questions, categories, periods, addQuestion, updateQuestion, deleteQuestion } = useApp();
  const [editItem, setEditItem] = useState<Question | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filterCat, setFilterCat] = useState('all');
  const [form, setForm] = useState({ categoryId: '', periodId: '', text: '', options: ['', '', '', ''], correctAnswer: 0 });

  const leafCategories = categories.filter(c => !categories.some(ch => ch.parentId === c.id));
  const filteredQuestions = filterCat === 'all' ? questions : questions.filter(q => q.categoryId === filterCat);
  const availablePeriods = form.categoryId ? periods.filter(p => p.categoryId === form.categoryId) : [];

  const openAdd = () => {
    setEditItem(null);
    setForm({ categoryId: '', periodId: '', text: '', options: ['', '', '', ''], correctAnswer: 0 });
    setIsOpen(true);
  };

  const openEdit = (q: Question) => {
    setEditItem(q);
    setForm({ categoryId: q.categoryId, periodId: q.periodId, text: q.text, options: [...q.options], correctAnswer: q.correctAnswer });
    setIsOpen(true);
  };

  const handleSave = () => {
    if (editItem) updateQuestion({ ...editItem, ...form });
    else addQuestion(form);
    setIsOpen(false);
  };

  const setOption = (i: number, val: string) => {
    const opts = [...form.options];
    opts[i] = val;
    setForm(f => ({ ...f, options: opts }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Kelola Soal</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild><Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Tambah</Button></DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader><DialogTitle>{editItem ? 'Edit' : 'Tambah'} Soal</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Kategori</Label>
                <Select value={form.categoryId} onValueChange={val => setForm(f => ({ ...f, categoryId: val, periodId: '' }))}>
                  <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                  <SelectContent>{leafCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Periode</Label>
                <Select value={form.periodId} onValueChange={val => setForm(f => ({ ...f, periodId: val }))}>
                  <SelectTrigger><SelectValue placeholder="Pilih periode" /></SelectTrigger>
                  <SelectContent>{availablePeriods.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Pertanyaan</Label><Input value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} /></div>
              {form.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Label className="w-20">Opsi {String.fromCharCode(65 + i)}</Label>
                  <Input className="flex-1" value={opt} onChange={e => setOption(i, e.target.value)} />
                  <input type="radio" name="correct" checked={form.correctAnswer === i} onChange={() => setForm(f => ({ ...f, correctAnswer: i }))} />
                </div>
              ))}
              <p className="text-xs text-muted-foreground">Pilih radio button untuk jawaban benar</p>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
              <Button onClick={handleSave}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
              <TableHead>Kategori</TableHead>
              <TableHead>Periode</TableHead>
              <TableHead>Pertanyaan</TableHead>
              <TableHead>Jawaban</TableHead>
              <TableHead className="w-24">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.map(q => {
              const cat = categories.find(c => c.id === q.categoryId);
              const per = periods.find(p => p.id === q.periodId);
              return (
                <TableRow key={q.id}>
                  <TableCell>{cat?.icon} {cat?.name}</TableCell>
                  <TableCell className="text-sm">{per?.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{q.text}</TableCell>
                  <TableCell className="text-sm text-green-700">{q.options[q.correctAnswer]}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(q)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteQuestion(q.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
