import { supabase } from '../utils/supabase/client';

export const fetchActivePromotions = async () => {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('is_active', true)
    .eq('is_archived', false)
    .gte('end_date', now)
    .lte('start_date', now)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};