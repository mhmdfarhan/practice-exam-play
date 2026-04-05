import { useState } from 'react';
import { useCategories, useAddCategory, useUpdateCategory, useDeleteCategory, Category } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const CategoryManagement = () => {
  const { data: categories = [] } = useCategories();
  const addCategory = useAddCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [editItem, setEditItem] = useState<Category | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', icon: '📝', parent_id: '' });

  const rootCategories = categories.filter(c => c.parent_id === null);

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: '', description: '', icon: '📝', parent_id: '' });
    setIsOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditItem(c);
    setForm({ name: c.name, description: c.description, icon: c.icon, parent_id: c.parent_id || '' });
    setIsOpen(true);
  };

  const handleSave = () => {
    const payload = { ...form, parent_id: form.parent_id || null };
    if (editItem) {
      updateCategory.mutate({ ...editItem, ...payload });
    } else {
      addCategory.mutate(payload);
    }
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Kelola Kategori</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Tambah</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editItem ? 'Edit' : 'Tambah'} Kategori</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div><Label>Icon (emoji)</Label><Input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} /></div>
              <div><Label>Nama</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div><Label>Deskripsi</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div>
                <Label>Parent Kategori</Label>
                <Select value={form.parent_id} onValueChange={val => setForm(f => ({ ...f, parent_id: val === '_none' ? '' : val }))}>
                  <SelectTrigger><SelectValue placeholder="Tidak ada (root)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">Tidak ada (root)</SelectItem>
                    {rootCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
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
              <TableHead>Icon</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead className="w-24">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.icon}</TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{c.description}</TableCell>
                <TableCell>{c.parent_id ? categories.find(p => p.id === c.parent_id)?.name : '—'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteCategory.mutate(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CategoryManagement;
