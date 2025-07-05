import React, { useState } from 'react';
import Header from './Layout/Header';
import LibraryPage from './Library/LibraryPage';
import SearchBar from './SearchInterface/SearchBar';
import BookGrid from './BookResults/BookGrid';
import LoadingSpinner from './Common/LoadingSpinner';
import EmptyState from './Common/EmptyState';
import RecommendationsPage from './Recommendations/RecommendationsPage';
import CompactMoodSelector from './SearchInterface/CompactMoodSelector';
import { useBookSearch } from '../hooks/useBookSearch';
import { Book } from '../types';
import { BookOpen, Sparkles, Search, Heart, Target, TrendingUp, Award, Users, Zap, Star, Clock, Globe, ChevronDown, ChevronUp } from 'lucide-react';

function AppContent() {
  const { isLoading, results, error, totalResults, processingTime, hasSearched, searchBooks } = useBookSearch();
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentPage, setCurrentPage] = useState<'home' | 'library' | 'recommendations' | 'about'>('home');
  const [searchInput, setSearchInput] = useState('');
  const [selectedMood, setSelectedMood] = useState<any>(null);

  const handleSearch = async (query: string) => {
    setCurrentQuery(query);
    setSearchInput(query);
    
    // Combine search input with mood modifier if mood is selected
    let finalQuery = query;
    if (selectedMood) {
      finalQuery = `${query} ${selectedMood.searchModifier}`;
    }
    
    await searchBooks({ query: finalQuery });
  };

  const handleMoodSelect = (mood: any) => {
    setSelectedMood(mood);
  };
  
  const handleBookClick = (book: Book) => {
    // TODO: Implement book detail modal or navigation
    console.log('Book clicked:', book);
  };

  const handleTryExample = (example: string) => {
    setSearchInput(example);
    handleSearch(example);
  };

  // Handle navigation
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      console.log('Hash changed to:', hash); // Debug log
      if (hash === '#library') {
        setCurrentPage('library');
      } else if (hash === '#recommendations') {
        setCurrentPage('recommendations');
      } else if (hash === '#about') {
        setCurrentPage('about');
      } else {
        setCurrentPage('home');
      }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Also listen for popstate events (back/forward buttons)
    window.addEventListener('popstate', handleHashChange);
    
    // Check initial hash
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {currentPage === 'library' ? (
        <LibraryPage />
      ) : currentPage === 'recommendations' ? (
        <RecommendationsPage />
      ) : currentPage === 'about' ? (
        <div className="min-h-screen bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="relative inline-block mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                  <BookOpen className="w-12 h-12 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 bg-clip-text text-transparent mb-6">
                About NextRead
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Discover your next favorite book with the power of AI-driven recommendations. 
                We combine advanced machine learning with human curation to create the perfect reading experience.
              </p>
            </div>
            
            {/* Bento Grid Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-16">
              {/* Large Feature Card */}
              <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300 group">
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">AI-Powered Discovery</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      Our advanced AI understands your reading preferences, mood, and interests to recommend books 
                      that perfectly match what you're looking for. From genre preferences to writing style, 
                      we analyze every detail to find your perfect match.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">Semantic Search</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Machine Learning</span>
                      <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">Personalization</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tall Feature Card */}
              <div className="lg:row-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 text-white hover:shadow-2xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4">Personal Library</h3>
                <p className="text-indigo-100 mb-6 leading-relaxed">
                  Save books, track your reading progress, and keep detailed notes about your favorite reads. 
                  Your personal library grows smarter with every book you add.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-indigo-100">Reading progress tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-indigo-100">Personal notes & ratings</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-indigo-100">Smart recommendations</span>
                  </div>
                </div>
              </div>
              
              {/* Community Features */}
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Community Insights</h3>
                <p className="text-gray-700 leading-relaxed">
                  Discover what other readers with similar tastes are enjoying. Our community-driven recommendations 
                  help you find hidden gems.
                </p>
              </div>
              
              {/* Trending */}
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Trending & Popular</h3>
                <p className="text-gray-700 leading-relaxed">
                  Stay up-to-date with the latest bestsellers, award winners, and books that are making waves 
                  in the literary world.
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200 mb-16">
              <div className="text-center mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Powered by Advanced Technology</h3>
                <p className="text-gray-700">Our platform combines cutting-edge AI with comprehensive book data</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">1M+</div>
                  <div className="text-gray-700 text-sm">Books in Database</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">AI-Powered</div>
                  <div className="text-gray-700 text-sm">Semantic Search</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">Personalized</div>
                  <div className="text-gray-700 text-sm">Recommendations</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">Real-time</div>
                  <div className="text-gray-700 text-sm">Updates</div>
                </div>
              </div>
            </div>
            
            {/* CTA Section */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl shadow-2xl p-8 sm:p-12 text-center text-white">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Discover Your Next Favorite Book?</h3>
              <p className="text-indigo-100 max-w-2xl mx-auto mb-8 text-base sm:text-lg">
                Join thousands of readers who have found their perfect books through our AI-powered recommendations.
              </p>
              <button className="bg-white text-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl">
                Start Discovering Books
              </button>
            </div>
          </div>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Engaging Banner - Moved Higher */}
          <div className="mb-8">
            <div className="relative overflow-hidden rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-xl">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=600&fit=crop&crop=center&auto=enhance&sat=20&con=25&sharp=10')`,
                }}
              ></div>
              
              {/* Very light overlay to keep books visible */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/25 via-indigo-900/20 to-blue-900/25"></div>
              
              {/* Subtle floating book accents - minimal to not interfere with real books */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-6 left-8 w-6 h-8 bg-amber-200 rounded-sm shadow-sm transform rotate-12"></div>
                <div className="absolute top-12 right-16 w-5 h-7 bg-emerald-200 rounded-sm shadow-sm transform -rotate-8"></div>
                <div className="absolute bottom-8 left-20 w-7 h-9 bg-rose-200 rounded-sm shadow-sm transform rotate-15"></div>
                <div className="absolute bottom-6 right-12 w-4 h-6 bg-blue-200 rounded-sm shadow-sm transform -rotate-10"></div>
              </div>
              
              <div className="relative z-10 text-center text-white">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  {/* Reader silhouettes */}
                  <div className="hidden sm:flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-4 h-4 bg-white rounded-full opacity-90"></div>
                    </div>
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full opacity-90"></div>
                    </div>
                  </div>
                  
                  {/* Central book icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/20">
                    <BookOpen className="w-8 h-8 text-white drop-shadow-xl" />
                  </div>
                  
                  {/* More reader silhouettes */}
                  <div className="hidden sm:flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full opacity-90"></div>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-4 h-4 bg-white rounded-full opacity-90"></div>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-xl">
                  Discover Your Perfect
                  <span className="text-amber-200"> Literary Journey</span>
                </h2>
                
                <p className="text-lg sm:text-xl text-gray-50 max-w-3xl mx-auto mb-6 leading-relaxed drop-shadow-lg">
                  From timeless classics to contemporary masterpieces, from thrilling adventures to profound insights—
                  <span className="font-semibold text-amber-100"> find books that speak to your soul</span> with our AI-powered recommendations.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <div className="flex items-center space-x-2 bg-white bg-opacity-25 backdrop-blur-sm px-4 py-2 rounded-full border border-white border-opacity-40 shadow-lg">
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span className="text-white font-medium">Personalized Recommendations</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white bg-opacity-25 backdrop-blur-sm px-4 py-2 rounded-full border border-white border-opacity-40 shadow-lg">
                    <Heart className="w-4 h-4 text-pink-300" />
                    <span className="text-white font-medium">Curated Collections</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white bg-opacity-25 backdrop-blur-sm px-4 py-2 rounded-full border border-white border-opacity-40 shadow-lg">
                    <TrendingUp className="w-4 h-4 text-emerald-300" />
                    <span className="text-white font-medium">Trending Discoveries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Describe your perfect book
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Tell us what you're looking for, and our AI will find exactly what matches your taste.
                </p>
              </div>
              
              {/* Compact Mood Selector */}
              <div className="mb-6">
                <CompactMoodSelector 
                  selectedMood={selectedMood}
                  onMoodSelect={handleMoodSelect}
                />
              </div>
              
              <SearchBar 
                onSearch={handleSearch} 
                isLoading={isLoading}
                searchValue={searchInput}
                onSearchValueChange={setSearchInput}
              />
            </div>
          </div>


          {/* Results Section - Bento Style */}
          <div className="mb-8">
            {isLoading && (
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-200">
                <LoadingSpinner 
                  message="Our AI is analyzing thousands of books to find your perfect matches..."
                />
              </div>
            )}

            {error && (
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                      <span className="text-red-600 text-lg font-bold">!</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-red-800">Search Error</h3>
                    <p className="text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Results */}
            {!isLoading && !error && hasSearched && results.length > 0 && (
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200 mb-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                      <Sparkles className="w-6 h-6 mr-2 text-indigo-600" />
                      Found {totalResults} perfect matches
                    </h3>
                    <p className="text-gray-700 mt-2">
                      Search completed • Powered by AI semantic matching
                    </p>
                  </div>
                </div>
                
                <BookGrid 
                  books={results} 
                  onBookClick={handleBookClick}
                />
              </div>
            )}

            {!isLoading && !error && hasSearched && results.length === 0 && (
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-200 mb-8">
                <EmptyState 
                  type="no-results" 
                  query={currentQuery}
                  onTryExample={handleTryExample}
                />
              </div>
            )}

            {!hasSearched && !isLoading && (
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-200 mb-8">
                <EmptyState 
                  type="initial"
                  onTryExample={handleTryExample}
                />
              </div>
            )}

        </main>
      )}

      {/* Footer */}
      {currentPage === 'home' && (
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">NextRead</span>
              </div>
              <p className="text-gray-700 mb-2">
                Powered by AI semantic search • Built with React, TypeScript, and Tailwind CSS
              </p>
              <p className="text-sm text-gray-600">
                Book data provided by Google Books API • Recommendations generated by OpenAI
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default AppContent;