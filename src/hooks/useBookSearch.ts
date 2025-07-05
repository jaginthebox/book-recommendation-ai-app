import { useState, useCallback } from 'react';
import { BookSearchRequest, SearchState } from '../types';
import { bookSearchService } from '../services/api';
import { useSearchHistory } from './useSearchHistory';

export const useBookSearch = () => {
  const { saveSearch, recordBookClick } = useSearchHistory();
  const [searchState, setSearchState] = useState<SearchState>({
    isLoading: false,
    results: [],
    error: null,
    totalResults: 0,
    processingTime: '',
    hasSearched: false
  });

  const searchBooks = useCallback(async (request: BookSearchRequest) => {
    setSearchState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const response = await bookSearchService.searchBooks(request);
      
      // Save search to history
      const searchId = await saveSearch(
        request.query,
        response.totalResults,
        {
          processing_time: response.processingTime,
          timestamp: Date.now()
        }
      );
      
      setSearchState({
        isLoading: false,
        results: response.results,
        error: null,
        totalResults: response.totalResults,
        processingTime: response.processingTime,
        hasSearched: true
      });
    } catch (error) {
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        hasSearched: true
      }));
    }
  }, []);

  const handleBookClick = useCallback(async (book: any) => {
    await recordBookClick(book);
  }, [recordBookClick]);

  const clearSearch = useCallback(() => {
    setSearchState({
      isLoading: false,
      results: [],
      error: null,
      totalResults: 0,
      processingTime: '',
      hasSearched: false
    });
  }, []);

  return {
    ...searchState,
    searchBooks,
    handleBookClick,
    clearSearch
  };
};