/*
  # Fix RLS policy for search_history table

  1. Security Updates
    - Drop existing INSERT policy that uses incorrect uid() function
    - Create new INSERT policy using correct auth.uid() function
    - Ensure authenticated users can insert their own search history records

  2. Changes
    - Replace uid() with auth.uid() in INSERT policy
    - Maintain existing SELECT and UPDATE policies
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can insert own search history" ON search_history;

-- Create new INSERT policy with correct auth.uid() function
CREATE POLICY "Users can insert own search history"
  ON search_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);