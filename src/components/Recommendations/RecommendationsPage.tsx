import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Star, 
  TrendingUp, 
  Award, 
  Clock, 
  Users, 
  BookOpen, 
  Filter, 
  Search,
  Sparkles,
  User,
  Crown,
  Flame,
  Target,
  Globe,
  Calendar,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Book } from '../../types';
import BookCard from '../BookResults/BookCard';
import MoodSelector, { Mood } from '../SearchInterface/MoodSelector';
import { useRecommendations } from '../../hooks/useRecommendations';
import { useSearchHistory } from '../../hooks/useSearchHistory';

// Static curated recommendations for non-authenticated users and fallback
const staticCuratedRecommendations: RecommendationSection[] = [
  {
    id: 'staff-picks',
    title: 'Staff Picks',
    description: 'Curated selections from our literary experts',
    icon: Crown,
    type: 'curated',
    books: [
      {
        id: 'staff-1',
        title: 'Lessons in Chemistry',
        authors: ['Bonnie Garmus'],
        description: 'A brilliant scientist\'s unconventional approach to cooking and life in 1960s California.',
        coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=450&fit=crop',
        publishedDate: '2022',
        pageCount: 400,
        categories: ['Historical Fiction', 'Humor'],
        rating: 4.6,
        ratingCount: 45000,
        googleBooksUrl: 'https://books.google.com/books?id=example4',
        recommendation: 'Our editor\'s choice for best debut novel of the year!'
      },
      {
        id: 'staff-2',
        title: 'The Seven Husbands of Evelyn Hugo',
        authors: ['Taylor Jenkins Reid'],
        description: 'A reclusive Hollywood icon finally tells her story to a young journalist.',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
        publishedDate: '2017',
        pageCount: 400,
        categories: ['Historical Fiction', 'Romance'],
        rating: 4.5,
        ratingCount: 38000,
        googleBooksUrl: 'https://books.google.com/books?id=example5',
        recommendation: 'A captivating tale of love, ambition, and secrets!'
      }
    ]
  },
  {
    id: 'trending',
    title: 'Trending Now',
    description: 'Popular books everyone is talking about',
    icon: TrendingUp,
    type: 'community',
    books: [
      {
        id: 'trending-1',
        title: 'Fourth Wing',
        authors: ['Rebecca Yarros'],
        description: 'A thrilling fantasy about dragon riders and war college.',
        coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
        publishedDate: '2023',
        pageCount: 500,
        categories: ['Fantasy', 'Romance'],
        rating: 4.7,
        ratingCount: 52000,
        googleBooksUrl: 'https://books.google.com/books?id=example6',
        recommendation: 'The fantasy romance taking the world by storm!'
      }
    ]
  }
];

interface RecommendationSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  books: Book[];
  type: 'personalized' | 'curated' | 'community' | 'discovery';
}

const RecommendationsPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    recommendationData, 
    isLoading: recommendationsLoading,
    generatePersonalizedRecommendations,
    getBasedOnLibraryRecommendations,
    getTrendingBasedOnHistory
  } = useRecommendations();
  const { searchHistory } = useSearchHistory();
  const [activeFilter, setActiveFilter] = useState<'all' | 'personalized' | 'curated' | 'community' | 'discovery'>('all');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock recommendation data
  const [recommendations, setRecommendations] = useState<RecommendationSection[]>(staticCuratedRecommendations);

  // Generate recommendations based on user data
  useEffect(() => {
    if (user && !recommendationsLoading) {
      const personalizedBooks = generatePersonalizedRecommendations();
      const libraryBasedBooks = getBasedOnLibraryRecommendations();
      const trendingBooks = getTrendingBasedOnHistory();

      const newRecommendations: RecommendationSection[] = [
        // Only add personalized sections if we have data
        ...(personalizedBooks.length > 0 ? [{
          id: 'for-you',
          title: 'Recommended for You',
          description: `Personalized picks based on your ${searchHistory.length} searches and reading history`,
          icon: Target,
          type: 'personalized' as const,
          books: personalizedBooks
        }] : []),
        ...(libraryBasedBooks.length > 0 ? [{
          id: 'based-on-library',
          title: 'Based on Your Reading History',
          description: `Suggestions from your ${recommendationData.clickedBooks.length} book interactions`,
          icon: BookOpen,
          type: 'personalized' as const,
          books: libraryBasedBooks
        }] : []),
        ...(trendingBooks.length > 0 ? [{
          id: 'trending-based-on-you',
          title: 'Trending for Your Taste',
          description: 'Popular books that match your reading patterns',
          icon: TrendingUp,
          type: 'community' as const,
          books: trendingBooks
        }] : []),
        // Always include curated sections
        ...staticCuratedRecommendations
      ];

      setRecommendations(newRecommendations);
    } else {
      // Ensure recommendations are set to static data when user is not authenticated
      setRecommendations(staticCuratedRecommendations);
    }
  }, [user, recommendationsLoading, recommendationData, searchHistory, generatePersonalizedRecommendations, getBasedOnLibraryRecommendations, getTrendingBasedOnHistory]);

  const filteredRecommendations = recommendations.filter(section => {
    if (activeFilter === 'all') return true;
    return section.type === activeFilter;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Reload recommendation data
    if (user) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Minimum loading time for UX
    }
    setIsRefreshing(false);
  };

  const getFilterIcon = (filter: string) => {
    switch (filter) {
      case 'personalized': return Target;
      case 'curated': return Crown;
      case 'community': return Users;
      case 'discovery': return Globe;
      default: return Filter;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section for Non-Users */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Discover Your Next Favorite Book</h1>
              <p className="text-xl text-white text-opacity-90 max-w-2xl mx-auto mb-8">
                Get personalized recommendations based on your reading history and preferences
              </p>
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Sign Up for Personalized Recommendations
              </button>
            </div>
          </div>
        </div>

        {/* Sample Recommendations */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sample Recommendations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Here's a preview of the personalized recommendations you'll get when you create an account
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations[0].books.slice(0, 2).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Recommendations</h1>
                  <p className="text-xl text-white text-opacity-90">
                    Based on your {searchHistory.length} searches and reading patterns
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search History Insights */}
      {user && searchHistory.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Your Reading Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-blue-700 font-medium">Recent Searches</p>
                <p className="text-blue-600">{recommendationData.recentQueries.slice(0, 2).join(', ')}</p>
              </div>
              <div>
                <p className="text-blue-700 font-medium">Favorite Genres</p>
                <p className="text-blue-600">{recommendationData.popularGenres.slice(0, 3).join(', ')}</p>
              </div>
              <div>
                <p className="text-blue-700 font-medium">Books Explored</p>
                <p className="text-blue-600">{recommendationData.clickedBooks.length} books clicked</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Recommendations', icon: Filter },
                { id: 'personalized', label: 'For You', icon: Target },
                { id: 'curated', label: 'Curated', icon: Crown },
                { id: 'community', label: 'Community', icon: Users },
                { id: 'discovery', label: 'Discovery', icon: Globe }
              ].map((filter) => {
                const IconComponent = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeFilter === filter.id
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search recommendations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full lg:w-64"
              />
            </div>
          </div>
        </div>

        {/* Mood-Based Recommendations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
              Browse by Mood
            </h3>
            <p className="text-gray-600">Find books that match how you're feeling today</p>
          </div>
          <MoodSelector
            selectedMood={selectedMood}
            onMoodSelect={setSelectedMood}
          />
        </div>

        {/* Recommendation Sections */}
        <div className="space-y-8">
          {(recommendationsLoading ? [] : filteredRecommendations).map((section) => {
            const IconComponent = section.icon;
            return (
              <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                      <p className="text-gray-600 text-sm">{section.description}</p>
                    </div>
                  </div>
                  <button className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                    <span>View All</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {section.books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </div>
            );
          })}
          
          {recommendationsLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading personalized recommendations...</p>
            </div>
          )}
        </div>

        {/* Quick Discovery Tools */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Reading Groups</h4>
            <p className="text-gray-600 text-sm mb-4">Join discussions about books you love</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Explore Groups →
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 border border-purple-200">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Reading Challenges</h4>
            <p className="text-gray-600 text-sm mb-4">Set goals and track your progress</p>
            <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
              Join Challenge →
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Hot Topics</h4>
            <p className="text-gray-600 text-sm mb-4">Books trending in current events</p>
            <button className="text-green-600 hover:text-green-700 font-medium text-sm">
              See Trending →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;