/*
  # Employee Management Updates

  1. Changes
    - Add date_hired column to employees table
    - Remove password column requirement from employees table
    - Add more employee details columns

  2. Security
    - Maintain existing RLS policies
*/

-- Remove not null constraint from password column
ALTER TABLE employees ALTER COLUMN password DROP NOT NULL;

-- Add date_hired and additional details columns
ALTER TABLE employees 
  ADD COLUMN IF NOT EXISTS date_hired date NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS position text,
  ADD COLUMN IF NOT EXISTS department text,
  ADD COLUMN IF NOT EXISTS emergency_contact text,
  ADD COLUMN IF NOT EXISTS emergency_phone text,
  ADD COLUMN IF NOT EXISTS address text;