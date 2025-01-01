import { supabase } from '../../utils/supabaseClient';

export const logUserAction = async (action, module, details) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('user_logs')
      .insert([{
        user_id: user?.id,
        action,
        module,
        details
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error logging user action:', error);
    // Don't throw the error as logging failure shouldn't break the main functionality
  }
};