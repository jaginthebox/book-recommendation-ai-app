import { useState, useEffect } from 'react';
import { DatabaseService } from '../lib/supabase';
import { useAuth } from './useAuth';
import { Book } from '../types';

interface RecommendationData {
  recentQueries: string[];
  clickedBooks: any[];
  popularGenres: string[];
  preferences: any;
  searchHistory: any[];
}

export const useRecommendations = () => {
  const { user } = useAuth();
  const [recommendationData, setRecommendationData] = useState<RecommendationData>({
    recentQueries: [],
    clickedBooks: [],
    popularGenres: [],
    preferences: null,
    searchHistory: []
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadRecommendationData();
    }
  }, [user]);

  const loadRecommendationData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await DatabaseService.getRecommendationData(user.id);
      setRecommendationData(data);
    } catch (error) {
      console.error('Error loading recommendation data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePersonalizedRecommendations = (): Book[] => {
    const { clickedBooks, popularGenres, recentQueries } = recommendationData;
    
    // This is a simplified recommendation algorithm
    // In a real app, you'd use more sophisticated ML algorithms
    
    const recommendations: Book[] = [];
    
    // Mock recommendations based on user data
    if (popularGenres.includes('Science Fiction')) {
      recommendations.push({
        id: 'rec-sf-1',
        title: 'The Expanse: Leviathan Wakes',
        authors: ['James S.A. Corey'],
        description: 'A space opera that follows a detective and a ship\'s officer as they uncover a conspiracy.',
        coverImage: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=450&fit=crop',
        publishedDate: '2011',
        categories: ['Science Fiction', 'Space Opera'],
        rating: 4.4,
        ratingCount: 89000,
        googleBooksUrl: 'https://books.google.com/books?id=example',
        recommendation: 'Based on your love for science fiction, this space opera offers complex characters and political intrigue.'
      });
    }

    if (popularGenres.includes('Fantasy')) {
      recommendations.push({
        id: 'rec-fantasy-1',
        title: 'The Name of the Wind',
        authors: ['Patrick Rothfuss'],
        description: 'The first book in the Kingkiller Chronicle series about a legendary figure telling his story.',
        coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
        publishedDate: '2007',
        categories: ['Fantasy', 'Epic Fantasy'],
        rating: 4.5,
        ratingCount: 156000,
        googleBooksUrl: 'https://books.google.com/books?id=example',
        recommendation: 'Your fantasy reading history suggests you\'ll love this beautifully written epic tale.'
      });
    }

    // Add more recommendations based on recent queries
    if (recentQueries.some(q => q.toLowerCase().includes('mystery'))) {
      recommendations.push({
        id: 'rec-mystery-1',
        title: 'The Thursday Murder Club',
        authors: ['Richard Osman'],
        description: 'Four unlikely friends meet weekly to investigate cold cases, but soon find themselves pursuing a killer.',
        coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop',
        publishedDate: '2020',
        categories: ['Mystery', 'Cozy Mystery'],
        rating: 4.3,
        ratingCount: 67000,
        googleBooksUrl: 'https://books.google.com/books?id=example',
        recommendation: 'Since you\'ve been searching for mysteries, this charming cozy mystery is perfect for you.'
      });
    }

    return recommendations;
  };

  const getBasedOnLibraryRecommendations = (): Book[] => {
    const { clickedBooks } = recommendationData;
    
    // Generate recommendations based on books the user has clicked on
    const recommendations: Book[] = [];
    
    if (clickedBooks.length > 0) {
      // Find common themes/genres from clicked books
      const genres = clickedBooks.flatMap(book => book.categories || []);
      const genreCount = genres.reduce((acc, genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const topGenre = Object.entries(genreCount)
        .sort(([,a], [,b]) => b - a)[0]?.[0];
      
      if (topGenre) {
        recommendations.push({
          id: 'rec-library-1',
          title: 'Similar to Your Recent Reads',
          authors: ['Various Authors'],
          description: `Books similar to your recent ${topGenre} selections.`,
          coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop',
          publishedDate: '2023',
          categories: [topGenre],
          rating: 4.2,
          ratingCount: 25000,
          googleBooksUrl: 'https://books.google.com/books?id=example',
          recommendation: `Based on your interest in ${topGenre} books from your library.`
        });
      }
    }
    
    return recommendations;
  };

  const getTrendingBasedOnHistory = (): Book[] => {
    // Generate trending recommendations based on user's search patterns
    return [
      {
        id: 'rec-trending-1',
        title: 'Fourth Wing',
        authors: ['Rebecca Yarros'],
        description: 'A fantasy romance about a war college where dragons choose their riders.',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop',
        publishedDate: '2023',
        categories: ['Fantasy', 'Romance'],
        rating: 4.6,
        ratingCount: 89000,
        googleBooksUrl: 'https://books.google.com/books?id=example',
        recommendation: 'This trending fantasy romance matches your reading patterns perfectly.'
      }
    ];
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