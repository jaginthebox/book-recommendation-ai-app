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
  Globe,
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

  // Simulate fetching pricing data (in real app, this would come from Google Books API)
  useEffect(() => {
    const fetchPricing = async () => {
      setIsLoadingPricing(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock pricing data
      const mockPricing: BookPricing = {
        retailPrice: {
          amount: Math.floor(Math.random() * 20) + 5, // $5-25
          currencyCode: 'USD'
        },
        listPrice: {
          amount: Math.floor(Math.random() * 25) + 8, // $8-33
          currencyCode: 'USD'
        },
        buyLink: `https://books.google.com/books?id=${book.id}&dq=${encodeURIComponent(book.title)}&hl=en&sa=X&ved=0ahUKEwi`,
        isEbook: Math.random() > 0.3, // 70% chance of ebook availability
        sampleUrl: `https://books.google.com/books?id=${book.id}&printsec=frontcover&dq=${encodeURIComponent(book.title)}&hl=en&sa=X&ved=0ahUKEwi`
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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-start space-x-6">
            {/* Large Book Cover */}
            <div className="flex-shrink-0">
              <div className="w-32 h-48 bg-white bg-opacity-20 rounded-2xl overflow-hidden shadow-2xl">
                {!imageError ? (
                  <img
                    src={book.coverImage}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                    <BookOpen className="w-16 h-16 text-indigo-400" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Book Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold mb-3 leading-tight">{book.title}</h1>
              <p className="text-xl text-purple-100 mb-4">by {formatAuthors(book.authors)}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-purple-100 mb-4">
                {book.publishedDate && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Published {book.publishedDate}</span>
                  </div>
                )}
                
                {book.rating && (
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{book.rating.toFixed(1)}</span>
                    {book.ratingCount && (
                      <span className="text-purple-200">({book.ratingCount.toLocaleString()} reviews)</span>
                    )}
                  </div>
                )}

                {book.pageCount && (
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{book.pageCount} pages</span>
                  </div>
                )}
              </div>

              {/* Categories */}
              {book.categories && book.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {book.categories.slice(0, 4).map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-white bg-opacity-20 text-white rounded-full backdrop-blur-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">About This Book</h3>
                <p className="text-gray-700 leading-relaxed">
                  {book.description || 'No description available for this book.'}
                </p>
              </div>

              {/* AI Recommendation */}
              {book.recommendation && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                  <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center">
                    <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center mr-2">
                      <Star className="w-3 h-3 text-white fill-current" />
                    </div>
                    AI Recommendation
                  </h3>
                  <p className="text-indigo-800 leading-relaxed">
                    {book.recommendation}
                  </p>
                </div>
              )}

              {/* Book Details */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Book Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900">Authors</span>
                    </div>
                    <p className="text-gray-700">{formatAuthors(book.authors)}</p>
                  </div>
                  
                  {book.isbn && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <BookOpen className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">ISBN</span>
                      </div>
                      <p className="text-gray-700 font-mono text-sm">{book.isbn}</p>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900">Published</span>
                    </div>
                    <p className="text-gray-700">{book.publishedDate || 'Unknown'}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Globe className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900">Language</span>
                    </div>
                    <p className="text-gray-700">English</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Pricing & Actions */}
            <div className="space-y-6">
              {/* Pricing Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Pricing & Availability
                </h3>
                
                {isLoadingPricing ? (
                  <div className="space-y-3">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ) : pricing ? (
                  <div className="space-y-4">
                    {/* Pricing */}
                    <div>
                      {pricing.retailPrice && (
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600">Digital Edition</span>
                          <div className="text-right">
                            {pricing.listPrice && pricing.listPrice.amount > pricing.retailPrice.amount && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(pricing.listPrice)}
                              </span>
                            )}
                            <div className="text-2xl font-bold text-green-600">
                              {formatPrice(pricing.retailPrice)}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {pricing.isEbook && (
                        <div className="flex items-center space-x-2 text-sm text-green-600 mb-3">
                          <Download className="w-4 h-4" />
                          <span>Available as eBook</span>
                        </div>
                      )}
                    </div>

                    {/* Buy Button */}
                    {pricing.buyLink && (
                      <a
                        href={pricing.buyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
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
                        className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Preview Sample</span>
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600">Pricing information not available</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {user && (
                  <button
                    onClick={handleSaveBook}
                    disabled={isSaving || isSaved}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${
                      isSaved
                        ? 'bg-red-100 text-red-700 cursor-default'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                    }`}
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isSaved ? (
                      <>
                        <Heart className="w-4 h-4 fill-current" />
                        <span>Saved to Library</span>
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
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View on Google Books</span>
                </a>

                <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>Share Book</span>
                </button>
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Did you know?</h4>
                <p className="text-sm text-blue-800">
                  Books in your library get better recommendations over time as our AI learns your preferences!
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