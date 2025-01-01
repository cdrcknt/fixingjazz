/*
  # Add cascade delete for employee records

  1. Changes
    - Add ON DELETE CASCADE to employee-related foreign keys
    - This ensures when an employee is deleted, all related records are also removed
*/

-- Add cascade delete to time_entries
ALTER TABLE time_entries
DROP CONSTRAINT IF EXISTS time_entries_employee_id_fkey,
ADD CONSTRAINT time_entries_employee_id_fkey
FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE;

-- Add cascade delete to schedules
ALTER TABLE schedules
DROP CONSTRAINT IF EXISTS schedules_employee_id_fkey,
ADD CONSTRAINT schedules_employee_id_fkey
FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE;