export interface Book {
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
  similarityScore?: number;
  recommendation?: string;
  googleBooksUrl: string;
  isbn?: string;
}

export interface SearchFilters {
  author?: string;
  subject?: string;
  publishedAfter?: string;
  publishedBefore?: string;
  minRating?: number;
  language?: string;
}

export interface BookSearchRequest {
  query: string;
  filters?: SearchFilters;
  userId?: string;
}

export interface BookSearchResponse {
  results: Book[];
  totalResults: number;
  processingTime: string;
  query: string;
}

export interface SearchState {
  isLoading: boolean;
  results: Book[];
  error: string | null;
  totalResults: number;
  processingTime: string;
  hasSearched: boolean;
}