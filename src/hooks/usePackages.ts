import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface QuestionPackage {
  id: string;
  name: string;
  description: string;
  category_id: string;
  duration: number;
  target_questions: number | null;
  period_label: string | null;
  is_published: boolean;
  created_at: string;
}

export function usePackages() {
  return useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const { data, error } = await supabase.from('question_packages').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as QuestionPackage[];
    },
  });
}

export function useAddPackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pkg: Omit<QuestionPackage, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('question_packages').insert(pkg).select().single();
      if (error) throw error;
      return data as QuestionPackage;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['packages'] }),
  });
}

export function useUpdatePackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pkg: QuestionPackage) => {
      const { id, ...rest } = pkg;
      const { error } = await supabase.from('question_packages').update(rest).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['packages'] }),
  });
}

export function useDeletePackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('question_packages').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['packages'] }),
  });
}
