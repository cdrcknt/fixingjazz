import { supabase } from '../supabaseClient';

export const updateEmployee = async (employee) => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .update({
        name: employee.name,
        email: employee.email,
        role: employee.role,
        position: employee.position,
        department: employee.department,
        birth_date: employee.birth_date,
        date_hired: employee.date_hired,
        emergency_contact: employee.emergency_contact,
        emergency_phone: employee.emergency_phone,
        address: employee.address
      })
      .eq('id', employee.id)
      .select();

    if (error) throw error;

    // Log the update action
    await supabase
      .from('user_logs')
      .insert([{
        user_id: (await supabase.auth.getUser()).data.user?.id,
        action: 'update',
        module: 'employees',
        details: {
          employee_id: employee.id,
          changes: employee
        }
      }]);

    return data[0];
  } catch (error) {
    throw new Error(`Failed to update employee: ${error.message}`);
  }
};

export const deleteEmployee = async (employeeId) => {
  try {
    // Get employee data before deletion for logging
    const { data: employeeData } = await supabase
      .from('employees')
      .select('*')
      .eq('id', employeeId)
      .single();

    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', employeeId);

    if (error) throw error;

    // Log the deletion action
    await supabase
      .from('user_logs')
      .insert([{
        user_id: (await supabase.auth.getUser()).data.user?.id,
        action: 'delete',
        module: 'employees',
        details: {
          employee_id: employeeId,
          deleted_employee: employeeData
        }
      }]);
  } catch (error) {
    throw new Error(`Failed to delete employee: ${error.message}`);
  }
};