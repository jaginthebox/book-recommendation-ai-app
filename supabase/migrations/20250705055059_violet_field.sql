/*
  # Fix search_history RLS policy

  1. Security Updates
    - Drop existing INSERT policy that uses incorrect uid() function
    - Create new INSERT policy using correct auth.uid() function
    - Ensure policy allows authenticated users to insert their own search history

  2. Changes
    - Replace uid() with auth.uid() in INSERT policy check condition
    - Maintain same security model where users can only insert their own data
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can insert own search history" ON search_history;

-- Create new INSERT policy with correct auth.uid() function
CREATE POLICY "Users can insert own search history"
  ON search_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);