import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  Calendar, 
  BookOpen, 
  ExternalLink, 
  Heart, 
  Plus, 
  User,
  DollarSign,
  ShoppingCart,
  Download,
  Eye,
  Share2
} from 'lucide-react';
import { Book } from '../../types';
import { useLibrary } from '../../hooks/useLibrary';
import { useAuth } from '../../hooks/useAuth';

interface BookDetailsModalProps {
  book: Book;
  onClose: () => void;
}

interface BookPricing {
  retailPrice?: {
    amount: number;
    currencyCode: string;
  };
  listPrice?: {
    amount: number;
    currencyCode: string;
  };
  buyLink?: string;
  isEbook?: boolean;
  sampleUrl?: string;
}

const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ book, onClose }) => {
  const { user } = useAuth();
  const { saveBook, isBookSaved } = useLibrary();
  const [imageError, setImageError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pricing, setPricing] = useState<BookPricing | null>(null);
  const [isLoadingPricing, setIsLoadingPricing] = useState(true);

  // Check if book is saved when component mounts
  useEffect(() => {
    if (user) {
      isBookSaved(book.id).then(setIsSaved);
    }
  }, [user, book.id, isBookSaved]);

  // Simulate fetching pricing data
  useEffect(() => {
    const fetchPricing = async () => {
      setIsLoadingPricing(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockPricing: BookPricing = {
        retailPrice: {
          amount: Math.floor(Math.random() * 15) + 8, // $8-23
          currencyCode: 'USD'
        },
        listPrice: {
          amount: Math.floor(Math.random() * 20) + 12, // $12-32
          currencyCode: 'USD'
        },
        buyLink: `https://books.google.com/books?id=${book.id}&dq=${encodeURIComponent(book.title)}`,
        isEbook: Math.random() > 0.3,
        sampleUrl: `https://books.google.com/books?id=${book.id}&printsec=frontcover`
      };
      
      setPricing(mockPricing);
      setIsLoadingPricing(false);
    };

    fetchPricing();
  }, [book.id, book.title]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleSaveBook = async () => {
    if (!user || isSaving) return;

    setIsSaving(true);
    try {
      if (!isSaved) {
        const success = await saveBook(book);
        if (success) {
          setIsSaved(true);
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatAuthors = (authors: string[]) => {
    if (!authors || !Array.isArray(authors) || authors.length === 0) {
      return 'Unknown Author';
    }
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return authors.join(' & ');
    return `${authors[0]} & ${authors.length - 1} others`;
  };

  const formatPrice = (price: { amount: number; currencyCode: string }) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currencyCode
    }).format(price.amount);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Compact Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Book Details</h1>
              <p className="text-indigo-100 text-sm">Complete information and pricing</p>
            </div>
          </div>
        </div>

        {/* Horizontal Content Layout */}
        <div className="p-6">
          <div className="flex space-x-6">
            {/* Book Cover - Left Side */}
            <div className="flex-shrink-0">
              <div className="w-32 h-44 bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                {!imageError ? (
                  <img
                    src={book.coverImage}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                    <BookOpen className="w-12 h-12 text-indigo-400" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Main Content - Center */}
            <div className="flex-1 min-w-0">
              {/* Title and Basic Info */}
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">{book.title}</h2>
                <p className="text-lg text-gray-700 mb-3">by {formatAuthors(book.authors)}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                  {book.publishedDate && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{book.publishedDate}</span>
                    </div>
                  )}
                  
                  {book.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{book.rating.toFixed(1)}</span>
                      {book.ratingCount && (
                        <span className="text-gray-500">({book.ratingCount.toLocaleString()})</span>
                      )}
                    </div>
                  )}

                  {book.pageCount && (
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{book.pageCount} pages</span>
                    </div>
                  )}
                </div>

                {/* Categories */}
                {book.categories && book.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {book.categories.slice(0, 3).map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                  {book.description || 'No description available for this book.'}
                </p>
              </div>

              {/* AI Recommendation */}
              {book.recommendation && (
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200 mb-4">
                  <h4 className="text-sm font-semibold text-indigo-900 mb-2 flex items-center">
                    <Star className="w-4 h-4 mr-1 text-indigo-600" />
                    AI Recommendation
                  </h4>
                  <p className="text-sm text-indigo-800 leading-relaxed">
                    {book.recommendation}
                  </p>
                </div>
              )}
            </div>

            {/* Pricing & Actions - Right Side */}
            <div className="flex-shrink-0 w-64">
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Pricing
                </h3>
                
                {isLoadingPricing ? (
                  <div className="space-y-2">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ) : pricing ? (
                  <div className="space-y-3">
                    {pricing.retailPrice && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Digital Edition</span>
                          {pricing.isEbook && (
                            <div className="flex items-center space-x-1 text-xs text-green-600">
                              <Download className="w-3 h-3" />
                              <span>eBook</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          {pricing.listPrice && pricing.listPrice.amount > pricing.retailPrice.amount && (
                            <span className="text-sm text-gray-500 line-through block">
                              {formatPrice(pricing.listPrice)}
                            </span>
                          )}
                          <div className="text-xl font-bold text-green-600">
                            {formatPrice(pricing.retailPrice)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Buy Button */}
                    {pricing.buyLink && (
                      <a
                        href={pricing.buyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-green-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Buy Now</span>
                      </a>
                    )}

                    {/* Sample Button */}
                    {pricing.sampleUrl && (
                      <a
                        href={pricing.sampleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gray-200 text-gray-700 py-2 px-3 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Pricing unavailable</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {user && (
                  <button
                    onClick={handleSaveBook}
                    disabled={isSaving || isSaved}
                    className={`w-full py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm ${
                      isSaved
                        ? 'bg-red-100 text-red-700 cursor-default'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isSaved ? (
                      <>
                        <Heart className="w-4 h-4 fill-current" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Save to Library</span>
                      </>
                    )}
                  </button>
                )}

                <a
                  href={book.googleBooksUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Google Books</span>
                </a>

                <button className="w-full bg-gray-200 text-gray-700 py-2 px-3 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2 text-sm">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 rounded-lg p-3 mt-4 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-1 text-sm">💡 Tip</h4>
                <p className="text-xs text-blue-800">
                  Save books to get better AI recommendations!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal;