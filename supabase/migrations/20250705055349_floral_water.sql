/*
  # Fix RLS policy for search_history table

  1. Security Changes
    - Drop existing INSERT policy that uses incorrect uid() function
    - Create new INSERT policy using correct auth.uid() function
    - Ensure users can only insert their own search history records

  2. Policy Details
    - Policy allows authenticated users to insert records where user_id matches their auth.uid()
    - This fixes the "new row violates row-level security policy" error
*/

-- Drop the existing INSERT policy with incorrect function
DROP POLICY IF EXISTS "Users can insert own search history" ON search_history;

-- Create new INSERT policy with correct auth.uid() function
CREATE POLICY "Users can insert own search history"
  ON search_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);