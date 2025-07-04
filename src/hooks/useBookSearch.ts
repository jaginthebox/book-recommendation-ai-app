import { useState, useCallback } from 'react';
import { BookSearchRequest, SearchState } from '../types';
import { bookSearchService } from '../services/api';

export const useBookSearch = () => {
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
    clearSearch
  };
};