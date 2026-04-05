import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Question {
  id: string;
  package_id: string;
  text: string;
  options: string[];
  correct_answer: number;
  explanation: string | null;
}

export function useQuestions(packageId?: string) {
  return useQuery({
    queryKey: ['questions', packageId],
    queryFn: async () => {
      let q = supabase.from('questions').select('*');
      if (packageId) q = q.eq('package_id', packageId);
      const { data, error } = await q.order('id');
      if (error) throw error;
      // Parse options from JSONB
      return (data || []).map(d => ({ ...d, options: d.options as unknown as string[] })) as Question[];
    },
    enabled: packageId !== undefined,
  });
}

export function useAllQuestions() {
  return useQuery({
    queryKey: ['questions', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase.from('questions').select('*');
      if (error) throw error;
      return (data || []).map(d => ({ ...d, options: d.options as unknown as string[] })) as Question[];
    },
  });
}

export function useAddQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (q: Omit<Question, 'id'>) => {
      const { data, error } = await supabase.from('questions').insert({
        package_id: q.package_id,
        text: q.text,
        options: q.options as any,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['questions'] }),
  });
}

export function useUpdateQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (q: Question) => {
      const { id, ...rest } = q;
      const { error } = await supabase.from('questions').update({
        ...rest,
        options: rest.options as any,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['questions'] }),
  });
}

export function useDeleteQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('questions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['questions'] }),
  });
}
