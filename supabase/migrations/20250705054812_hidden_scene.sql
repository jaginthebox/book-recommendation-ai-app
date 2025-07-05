/*
  # Fix RLS policies for search_history table

  1. Security Updates
    - Drop existing policies that use incorrect `uid()` function
    - Create new policies using correct `auth.uid()` function
    - Ensure authenticated users can insert, select, and update their own search history

  2. Policy Changes
    - INSERT: Allow authenticated users to insert records where user_id matches their auth.uid()
    - SELECT: Allow authenticated users to view their own search history
    - UPDATE: Allow authenticated users to update their own search history records
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert own search history" ON search_history;
DROP POLICY IF EXISTS "Users can view own search history" ON search_history;
DROP POLICY IF EXISTS "Users can update own search history" ON search_history;

-- Create corrected policies using auth.uid()
CREATE POLICY "Users can insert own search history"
  ON search_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own search history"
  ON search_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own search history"
  ON search_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);