import { supabase } from '../../utils/supabaseClient';
import { logUserAction } from '../logging/userLogService';

export const updateEmployee = async (id, data) => {
  try {
    const { error } = await supabase
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

    if (error) throw error;

    await logUserAction('update', 'employees', { employee_id: id, changes: data });
    return true;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const { data: employeeData } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await logUserAction('delete', 'employees', { deleted_employee: employeeData });
    return true;
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};

export const fetchEmployees = async () => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};