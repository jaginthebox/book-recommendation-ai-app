import React, { useState } from 'react';
import { Star, Calendar, BookOpen, ExternalLink, Sparkles, Clock, Users, Award } from 'lucide-react';
import { Book } from '../../types';

interface EnhancedBookCardProps {
  book: Book;
  onClick?: () => void;
  rank?: number;
}

const EnhancedBookCard: React.FC<EnhancedBookCardProps> = ({ book, onClick, rank }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const categories = book.categories || [];

  const handleImageError = () => {
    setImageError(true);
  };

  const formatAuthors = (authors: string[]) => {
    if (!authors || !Array.isArray(authors) || authors.length === 0) {
      return 'Unknown Author';
    }
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return authors.join(' & ');
    return `${authors[0]} & ${authors.length - 1} others`;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'from-green-400 to-emerald-500';
    if (score >= 80) return 'from-blue-400 to-indigo-500';
    if (score >= 70) return 'from-yellow-400 to-orange-500';
    return 'from-gray-400 to-gray-500';
  };

  const matchScore = book.similarityScore ? Math.round(book.similarityScore * 100) : book.matchScore || 0;

  return (
    <div 
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 
                 border border-gray-100 hover:border-purple-200 cursor-pointer
                 transform hover:-translate-y-2 relative overflow-hidden"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Rank Badge */}
      {rank && rank <= 3 && (
        <div className="absolute top-4 left-4 z-10">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
            rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
            rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
            'bg-gradient-to-br from-amber-600 to-yellow-700'
          }`}>
            {rank}
          </div>
        </div>
      )}

      {/* Match Score */}
      {matchScore > 0 && (
        <div className="absolute top-4 right-4 z-10">
          <div className={`bg-gradient-to-r ${getMatchScoreColor(matchScore)} text-white px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg`}>
            <Sparkles className="w-3 h-3" />
            <span className="text-sm font-bold">{matchScore}%</span>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex space-x-4">
          {/* Book Cover */}
          <div className="flex-shrink-0 relative">
            <div className="w-24 h-36 bg-gray-100 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              {!imageError ? (
                <img
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                  <BookOpen className="w-10 h-10 text-indigo-400" />
                </div>
              )}
            </div>
            
            {/* Quick Preview on Hover */}
            {isHovered && (
              <div className="absolute inset-0 bg-black/80 rounded-xl flex items-center justify-center transition-opacity duration-200">
                <span className="text-white text-sm font-medium">Quick Preview</span>
              </div>
            )}
          </div>

          {/* Book Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 
                           transition-colors duration-200 line-clamp-2 leading-tight">
                {book.title}
              </h3>
            </div>

            <p className="text-base text-gray-600 mb-3 font-medium">
              by {formatAuthors(book.authors)}
            </p>

            {/* Enhanced Metrics */}
            <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500 mb-4">
              {book.publishedDate && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{book.publishedDate}</span>
                </div>
              )}
              
              {book.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{book.rating.toFixed(1)}</span>
                  {book.ratingCount && (
                    <span className="text-gray-400">({book.ratingCount.toLocaleString()})</span>
                  )}
                </div>
              )}

              {book.pageCount && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{Math.round(book.pageCount / 250)} hr read</span>
                </div>
              )}

              {book.ratingCount && book.ratingCount > 10000 && (
                <div className="flex items-center space-x-1 text-green-600">
                  <Award className="w-4 h-4" />
                  <span className="font-medium">Popular</span>
                </div>
              )}
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.slice(0, 3).map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs bg-gradient-to-r from-purple-100 to-indigo-100 
                             text-purple-700 rounded-full font-medium border border-purple-200"
                  >
                    {category}
                  </span>
                ))}
                {categories.length > 3 && (
                  <span className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-medium">
                    +{categories.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            <p className="text-sm text-gray-700 line-clamp-2 mb-4 leading-relaxed">
              {truncateText(book.description, 140)}
            </p>

            {/* AI Recommendation */}
            {book.recommendation && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-400 p-4 rounded-r-xl mb-4">
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-purple-900 mb-1">Why this matches you:</p>
                    <p className="text-sm text-purple-800 leading-relaxed">
                      {book.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full 
                           font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200
                           flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Read Now</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <button className="text-sm text-gray-600 hover:text-purple-600 font-medium 
                             transition-colors duration-200 flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>Reviews</span>
            </button>
            
            <a
              href={book.googleBooksUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 
                       transition-colors duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <span>More Info</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
    </div>
  );
};

export default EnhancedBookCard;