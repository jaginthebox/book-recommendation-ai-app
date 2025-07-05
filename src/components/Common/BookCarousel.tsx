import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, TrendingUp, Award, Clock, Loader2 } from 'lucide-react';
import { useBookSearch } from '../../hooks/useBookSearch';
import { Book } from '../../types';

interface BookCarouselProps {
  onGenreClick?: (genre: string) => void;
}

// Cache for trending books to avoid repeated API calls
let trendingBooksCache: {
  books: Book[];
  timestamp: number;
  expiryTime: number;
} | null = null;

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

const BookCarousel: React.FC<BookCarouselProps> = ({ onGenreClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const { searchBooks } = useBookSearch();

  const booksPerView = 6;
  const maxIndex = Math.max(0, trendingBooks.length - booksPerView);

  // Load trending books on component mount
  useEffect(() => {
    const loadTrendingBooks = async () => {
      // Check if we have valid cached data
      const now = Date.now();
      if (trendingBooksCache && now < trendingBooksCache.expiryTime) {
        setTrendingBooks(trendingBooksCache.books);
        return;
      }

      setIsLoadingTrending(true);
      try {
        // Search for trending fiction books
        const response = await searchBooks({ query: "Trending Books from Fiction" });
        
        if (response && response.results) {
          const topBooks = response.results.slice(0, 10);
          setTrendingBooks(topBooks);
          
          // Cache the results
          trendingBooksCache = {
            books: topBooks,
            timestamp: now,
            expiryTime: now + CACHE_DURATION
          };
        }
      } catch (error) {
        console.error('Error loading trending books:', error);
        // Fallback to static books if API fails
        setTrendingBooks(getFallbackBooks());
      } finally {
        setIsLoadingTrending(false);
      }
    };

    loadTrendingBooks();
  }, [searchBooks]);

  // Fallback books in case API fails
  const getFallbackBooks = (): Book[] => [
    {
      id: 'fallback-1',
      title: 'The Seven Husbands of Evelyn Hugo',
      authors: ['Taylor Jenkins Reid'],
      description: 'A reclusive Hollywood icon finally tells her story to a young journalist.',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop',
      publishedDate: '2017',
      categories: ['Contemporary Fiction'],
      rating: 4.8,
      ratingCount: 89000,
      googleBooksUrl: 'https://books.google.com/books?id=fallback1'
    },
    {
      id: 'fallback-2',
      title: 'Project Hail Mary',
      authors: ['Andy Weir'],
      description: 'A lone astronaut must save humanity in this thrilling science fiction adventure.',
      coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&h=300&fit=crop',
      publishedDate: '2021',
      categories: ['Science Fiction'],
      rating: 4.7,
      ratingCount: 67000,
      googleBooksUrl: 'https://books.google.com/books?id=fallback2'
    },
    {
      id: 'fallback-3',
      title: 'The Midnight Library',
      authors: ['Matt Haig'],
      description: 'Between life and death there is a library, and within that library, the shelves go on forever.',
      coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop',
      publishedDate: '2020',
      categories: ['Literary Fiction'],
      rating: 4.6,
      ratingCount: 45000,
      googleBooksUrl: 'https://books.google.com/books?id=fallback3'
    },
    {
      id: 'fallback-4',
      title: 'Klara and the Sun',
      authors: ['Kazuo Ishiguro'],
      description: 'From her place in the store, Klara watches the behavior of those who come in to browse.',
      coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop',
      publishedDate: '2021',
      categories: ['Literary Fiction'],
      rating: 4.5,
      ratingCount: 38000,
      googleBooksUrl: 'https://books.google.com/books?id=fallback4'
    },
    {
      id: 'fallback-5',
      title: 'The Invisible Life of Addie LaRue',
      authors: ['V.E. Schwab'],
      description: 'A life no one will remember. A story you will never forget.',
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop',
      publishedDate: '2020',
      categories: ['Fantasy Romance'],
      rating: 4.4,
      ratingCount: 52000,
      googleBooksUrl: 'https://books.google.com/books?id=fallback5'
    },
    {
      id: 'fallback-6',
      title: 'Educated',
      authors: ['Tara Westover'],
      description: 'A memoir about a young girl who, kept out of school, leaves her survivalist family.',
      coverImage: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=200&h=300&fit=crop',
      publishedDate: '2018',
      categories: ['Memoir'],
      rating: 4.9,
      ratingCount: 78000,
      googleBooksUrl: 'https://books.google.com/books?id=fallback6'
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying || isLoadingTrending || trendingBooks.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex, isLoadingTrending, trendingBooks.length]);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleGenreClick = (category: string) => {
    if (onGenreClick) {
      const searchQuery = `popular ${category.toLowerCase()} books`;
      onGenreClick(searchQuery);
    }
  };

  const getBadgeIcon = (index: number) => {
    const badges = ['bestseller', 'trending', 'award', 'new'];
    const badge = badges[index % badges.length];
    
    switch (badge) {
      case 'bestseller': return <TrendingUp className="w-3 h-3" />;
      case 'trending': return <TrendingUp className="w-3 h-3" />;
      case 'award': return <Award className="w-3 h-3" />;
      case 'new': return <Clock className="w-3 h-3" />;
      default: return null;
    }
  };

  const getBadgeColor = (index: number) => {
    const badges = ['bestseller', 'trending', 'award', 'new'];
    const badge = badges[index % badges.length];
    
    switch (badge) {
      case 'bestseller': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'trending': return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white';
      case 'award': return 'bg-gradient-to-r from-purple-400 to-pink-500 text-white';
      case 'new': return 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const getBadgeLabel = (index: number) => {
    const badges = ['Bestseller', 'Trending', 'Award Winner', 'New Release'];
    return badges[index % badges.length];
  };

  if (isLoadingTrending) {
    return (
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Trending Books</h3>
            <p className="text-slate-600">Loading the latest trending fiction...</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-12 border border-indigo-100">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
            <p className="text-indigo-700 font-medium">Discovering trending books...</p>
            <p className="text-indigo-600 text-sm mt-1">Finding the most popular fiction right now</p>
          </div>
        </div>
      </div>
    );
  }

  if (trendingBooks.length === 0) {
    return (
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Trending Books</h3>
            <p className="text-slate-600">Unable to load trending books</p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <p className="text-gray-600 text-center">
            Sorry, we couldn't load the trending books right now. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
            Trending Books
            {trendingBooksCache && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Live
              </span>
            )}
          </h3>
          <p className="text-slate-600">
            {trendingBooks.length} trending fiction books • Updated every 30 minutes
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevSlide}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors shadow-sm hover:shadow-md"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={nextSlide}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors shadow-sm hover:shadow-md"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden rounded-2xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / booksPerView)}%)` }}
        >
          {trendingBooks.map((book, index) => (
            <div key={book.id} className="flex-shrink-0 w-1/6 px-3">
              <div className="group cursor-pointer">
                <div className="relative mb-4">
                  <div className="aspect-[2/3] bg-slate-100 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop&auto=format&q=80`;
                      }}
                    />
                  </div>
                  
                  {/* Dynamic Badge */}
                  <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getBadgeColor(index)} shadow-lg`}>
                    {getBadgeIcon(index)}
                    <span>{getBadgeLabel(index)}</span>
                  </div>

                  {/* Rating */}
                  {book.rating && (
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1 backdrop-blur-sm">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{book.rating}</span>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {book.title}
                  </h4>
                  <p className="text-xs text-slate-600 mb-2 truncate">
                    {book.authors.join(', ')}
                  </p>
                  {book.categories && book.categories.length > 0 && (
                    <button
                      onClick={() => handleGenreClick(book.categories[0])}
                      className="text-xs text-indigo-600 font-medium truncate hover:text-indigo-800 hover:underline transition-colors cursor-pointer bg-indigo-50 px-2 py-1 rounded-full"
                      title={`Search for ${book.categories[0]} books`}
                    >
                      {book.categories[0]}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {maxIndex > 0 && (
        <div className="flex justify-center space-x-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookCarousel;