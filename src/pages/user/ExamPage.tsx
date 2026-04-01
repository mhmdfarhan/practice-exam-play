import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, ArrowRight, Clock, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const ExamPage = () => {
  const { packageId } = useParams();
  const { getQuestionsByPackage, getPackageById, getCategoryById, addResult, currentUser } = useApp();
  const navigate = useNavigate();

  const pkg = getPackageById(packageId!);
  const questions = getQuestionsByPackage(packageId!);
  const category = pkg ? getCategoryById(pkg.categoryId) : undefined;
  const timeLimit = (pkg?.duration || 30) * 60;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted]);

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    let correct = 0;
    questions.forEach(q => { if (answers[q.id] === q.correctAnswer) correct++; });
    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    const result = {
      userId: currentUser!.id,
      packageId: packageId!,
      categoryId: pkg?.categoryId || '',
      score,
      totalQuestions: questions.length,
      correctAnswers: correct,
      answers,
      date: new Date().toISOString().split('T')[0],
    };
    addResult(result);
    navigate('/result', { state: result });
  }, [answers, questions, submitted, packageId, pkg, currentUser]);

  if (!questions.length) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-muted-foreground">Belum ada soal untuk paket ini.</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>Kembali</Button>
      </div>
    );
  }

  const current = questions[currentIndex];
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">{category?.icon} {category?.name}</h1>
          <p className="text-sm text-muted-foreground">{pkg?.name}</p>
        </div>
        <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
          <Clock className="h-4 w-4" />
          <span className={cn("font-mono font-bold", timeLeft < 300 && "text-destructive")}>
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Soal {currentIndex + 1} / {questions.length}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg">{current.text}</p>
            <RadioGroup
              value={answers[current.id]?.toString()}
              onValueChange={val => setAnswers(prev => ({ ...prev, [current.id]: parseInt(val) }))}
            >
              {current.options.map((opt, i) => (
                <div key={i} className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={i.toString()} id={`opt-${i}`} />
                  <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
            <div className="flex justify-between pt-4">
              <Button variant="outline" disabled={currentIndex === 0} onClick={() => setCurrentIndex(i => i - 1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Sebelumnya
              </Button>
              {currentIndex < questions.length - 1 ? (
                <Button onClick={() => setCurrentIndex(i => i + 1)}>
                  Selanjutnya <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button><Send className="mr-2 h-4 w-4" /> Submit Ujian</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Submit Ujian?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Anda telah menjawab {Object.keys(answers).length} dari {questions.length} soal.
                        Setelah submit, jawaban tidak bisa diubah.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSubmit}>Ya, Submit</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Navigasi Soal</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, i) => (
              <Button
                key={q.id}
                variant={i === currentIndex ? 'default' : answers[q.id] !== undefined ? 'secondary' : 'outline'}
                size="sm"
                className="h-9 w-9 p-0"
                onClick={() => setCurrentIndex(i)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground space-y-1 mt-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-primary" /> Soal saat ini</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-secondary" /> Sudah dijawab</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded border" /> Belum dijawab</div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full mt-4" variant="default"><Send className="mr-2 h-4 w-4" /> Submit</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Submit Ujian?</AlertDialogTitle>
                <AlertDialogDescription>
                  Anda telah menjawab {Object.keys(answers).length} dari {questions.length} soal.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>Ya, Submit</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
