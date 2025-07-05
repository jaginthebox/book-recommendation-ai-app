import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';

export interface SavedBook {
  id: string;
  user_id: string;
  book_id: string;
  book_data: any;
  is_read: boolean;
  reading_progress: number;
  user_rating?: number;
  notes?: string;
  tags: string[];
  saved_at: string;
  read_at?: string;
  updated_at: string;
  status: 'want_to_read' | 'currently_reading' | 'read';
  priority: number;
  date_started?: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  book_id: string;
  book_data: any;
  user_rating?: number;
  comments?: string;
  priority: number;
  tags: string[];
  added_at: string;
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

export interface ReadingSession {
  id: string;
  user_id: string;
  book_id: string;
  pages_read: number;
  session_duration: number;
  session_date: string;
  notes?: string;
}

export const useLibrary = () => {
  const { user } = useAuth();
  const [savedBooks, setSavedBooks] = useState<SavedBook[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [readingGoals, setReadingGoals] = useState<ReadingGoal[]>([]);
  const [collections, setCollections] = useState<BookCollection[]>([]);
  const [readingSessions, setReadingSessions] = useState<ReadingSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user's library data
  useEffect(() => {
    if (user) {
      loadLibraryData();
    } else {
      // Clear data when user logs out
      setSavedBooks([]);
      setWishlistItems([]);
      setReadingGoals([]);
      setCollections([]);
      setReadingSessions([]);
    }
  }, [user]);

  const loadLibraryData = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Load saved books
      const { data: savedBooksData, error: savedBooksError } = await supabase
        .from('saved_books')
        .select('*')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (savedBooksError) throw savedBooksError;

      // Load wishlist items
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', user.id)
        .order('added_at', { ascending: false });

      if (wishlistError) throw wishlistError;

      // Load reading goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('reading_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('year', { ascending: false });

      if (goalsError) throw goalsError;

      // Load collections
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('book_collections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (collectionsError) throw collectionsError;

      // Load reading sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('reading_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('session_date', { ascending: false });

      if (sessionsError) throw sessionsError;

      setSavedBooks(savedBooksData || []);
      setWishlistItems(wishlistData || []);
      setReadingGoals(goalsData || []);
      setCollections(collectionsData || []);
      setReadingSessions(sessionsData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load library data');
    } finally {
      setIsLoading(false);
    }
  };

  // Save a book to the library
  const saveBook = async (book: any, status: 'want_to_read' | 'currently_reading' | 'read' = 'want_to_read') => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('saved_books')
      .upsert({
        user_id: user.id,
        book_id: book.id,
        book_data: book,
        status,
        is_read: status === 'read',
        date_started: status === 'currently_reading' ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (error) throw error;

    // Update local state
    setSavedBooks(prev => {
      const existing = prev.find(b => b.book_id === book.id);
      if (existing) {
        return prev.map(b => b.book_id === book.id ? data : b);
      } else {
        return [data, ...prev];
      }
    });

    return data;
  };

  // Remove a book from the library
  const removeBook = async (bookId: string) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('saved_books')
      .delete()
      .eq('user_id', user.id)
      .eq('book_id', bookId);

    if (error) throw error;

    setSavedBooks(prev => prev.filter(book => book.book_id !== bookId));
  };

  // Update book status
  const updateBookStatus = async (bookId: string, status: 'want_to_read' | 'currently_reading' | 'read') => {
    if (!user) throw new Error('User not authenticated');

    const updates: any = {
      status,
      is_read: status === 'read',
      updated_at: new Date().toISOString()
    };

    if (status === 'currently_reading') {
      updates.date_started = new Date().toISOString();
    } else if (status === 'read') {
      updates.read_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('saved_books')
      .update(updates)
      .eq('user_id', user.id)
      .eq('book_id', bookId)
      .select()
      .single();

    if (error) throw error;

    setSavedBooks(prev => prev.map(book => 
      book.book_id === bookId ? data : book
    ));

    return data;
  };

  // Update reading progress
  const updateReadingProgress = async (bookId: string, progress: number) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('saved_books')
      .update({ 
        reading_progress: progress,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('book_id', bookId)
      .select()
      .single();

    if (error) throw error;

    setSavedBooks(prev => prev.map(book => 
      book.book_id === bookId ? data : book
    ));

    return data;
  };

  // Add to wishlist
  const addToWishlist = async (book: any, priority: number = 3) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('wishlist')
      .upsert({
        user_id: user.id,
        book_id: book.id,
        book_data: book,
        priority
      })
      .select()
      .single();

    if (error) throw error;

    setWishlistItems(prev => {
      const existing = prev.find(item => item.book_id === book.id);
      if (existing) {
        return prev.map(item => item.book_id === book.id ? data : item);
      } else {
        return [data, ...prev];
      }
    });

    return data;
  };

  // Remove from wishlist
  const removeFromWishlist = async (bookId: string) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', user.id)
      .eq('book_id', bookId);

    if (error) throw error;

    setWishlistItems(prev => prev.filter(item => item.book_id !== bookId));
  };

  // Create or update reading goal
  const setReadingGoal = async (year: number, targetBooks: number, targetPages?: number) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('reading_goals')
      .upsert({
        user_id: user.id,
        year,
        target_books: targetBooks,
        target_pages: targetPages
      })
      .select()
      .single();

    if (error) throw error;

    setReadingGoals(prev => {
      const existing = prev.find(goal => goal.year === year);
      if (existing) {
        return prev.map(goal => goal.year === year ? data : goal);
      } else {
        return [data, ...prev];
      }
    });

    return data;
  };

  // Create a new collection
  const createCollection = async (name: string, description?: string, isPublic: boolean = false) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('book_collections')
      .insert({
        user_id: user.id,
        name,
        description,
        is_public: isPublic
      })
      .select()
      .single();

    if (error) throw error;

    setCollections(prev => [data, ...prev]);
    return data;
  };

