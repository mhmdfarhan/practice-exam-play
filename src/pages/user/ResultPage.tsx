import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Trophy } from 'lucide-react';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCategoryById, periods } = useApp();
  const result = location.state as any;

  if (!result) {
    navigate('/');
    return null;
  }

  const category = getCategoryById(result.categoryId);
  const period = periods.find(p => p.id === result.periodId);
  const passed = result.score >= 60;

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="mb-6">
        <Trophy className={`h-16 w-16 mx-auto ${passed ? 'text-yellow-500' : 'text-muted-foreground'}`} />
      </div>
      <h1 className="text-3xl font-bold mb-2">Hasil Ujian</h1>
      <p className="text-muted-foreground mb-6">{category?.name} — {period?.name}</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className={`text-5xl ${passed ? 'text-green-600' : 'text-destructive'}`}>
            {result.score}%
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {passed ? '✅ LULUS' : '❌ TIDAK LULUS'}
          </div>
          <div className="flex justify-center gap-8 pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="font-medium">{result.correctAnswers} Benar</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              <span className="font-medium">{result.totalQuestions - result.correctAnswers} Salah</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground pt-2">
            {result.correctAnswers} dari {result.totalQuestions} soal dijawab benar
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={() => navigate('/')}>Kembali ke Dashboard</Button>
        <Button onClick={() => navigate('/history')}>Lihat Riwayat</Button>
      </div>
    </div>
  );
};

export default ResultPage;
