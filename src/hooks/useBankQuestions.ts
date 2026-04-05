import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BankQuestion {
  id: string;
  text: string;
  options: string[];
  correct_answer: number;
  explanation: string | null;
  category_id: string;
  tags: string[];
}

export function useBankQuestions() {
  return useQuery({
    queryKey: ['bankQuestions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('bank_questions').select('*').order('id');
      if (error) throw error;
      return (data || []).map(d => ({
        ...d,
        options: d.options as unknown as string[],
        tags: d.tags || [],
      })) as BankQuestion[];
    },
  });
}

export function useAddBankQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (q: Omit<BankQuestion, 'id'>) => {
      const { data, error } = await supabase.from('bank_questions').insert({
        text: q.text,
        options: q.options as any,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        category_id: q.category_id,
        tags: q.tags,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bankQuestions'] }),
  });
}

export function useUpdateBankQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (q: BankQuestion) => {
      const { id, ...rest } = q;
      const { error } = await supabase.from('bank_questions').update({
        ...rest,
        options: rest.options as any,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bankQuestions'] }),
  });
}

export function useDeleteBankQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('bank_questions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bankQuestions'] }),
  });
}
