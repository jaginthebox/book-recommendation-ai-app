/*
  # Search History and Recommendations Schema

  1. New Tables
    - `search_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `query` (text)
      - `results_count` (integer)
      - `clicked_books` (jsonb array of book data)
      - `search_metadata` (jsonb for filters, mood, etc.)
      - `created_at` (timestamp)
    
    - `user_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `preferred_genres` (text array)
      - `preferred_authors` (text array)
      - `reading_level` (text)
      - `favorite_themes` (text array)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create search_history table
CREATE TABLE IF NOT EXISTS search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  query text NOT NULL,
  results_count integer DEFAULT 0,
  clicked_books jsonb DEFAULT '[]'::jsonb,
  search_metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  preferred_genres text[] DEFAULT '{}',
  preferred_authors text[] DEFAULT '{}',
  reading_level text DEFAULT 'intermediate',
  favorite_themes text[] DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies for search_history
CREATE POLICY "Users can view own search history"
  ON search_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own search history"
  ON search_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own search history"
  ON search_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for user_preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Function to update user preferences based on search history
CREATE OR REPLACE FUNCTION update_user_preferences_from_search()
RETURNS trigger AS $$
BEGIN
  -- Extract genres and themes from clicked books and update preferences
  INSERT INTO user_preferences (user_id, preferred_genres, favorite_themes)
  SELECT 
    NEW.user_id,
    ARRAY(
      SELECT DISTINCT unnest(
        ARRAY(
          SELECT jsonb_array_elements_text(
            jsonb_path_query_array(NEW.clicked_books, '$[*].categories[*]')
          )
        )
      )
    ),
    ARRAY(
      SELECT DISTINCT unnest(
        ARRAY(
          SELECT jsonb_array_elements_text(
            jsonb_path_query_array(NEW.clicked_books, '$[*].categories[*]')
          )
        )
      )
    )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    preferred_genres = ARRAY(
      SELECT DISTINCT unnest(
        user_preferences.preferred_genres || EXCLUDED.preferred_genres
      )
    ),
    favorite_themes = ARRAY(
      SELECT DISTINCT unnest(
        user_preferences.favorite_themes || EXCLUDED.favorite_themes
      )
    ),
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update preferences when search history is updated
CREATE TRIGGER update_preferences_trigger
  AFTER UPDATE OF clicked_books ON search_history
  FOR EACH ROW
  WHEN (OLD.clicked_books IS DISTINCT FROM NEW.clicked_books)
  EXECUTE FUNCTION update_user_preferences_from_search();