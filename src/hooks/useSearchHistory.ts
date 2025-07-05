import { useState, useEffect } from 'react';
import { DatabaseService, SearchHistory } from '../lib/supabase';
import { useAuth } from './useAuth';
import { Book } from '../types';

export const useSearchHistory = () => {
  const { user } = useAuth();
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [currentSearchId, setCurrentSearchId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load search history when user changes
  useEffect(() => {
    if (user) {
      loadSearchHistory();
    } else {
      setSearchHistory([]);
    }
  }, [user]);

  const loadSearchHistory = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const history = await DatabaseService.getUserSearchHistory(user.id);
      setSearchHistory(history);
    } catch (error) {
      console.error('Error loading search history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSearch = async (
    query: string,
    resultsCount: number,
    metadata: any = {}
  ): Promise<string | null> => {
    if (!user) return null;

    try {
      const searchRecord = await DatabaseService.saveSearchHistory(
        user.id,
        query,
        resultsCount,
        metadata
      );
      
      if (searchRecord) {
        setCurrentSearchId(searchRecord.id);
        setSearchHistory(prev => [searchRecord, ...prev]);
        return searchRecord.id;
      }
    } catch (error) {
      console.error('Error saving search:', error);
    }
    
    return null;
  };

  const recordBookClick = async (book: Book) => {
    if (!user || !currentSearchId) return;

    try {
      // Get current search record
      const currentSearch = searchHistory.find(s => s.id === currentSearchId);
      if (!currentSearch) return;

      // Add book to clicked books if not already there
      const clickedBooks = [...currentSearch.clicked_books];
      const bookExists = clickedBooks.some(b => b.id === book.id);
      
      if (!bookExists) {
        clickedBooks.push({
          id: book.id,
          title: book.title,
          authors: book.authors,
          categories: book.categories,
          rating: book.rating,
          clicked_at: new Date().toISOString()
        });

        // Update in database
        await DatabaseService.updateSearchHistoryWithClicks(currentSearchId, clickedBooks);
        
        // Update local state
        setSearchHistory(prev => 
          prev.map(search => 
            search.id === currentSearchId 
              ? { ...search, clicked_books: clickedBooks }
              : search
          )
        );
      }
    } catch (error) {
      console.error('Error recording book click:', error);
    }
  };

  const getRecentQueries = async (): Promise<string[]> => {
    if (!user) return [];
    
    try {
      return await DatabaseService.getRecentSearchQueries(user.id, 10);
    } catch (error) {
      console.error('Error getting recent queries:', error);
      return [];
    }
  };

  const clearSearchHistory = async () => {
    // This would require a delete endpoint in DatabaseService
    // For now, just clear local state
    setSearchHistory([]);
  };

  return {
    searchHistory,
    isLoading,
    saveSearch,
    recordBookClick,
    getRecentQueries,
    clearSearchHistory,
    loadSearchHistory
  };
};