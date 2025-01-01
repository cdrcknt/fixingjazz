import { supabase } from '../utils/supabaseClient';

export const updateRecord = async (table, id, data) => {
  try {
    // For employees table, we need to update both the employees table and auth user metadata
    if (table === 'employees') {
      const { error: employeeError } = await supabase
        .from('employees')
        .update({
          name: data.name,
          email: data.email,
          role: data.role,
          position: data.position,
          department: data.department,
          birth_date: data.birth_date,
          date_hired: data.date_hired,
          emergency_contact: data.emergency_contact,
          emergency_phone: data.emergency_phone,
          address: data.address
        })
        .eq('id', id);

      if (employeeError) throw employeeError;

      // Log the update in user_logs
      await supabase.from('user_logs').insert([{
        user_id: (await supabase.auth.getUser()).data.user?.id,
        action: 'update',
        module: 'employees',
        details: { employee_id: id, changes: data }
      }]);

    } else {
      const { error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id);

      if (error) throw error;
    }
  } catch (error) {
    console.error(`Error updating ${table}:`, error);
    throw error;
  }
};

export const deleteRecord = async (table, id) => {
  try {
    // For employees table, we need special handling
    if (table === 'employees') {
      // Get employee data before deletion for logging
      const { data: employeeData } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();

      const { error: deleteError } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Log the deletion
      await supabase.from('user_logs').insert([{
        user_id: (await supabase.auth.getUser()).data.user?.id,
        action: 'delete',
        module: 'employees',
        details: { deleted_employee: employeeData }
      }]);

    } else {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
    }
  } catch (error) {
    console.error(`Error deleting from ${table}:`, error);
    throw error;
  }
};

export const fetchRecords = async (table) => {
  try {
    let query = supabase.from(table).select('*');
    
    // For employees, we want to order by name
    if (table === 'employees') {
      query = query.order('name', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching ${table}:`, error);
    throw error;
  }
};