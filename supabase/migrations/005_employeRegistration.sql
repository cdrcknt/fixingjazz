/*
  # Update Employee RLS Policies

  1. Changes
    - Update the SELECT policy for employees table to allow viewing all employees
    - Keep existing policies for INSERT, UPDATE, and DELETE operations

  2. Security
    - Users can view all employees
    - Users can only modify employees they created
*/

-- Drop the existing SELECT policy
DROP POLICY IF EXISTS "Users can view their own employees" ON employees;

-- Create new SELECT policy that allows viewing all employees
CREATE POLICY "Users can view all employees"
ON employees
FOR SELECT
TO authenticated
USING (true);