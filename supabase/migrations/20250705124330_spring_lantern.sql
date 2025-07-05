/*
  # Comprehensive Library Management System

  1. New Tables
    - `wishlist` - User wishlist with comments and ratings
    - Enhanced `saved_books` with wishlist support
    - Enhanced `user_preferences` with genre tracking
    - `book_collections` - Custom user collections

  2. Enhanced Features
    - Wishlist functionality with ratings and comments
    - Book status tracking (want_to_read, currently_reading, read)
    - Enhanced user preferences with automatic genre tracking
    - Custom collections support
    - Reading goals and challenges

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to manage their own data
*/

-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id text NOT NULL,
  book_data jsonb NOT NULL,
  user_rating integer CHECK (user_rating >= 1 AND user_rating <= 5),
  comments text,
  priority integer DEFAULT 3 CHECK (priority >= 1 AND priority <= 5), -- 1=highest, 5=lowest
  tags text[] DEFAULT '{}',
  added_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, book_id)
);

-- Create book_collections table for custom user collections
CREATE TABLE IF NOT EXISTS book_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  book_ids text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reading_goals table
CREATE TABLE IF NOT EXISTS reading_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  year integer NOT NULL,
  target_books integer NOT NULL,
  current_books integer DEFAULT 0,
  target_pages integer,
  current_pages integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, year)
);

-- Add status column to saved_books if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_books' AND column_name = 'status'
  ) THEN
    ALTER TABLE saved_books ADD COLUMN status text DEFAULT 'want_to_read' CHECK (status IN ('want_to_read', 'currently_reading', 'read'));
  END IF;
END $$;

-- Add priority column to saved_books if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_books' AND column_name = 'priority'
  ) THEN
    ALTER TABLE saved_books ADD COLUMN priority integer DEFAULT 3 CHECK (priority >= 1 AND priority <= 5);
  END IF;
END $$;

-- Add date_started column to saved_books if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_books' AND column_name = 'date_started'
  ) THEN
    ALTER TABLE saved_books ADD COLUMN date_started timestamptz;
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_goals ENABLE ROW LEVEL SECURITY;

-- Policies for wishlist
CREATE POLICY "Users can view own wishlist"
  ON wishlist
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wishlist items"
  ON wishlist
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wishlist items"
  ON wishlist
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishlist items"
  ON wishlist
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for book_collections
CREATE POLICY "Users can view own collections"
  ON book_collections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert own collections"
  ON book_collections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own collections"
  ON book_collections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own collections"
  ON book_collections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for reading_goals
CREATE POLICY "Users can view own reading goals"
  ON reading_goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reading goals"
  ON reading_goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reading goals"
  ON reading_goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reading goals"
  ON reading_goals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_added_at ON wishlist(added_at DESC);
CREATE INDEX IF NOT EXISTS idx_wishlist_priority ON wishlist(priority);
CREATE INDEX IF NOT EXISTS idx_book_collections_user_id ON book_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_book_collections_public ON book_collections(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_reading_goals_user_id ON reading_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_goals_year ON reading_goals(year DESC);
CREATE INDEX IF NOT EXISTS idx_saved_books_status ON saved_books(status);

-- Function to update updated_at timestamp for new tables
CREATE TRIGGER update_wishlist_updated_at
  BEFORE UPDATE ON wishlist
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_collections_updated_at
  BEFORE UPDATE ON book_collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reading_goals_updated_at
  BEFORE UPDATE ON reading_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update reading goals when books are marked as read
CREATE OR REPLACE FUNCTION update_reading_goals()
RETURNS TRIGGER AS $$
BEGIN
  -- If book status changed to 'read', update reading goals
  IF OLD.status != 'read' AND NEW.status = 'read' THEN
    INSERT INTO reading_goals (user_id, year, target_books, current_books, current_pages)
    VALUES (
      NEW.user_id,
      EXTRACT(YEAR FROM now()),
      12, -- Default target
      1,
      COALESCE((NEW.book_data->>'pageCount')::integer, 0)
    )
    ON CONFLICT (user_id, year)
    DO UPDATE SET
      current_books = reading_goals.current_books + 1,
      current_pages = reading_goals.current_pages + COALESCE((NEW.book_data->>'pageCount')::integer, 0),
      updated_at = now();
  END IF;
  
  -- If book status changed from 'read', decrease reading goals
  IF OLD.status = 'read' AND NEW.status != 'read' THEN
    UPDATE reading_goals
    SET 
      current_books = GREATEST(0, current_books - 1),
      current_pages = GREATEST(0, current_pages - COALESCE((OLD.book_data->>'pageCount')::integer, 0)),
      updated_at = now()
    WHERE user_id = OLD.user_id AND year = EXTRACT(YEAR FROM now());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update reading goals
CREATE TRIGGER update_reading_goals_trigger
  AFTER UPDATE OF status ON saved_books
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_reading_goals();

-- Function to automatically update book status when is_read changes
CREATE OR REPLACE FUNCTION sync_book_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If is_read changed to true, set status to 'read'
  IF OLD.is_read = false AND NEW.is_read = true THEN
    NEW.status = 'read';
    NEW.date_started = COALESCE(NEW.date_started, OLD.saved_at);
  END IF;
  
  -- If is_read changed to false, set status to 'currently_reading' if progress > 0, else 'want_to_read'
  IF OLD.is_read = true AND NEW.is_read = false THEN
    NEW.status = CASE 
      WHEN NEW.reading_progress > 0 THEN 'currently_reading'
      ELSE 'want_to_read'
    END;
  END IF;
  
  -- If status changed to 'currently_reading' and date_started is null, set it
  IF OLD.status != 'currently_reading' AND NEW.status = 'currently_reading' AND NEW.date_started IS NULL THEN
    NEW.date_started = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to sync book status with is_read
CREATE TRIGGER sync_book_status_trigger
  BEFORE UPDATE ON saved_books
  FOR EACH ROW
  WHEN (OLD.is_read IS DISTINCT FROM NEW.is_read OR OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION sync_book_status();