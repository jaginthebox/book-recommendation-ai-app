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
  status: 'want_to_read' | 'currently_reading' | 'read';
  reading_progress: number;
  user_rating?: number;
  notes?: string;
  tags: string[];
  priority: number;
  saved_at: string;
  read_at?: string;
  date_started?: string;
  updated_at: string;
}

export interface WishlistItem {
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
  user_rating?: number;
  comments?: string;
  priority: number;
  tags: string[];
  added_at: string;
  updated_at: string;
}

export interface BookCollection {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  book_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface ReadingGoal {
  id: string;
  user_id: string;
  year: number;
  target_books: number;
  current_books: number;
  target_pages?: number;
  current_pages: number;
  created_at: string;
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
        searchHistory,
        savedBooks: savedBooks || []
      };
    } catch (error) {
      console.error('Error getting recommendation data:', error);
      return {
        recentQueries: [],
        clickedBooks: [],
        popularGenres: [],
        preferences: null,
        searchHistory: [],
        savedBooks: []
      };
    }
  }

  // Library Management Methods
  static async saveBookToLibrary(
    userId: string,
    book: any,
    tags: string[] = [],
    status: 'want_to_read' | 'currently_reading' | 'read' = 'want_to_read',
    priority: number = 3
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
          tags,
          status,
          priority,
          is_read: status === 'read',
          reading_progress: status === 'read' ? 100 : 0,
          date_started: status === 'currently_reading' ? new Date().toISOString() : null
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
      status?: 'want_to_read' | 'currently_reading' | 'read';
      hasNotes?: boolean;
      tags?: string[];
      search?: string;
      priority?: number;
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

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.hasNotes) {
        query = query.not('notes', 'is', null);
      }

      if (filters?.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      let results = data || [];

      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        results = results.filter(book => 
          book.book_data.title.toLowerCase().includes(searchTerm) ||
          book.book_data.authors.some(author => 
            author.toLowerCase().includes(searchTerm)
          ) ||
          book.book_data.description.toLowerCase().includes(searchTerm) ||
          book.notes?.toLowerCase().includes(searchTerm)
        );
      }

      return results;
    } catch (error) {
      console.error('Error fetching saved books:', error);
      return [];
    }
  }

  static async updateSavedBook(
    userId: string,
    bookId: string,
    updates: Partial<Pick<SavedBook, 'is_read' | 'status' | 'reading_progress' | 'user_rating' | 'notes' | 'tags' | 'priority'>>
  ): Promise<SavedBook | null> {
    try {
      const { data, error } = await supabase
        .from('saved_books')
        .update(updates)
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .select()
        .single();

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

      if (bookId) {
        query = query.eq('book_id', bookId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching reading sessions:', error);
      return [];
    }
  }

  // Wishlist Management Methods
  static async addToWishlist(
    userId: string,
    book: any,
    priority: number = 3,
    tags: string[] = []
  ): Promise<WishlistItem | null> {
    try {
      const { data, error } = await supabase
        .from('wishlist')
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
          priority,
          tags
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return null;
    }
  }

  static async getUserWishlist(
    userId: string,
    filters?: {
      priority?: number;
      tags?: string[];
      search?: string;
    }
  ): Promise<WishlistItem[]> {
    try {
      let query = supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', userId)
        .order('priority', { ascending: true })
        .order('added_at', { ascending: false });

      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }

      if (filters?.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      let results = data || [];

      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        results = results.filter(item => 
          item.book_data.title.toLowerCase().includes(searchTerm) ||
          item.book_data.authors.some(author => 
            author.toLowerCase().includes(searchTerm)
          ) ||
          item.comments?.toLowerCase().includes(searchTerm)
        );
      }

      return results;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }
  }

  static async updateWishlistItem(
    userId: string,
    bookId: string,
    updates: Partial<Pick<WishlistItem, 'user_rating' | 'comments' | 'priority' | 'tags'>>
  ): Promise<WishlistItem | null> {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .update(updates)
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating wishlist item:', error);
      return null;
    }
  }

  static async removeFromWishlist(userId: string, bookId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)
        .eq('book_id', bookId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  }

  static async moveFromWishlistToLibrary(
    userId: string,
    bookId: string,
    status: 'want_to_read' | 'currently_reading' | 'read' = 'want_to_read'
  ): Promise<boolean> {
    try {
      // Get wishlist item
      const { data: wishlistItem, error: fetchError } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .single();

      if (fetchError) throw fetchError;

      // Add to library
      const savedBook = await this.saveBookToLibrary(
        userId,
        wishlistItem.book_data,
        wishlistItem.tags,
        status,
        wishlistItem.priority
      );

      if (!savedBook) return false;

      // Remove from wishlist
      await this.removeFromWishlist(userId, bookId);

      return true;
    } catch (error) {
      console.error('Error moving from wishlist to library:', error);
      return false;
    }
  }

  static async isInWishlist(userId: string, bookId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .limit(1);

      if (error) throw error;
      return (data && data.length > 0);
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  }

  // Reading Goals Methods
  static async getUserReadingGoal(userId: string, year?: number): Promise<ReadingGoal | null> {
    try {
      const targetYear = year || new Date().getFullYear();
      const { data, error } = await supabase
        .from('reading_goals')
        .select('*')
        .eq('user_id', userId)
        .eq('year', targetYear);

      if (error) throw error;
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error fetching reading goal:', error);
      return null;
    }
  }

  static async setReadingGoal(
    userId: string,
    year: number,
    targetBooks: number,
    targetPages?: number
  ): Promise<ReadingGoal | null> {
    try {
      // Check if a goal already exists for this user and year
      const existingGoal = await this.getUserReadingGoal(userId, year);
      
      let data, error;
      
      if (existingGoal) {
        // Update existing goal
        const result = await supabase
          .from('reading_goals')
          .update({
            target_books: targetBooks,
            target_pages: targetPages
          })
          .eq('id', existingGoal.id)
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else {
        // Create new goal
        const result = await supabase
          .from('reading_goals')
          .insert({
            user_id: userId,
            year,
            target_books: targetBooks,
            target_pages: targetPages
          })
          .select()
          .single();
        data = result.data;
        error = result.error;
      }

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error setting reading goal:', error);
      return null;
    }
  }

  // Library Analytics
  static async getLibraryStats(userId: string) {
    try {
      const [savedBooksResult, wishlistResult, readingGoalResult] = await Promise.all([
        supabase
        .from('saved_books')
        .select('*')
        .eq('user_id', userId),
        supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', userId),
        this.getUserReadingGoal(userId)
      ]);

      if (savedBooksResult.error) throw savedBooksResult.error;
      if (wishlistResult.error) throw wishlistResult.error;

      const books = savedBooksResult.data || [];
      const wishlistItems = wishlistResult.data || [];
      const readBooks = books.filter(book => book.is_read);
      const currentlyReading = books.filter(book => book.status === 'currently_reading');
      const booksWithNotes = books.filter(book => book.notes);
      const booksWithRatings = books.filter(book => book.user_rating);
      
      const averageRating = booksWithRatings.length > 0
        ? booksWithRatings.reduce((sum, book) => sum + (book.user_rating || 0), 0) / booksWithRatings.length
        : 0;

      // Get genre distribution
      const genreCount: { [key: string]: number } = {};
      books.forEach(book => {
        book.book_data.categories.forEach(genre => {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        });
      });

      const topGenres = Object.entries(genreCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([genre, count]) => ({ genre, count }));

      // Calculate reading streak (consecutive days with reading activity)
      const readingSessions = await this.getReadingSessions(userId, undefined, 30);
      const uniqueReadingDays = new Set(
        readingSessions.map(session => 
          new Date(session.session_date).toDateString()
        )
      );
      
      let currentStreak = 0;
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        if (uniqueReadingDays.has(checkDate.toDateString())) {
          currentStreak++;
        } else if (i > 0) { // Allow for today to not have reading yet
          break;
        }
      }
      
      return {
        totalBooks: books.length,
        readBooks: readBooks.length,
        currentlyReading: currentlyReading.length,
        wantToRead: books.filter(book => book.status === 'want_to_read').length,
        booksWithNotes: booksWithNotes.length,
        wishlistCount: wishlistItems.length,
        averageRating: Math.round(averageRating * 10) / 10,
        topGenres,
        readingProgress: books.length > 0 ? Math.round((readBooks.length / books.length) * 100) : 0,
        readingGoal: readingGoalResult,
        readingStreak: currentStreak,
        totalPages: books.reduce((sum, book) => sum + (book.book_data.pageCount || 0), 0),
        pagesRead: readBooks.reduce((sum, book) => sum + (book.book_data.pageCount || 0), 0)
      };
    } catch (error) {
      console.error('Error getting library stats:', error);
      return {
        totalBooks: 0,
        readBooks: 0,
        currentlyReading: 0,
        wantToRead: 0,
        booksWithNotes: 0,
        wishlistCount: 0,
        averageRating: 0,
        topGenres: [],
        readingProgress: 0,
        readingGoal: null,
        readingStreak: 0,
        totalPages: 0,
        pagesRead: 0
      };
    }
  }