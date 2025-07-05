/*
  # Dynamic Library System Schema

  1. New Tables
    - `saved_books`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `book_id` (text, external book identifier)
      - `book_data` (jsonb, complete book information)
      - `is_read` (boolean)
      - `reading_progress` (integer, percentage 0-100)
      - `user_rating` (integer, 1-5 stars)
      - `notes` (text)
      - `tags` (text array)
      - `saved_at` (timestamp)
      - `read_at` (timestamp, nullable)
      - `updated_at` (timestamp)
    
    - `reading_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `book_id` (text, references saved_books.book_id)
      - `pages_read` (integer)
      - `session_duration` (integer, minutes)
      - `session_date` (timestamp)
      - `notes` (text, nullable)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data

  3. Indexes
    - Performance indexes for common queries
*/

-- Create saved_books table
CREATE TABLE IF NOT EXISTS saved_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id text NOT NULL,
  book_data jsonb NOT NULL,
  is_read boolean DEFAULT false,
  reading_progress integer DEFAULT 0 CHECK (reading_progress >= 0 AND reading_progress <= 100),
  user_rating integer CHECK (user_rating >= 1 AND user_rating <= 5),
  notes text,
  tags text[] DEFAULT '{}',
  saved_at timestamptz DEFAULT now(),
  read_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, book_id)
);

-- Create reading_sessions table
CREATE TABLE IF NOT EXISTS reading_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id text NOT NULL,
  pages_read integer DEFAULT 0,
  session_duration integer DEFAULT 0,
  session_date timestamptz DEFAULT now(),
  notes text
);

-- Enable RLS
ALTER TABLE saved_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for saved_books
CREATE POLICY "Users can view own saved books"
  ON saved_books
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved books"
  ON saved_books
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved books"
  ON saved_books
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved books"
  ON saved_books
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for reading_sessions
CREATE POLICY "Users can view own reading sessions"
  ON reading_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reading sessions"
  ON reading_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reading sessions"
  ON reading_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reading sessions"
  ON reading_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_saved_books_user_id ON saved_books(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_books_book_id ON saved_books(book_id);
CREATE INDEX IF NOT EXISTS idx_saved_books_saved_at ON saved_books(saved_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_books_is_read ON saved_books(is_read);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_id ON reading_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_book_id ON reading_sessions(book_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_date ON reading_sessions(session_date DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_saved_books_updated_at
  BEFORE UPDATE ON saved_books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set read_at when book is marked as read
CREATE OR REPLACE FUNCTION set_read_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  -- If is_read changed from false to true, set read_at
  IF OLD.is_read = false AND NEW.is_read = true THEN
    NEW.read_at = now();
    NEW.reading_progress = 100;
  END IF;
  
  -- If is_read changed from true to false, clear read_at
  IF OLD.is_read = true AND NEW.is_read = false THEN
    NEW.read_at = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically manage read_at timestamp
CREATE TRIGGER set_read_at_trigger
  BEFORE UPDATE ON saved_books
  FOR EACH ROW
  WHEN (OLD.is_read IS DISTINCT FROM NEW.is_read)
  EXECUTE FUNCTION set_read_at_timestamp();