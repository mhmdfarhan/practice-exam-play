import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Period } from '@/lib/types';

const PeriodManagement = () => {
  const { periods, categories, addPeriod, updatePeriod, deletePeriod } = useApp();
  const [editItem, setEditItem] = useState<Period | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ categoryId: '', name: '', startDate: '', endDate: '', isActive: true });

  // Only show leaf categories (no children or sub-categories)
  const leafCategories = categories.filter(c => !categories.some(ch => ch.parentId === c.id));

  const openAdd = () => { setEditItem(null); setForm({ categoryId: '', name: '', startDate: '', endDate: '', isActive: true }); setIsOpen(true); };
  const openEdit = (p: Period) => { setEditItem(p); setForm({ categoryId: p.categoryId, name: p.name, startDate: p.startDate, endDate: p.endDate, isActive: p.isActive }); setIsOpen(true); };

  const handleSave = () => {
    if (editItem) updatePeriod({ ...editItem, ...form });
    else addPeriod(form);
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Kelola Periode</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild><Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Tambah</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editItem ? 'Edit' : 'Tambah'} Periode</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Kategori</Label>
                <Select value={form.categoryId} onValueChange={val => setForm(f => ({ ...f, categoryId: val }))}>
                  <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                  <SelectContent>{leafCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Nama Periode</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Mulai</Label><Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} /></div>
                <div><Label>Selesai</Label><Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} /></div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.isActive} onCheckedChange={val => setForm(f => ({ ...f, isActive: val }))} />
                <Label>Aktif</Label>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
              <Button onClick={handleSave}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kategori</TableHead>
              <TableHead>Periode</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {periods.map(p => {
              const cat = categories.find(c => c.id === p.categoryId);
              return (
                <TableRow key={p.id}>
                  <TableCell>{cat?.icon} {cat?.name}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-sm">{p.startDate} — {p.endDate}</TableCell>
                  <TableCell>
                    <Badge variant={p.isActive ? 'default' : 'secondary'}>{p.isActive ? 'Aktif' : 'Nonaktif'}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deletePeriod(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

export default PeriodManagement;
