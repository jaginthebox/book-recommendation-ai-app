import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  Calendar, 
  BookOpen, 
  ExternalLink, 
  Heart, 
  Plus, 
  DollarSign,
  ShoppingCart,
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
      {/* Much smaller, compact modal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[70vh] overflow-hidden">
        {/* Minimal header */}
        <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 text-white">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <div>
              <h1 className="text-lg font-bold">Book Details</h1>
              <p className="text-indigo-100 text-xs">Complete information and pricing</p>
            </div>
          </div>
        </div>

        {/* Compact horizontal content */}
        <div className="p-4">
          <div className="flex space-x-4">
            {/* Small book cover */}
            <div className="flex-shrink-0">
              <div className="w-20 h-28 bg-gray-100 rounded-lg overflow-hidden shadow-md">
                {!imageError ? (
                  <img
                    src={book.coverImage}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                    <BookOpen className="w-6 h-6 text-indigo-400" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Main content - condensed */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{book.title}</h2>
              <p className="text-sm text-gray-600 mb-2">by {formatAuthors(book.authors)}</p>
              
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
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
                  </div>
                )}

                {book.pageCount && (
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-3 h-3" />
                    <span>{book.pageCount}p</span>
                  </div>
                )}
              </div>

              {/* Categories - compact */}
              {book.categories && book.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {book.categories.slice(0, 2).map((category, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}

              {/* Truncated description */}
              <p className="text-sm text-gray-700 line-clamp-3 mb-3">
                {book.description || 'No description available for this book.'}
              </p>
            </div>

            {/* Compact pricing sidebar */}
            <div className="flex-shrink-0 w-32">
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="flex items-center space-x-1 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Price</h3>
                </div>
                
                {isLoadingPricing ? (
                  <div className="animate-pulse">
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : pricing?.retailPrice ? (
                  <div className="text-center">
                    {pricing.listPrice && pricing.listPrice.amount > pricing.retailPrice.amount && (
                      <span className="text-xs text-gray-500 line-through block">
                        {formatPrice(pricing.listPrice)}
                      </span>
                    )}
                    <div className="text-lg font-bold text-green-600">
                      {formatPrice(pricing.retailPrice)}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-600">Price unavailable</p>
                )}
              </div>

              {/* Compact action buttons */}
              <div className="space-y-2">
                {pricing?.buyLink && (
                  <a
                    href={pricing.buyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-600 text-white py-2 px-2 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    <span>Buy</span>
                  </a>
                )}

                {user && (
                  <button
                    onClick={handleSaveBook}
                    disabled={isSaving || isSaved}
                    className={`w-full py-2 px-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1 ${
                      isSaved
                        ? 'bg-red-100 text-red-700 cursor-default'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {isSaving ? (
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isSaved ? (
                      <>
                        <Heart className="w-3 h-3 fill-current" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                )}

                <a
                  href={book.googleBooksUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 text-white py-2 px-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Google</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal;