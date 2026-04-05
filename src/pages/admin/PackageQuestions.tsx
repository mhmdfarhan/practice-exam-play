import { useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePackages } from '@/hooks/usePackages';
import { useCategories } from '@/hooks/useCategories';
import { useQuestions, useAddQuestion, useUpdateQuestion, useDeleteQuestion, Question } from '@/hooks/useQuestions';
import { useBankQuestions } from '@/hooks/useBankQuestions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, Copy, FileJson, Upload, Pencil, Database, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const PackageQuestions = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { data: packages = [] } = usePackages();
  const { data: categories = [] } = useCategories();
  const { data: questions = [] } = useQuestions(packageId);
  const { data: bankQuestions = [] } = useBankQuestions();
  const addQuestion = useAddQuestion();
  const updateQuestion = useUpdateQuestion();
  const deleteQuestion = useDeleteQuestion();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pkg = packages.find(p => p.id === packageId);
  const category = pkg ? categories.find(c => c.id === pkg.category_id) : undefined;

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Question | null>(null);
  const [form, setForm] = useState({ text: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' });
  const [importTab, setImportTab] = useState('manual');
  const [jsonInput, setJsonInput] = useState('');
  const [csvPreview, setCsvPreview] = useState<Array<{ text: string; options: string[]; correctAnswer: number }>>([]);
  const [jsonPreview, setJsonPreview] = useState<Array<{ text: string; options: string[]; correctAnswer: number; explanation?: string }>>([]);
  const [importError, setImportError] = useState('');
  const [bankSearch, setBankSearch] = useState('');
  const [bankSelected, setBankSelected] = useState<Set<string>>(new Set());

  const availableBankQuestions = useMemo(() => {
    if (!pkg) return [];
    const bq = bankQuestions.filter(q => q.category_id === pkg.category_id);
    if (!bankSearch) return bq;
    return bq.filter(q => q.text.toLowerCase().includes(bankSearch.toLowerCase()));
  }, [pkg, bankQuestions, bankSearch]);

  if (!pkg) return <div className="p-8">Paket tidak ditemukan</div>;

  const toggleSelect = (id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleAll = () => {
    if (selected.size === questions.length) setSelected(new Set());
    else setSelected(new Set(questions.map(q => q.id)));
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ text: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' });
    setImportTab('manual');
    setJsonInput(''); setCsvPreview([]); setJsonPreview([]); setImportError('');
    setBankSearch(''); setBankSelected(new Set());
    setIsAddOpen(true);
  };
  const openEdit = (q: Question) => {
    setEditItem(q);
    setForm({ text: q.text, options: [...q.options], correctAnswer: q.correct_answer, explanation: q.explanation || '' });
    setImportTab('manual');
    setIsAddOpen(true);
  };

  const handleSaveManual = () => {
    if (editItem) {
      updateQuestion.mutate({ ...editItem, text: form.text, options: form.options, correct_answer: form.correctAnswer, explanation: form.explanation || null });
    } else {
      addQuestion.mutate({ package_id: packageId!, text: form.text, options: form.options, correct_answer: form.correctAnswer, explanation: form.explanation || null });
    }
    setIsAddOpen(false);
  };

  const setOption = (i: number, val: string) => {
    const opts = [...form.options]; opts[i] = val;
    setForm(f => ({ ...f, options: opts }));
  };

  const handleDeleteSelected = () => {
    selected.forEach(id => deleteQuestion.mutate(id));
    setSelected(new Set());
  };
  const handleDuplicateSelected = () => {
    questions.filter(q => selected.has(q.id)).forEach(q => {
      addQuestion.mutate({ package_id: q.package_id, text: q.text, options: [...q.options], correct_answer: q.correct_answer, explanation: q.explanation });
    });
    setSelected(new Set());
  };
  const handleDuplicate = (q: Question) => {
    addQuestion.mutate({ package_id: q.package_id, text: q.text, options: [...q.options], correct_answer: q.correct_answer, explanation: q.explanation });
  };

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
    jsonPreview.forEach(q => addQuestion.mutate({ package_id: packageId!, text: q.text, options: q.options, correct_answer: q.correctAnswer, explanation: q.explanation || null }));
    setJsonInput(''); setJsonPreview([]); setIsAddOpen(false);
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
    csvPreview.forEach(q => addQuestion.mutate({ package_id: packageId!, text: q.text, options: q.options, correct_answer: q.correctAnswer, explanation: null }));
    setCsvPreview([]); setIsAddOpen(false);
  };

  const handleAddFromBank = () => {
    bankQuestions.filter(bq => bankSelected.has(bq.id)).forEach(bq => {
      addQuestion.mutate({ package_id: packageId!, text: bq.text, options: [...bq.options], correct_answer: bq.correct_answer, explanation: bq.explanation });
    });
    setBankSelected(new Set());
    setIsAddOpen(false);
  };

  const questionCount = questions.length;
  const targetLabel = pkg.target_questions ? `${questionCount} / ${pkg.target_questions} soal` : `${questionCount} soal`;

  return (
    <div>
      <Button variant="ghost" className="mb-4" onClick={() => navigate('/admin/questions')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
      </Button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{pkg.name}</h1>
          <p className="text-muted-foreground text-sm">{category?.icon} {category?.name} · {pkg.duration} menit</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={pkg.is_published ? 'default' : 'secondary'}>{pkg.is_published ? 'Published' : 'Draft'}</Badge>
            {pkg.period_label && <Badge variant="outline">{pkg.period_label}</Badge>}
            <span className="text-sm font-medium text-muted-foreground">{targetLabel}</span>
          </div>
        </div>
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Tambah Soal</Button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-muted/20">
          <p className="text-lg text-muted-foreground mb-4">Belum ada soal dalam paket ini</p>
          <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Tambah Soal Pertama</Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={selected.size === questions.length && questions.length > 0} onCheckedChange={toggleAll} /></TableHead>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Pertanyaan</TableHead>
                <TableHead>Jawaban Benar</TableHead>
                <TableHead className="w-28">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((q, i) => (
                <TableRow key={q.id} className={cn(selected.has(q.id) && 'bg-muted/50')}>
                  <TableCell><Checkbox checked={selected.has(q.id)} onCheckedChange={() => toggleSelect(q.id)} /></TableCell>
                  <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="max-w-xs truncate">{q.text}</TableCell>
                  <TableCell className="text-sm text-green-700">{q.options[q.correct_answer]}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(q)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDuplicate(q)}><Copy className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteQuestion.mutate(q.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-background border shadow-lg rounded-lg px-6 py-3 flex items-center gap-4 z-50">
          <span className="text-sm font-medium">{selected.size} soal dipilih</span>
          <Button size="sm" variant="outline" onClick={handleDuplicateSelected}><Copy className="mr-2 h-4 w-4" /> Duplikat</Button>
          <Button size="sm" variant="destructive" onClick={handleDeleteSelected}><Trash2 className="mr-2 h-4 w-4" /> Hapus</Button>
        </div>
      )}

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Soal' : 'Tambah Soal'}</DialogTitle>
          </DialogHeader>

          {editItem ? (
            <div className="space-y-4">
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
                <TabsTrigger value="bank" className="flex-1"><Database className="mr-1 h-4 w-4" /> Bank Soal</TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-4">
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
                  <Button onClick={handleSaveManual} disabled={!form.text || form.options.some(o => !o)}>Simpan</Button>
                </DialogFooter>
              </TabsContent>

              <TabsContent value="json" className="space-y-4">
                <div><Label>Paste JSON</Label>
                  <Textarea className="min-h-[150px] font-mono text-xs" placeholder={`[\n  {"text":"...", "options":["A","B","C","D"], "correctAnswer":0}\n]`} value={jsonInput} onChange={e => setJsonInput(e.target.value)} />
                </div>
                {importError && <p className="text-sm text-destructive">{importError}</p>}
                <Button variant="outline" onClick={handleValidateJson} disabled={!jsonInput.trim()}>Validasi</Button>
                {jsonPreview.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Preview: {jsonPreview.length} soal</p>
                    <DialogFooter className="mt-4"><Button onClick={handleImportJson}>Import {jsonPreview.length} Soal</Button></DialogFooter>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="csv" className="space-y-4">
                <div>
                  <Label>Upload CSV</Label>
                  <p className="text-xs text-muted-foreground mb-2">Format: question,option_a,option_b,option_c,option_d,correct_answer(0-3)</p>
                  <Input ref={fileInputRef} type="file" accept=".csv" onChange={handleCsvFile} />
                </div>
                {importError && <p className="text-sm text-destructive">{importError}</p>}
                {csvPreview.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Preview: {csvPreview.length} soal</p>
                    <DialogFooter className="mt-4"><Button onClick={handleImportCsv}>Import {csvPreview.length} Soal</Button></DialogFooter>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="bank" className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Cari soal di bank..." value={bankSearch} onChange={e => setBankSearch(e.target.value)} />
                </div>
                {availableBankQuestions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Tidak ada soal di bank untuk kategori ini</p>
                ) : (
                  <div className="max-h-64 overflow-y-auto border rounded">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10"><Checkbox checked={bankSelected.size === availableBankQuestions.length && availableBankQuestions.length > 0} onCheckedChange={() => {
                            if (bankSelected.size === availableBankQuestions.length) setBankSelected(new Set());
                            else setBankSelected(new Set(availableBankQuestions.map(q => q.id)));
                          }} /></TableHead>
                          <TableHead>Pertanyaan</TableHead>
                          <TableHead>Tags</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {availableBankQuestions.map(q => (
                          <TableRow key={q.id}>
                            <TableCell><Checkbox checked={bankSelected.has(q.id)} onCheckedChange={() => {
                              setBankSelected(prev => { const n = new Set(prev); n.has(q.id) ? n.delete(q.id) : n.add(q.id); return n; });
                            }} /></TableCell>
                            <TableCell className="max-w-xs truncate">{q.text}</TableCell>
                            <TableCell><div className="flex flex-wrap gap-1">{q.tags.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}</div></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                {bankSelected.size > 0 && (
                  <DialogFooter><Button onClick={handleAddFromBank}>Tambah {bankSelected.size} Soal dari Bank</Button></DialogFooter>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackageQuestions;
