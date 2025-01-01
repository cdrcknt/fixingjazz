import { supabase } from '../utils/supabaseClient';

export const updateRecord = async (table, id, data) => {
  const { error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id);

  if (error) throw error;
};

export const deleteRecord = async (table, id) => {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const fetchRecords = async (table) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};