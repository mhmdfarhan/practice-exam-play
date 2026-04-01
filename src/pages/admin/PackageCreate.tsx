import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const PackageCreate = () => {
  const { categories, addPackage } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', description: '', categoryId: '',
    duration: 30, targetQuestions: 0, periodLabel: '',
    isPublished: false,
  });

  const leafCategories = categories.filter(c => !categories.some(ch => ch.parentId === c.id));

  const handleFinish = () => {
    const pkg = {
      ...form,
      targetQuestions: form.targetQuestions || undefined,
      periodLabel: form.periodLabel || undefined,
      createdAt: new Date().toISOString().split('T')[0],
    };
    addPackage(pkg);
    // Navigate to questions page — we need the new id, but since addPackage uses crypto.randomUUID
    // we'll navigate to the package list for now
    navigate('/admin/questions');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => navigate('/admin/questions')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
      </Button>
      <h1 className="text-3xl font-bold mb-6">Buat Paket Soal</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              s < step ? 'bg-primary text-primary-foreground' : s === step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {s < step ? <Check className="h-4 w-4" /> : s}
            </div>
            <span className="text-sm hidden sm:inline">{s === 1 ? 'Info Dasar' : s === 2 ? 'Pengaturan' : 'Selesai'}</span>
            {s < 3 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader><CardTitle>Info Dasar</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nama Paket</Label>
              <Input placeholder="Contoh: JLPT N5 Latihan 1" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <Label>Kategori</Label>
              <Select value={form.categoryId} onValueChange={val => setForm(f => ({ ...f, categoryId: val }))}>
                <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                <SelectContent>{leafCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Deskripsi (opsional)</Label>
              <Textarea placeholder="Deskripsi singkat tentang paket ini" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="flex justify-end">
              <Button disabled={!form.name || !form.categoryId} onClick={() => setStep(2)}>
                Selanjutnya <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader><CardTitle>Pengaturan</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Durasi Ujian (menit)</Label>
              <Input type="number" min={5} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: parseInt(e.target.value) || 30 }))} />
            </div>
            <div>
              <Label>Target Jumlah Soal (opsional)</Label>
              <Input type="number" min={0} value={form.targetQuestions || ''} onChange={e => setForm(f => ({ ...f, targetQuestions: parseInt(e.target.value) || 0 }))} placeholder="0 = tidak ada target" />
            </div>
            <div>
              <Label>Label Periode (opsional)</Label>
              <Input placeholder="Contoh: JFT April 2026" value={form.periodLabel} onChange={e => setForm(f => ({ ...f, periodLabel: e.target.value }))} />
              <p className="text-xs text-muted-foreground mt-1">Paket dengan label periode akan ditampilkan di section "Trending"</p>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isPublished} onCheckedChange={val => setForm(f => ({ ...f, isPublished: val }))} />
              <Label>Publish langsung</Label>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="mr-2 h-4 w-4" /> Kembali</Button>
              <Button onClick={() => setStep(3)}>Selanjutnya <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader><CardTitle>Ringkasan</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Nama:</span><span className="font-medium">{form.name}</span>
              <span className="text-muted-foreground">Kategori:</span><span className="font-medium">{leafCategories.find(c => c.id === form.categoryId)?.name}</span>
              <span className="text-muted-foreground">Durasi:</span><span className="font-medium">{form.duration} menit</span>
              {form.targetQuestions > 0 && <><span className="text-muted-foreground">Target Soal:</span><span className="font-medium">{form.targetQuestions}</span></>}
              {form.periodLabel && <><span className="text-muted-foreground">Label Periode:</span><span className="font-medium">{form.periodLabel}</span></>}
              <span className="text-muted-foreground">Status:</span><span className="font-medium">{form.isPublished ? '✅ Published' : '📝 Draft'}</span>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="mr-2 h-4 w-4" /> Kembali</Button>
              <Button onClick={handleFinish}><Check className="mr-2 h-4 w-4" /> Buat Paket</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PackageCreate;
