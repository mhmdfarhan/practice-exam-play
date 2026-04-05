import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ExamResult {
  id: string;
  user_id: string;
  package_id: string;
  category_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  answers: Record<string, number>;
  date: string;
}

export function useExamResults(userId?: string) {
  return useQuery({
    queryKey: ['examResults', userId],
    queryFn: async () => {
      let q = supabase.from('exam_results').select('*').order('date', { ascending: false });
      if (userId) q = q.eq('user_id', userId);
      const { data, error } = await q;
      if (error) throw error;
      return (data || []).map(d => ({ ...d, answers: d.answers as unknown as Record<string, number> })) as ExamResult[];
    },
  });
}

export function useAddExamResult() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (r: Omit<ExamResult, 'id'>) => {
      const { data, error } = await supabase.from('exam_results').insert({
        user_id: r.user_id,
        package_id: r.package_id,
        category_id: r.category_id,
        score: r.score,
        total_questions: r.total_questions,
        correct_answers: r.correct_answers,
        answers: r.answers as any,
        date: r.date,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['examResults'] }),
  });
}
