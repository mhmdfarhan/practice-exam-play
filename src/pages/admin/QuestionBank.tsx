import { useState, useRef, useMemo } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useBankQuestions, useAddBankQuestion, useUpdateBankQuestion, useDeleteBankQuestion, BankQuestion } from '@/hooks/useBankQuestions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Pencil, Search, FileJson, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

const QuestionBank = () => {
  const { data: categories = [] } = useCategories();
  const { data: bankQuestions = [] } = useBankQuestions();
  const addBankQuestion = useAddBankQuestion();
  const updateBankQuestion = useUpdateBankQuestion();
  const deleteBankQuestion = useDeleteBankQuestion();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<BankQuestion | null>(null);
  const [form, setForm] = useState({ text: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', categoryId: '', tags: '' });
  const [importTab, setImportTab] = useState('manual');
  const [jsonInput, setJsonInput] = useState('');
  const [jsonPreview, setJsonPreview] = useState<Array<{ text: string; options: string[]; correctAnswer: number; explanation?: string }>>([]);
  const [csvPreview, setCsvPreview] = useState<Array<{ text: string; options: string[]; correctAnswer: number }>>([]);
  const [importError, setImportError] = useState('');
  const [importCategoryId, setImportCategoryId] = useState('');
  const [importTags, setImportTags] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterTag, setFilterTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    bankQuestions.forEach(q => q.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [bankQuestions]);

  const filtered = useMemo(() => {
    return bankQuestions.filter(q => {
      if (filterCategory !== 'all' && q.category_id !== filterCategory) return false;
      if (filterTag !== 'all' && !q.tags.includes(filterTag)) return false;
      if (searchQuery && !q.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [bankQuestions, filterCategory, filterTag, searchQuery]);

  const toggleSelect = (id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(q => q.id)));
  };

  const parseTags = (s: string) => s.split(',').map(t => t.trim()).filter(Boolean);

  const openAdd = () => {
    setEditItem(null);
    setForm({ text: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', categoryId: '', tags: '' });
    setImportTab('manual'); setJsonInput(''); setJsonPreview([]); setCsvPreview([]); setImportError('');
    setImportCategoryId(''); setImportTags('');
    setIsDialogOpen(true);
  };
  const openEdit = (q: BankQuestion) => {
    setEditItem(q);
    setForm({ text: q.text, options: [...q.options], correctAnswer: q.correct_answer, explanation: q.explanation || '', categoryId: q.category_id, tags: q.tags.join(', ') });
    setImportTab('manual');
    setIsDialogOpen(true);
  };

  const setOption = (i: number, val: string) => {
    const opts = [...form.options]; opts[i] = val;
    setForm(f => ({ ...f, options: opts }));
  };

  const handleSaveManual = () => {
    const tags = parseTags(form.tags);
    if (editItem) {
      updateBankQuestion.mutate({ ...editItem, text: form.text, options: form.options, correct_answer: form.correctAnswer, explanation: form.explanation || null, category_id: form.categoryId, tags });
    } else {
      addBankQuestion.mutate({ text: form.text, options: form.options, correct_answer: form.correctAnswer, explanation: form.explanation || null, category_id: form.categoryId, tags });
    }
    setIsDialogOpen(false);
  };

  const handleDeleteSelected = () => { selected.forEach(id => deleteBankQuestion.mutate(id)); setSelected(new Set()); };

  const handleValidateJson = () => {
    setImportError('');
    try {
      const data = JSON.parse(jsonInput);
      if (!Array.isArray(data)) throw new Error('Data harus berupa array');
      const validated = data.map((item: any, i: number) => {
        if (!item.text || !Array.isArray(item.options) || item.options.length < 2 || item.correctAnswer === undefined)
          throw new Error(`Item ${i + 1}: format tidak valid`);
        return { text: item.text, options: item.options, correctAnswer: item.correctAnswer, explanation: item.explanation };
      });
      setJsonPreview(validated);
    } catch (e: any) { setImportError(e.message); setJsonPreview([]); }
  };
  const handleImportJson = () => {
    const tags = parseTags(importTags);
    jsonPreview.forEach(q => addBankQuestion.mutate({ text: q.text, options: q.options, correct_answer: q.correctAnswer, explanation: q.explanation || null, category_id: importCategoryId, tags }));
    setJsonInput(''); setJsonPreview([]); setIsDialogOpen(false);
  };

  const handleCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length < 2) { setImportError('CSV harus punya header dan minimal 1 baris data'); return; }
      const rows = lines.slice(1).map(line => {
        const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        return { text: cols[0] || '', options: [cols[1] || '', cols[2] || '', cols[3] || '', cols[4] || ''], correctAnswer: parseInt(cols[5]) || 0 };
      });
      setCsvPreview(rows); setImportError('');
    };
    reader.readAsText(file);
  };
  const handleImportCsv = () => {
    const tags = parseTags(importTags);
    csvPreview.forEach(q => addBankQuestion.mutate({ text: q.text, options: q.options, correct_answer: q.correctAnswer, explanation: null, category_id: importCategoryId, tags }));
    setCsvPreview([]); setIsDialogOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bank Soal</h1>
          <p className="text-muted-foreground text-sm">{bankQuestions.length} soal tersimpan</p>
        </div>
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Tambah Soal</Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Cari soal..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Kategori" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterTag} onValueChange={setFilterTag}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Tag" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tag</SelectItem>
            {allTags.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-muted/20"><p className="text-lg text-muted-foreground">Tidak ada soal ditemukan</p></div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={selected.size === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} /></TableHead>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Pertanyaan</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="w-24">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((q, i) => {
                const cat = categories.find(c => c.id === q.category_id);
                return (
                  <TableRow key={q.id} className={cn(selected.has(q.id) && 'bg-muted/50')}>
                    <TableCell><Checkbox checked={selected.has(q.id)} onCheckedChange={() => toggleSelect(q.id)} /></TableCell>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="max-w-xs truncate">{q.text}</TableCell>
                    <TableCell className="text-sm">{cat?.icon} {cat?.name}</TableCell>
                    <TableCell><div className="flex flex-wrap gap-1">{q.tags.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}</div></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(q)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteBankQuestion.mutate(q.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-background border shadow-lg rounded-lg px-6 py-3 flex items-center gap-4 z-50">
          <span className="text-sm font-medium">{selected.size} soal dipilih</span>
          <Button size="sm" variant="destructive" onClick={handleDeleteSelected}><Trash2 className="mr-2 h-4 w-4" /> Hapus</Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editItem ? 'Edit Soal Bank' : 'Tambah Soal ke Bank'}</DialogTitle></DialogHeader>

          {editItem ? (
            <div className="space-y-4">
              <div><Label>Kategori</Label>
                <Select value={form.categoryId} onValueChange={v => setForm(f => ({ ...f, categoryId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Tags (pisahkan dengan koma)</Label><Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="N5, 文法, grammar" /></div>
              <div><Label>Pertanyaan</Label><Textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} /></div>
              {form.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Label className="w-16">Opsi {String.fromCharCode(65 + i)}</Label>
                  <Input className="flex-1" value={opt} onChange={e => setOption(i, e.target.value)} />
                  <input type="radio" name="correct" checked={form.correctAnswer === i} onChange={() => setForm(f => ({ ...f, correctAnswer: i }))} />
                </div>
              ))}
              <div><Label>Pembahasan (opsional)</Label><Textarea value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))} /></div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
                <Button onClick={handleSaveManual}>Simpan</Button>
              </DialogFooter>
            </div>
          ) : (
            <Tabs value={importTab} onValueChange={setImportTab}>
              <TabsList className="w-full">
                <TabsTrigger value="manual" className="flex-1">Manual</TabsTrigger>
                <TabsTrigger value="json" className="flex-1"><FileJson className="mr-1 h-4 w-4" /> JSON</TabsTrigger>
                <TabsTrigger value="csv" className="flex-1"><Upload className="mr-1 h-4 w-4" /> CSV</TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-4">
                <div><Label>Kategori</Label>
                  <Select value={form.categoryId} onValueChange={v => setForm(f => ({ ...f, categoryId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                    <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Tags (pisahkan dengan koma)</Label><Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="N5, 文法, grammar" /></div>
                <div><Label>Pertanyaan</Label><Textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} /></div>
                {form.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Label className="w-16">Opsi {String.fromCharCode(65 + i)}</Label>
                    <Input className="flex-1" value={opt} onChange={e => setOption(i, e.target.value)} />
                    <input type="radio" name="correct-add" checked={form.correctAnswer === i} onChange={() => setForm(f => ({ ...f, correctAnswer: i }))} />
                  </div>
                ))}
                <div><Label>Pembahasan (opsional)</Label><Textarea value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))} /></div>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
                  <Button onClick={handleSaveManual} disabled={!form.text || !form.categoryId || form.options.some(o => !o)}>Simpan</Button>
                </DialogFooter>
              </TabsContent>

              <TabsContent value="json" className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Kategori</Label>
                    <Select value={importCategoryId} onValueChange={setImportCategoryId}>
                      <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                      <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Tags</Label><Input value={importTags} onChange={e => setImportTags(e.target.value)} placeholder="N5, 文法" /></div>
                </div>
                <div><Label>Paste JSON</Label>
                  <Textarea className="min-h-[150px] font-mono text-xs" placeholder={`[\n  {"text":"...", "options":["A","B","C","D"], "correctAnswer":0}\n]`} value={jsonInput} onChange={e => setJsonInput(e.target.value)} />
                </div>
                {importError && <p className="text-sm text-destructive">{importError}</p>}
                <Button variant="outline" onClick={handleValidateJson} disabled={!jsonInput.trim() || !importCategoryId}>Validasi</Button>
                {jsonPreview.length > 0 && (
                  <DialogFooter className="mt-4"><Button onClick={handleImportJson}>Import {jsonPreview.length} Soal</Button></DialogFooter>
                )}
              </TabsContent>

              <TabsContent value="csv" className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Kategori</Label>
                    <Select value={importCategoryId} onValueChange={setImportCategoryId}>
                      <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                      <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Tags</Label><Input value={importTags} onChange={e => setImportTags(e.target.value)} placeholder="N5, 文法" /></div>
                </div>
                <div>
                  <Label>Upload CSV</Label>
                  <p className="text-xs text-muted-foreground mb-2">Format: question,option_a,option_b,option_c,option_d,correct_answer(0-3)</p>
                  <Input ref={fileInputRef} type="file" accept=".csv" onChange={handleCsvFile} />
                </div>
                {importError && <p className="text-sm text-destructive">{importError}</p>}
                {csvPreview.length > 0 && (
                  <DialogFooter className="mt-4"><Button onClick={handleImportCsv}>Import {csvPreview.length} Soal</Button></DialogFooter>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionBank;
