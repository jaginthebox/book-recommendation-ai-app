import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://djazodainzrjzndtifzk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqYXpvZGFpbnpyanpuZHRpZnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2OTQzNzcsImV4cCI6MjA2NzI3MDM3N30.YhUOQJhgLhgJhgLhgJhgLhgJhgLhgJhgLhgJhgLhgJhg';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    redirectTo: `${window.location.origin}`
  }
});

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

export interface SavedBook {
  id: string;
  user_id: string;
  book_id: string;
  book_data: {
    id: string;
    title: string;
    authors: string[];
    description: string;
    coverImage: string;
    publishedDate: string;
    pageCount?: number;
    categories: string[];
    rating?: number;
    ratingCount?: number;
    googleBooksUrl: string;
    isbn?: string;
  };
  is_read: boolean;
  reading_progress: number;
  user_rating?: number;
  notes?: string;
  tags: string[];
  saved_at: string;
  read_at?: string;
  updated_at: string;
}

export interface ReadingSession {
  id: string;
  user_id: string;
  book_id: string;
  pages_read: number;
  session_duration: number;
  session_date: string;
  notes?: string;
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

  // Library Management Methods
  static async saveBookToLibrary(
    userId: string,
    book: any,
    tags: string[] = []
  ): Promise<SavedBook | null> {
    try {
      const { data, error } = await supabase
        .from('saved_books')
        .insert({
          user_id: userId,
          book_id: book.id,
          book_data: {
            id: book.id,
            title: book.title,
            authors: book.authors,
            description: book.description,
            coverImage: book.coverImage,
            publishedDate: book.publishedDate,
            pageCount: book.pageCount,
            categories: book.categories,
            rating: book.rating,
            ratingCount: book.ratingCount,
            googleBooksUrl: book.googleBooksUrl,
            isbn: book.isbn
          },
          tags
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving book to library:', error);
      return null;
    }
  }

  static async getUserSavedBooks(
    userId: string,
    filters?: {
      isRead?: boolean;
      hasNotes?: boolean;
      tags?: string[];
      search?: string;
    }
  ): Promise<SavedBook[]> {
    try {
      let query = supabase
        .from('saved_books')
        .select('*')
        .eq('user_id', userId)
        .order('saved_at', { ascending: false });

      // Apply filters
      if (filters?.isRead !== undefined) {
        query = query.eq('is_read', filters.isRead);
      }

      if (filters?.hasNotes) {
        query = query.not('notes', 'is', null);
      }

      if (filters?.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      let results = data || [];

      return results;
    } catch (error) {
      console.error('Error fetching saved books:', error);
      return [];
    }
  }

  static async updateSavedBook(
    userId: string,
    bookId: string,
    updates: Partial<Pick<SavedBook, 'is_read' | 'reading_progress' | 'user_rating' | 'notes' | 'tags'>>
  ): Promise<SavedBook | null> {
    try {
      const { data, error } = await supabase
        .from('saved_books')
        .update(updates)
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .select()
        .single();
      // Apply search filter (client-side for complex text search)
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating saved book:', error);
      return null;
    }
  }

  static async removeSavedBook(userId: string, bookId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('saved_books')
        .delete()
        .eq('user_id', userId)
        .eq('book_id', bookId);
      if (filters?.search) {
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing saved book:', error);
      return false;
    }
  }

  static async isBookSaved(userId: string, bookId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('saved_books')
        .select('id')
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .limit(1);
        const searchTerm = filters.search.toLowerCase();
      if (error) throw error;
      return (data && data.length > 0);
    } catch (error) {
      console.error('Error checking if book is saved:', error);
      return false;
    }
  }

  // Reading Sessions Methods
  static async addReadingSession(
    userId: string,
    bookId: string,
    pagesRead: number,
    sessionDuration: number,
    notes?: string
  ): Promise<ReadingSession | null> {
    try {
      const { data, error } = await supabase
        .from('reading_sessions')
        .insert({
          user_id: userId,
          book_id: bookId,
          pages_read: pagesRead,
          session_duration: sessionDuration,
          notes
        })
        .select()
        .single();
        results = results.filter(book => 
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding reading session:', error);
      return null;
    }
  }

  static async getReadingSessions(
    userId: string,
    bookId?: string,
    limit: number = 50
  ): Promise<ReadingSession[]> {
    try {
      let query = supabase
        .from('reading_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('session_date', { ascending: false })
        .limit(limit);
          book.book_data.title.toLowerCase().includes(searchTerm) ||
      if (bookId) {
        query = query.eq('book_id', bookId);
      }
          book.book_data.authors.some(author => 
      const { data, error } = await query;
            author.toLowerCase().includes(searchTerm)
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching reading sessions:', error);
      return [];
    }
  }

  // Library Analytics
  static async getLibraryStats(userId: string) {
    try {
      const { data: savedBooks, error } = await supabase
        .from('saved_books')
        .select('*')
        .eq('user_id', userId);
          ) ||
      if (error) throw error;
          book.book_data.description.toLowerCase().includes(searchTerm) ||
      const books = savedBooks || [];
      const readBooks = books.filter(book => book.is_read);
      const booksWithNotes = books.filter(book => book.notes);
      const booksWithRatings = books.filter(book => book.user_rating);
      
      const averageRating = booksWithRatings.length > 0
        ? booksWithRatings.reduce((sum, book) => sum + (book.user_rating || 0), 0) / booksWithRatings.length
        : 0;
          book.notes?.toLowerCase().includes(searchTerm)
      // Get genre distribution
      const genreCount: { [key: string]: number } = {};
      books.forEach(book => {
        book.book_data.categories.forEach(genre => {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        });
      });
        );
      const topGenres = Object.entries(genreCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([genre, count]) => ({ genre, count }));
      }
      return {
        totalBooks: books.length,
        readBooks: readBooks.length,
        booksWithNotes: booksWithNotes.length,
        averageRating: Math.round(averageRating * 10) / 10,
        topGenres,
        readingProgress: books.length > 0 ? Math.round((readBooks.length / books.length) * 100) : 0
      };
    } catch (error) {
      console.error('Error getting library stats:', error);
      return {
        totalBooks: 0,
        readBooks: 0,
        booksWithNotes: 0,
        averageRating: 0,
        topGenres: [],
        readingProgress: 0
      };
    }
  }
}