  // Add book to collection
  const addBookToCollection = async (collectionId: string, bookId: string) => {
    if (!user) throw new Error('User not authenticated');

    const collection = collections.find(c => c.id === collectionId);
    if (!collection) throw new Error('Collection not found');

    const updatedBookIds = [...collection.book_ids, bookId];

    const { data, error } = await supabase
      .from('book_collections')
      .update({ book_ids: updatedBookIds })
      .eq('id', collectionId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    setCollections(prev => prev.map(c => c.id === collectionId ? data : c));
    return data;
  };

  // Helper functions
  const isBookSaved = (bookId: string) => {
    return savedBooks.some(book => book.book_id === bookId);
  };

  const isBookInWishlist = (bookId: string) => {
    return wishlistItems.some(item => item.book_id === bookId);
  };

  const getBookStatus = (bookId: string) => {
    const savedBook = savedBooks.find(book => book.book_id === bookId);
    return savedBook?.status || null;
  };

  const getReadingProgress = (bookId: string) => {
    const savedBook = savedBooks.find(book => book.book_id === bookId);
    return savedBook?.reading_progress || 0;
  };

  // Statistics
  const getLibraryStats = () => {
    const totalBooks = savedBooks.length;
    const readBooks = savedBooks.filter(book => book.is_read).length;
    const currentlyReading = savedBooks.filter(book => book.status === 'currently_reading').length;
    const wantToRead = savedBooks.filter(book => book.status === 'want_to_read').length;
    const wishlistCount = wishlistItems.length;
    const currentYear = new Date().getFullYear();
    const currentYearGoal = readingGoals.find(goal => goal.year === currentYear);

    return {
      totalBooks,
      readBooks,
      currentlyReading,
      wantToRead,
      wishlistCount,
      readingSessions,
      readingGoal: currentYearGoal
    };
  };

  return {
    // State
    savedBooks,
    wishlistItems,
    readingGoals,
    collections,
    readingSessions,
    isLoading,
    error,

    // Actions
    saveBook,
    removeBook,
    updateBookStatus,
    updateReadingProgress,
    addToWishlist,
    removeFromWishlist,
    setReadingGoal,
    createCollection,
    addBookToCollection,
    loadLibraryData,

    // Helpers
    isBookSaved,
    isBookInWishlist,
    getBookStatus,
    getReadingProgress,
    getLibraryStats
  };
};