import { useState, useEffect, useCallback } from 'react';
import { DatabaseService, SavedBook } from '../lib/supabase';
import { useAuth } from './useAuth';
import { Book } from '../types';

interface LibraryFilters {
  isRead?: boolean;
  hasNotes?: boolean;
  tags?: string[];
  search?: string;
}

interface LibraryStats {
  totalBooks: number;
  readBooks: number;
  booksWithNotes: number;
  averageRating: number;
  topGenres: { genre: string; count: number }[];
  readingProgress: number;
}

export const useLibrary = () => {
  const { user } = useAuth();
  const [savedBooks, setSavedBooks] = useState<SavedBook[]>([]);
  const [libraryStats, setLibraryStats] = useState<LibraryStats>({
    totalBooks: 0,
    readBooks: 0,
    booksWithNotes: 0,
    averageRating: 0,
    topGenres: [],
    readingProgress: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user's library
  const loadLibrary = useCallback(async (filters?: LibraryFilters) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const [books, stats] = await Promise.all([
        DatabaseService.getUserSavedBooks(user.id, filters),
        DatabaseService.getLibraryStats(user.id)
      ]);
      
      setSavedBooks(books);
      setLibraryStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load library');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Save book to library
  const saveBook = useCallback(async (book: Book, tags: string[] = []) => {
    if (!user) return false;

    try {
      const savedBook = await DatabaseService.saveBookToLibrary(user.id, book, tags);
      if (savedBook) {
        setSavedBooks(prev => [savedBook, ...prev]);
        // Refresh stats
        const stats = await DatabaseService.getLibraryStats(user.id);
        setLibraryStats(stats);
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save book');
      return false;
    }
  }, [user]);

  // Remove book from library
  const removeBook = useCallback(async (bookId: string) => {
    if (!user) return false;

    try {
      const success = await DatabaseService.removeSavedBook(user.id, bookId);
      if (success) {
        setSavedBooks(prev => prev.filter(book => book.book_id !== bookId));
        // Refresh stats
        const stats = await DatabaseService.getLibraryStats(user.id);
        setLibraryStats(stats);
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove book');
      return false;
    }
  }, [user]);

  // Update book details
  const updateBook = useCallback(async (
    bookId: string, 
    updates: Partial<Pick<SavedBook, 'is_read' | 'reading_progress' | 'user_rating' | 'notes' | 'tags'>>
  ) => {
    if (!user) return false;

    try {
      const updatedBook = await DatabaseService.updateSavedBook(user.id, bookId, updates);
      if (updatedBook) {
        setSavedBooks(prev => 
          prev.map(book => 
            book.book_id === bookId ? updatedBook : book
          )
        );
        // Refresh stats if read status changed
        if ('is_read' in updates || 'user_rating' in updates) {
          const stats = await DatabaseService.getLibraryStats(user.id);
          setLibraryStats(stats);
        }
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update book');
      return false;
    }
  }, [user]);

  // Check if book is saved
  const isBookSaved = useCallback(async (bookId: string) => {
    if (!user) return false;
    return await DatabaseService.isBookSaved(user.id, bookId);
  }, [user]);

  // Toggle read status
  const toggleReadStatus = useCallback(async (bookId: string) => {
    const book = savedBooks.find(b => b.book_id === bookId);
    if (!book) return false;

    return await updateBook(bookId, { 
      is_read: !book.is_read,
      reading_progress: !book.is_read ? 100 : book.reading_progress
    });
  }, [savedBooks, updateBook]);

  // Update reading progress
  const updateReadingProgress = useCallback(async (bookId: string, progress: number) => {
    return await updateBook(bookId, { 
      reading_progress: Math.max(0, Math.min(100, progress)),
      is_read: progress >= 100
    });
  }, [updateBook]);

  // Save notes and rating
  const saveNotesAndRating = useCallback(async (
    bookId: string, 
    notes: string, 
    rating?: number
  ) => {
    const updates: any = { notes };
    if (rating !== undefined) {
      updates.user_rating = rating;
    }
    return await updateBook(bookId, updates);
  }, [updateBook]);

  // Load library on user change
  useEffect(() => {
    if (user) {
      loadLibrary();
    } else {
      setSavedBooks([]);
      setLibraryStats({
        totalBooks: 0,
        readBooks: 0,
        booksWithNotes: 0,
        averageRating: 0,
        topGenres: [],
        readingProgress: 0
      });
    }
  }, [user, loadLibrary]);

  return {
    savedBooks,
    libraryStats,
    isLoading,
    error,
    loadLibrary,
    saveBook,
    removeBook,
    updateBook,
    isBookSaved,
    toggleReadStatus,
    updateReadingProgress,
    saveNotesAndRating
  };
};