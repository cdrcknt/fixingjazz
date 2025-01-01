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
    return data[0];
  } catch (error) {
    throw new Error(`Failed to update employee: ${error.message}`);
  }
};

export const deleteEmployee = async (employeeId) => {
  try {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', employeeId);

    if (error) throw error;
  } catch (error) {
    throw new Error(`Failed to delete employee: ${error.message}`);
  }
};