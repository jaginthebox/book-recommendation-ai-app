import React, { useState, useRef } from 'react';
import Header from './components/Layout/Header';
import HeroSection from './components/Hero/HeroSection';
import EnhancedSearchBar from './components/SearchInterface/EnhancedSearchBar';
import EnhancedBookGrid from './components/BookResults/EnhancedBookGrid';
import LoadingSpinner from './components/Common/LoadingSpinner';
import EmptyState from './components/Common/EmptyState';
import SocialProof from './components/Common/SocialProof';
import { useBookSearch } from './hooks/useBookSearch';
import { Book } from './types';

function App() {
  const { isLoading, results, error, totalResults, processingTime, hasSearched, searchBooks } = useBookSearch();
  const [currentQuery, setCurrentQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

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

  const handleGetStarted = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <HeroSection onGetStarted={handleGetStarted} />

      {/* Social Proof */}
      <SocialProof />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search Section */}
        <div ref={searchRef} className="mb-16">
          <EnhancedSearchBar 
            onSearch={handleSearch} 
            isLoading={isLoading}
          />
        </div>

        {/* Results Section */}
        <div className="mb-8">
          {isLoading && (
            <LoadingSpinner 
              message="Our AI is analyzing millions of books to find your perfect matches..."
            />
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-lg font-bold">!</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-red-800">Oops! Something went wrong</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                  <p className="text-sm text-red-600 mt-2">
                    Don't worry - try searching again or contact our support team.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !error && hasSearched && results.length > 0 && (
            <EnhancedBookGrid 
              books={results} 
              onBookClick={handleBookClick}
              totalResults={totalResults}
              processingTime={processingTime}
            />
          )}

          {!isLoading && !error && hasSearched && results.length === 0 && (
            <EmptyState 
              type="no-results" 
              query={currentQuery}
              onTryExample={handleTryExample}
            />
          )}

          {!hasSearched && !isLoading && (
            <div className="text-center py-16">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to discover your next favorite book?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Our AI has helped over 500,000 readers find books they absolutely love. 
                  Join them and discover what you've been missing.
                </p>
                <button 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Start Your Book Journey
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">B</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    BookMind
                  </h3>
                  <p className="text-sm text-gray-500">AI-Powered Book Discovery</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                Discover your next favorite book in seconds with our AI-powered recommendation engine. 
                Join 500,000+ readers who trust BookMind for personalized book suggestions.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>🔒 Privacy Protected</span>
                <span>⚡ Instant Results</span>
                <span>💯 Money-Back Guarantee</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-purple-600 transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Mobile App</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-purple-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-600">
              © 2024 BookMind. All rights reserved. • 
              <span className="text-purple-600 font-medium"> Powered by AI semantic search</span> • 
              Built with React, TypeScript, and Tailwind CSS
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Book data provided by Google Books API • Recommendations generated by OpenAI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;