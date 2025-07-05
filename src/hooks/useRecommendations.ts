import { useState, useEffect } from 'react';
import { DatabaseService, SavedBook } from '../lib/supabase';
import { useAuth } from './useAuth.tsx';
import { Book } from '../types';
import { useLibrary } from './useLibrary';

interface RecommendationData {
  recentQueries: string[];
  clickedBooks: any[];
  popularGenres: string[];
  preferences: any;
  searchHistory: any[];
  savedBooks: SavedBook[];
}

export const useRecommendations = () => {
  const { user } = useAuth();
  const { savedBooks } = useLibrary();
  const [recommendationData, setRecommendationData] = useState<RecommendationData>({
    recentQueries: [],
    clickedBooks: [],
    popularGenres: [],
    preferences: null,
    searchHistory: [],
    savedBooks: []
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadRecommendationData();
    }
  }, [user]);

  // Update recommendation data when saved books change
  useEffect(() => {
    setRecommendationData(prev => ({
      ...prev,
      savedBooks
    }));
  }, [savedBooks]);

  const loadRecommendationData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await DatabaseService.getRecommendationData(user.id);
      setRecommendationData(prev => ({
        ...data,
        savedBooks: savedBooks || [] // Ensure savedBooks is always an array
      }));
    } catch (error) {
      console.error('Error loading recommendation data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePersonalizedRecommendations = (): Book[] => {
    const { clickedBooks, popularGenres, recentQueries, savedBooks = [] } = recommendationData;
    
    // Enhanced recommendation algorithm using saved books data
    const recommendations: Book[] = [];
    
    // Get genres from saved books
    const savedGenres = savedBooks.flatMap(book => book.book_data.categories || []);
    const genreCount = savedGenres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topSavedGenres = Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);
    
    // Get authors from saved books
    const savedAuthors = savedBooks.flatMap(book => book.book_data.authors || []);
    const authorCount = savedAuthors.reduce((acc, author) => {
      acc[author] = (acc[author] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topAuthors = Object.entries(authorCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([author]) => author);
    
    // Get average rating preference
    const ratedBooks = savedBooks.filter(book => book.user_rating);
    const avgUserRating = ratedBooks.length > 0 
      ? ratedBooks.reduce((sum, book) => sum + (book.user_rating || 0), 0) / ratedBooks.length
      : 4.0;
    
    // Generate recommendations based on saved library
    if (topSavedGenres.includes('Science Fiction') || popularGenres.includes('Science Fiction') || recentQueries.some(q => q.toLowerCase().includes('science'))) {
      recommendations.push({
        id: 'rec-sf-1',
        title: 'The Left Hand of Darkness',
        authors: ['Ursula K. Le Guin'],
        description: 'A groundbreaking exploration of gender and society on an alien world.',
        coverImage: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=450&fit=crop',
        publishedDate: '1969',
        categories: ['Science Fiction', 'Space Opera'],
        rating: 4.2,
        ratingCount: 67000,
        googleBooksUrl: 'https://books.google.com/books?id=example',
        recommendation: 'Based on your science fiction preferences, this classic explores themes similar to your reading history.'
      });
    }

    if (topSavedGenres.includes('Fantasy') || popularGenres.includes('Fantasy') || recentQueries.some(q => q.toLowerCase().includes('fantasy'))) {
      recommendations.push({
        id: 'rec-fantasy-1',
        title: 'The Goblin Emperor',
        authors: ['Katherine Addison'],
        description: 'A court intrigue fantasy about a half-goblin prince who unexpectedly becomes emperor.',
        coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
        publishedDate: '2014',
        categories: ['Fantasy', 'Court Intrigue'],
        rating: 4.3,
        ratingCount: 45000,
        googleBooksUrl: 'https://books.google.com/books?id=example',
        recommendation: 'Your fantasy preferences suggest you\'ll enjoy this character-driven political fantasy.'
      });
    }

    // Recommendations based on favorite authors
    if (topAuthors.length > 0) {
      recommendations.push({
        id: 'rec-author-1',
        title: 'Similar Authors Recommendation',
        authors: ['Various Authors'],
        description: `Books by authors similar to your favorites: ${topAuthors.join(', ')}.`,
        coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop',
        publishedDate: '2023',
        categories: topSavedGenres,
        rating: avgUserRating,
        ratingCount: 25000,
        googleBooksUrl: 'https://books.google.com/books?id=example',
        recommendation: `Since you enjoy ${topAuthors[0]}, you might like these similar authors.`
      });
    }

    // High-rated books in user's preferred genres
    if (topSavedGenres.length > 0 && avgUserRating >= 4.0) {
      recommendations.push({
        id: 'rec-highrated-1',
        title: 'Highly Rated in Your Genres',
        authors: ['Acclaimed Authors'],
        description: `Top-rated books in ${topSavedGenres[0]} that match your high standards.`,
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop',
        publishedDate: '2023',
        categories: [topSavedGenres[0]],
        rating: 4.6,
        ratingCount: 89000,
        googleBooksUrl: 'https://books.google.com/books?id=example',
        recommendation: `Since you rate books highly (avg: ${avgUserRating.toFixed(1)}), these acclaimed ${topSavedGenres[0]} books should meet your standards.`
      });
    }

    // If no specific preferences detected or for new users, provide general recommendations
    if (recommendations.length === 0) {
      recommendations.push(
        {
          id: 'rec-popular-1',
          title: 'The Seven Husbands of Evelyn Hugo',
          authors: ['Taylor Jenkins Reid'],
          description: 'A reclusive Hollywood icon finally tells her story to a young journalist.',
          coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
          publishedDate: '2017',
          categories: ['Historical Fiction', 'Romance'],
          rating: 4.5,
          ratingCount: 89000,
          googleBooksUrl: 'https://books.google.com/books?id=example',
          recommendation: 'A captivating tale that\'s perfect for discovering your reading preferences!'
        },
        {
          id: 'rec-popular-2',
          title: 'Atomic Habits',
          authors: ['James Clear'],
          description: 'An easy and proven way to build good habits and break bad ones.',
          coverImage: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&h=450&fit=crop',
          publishedDate: '2018',
          categories: ['Self-Help', 'Psychology'],
          rating: 4.7,
          ratingCount: 125000,
          googleBooksUrl: 'https://books.google.com/books?id=example',
          recommendation: 'Start your reading journey with this highly-rated and practical guide!'
        }
      );
    }
    return recommendations;
  };

  const getBasedOnLibraryRecommendations = (): Book[] => {
    const { clickedBooks, savedBooks = [] } = recommendationData;
    
    // Generate recommendations based on saved books and clicked books
    const recommendations: Book[] = [];
    
    // Combine saved books and clicked books for analysis
    const allBooks = [
      ...savedBooks.map(book => book.book_data),
      ...(clickedBooks || [])
    ];
    
    if (allBooks.length > 0) {
      // Find common themes/genres from all user interactions
      const genres = allBooks.flatMap(book => book.categories || []);
      const genreCount = genres.reduce((acc, genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const topGenre = Object.entries(genreCount)
        .sort(([,a], [,b]) => b - a)[0]?.[0];
      
      // Get reading patterns from saved books
      const readBooks = savedBooks.filter(book => book.is_read);
      const avgReadingTime = readBooks.length > 0 
        ? readBooks.reduce((sum, book) => {
            const savedDate = new Date(book.saved_at);
            const readDate = book.read_at ? new Date(book.read_at) : new Date();
            return sum + (readDate.getTime() - savedDate.getTime());
          }, 0) / readBooks.length / (1000 * 60 * 60 * 24) // Convert to days
        : 0;
      
      if (topGenre) {
        recommendations.push({
          id: 'rec-library-1',
          title: 'Based on Your Library',
          authors: ['Various Authors'],
          description: `Curated ${topGenre} recommendations based on your ${savedBooks.length} saved books and reading patterns.`,
          coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop',
          publishedDate: '2023',
          categories: [topGenre],
          rating: 4.2,
          ratingCount: 25000,
          googleBooksUrl: 'https://books.google.com/books?id=example',
          recommendation: `Based on your ${savedBooks.length} saved books and preference for ${topGenre}, with ${readBooks.length} books completed.`
        });
      }
      
      // Add recommendations based on reading speed/habits
      if (readBooks.length >= 3) {
        const readingSpeed = avgReadingTime < 30 ? 'fast' : avgReadingTime < 60 ? 'moderate' : 'slow';
        recommendations.push({
          id: 'rec-reading-pace-1',
          title: `Perfect for Your Reading Pace`,
          authors: ['Curated Selection'],
          description: `Books that match your ${readingSpeed} reading style and completion patterns.`,
          coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop',
          publishedDate: '2023',
          categories: [topGenre || 'Fiction'],
          rating: 4.4,
          ratingCount: 35000,
          googleBooksUrl: 'https://books.google.com/books?id=example',
          recommendation: `Based on your reading habits (${readBooks.length} books completed), these match your ${readingSpeed} reading pace.`
        });
      }
    }
    
    return recommendations;
  };

  const getTrendingBasedOnHistory = (): Book[] => {
    const { savedBooks = [], recentQueries = [], popularGenres = [] } = recommendationData;
    
    // Generate trending recommendations based on user's patterns and current trends
    const recommendations: Book[] = [];
    
    // Get user's genre preferences
    const userGenres = savedBooks.flatMap(book => book.book_data.categories || []);
    const combinedGenres = [...userGenres, ...popularGenres];
    const genreCount = combinedGenres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topUserGenre = Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0];
    
    if (topUserGenre) {
      recommendations.push({
        id: 'rec-trending-1',
        title: 'Trending in Your Favorite Genre',
        authors: ['Popular Authors'],
        description: `Currently trending ${topUserGenre} books that align with your reading history.`,
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop',
        publishedDate: '2024',
        categories: [topUserGenre],
        rating: 4.5,
        ratingCount: 89000,
        googleBooksUrl: 'https://books.google.com/books?id=example',
        recommendation: `This trending ${topUserGenre} book matches your reading patterns and current popular trends.`
      });
    }
    
    // Add recommendations based on recent search queries
    if (recentQueries.length > 0) {
      const recentThemes = recentQueries.join(' ').toLowerCase();
      let trendingCategory = 'Fiction';
      let trendingDescription = 'Popular books matching your recent searches';
      
      if (recentThemes.includes('romance')) {
        trendingCategory = 'Romance';
        trendingDescription = 'Trending romance novels based on your recent searches';
      } else if (recentThemes.includes('mystery') || recentThemes.includes('thriller')) {
        trendingCategory = 'Mystery';
        trendingDescription = 'Hot mystery and thriller releases matching your interests';
      } else if (recentThemes.includes('fantasy') || recentThemes.includes('magic')) {
        trendingCategory = 'Fantasy';
        trendingDescription = 'Trending fantasy books that match your search history';
      }
      
      recommendations.push({
        id: 'rec-trending-search-1',
        title: 'Trending Based on Your Searches',
        authors: ['Trending Authors'],
        description: trendingDescription,
        coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=450&fit=crop',
        publishedDate: '2024',
        categories: [trendingCategory],
        rating: 4.4,
        ratingCount: 67000,
        googleBooksUrl: 'https://books.google.com/books?id=example',
        recommendation: `Based on your recent searches for "${recentQueries.slice(0, 2).join('", "')}", this trending book should interest you.`
      });
    }
    
    return recommendations;
  };

  return {
    recommendationData,
    isLoading,
    loadRecommendationData,
    generatePersonalizedRecommendations,
    getBasedOnLibraryRecommendations,
    getTrendingBasedOnHistory
  };
};