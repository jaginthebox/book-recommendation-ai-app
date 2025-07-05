import { useState, useEffect, useCallback } from 'react';
import { DatabaseService, SavedBook, WishlistItem, ReadingGoal } from '../lib/supabase';
import { useAuth } from './useAuth.tsx';
import { Book } from '../types';

interface LibraryFilters {
  isRead?: boolean;
  status?: 'want_to_read' | 'currently_reading' | 'read';
  hasNotes?: boolean;
  tags?: string[];
  search?: string;
  priority?: number;
}

interface WishlistFilters {
  priority?: number;
  tags?: string[];
  search?: string;
}

interface LibraryStats {
  totalBooks: number;
  readBooks: number;
  currentlyReading: number;
  wantToRead: number;
  booksWithNotes: number;
  wishlistCount: number;
  averageRating: number;
  topGenres: { genre: string; count: number }[];
  readingProgress: number;
  readingGoal: ReadingGoal | null;
  readingStreak: number;
  totalPages: number;
  pagesRead: number;
}

export const useLibrary = () => {
  const { user } = useAuth();
  const [savedBooks, setSavedBooks] = useState<SavedBook[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [libraryStats, setLibraryStats] = useState<LibraryStats>({
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

  // Load user's wishlist
  const loadWishlist = useCallback(async (filters?: WishlistFilters) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const items = await DatabaseService.getUserWishlist(user.id, filters);
      setWishlistItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Save book to library
  const saveBook = useCallback(async (
    book: Book, 
    tags: string[] = [],
    status: 'want_to_read' | 'currently_reading' | 'read' = 'want_to_read',
    priority: number = 3
  ) => {
    if (!user) return false;

    try {
      const savedBook = await DatabaseService.saveBookToLibrary(user.id, book, tags, status, priority);
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

  // Add book to wishlist
  const addToWishlist = useCallback(async (
    book: Book, 
    priority: number = 3,
    tags: string[] = []
  ) => {
    if (!user) return false;

    try {
      const wishlistItem = await DatabaseService.addToWishlist(user.id, book, priority, tags);
      if (wishlistItem) {
        setWishlistItems(prev => [wishlistItem, ...prev]);
        // Refresh stats
        const stats = await DatabaseService.getLibraryStats(user.id);
        setLibraryStats(stats);
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to wishlist');
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

  // Remove book from wishlist
  const removeFromWishlist = useCallback(async (bookId: string) => {
    if (!user) return false;

    try {
      const success = await DatabaseService.removeFromWishlist(user.id, bookId);
      if (success) {
        setWishlistItems(prev => prev.filter(item => item.book_id !== bookId));
        // Refresh stats
        const stats = await DatabaseService.getLibraryStats(user.id);
        setLibraryStats(stats);
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from wishlist');
      return false;
    }
  }, [user]);

  // Update book details
  const updateBook = useCallback(async (
    bookId: string, 
    updates: Partial<Pick<SavedBook, 'is_read' | 'status' | 'reading_progress' | 'user_rating' | 'notes' | 'tags' | 'priority'>>
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
        if ('is_read' in updates || 'status' in updates || 'user_rating' in updates) {
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

  // Update wishlist item
  const updateWishlistItem = useCallback(async (
    bookId: string,
    updates: Partial<Pick<WishlistItem, 'user_rating' | 'comments' | 'priority' | 'tags'>>
  ) => {
    if (!user) return false;

    try {
      const updatedItem = await DatabaseService.updateWishlistItem(user.id, bookId, updates);
      if (updatedItem) {
        setWishlistItems(prev => 
          prev.map(item => 
            item.book_id === bookId ? updatedItem : item
          )
        );
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update wishlist item');
      return false;
    }
  }, [user]);

  // Check if book is saved
  const isBookSaved = useCallback(async (bookId: string) => {
    if (!user) return false;
    return await DatabaseService.isBookSaved(user.id, bookId);
  }, [user]);

  // Check if book is in wishlist
  const isInWishlist = useCallback(async (bookId: string) => {
    if (!user) return false;
    return await DatabaseService.isInWishlist(user.id, bookId);
  }, [user]);

  // Toggle read status
  const toggleReadStatus = useCallback(async (bookId: string) => {
    const book = savedBooks.find(b => b.book_id === bookId);
    if (!book) return false;

    const newStatus = book.is_read ? 'want_to_read' : 'read';
    return await updateBook(bookId, {
      is_read: !book.is_read,
      status: newStatus,
      reading_progress: !book.is_read ? 100 : book.reading_progress
    });
  }, [savedBooks, updateBook]);

  // Update book status
  const updateBookStatus = useCallback(async (
    bookId: string, 
    status: 'want_to_read' | 'currently_reading' | 'read'
  ) => {
    return await updateBook(bookId, { 
      status,
      is_read: status === 'read',
      reading_progress: status === 'read' ? 100 : undefined
    });
  }, [updateBook]);

  // Update reading progress
  const updateReadingProgress = useCallback(async (bookId: string, progress: number) => {
    if (!user) return false;

    // Add reading session when progress is updated
    const book = savedBooks.find(b => b.book_id === bookId);
    if (book) {
      const previousProgress = book.reading_progress || 0;
      const pagesRead = Math.round(((progress - previousProgress) / 100) * (book.book_data.pageCount || 0));
      
      if (pagesRead > 0) {
        await DatabaseService.addReadingSession(
          user.id,
          bookId,
          pagesRead,
          30, // Assume 30 minutes session duration
          `Progress updated from ${previousProgress}% to ${progress}%`
        );
      }
    }

    const status = progress >= 100 ? 'read' : progress > 0 ? 'currently_reading' : 'want_to_read';
    return await updateBook(bookId, {
      reading_progress: Math.max(0, Math.min(100, progress)),
      is_read: progress >= 100,
      status
    });
  }, [updateBook, user, savedBooks]);

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

  // Move from wishlist to library
  const moveFromWishlistToLibrary = useCallback(async (
    bookId: string,
    status: 'want_to_read' | 'currently_reading' | 'read' = 'want_to_read'
  ) => {
    if (!user) return false;

    try {
      const success = await DatabaseService.moveFromWishlistToLibrary(user.id, bookId, status);
      if (success) {
        // Remove from wishlist state
        setWishlistItems(prev => prev.filter(item => item.book_id !== bookId));
        // Refresh library and stats
        await loadLibrary();
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move book to library');
      return false;
    }
  }, [user, loadLibrary]);

  // Load library on user change
  useEffect(() => {
    if (user) {
      loadLibrary();
    } else {
      setSavedBooks([]);
      setLibraryStats({
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
      });
    }
  }, [user, loadLibrary]);

  // Set reading goal
  const setReadingGoal = useCallback(async (
    year: number,
    targetBooks: number,
    targetPages?: number
  ) => {
    if (!user) return false;

    try {
      const goal = await DatabaseService.setReadingGoal(user.id, year, targetBooks, targetPages);
      if (goal) {
        setLibraryStats(prev => ({ ...prev, readingGoal: goal }));
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set reading goal');
      return false;
    }
  }, [user]);

  return {
    savedBooks,
    wishlistItems,
    libraryStats,
    isLoading,
    error,
    loadLibrary,
    loadWishlist,
    saveBook,
    addToWishlist,
    removeBook,
    removeFromWishlist,
    updateBook,
    updateWishlistItem,
    isBookSaved,
    isInWishlist,
    toggleReadStatus,
    updateBookStatus,
    updateReadingProgress,
    saveNotesAndRating,
    moveFromWishlistToLibrary,
    setReadingGoal
  };
};