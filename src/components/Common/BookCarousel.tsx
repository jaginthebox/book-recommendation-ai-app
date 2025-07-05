import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, TrendingUp, Award, Clock } from 'lucide-react';

interface CarouselBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  category: string;
  badge?: 'bestseller' | 'trending' | 'award' | 'new';
}

const featuredBooks: CarouselBook[] = [
  {
    id: '1',
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop',
    rating: 4.8,
    category: 'Contemporary Fiction',
    badge: 'bestseller'
  },
  {
    id: '2',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&h=300&fit=crop',
    rating: 4.7,
    category: 'Science Fiction',
    badge: 'trending'
  },
  {
    id: '3',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop',
    rating: 4.6,
    category: 'Literary Fiction',
    badge: 'award'
  },
  {
    id: '4',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop',
    rating: 4.5,
    category: 'Literary Fiction',
    badge: 'new'
  },
  {
    id: '5',
    title: 'The Invisible Life of Addie LaRue',
    author: 'V.E. Schwab',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop',
    rating: 4.4,
    category: 'Fantasy Romance',
    badge: 'bestseller'
  },
  {
    id: '6',
    title: 'Educated',
    author: 'Tara Westover',
    cover: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=200&h=300&fit=crop',
    rating: 4.9,
    category: 'Memoir',
    badge: 'award'
  },
  {
    id: '7',
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop',
    rating: 4.8,
    category: 'Historical Fiction',
    badge: 'trending'
  },
  {
    id: '8',
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=200&h=300&fit=crop',
    rating: 4.7,
    category: 'Self-Help',
    badge: 'bestseller'
  }
];

const BookCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const booksPerView = 4;
  const maxIndex = Math.max(0, featuredBooks.length - booksPerView);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'bestseller': return <TrendingUp className="w-3 h-3" />;
      case 'trending': return <TrendingUp className="w-3 h-3" />;
      case 'award': return <Award className="w-3 h-3" />;
      case 'new': return <Clock className="w-3 h-3" />;
      default: return null;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'bestseller': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'trending': return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white';
      case 'award': return 'bg-gradient-to-r from-purple-400 to-pink-500 text-white';
      case 'new': return 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div 
      className="relative bg-white rounded-lg shadow-sm p-2 border border-gray-100"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-0.5">Trending Books</h3>
          <p className="text-xs text-gray-600">Discover what everyone's reading</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevSlide}
            className="p-0.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-2.5 h-2.5 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="p-0.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-2.5 h-2.5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / booksPerView)}%)` }}
        >
          {featuredBooks.map((book) => (
            <div key={book.id} className="flex-shrink-0 w-1/4 px-0.5">
              <div className="group cursor-pointer">
                <div className="relative mb-1">
                  <div className="aspect-[2/3] bg-gray-100 rounded-sm overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Badge */}
                  {book.badge && (
                    <div className={`absolute top-0.5 left-0.5 px-0.5 py-0.5 rounded-full text-xs font-medium flex items-center space-x-0.5 ${getBadgeColor(book.badge)}`}>
                      {getBadgeIcon(book.badge)}
                      <span className="capitalize text-xs">{book.badge}</span>
                    </div>
                  )}

                  {/* Rating */}
                  <div className="absolute bottom-0.5 right-0.5 bg-black bg-opacity-70 text-white px-0.5 py-0.5 rounded-full text-xs flex items-center space-x-0.5">
                    <Star className="w-2 h-2 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{book.rating}</span>
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 text-xs mb-0.5 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {book.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-0.5 truncate">{book.author}</p>
                  <p className="text-xs text-indigo-600 font-medium truncate">{book.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-0.5 mt-1.5">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1 h-1 rounded-full transition-colors ${
              index === currentIndex ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BookCarousel;