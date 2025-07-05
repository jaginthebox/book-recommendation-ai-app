import React, { useState } from 'react';
import { AuthProvider } from './hooks/useAuth.tsx';
import Header from './components/Layout/Header';
import LibraryPage from './components/Library/LibraryPage';
import SearchBar from './components/SearchInterface/SearchBar';
import BookGrid from './components/BookResults/BookGrid';
import LoadingSpinner from './components/Common/LoadingSpinner';
import EmptyState from './components/Common/EmptyState';
import { useBookSearch } from './hooks/useBookSearch';
import { Book } from './types';
import { BookOpen, Sparkles, Search, Heart } from 'lucide-react';

function App() {
  const { isLoading, results, error, totalResults, processingTime, hasSearched, searchBooks } = useBookSearch();
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentPage, setCurrentPage] = useState<'home' | 'library' | 'recommendations' | 'about'>('home');

  const handleSearch = async (query: string) => {
    setCurrentQuery(query);
    await searchBooks({ query });
  };

  const handleBookClick = (book: Book) => {
    // TODO: Implement book detail modal or navigation
    console.log('Book clicked:', book);
  };

  const handleTryExample = (example: string) => {
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
    
    // Check initial hash
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {currentPage === 'library' ? (
          <LibraryPage />
        ) : currentPage === 'recommendations' ? (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recommendations Coming Soon</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                We're working on personalized book recommendations based on your reading history and preferences.
              </p>
            </div>
          </div>
        ) : currentPage === 'about' ? (
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">About Readpop</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Discover your next favorite book with the power of AI-driven recommendations
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Discovery</h3>
                  <p className="text-gray-600">
                    Our AI understands your mood and preferences to find books that perfectly match what you're looking for.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Library</h3>
                  <p className="text-gray-600">
                    Save books, track your reading progress, and keep notes about your favorite reads all in one place.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Powered by Advanced AI</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Readpop uses semantic search and machine learning to understand the nuances of what makes a book perfect for you. 
                  Whether you're looking for something specific or just browsing by mood, we'll help you discover amazing books.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Discover your next great read
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Tell us what you're in the mood for, and our AI will find the perfect books to match your vibe.
              </p>
            </div>
            
            <SearchBar 
              onSearch={handleSearch} 
              isLoading={isLoading}
            />
          </div>

          {/* Results Section */}
          <div className="mb-8">
            {isLoading && (
              <LoadingSpinner 
                message="Our AI is analyzing thousands of books to find your perfect matches..."
              />
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm font-medium">!</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Search Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && !error && hasSearched && results.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Found {totalResults} perfect matches
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Search completed in {processingTime} • Powered by AI semantic matching
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
              <EmptyState 
                type="no-results" 
                query={currentQuery}
                onTryExample={handleTryExample}
              />
            )}

            {!hasSearched && !isLoading && (
              <EmptyState 
                type="initial"
                onTryExample={handleTryExample}
              />
            )}
          </div>
        </main>
        )}

        {/* Footer */}
        {currentPage === 'home' && (
          <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-gray-600">
                Powered by AI semantic search • Built with React, TypeScript, and Tailwind CSS
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Book data provided by Google Books API • Recommendations generated by OpenAI
              </p>
            </div>
          </div>
        </footer>
        )}
      </div>
    </AuthProvider>
  );
}

export default App;