import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface SearchHistory {
  id: string;
  user_id: string;
  query: string;
  results_count: number;
  clicked_books: any[];
  search_metadata: {
    mood?: string;
    filters?: any;
    processing_time?: string;
  };
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  preferred_genres: string[];
  preferred_authors: string[];
  reading_level: string;
  favorite_themes: string[];
  updated_at: string;
}

// Database service functions
export class DatabaseService {
  // Search History Methods
  static async saveSearchHistory(
    userId: string,
    query: string,
    resultsCount: number,
    metadata: any = {}
  ): Promise<SearchHistory | null> {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .insert({
          user_id: userId,
          query,
          results_count: resultsCount,
          search_metadata: metadata
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving search history:', error);
      return null;
    }
  }

  static async updateSearchHistoryWithClicks(
    searchId: string,
    clickedBooks: any[]
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('search_history')
        .update({ clicked_books: clickedBooks })
        .eq('id', searchId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating search history with clicks:', error);
      return false;
    }
  }

  static async getUserSearchHistory(
    userId: string,
    limit: number = 50
  ): Promise<SearchHistory[]> {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching search history:', error);
      return [];
    }
  }

  static async getRecentSearchQueries(
    userId: string,
    limit: number = 10
  ): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('query')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data?.map(item => item.query) || [];
    } catch (error) {
      console.error('Error fetching recent queries:', error);
      return [];
    }
  }

  // User Preferences Methods
  static async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .limit(1);

      if (error) throw error;
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return null;
    }
  }

  static async updateUserPreferences(
    userId: string,
    preferences: Partial<Omit<UserPreferences, 'id' | 'user_id' | 'updated_at'>>
  ): Promise<UserPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return null;
    }
  }

  // Analytics and Recommendations
  static async getPopularGenres(userId: string): Promise<string[]> {
    try {
      const searchHistory = await this.getUserSearchHistory(userId);
      const genreCount: { [key: string]: number } = {};

      searchHistory.forEach(search => {
        search.clicked_books.forEach((book: any) => {
          if (book.categories) {
            book.categories.forEach((genre: string) => {
              genreCount[genre] = (genreCount[genre] || 0) + 1;
            });
          }
        });
      });

      return Object.entries(genreCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([genre]) => genre);
    } catch (error) {
      console.error('Error getting popular genres:', error);
      return [];
    }
  }

  static async getRecommendationData(userId: string) {
    try {
      const [searchHistory, preferences] = await Promise.all([
        this.getUserSearchHistory(userId, 20),
        this.getUserPreferences(userId)
      ]);

      const recentQueries = searchHistory.slice(0, 5).map(s => s.query);
      const clickedBooks = searchHistory.flatMap(s => s.clicked_books);
      const popularGenres = await this.getPopularGenres(userId);

      return {
        recentQueries,
        clickedBooks,
        popularGenres,
        preferences,
        searchHistory
      };
    } catch (error) {
      console.error('Error getting recommendation data:', error);
      return {
        recentQueries: [],
        clickedBooks: [],
        popularGenres: [],
        preferences: null,
        searchHistory: []
      };
    }
  }
}