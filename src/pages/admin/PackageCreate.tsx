import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { useAddPackage } from '@/hooks/usePackages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const PackageCreate = () => {
  const { data: categories = [] } = useCategories();
  const addPackage = useAddPackage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', description: '', category_id: '',
    duration: 30, target_questions: 0, period_label: '',
    is_published: false,
  });

  const leafCategories = categories.filter(c => !categories.some(ch => ch.parent_id === c.id));

  const handleFinish = async () => {
    await addPackage.mutateAsync({
      name: form.name,
      description: form.description,
      category_id: form.category_id,
      duration: form.duration,
      target_questions: form.target_questions || null,
      period_label: form.period_label || null,
      is_published: form.is_published,
    });
    navigate('/admin/questions');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => navigate('/admin/questions')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
      </Button>
      <h1 className="text-3xl font-bold mb-6">Buat Paket Soal</h1>

      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              s <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
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
            <div><Label>Nama Paket</Label><Input placeholder="Contoh: JLPT N5 Latihan 1" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div>
              <Label>Kategori</Label>
              <Select value={form.category_id} onValueChange={val => setForm(f => ({ ...f, category_id: val }))}>
                <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                <SelectContent>{leafCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Deskripsi (opsional)</Label><Textarea placeholder="Deskripsi singkat" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
            <div className="flex justify-end">
              <Button disabled={!form.name || !form.category_id} onClick={() => setStep(2)}>Selanjutnya <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader><CardTitle>Pengaturan</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Durasi Ujian (menit)</Label><Input type="number" min={5} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: parseInt(e.target.value) || 30 }))} /></div>
            <div><Label>Target Jumlah Soal (opsional)</Label><Input type="number" min={0} value={form.target_questions || ''} onChange={e => setForm(f => ({ ...f, target_questions: parseInt(e.target.value) || 0 }))} placeholder="0 = tidak ada target" /></div>
            <div><Label>Label Periode (opsional)</Label><Input placeholder="Contoh: JFT April 2026" value={form.period_label} onChange={e => setForm(f => ({ ...f, period_label: e.target.value }))} /></div>
            <div className="flex items-center gap-3"><Switch checked={form.is_published} onCheckedChange={val => setForm(f => ({ ...f, is_published: val }))} /><Label>Publish langsung</Label></div>
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
              <span className="text-muted-foreground">Kategori:</span><span className="font-medium">{leafCategories.find(c => c.id === form.category_id)?.name}</span>
              <span className="text-muted-foreground">Durasi:</span><span className="font-medium">{form.duration} menit</span>
              {form.target_questions > 0 && <><span className="text-muted-foreground">Target Soal:</span><span className="font-medium">{form.target_questions}</span></>}
              {form.period_label && <><span className="text-muted-foreground">Label Periode:</span><span className="font-medium">{form.period_label}</span></>}
              <span className="text-muted-foreground">Status:</span><span className="font-medium">{form.is_published ? '✅ Published' : '📝 Draft'}</span>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="mr-2 h-4 w-4" /> Kembali</Button>
              <Button onClick={handleFinish} disabled={addPackage.isPending}><Check className="mr-2 h-4 w-4" /> Buat Paket</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PackageCreate;
