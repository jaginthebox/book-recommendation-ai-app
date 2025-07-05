import React from 'react';
import { Book } from '../../types';
import EnhancedBookCard from './EnhancedBookCard';
import { Trophy, Sparkles, TrendingUp } from 'lucide-react';

interface EnhancedBookGridProps {
  books: Book[];
  onBookClick?: (book: Book) => void;
  totalResults?: number;
  processingTime?: string;
}

const EnhancedBookGrid: React.FC<EnhancedBookGridProps> = ({ 
  books, 
  onBookClick, 
  totalResults, 
  processingTime 
}) => {
  if (books.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-3xl font-bold text-gray-900">Your Perfect Matches</h2>
          <Sparkles className="w-6 h-6 text-purple-500" />
        </div>
        
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span>Found {totalResults || books.length} perfect matches</span>
          </div>
          {processingTime && (
            <div>
              <span>Analyzed in {processingTime}</span>
            </div>
          )}
          <div>
            <span className="text-purple-600 font-medium">Ranked by AI similarity</span>
          </div>
        </div>
      </div>

      {/* Top 3 Highlights */}
      {books.length >= 3 && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-8 border border-purple-100">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">🏆 Your Top 3 Recommendations</h3>
            <p className="text-gray-600">These books scored highest for your preferences</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {books.slice(0, 3).map((book, index) => (
              <div key={book.id} className="relative">
                <EnhancedBookCard
                  book={book}
                  onClick={() => onBookClick?.(book)}
                  rank={index + 1}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Results */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {books.length > 3 ? 'More Great Matches' : 'Your Recommendations'}
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {books.slice(books.length > 3 ? 3 : 0).map((book, index) => (
            <EnhancedBookCard
              key={book.id}
              book={book}
              onClick={() => onBookClick?.(book)}
              rank={books.length > 3 ? index + 4 : index + 1}
            />
          ))}
        </div>
      </div>

      {/* CTA at bottom */}
      <div className="text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-8">
        <h3 className="text-2xl font-bold mb-2">Love these recommendations?</h3>
        <p className="text-purple-100 mb-4">
          Join 500,000+ readers getting personalized book suggestions daily
        </p>
        <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
          Get More Recommendations
        </button>
      </div>
    </div>
  );
};

export default EnhancedBookGrid;