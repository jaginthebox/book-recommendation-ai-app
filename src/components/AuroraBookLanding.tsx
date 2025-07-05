"use client";

import { motion } from "framer-motion";
import React, { useState, useRef } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { BookOpen, Sparkles, Search, Star, Users, TrendingUp, Heart, Zap, Coffee, Moon, Clock, Award } from "lucide-react";
import { useBookSearch } from '../hooks/useBookSearch';
import EnhancedBookGrid from './BookResults/EnhancedBookGrid';
import LoadingSpinner from './Common/LoadingSpinner';
import { Book } from '../types';

export function AuroraBookLanding() {
  const { isLoading, results, error, totalResults, processingTime, hasSearched, searchBooks } = useBookSearch();
  const [query, setQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const moodButtons = [
    { id: 'adventurous', label: 'Adventurous', icon: Zap, color: 'from-orange-400 to-red-500', query: 'thrilling adventure books with action and excitement' },
    { id: 'romantic', label: 'Romantic', icon: Heart, color: 'from-pink-400 to-rose-500', query: 'heartwarming romance novels with emotional depth' },
    { id: 'thoughtful', label: 'Thoughtful', icon: Coffee, color: 'from-amber-400 to-orange-500', query: 'thought-provoking literary fiction that makes you think' },
    { id: 'mysterious', label: 'Mysterious', icon: Moon, color: 'from-indigo-400 to-purple-500', query: 'gripping mystery and thriller books with plot twists' }
  ];

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    await searchBooks({ query: searchQuery });
    // Scroll to results after search
    setTimeout(() => {
      searchRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      handleSearch(query.trim());
    }
  };

  const handleMoodClick = (mood: typeof moodButtons[0]) => {
    setSelectedMood(mood.id);
    setQuery(mood.query);
    handleSearch(mood.query);
  };

  const handleBookClick = (book: Book) => {
    console.log('Book clicked:', book);
  };

  return (
    <div className="min-h-screen">
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-8 items-center justify-center px-4 max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <Sparkles className="w-5 h-5 text-yellow-400 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                BookMind
              </h1>
              <p className="text-sm text-gray-600">AI-Powered Book Discovery</p>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center">
            <div className="text-4xl md:text-6xl lg:text-7xl font-bold dark:text-white text-gray-900 text-center mb-6 leading-tight">
              Find Your Next
              <span className="block bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Favorite Book
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl">in 30 Seconds</span>
            </div>
            
            <div className="font-light text-lg md:text-xl dark:text-neutral-200 text-gray-600 py-4 max-w-3xl mx-auto">
              AI-powered recommendations based on your mood and preferences. 
              <span className="font-semibold text-purple-700"> No more endless browsing.</span>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600 mb-8">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="font-medium">500,000+ readers</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium">4.9/5 rating</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="font-medium">97% match rate</span>
            </div>
          </div>

          {/* Mood Buttons */}
          <div className="w-full max-w-4xl">
            <p className="text-center text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">What's your mood today?</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {moodButtons.map((mood) => {
                const Icon = mood.icon;
                return (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodClick(mood)}
                    disabled={isLoading}
                    className={`group relative overflow-hidden bg-gradient-to-br ${mood.color} text-white p-4 rounded-2xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      selectedMood === mood.id ? 'ring-4 ring-white shadow-2xl' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-semibold text-sm">{mood.label}</span>
                    </div>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-4xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe the perfect book for you..."
                disabled={isLoading}
                className="w-full pl-16 pr-20 py-6 text-lg border-2 border-gray-200 rounded-2xl 
                         focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-lg hover:shadow-xl transition-all duration-200
                         placeholder-gray-400 bg-white/90 backdrop-blur-sm"
              />
              
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="absolute inset-y-0 right-0 pr-4 flex items-center
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 
                              text-white px-6 py-3 rounded-xl transition-all duration-200
                              flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl
                              transform hover:-translate-y-0.5">
                  <Sparkles className="w-5 h-5" />
                  <span>Discover</span>
                </div>
              </button>
            </div>
          </form>

          {/* CTA */}
          <button 
            onClick={() => searchRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-full px-8 py-3 font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-gray-700"
          >
            Start Your Book Journey
          </button>

          {/* Quick Examples */}
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Try: "uplifting romance", "dark mystery", "sci-fi with strong women"
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              ✓ Instant results • ✓ No spam • ✓ Always free
            </p>
          </div>
        </motion.div>
      </AuroraBackground>

      {/* Results Section */}
      <div ref={searchRef} className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                No books found for "{query}"
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Try adjusting your search terms or being more specific about what you're looking for.
              </p>
            </div>
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
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <p className="text-gray-600">
                © 2024 BookMind. All rights reserved. • 
                <span className="text-purple-600 font-medium"> Powered by AI semantic search</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Book data provided by Google Books API • Recommendations generated by OpenAI
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}