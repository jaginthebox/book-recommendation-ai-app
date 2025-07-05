import React, { useState } from 'react';
import { Star, Calendar, BookOpen, ExternalLink, Sparkles, Heart, Plus, Bookmark } from 'lucide-react';
import { Book } from '../../types';
import { useLibrary } from '../../hooks/useLibrary';
import { useAuth } from '../../hooks/useAuth';
import BookDetailsModal from './BookDetailsModal';

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const { user } = useAuth();
  const { saveBook, addToWishlist, isBookSaved, isInWishlist } = useLibrary();
  const [imageError, setImageError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isInWishlistState, setIsInWishlistState] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Safely handle categories that might be undefined or null
  const categories = book.categories || [];

  // Check if book is saved when component mounts
  React.useEffect(() => {
    if (user) {
      Promise.all([
        isBookSaved(book.id),
        isInWishlist(book.id)
      ]).then(([saved, wishlist]) => {
        setIsSaved(saved);
        setIsInWishlistState(wishlist);
      });
    }
  }, [user, book.id, isBookSaved, isInWishlist]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleSaveBook = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || isSaving) return;

    setIsSaving(true);
    try {
      if (isSaved) {
        // TODO: Implement remove from library
        console.log('Remove from library not implemented yet');
      } else {
        const success = await saveBook(book);
        if (success) {
          setIsSaved(true);
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || isAddingToWishlist) return;

    setIsAddingToWishlist(true);
    try {
      if (!isInWishlistState) {
        const success = await addToWishlist(book, 3); // Default medium priority
        if (success) {
          setIsInWishlistState(true);
        }
      }
    } finally {
      setIsAddingToWishlist(false);
    }
  };
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetailsModal(true);
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

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 
                 border border-gray-100 hover:border-gray-200 cursor-pointer group
                 transform hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex space-x-4">
          {/* Book Cover */}
          <div className="flex-shrink-0">
            <div className="w-20 h-28 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
              {!imageError ? (
                <img
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                  <BookOpen className="w-8 h-8 text-indigo-400" />
                </div>
              )}
            </div>
          </div>

          {/* Book Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 
                           transition-colors duration-200 line-clamp-2">
                {book.title}
              </h3>
              <div className="flex items-center space-x-1 ml-2">
                {book.similarityScore && (
                  <div className="flex items-center space-x-1 bg-indigo-50 px-2 py-1 rounded-full">
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    <span className="text-xs font-medium text-indigo-700">
                      {Math.round(book.similarityScore * 100)}%
                    </span>
                  </div>
                )}
                {user && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={handleSaveBook}
                      disabled={isSaving}
                      className={`p-2 rounded-full transition-colors ${
                        isSaved
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600'
                      } disabled:opacity-50`}
                      title={isSaved ? 'In library' : 'Add to library'}
                    >
                      {isSaving ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : isSaved ? (
                        <BookOpen className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                    
                    {!isSaved && (
                      <button
                        onClick={handleAddToWishlist}
                        disabled={isAddingToWishlist}
                        className={`p-2 rounded-full transition-colors ${
                          isInWishlistState
                            ? 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600'
                        } disabled:opacity-50`}
                        title={isInWishlistState ? 'In wishlist' : 'Add to wishlist'}
                      >
                        {isAddingToWishlist ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : isInWishlistState ? (
                          <Heart className="w-4 h-4 fill-current" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                )}
                </div>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              by {formatAuthors(book.authors)}
            </p>

            <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
              {book.publishedDate && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{book.publishedDate}</span>
                </div>
              )}
              
              {book.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{book.rating.toFixed(1)}</span>
                  {book.ratingCount && (
                    <span className="text-gray-400">({book.ratingCount.toLocaleString()})</span>
                  )}
                </div>
              )}

              {book.pageCount && (
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-3 h-3" />
                  <span>{book.pageCount} pages</span>
                </div>
              )}
            </div>

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {categories.slice(0, 3).map((category, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}

            <p className="text-sm text-gray-700 line-clamp-2 mb-3">
              {truncateText(book.description, 120)}
            </p>

            {book.recommendation && (
              <div className="bg-indigo-50 border-l-4 border-indigo-400 p-3 rounded-r-lg">
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-indigo-800 font-medium">
                    {book.recommendation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleViewDetails}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium 
                         transition-colors duration-200"
            >
              View Details
            </button>
            {user && !isSaved && !isInWishlistState && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveBook}
                  disabled={isSaving}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  <Plus className="w-3 h-3" />
                  <span>Library</span>
                </button>
                <button
                  onClick={handleAddToWishlist}
                  disabled={isAddingToWishlist}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-pink-600 font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  <Bookmark className="w-3 h-3" />
                  <span>Wishlist</span>
                </button>
              </div>
            )}
          </div>
          
          <a
            href={book.googleBooksUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 
                     transition-colors duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <span>Google Books</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
      
      {/* Book Details Modal */}
      {showDetailsModal && (
        <BookDetailsModal
          book={book}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
};

export default BookCard;