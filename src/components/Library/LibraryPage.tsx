import React, { useState, useEffect } from 'react';
import { 
  Book, 
  Heart, 
  BookOpen, 
  Star, 
  Calendar, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  StickyNote,
  TrendingUp,
  Award,
  Target,
  BarChart3,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle,
  Circle,
  PlayCircle,
  Bookmark,
  Flame,
  Trophy,
  Calendar as CalendarIcon,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLibrary } from '../../hooks/useLibrary';
import { SavedBook } from '../../lib/supabase';
import NotesModal from './NotesModal';
import BookDetailsModal from '../BookResults/BookDetailsModal';
import LoadingSpinner from '../Common/LoadingSpinner';
import WishlistPage from './WishlistPage';
import ReadingGoalModal from './ReadingGoalModal';

const LibraryPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    savedBooks, 
    wishlistItems,
    libraryStats, 
    isLoading, 
    error,
    loadLibrary,
    loadWishlist,
    removeBook,
    updateBookStatus,
    saveNotesAndRating,
    setReadingGoal
  } = useLibrary();
  
  const [activeTab, setActiveTab] = useState<'all' | 'want_to_read' | 'currently_reading' | 'read' | 'notes' | 'wishlist'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'rated' | 'priority'>('all');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<SavedBook | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBookForDetails, setSelectedBookForDetails] = useState<SavedBook | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Filter books based on active tab and filters
  const filteredBooks = savedBooks.filter(book => {
    // Tab filtering
    if (activeTab === 'want_to_read' && book.status !== 'want_to_read') return false;
    if (activeTab === 'currently_reading' && book.status !== 'currently_reading') return false;
    if (activeTab === 'read' && !book.is_read) return false;
    if (activeTab === 'notes' && !book.notes) return false;

    // Search filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = book.book_data.title.toLowerCase().includes(query);
      const matchesAuthor = book.book_data.authors.some(author => 
        author.toLowerCase().includes(query)
      );
      const matchesNotes = book.notes?.toLowerCase().includes(query);
      
      if (!matchesTitle && !matchesAuthor && !matchesNotes) return false;
    }

    // Additional filtering
    if (filterBy === 'recent') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(book.saved_at) > weekAgo;
    }
    if (filterBy === 'rated' && !book.user_rating) return false;
    if (filterBy === 'priority' && book.priority > 2) return false;

    return true;
  });

  const handleRemoveBook = async (bookId: string) => {
    if (window.confirm('Are you sure you want to remove this book from your library?')) {
      await removeBook(bookId);
    }
  };

  const handleStatusChange = async (bookId: string, newStatus: 'want_to_read' | 'currently_reading' | 'read') => {
    await updateBookStatus(bookId, newStatus);
  };

  const openNotesModal = (book: SavedBook) => {
    setSelectedBook(book);
    setShowNotesModal(true);
  };

  const openDetailsModal = (book: SavedBook) => {
    setSelectedBookForDetails(book);
    setShowDetailsModal(true);
  };

  const handleSaveNotes = async (bookId: string, notes: string, rating?: number) => {
    await saveNotesAndRating(bookId, notes, rating);
    setShowNotesModal(false);
  };

  const handleSetGoal = async (targetBooks: number, targetPages?: number) => {
    const currentYear = new Date().getFullYear();
    await setReadingGoal(currentYear, targetBooks, targetPages);
    setShowGoalModal(false);
  };
  const handleRefresh = () => {
    if (activeTab === 'wishlist') {
      loadWishlist({
        search: searchQuery || undefined
      });
    } else {
      loadLibrary({
        search: searchQuery || undefined,
        hasNotes: activeTab === 'notes' ? true : undefined,
        status: activeTab === 'all' ? undefined : activeTab as any,
        isRead: activeTab === 'read' ? true : undefined
      });
    }
  };

  // Load library with filters when they change
  useEffect(() => {
    if (user) {
      if (activeTab === 'wishlist') {
        loadWishlist({
          search: searchQuery || undefined
        });
      } else {
        loadLibrary({
          search: searchQuery || undefined,
          hasNotes: activeTab === 'notes' ? true : undefined,
          status: activeTab === 'all' ? undefined : activeTab as any,
          isRead: activeTab === 'read' ? true : undefined
        });
      }
    }
  }, [user, searchQuery, activeTab, loadLibrary, loadWishlist]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'want_to_read': return Circle;
      case 'currently_reading': return PlayCircle;
      case 'read': return CheckCircle;
      default: return Circle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'want_to_read': return 'text-gray-500';
      case 'currently_reading': return 'text-blue-500';
      case 'read': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-100 text-red-700';
      case 2: return 'bg-orange-100 text-orange-700';
      case 3: return 'bg-yellow-100 text-yellow-700';
      case 4: return 'bg-blue-100 text-blue-700';
      case 5: return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'Urgent';
      case 2: return 'High';
      case 3: return 'Medium';
      case 4: return 'Low';
      case 5: return 'Someday';
      default: return 'Medium';
    }
  };
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to access your library</h2>
          <p className="text-gray-600 mb-6">Create an account to save books, track your reading progress, and get personalized recommendations.</p>
          <button 
            onClick={() => window.location.hash = ''}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  // Show wishlist page if wishlist tab is active
  if (activeTab === 'wishlist') {
    return <WishlistPage />;
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">My Library</h1>
                <p className="text-xl text-white text-opacity-90">
                  Your personal collection of {libraryStats.totalBooks} books
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {libraryStats.readingGoal && (
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                  <div className="text-2xl font-bold">{libraryStats.readingGoal.current_books}/{libraryStats.readingGoal.target_books}</div>
                  <div className="text-xs text-white text-opacity-80">2024 Goal</div>
                </div>
              )}
              <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-3xl font-bold text-gray-900">{libraryStats.totalBooks}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                <PlayCircle className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reading</p>
                <p className="text-3xl font-bold text-gray-900">{libraryStats.currentlyReading}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Books Read</p>
                <p className="text-3xl font-bold text-gray-900">{libraryStats.readBooks}</p>
                <p className="text-xs text-green-600 font-medium">
                  {libraryStats.readingProgress}% complete
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Bookmark className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Wishlist</p>
                <p className="text-3xl font-bold text-gray-900">{libraryStats.wishlistCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <Star className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-3xl font-bold text-gray-900">
                <div className="text-xs text-white text-opacity-80">2025 Goal</div>
                </p>
                {libraryStats.averageRating > 0 && (
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.round(libraryStats.averageRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reading Goal and Streak */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
                2025 Reading Goal
              </h3>
              <button
                onClick={() => setShowGoalModal(true)}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                {libraryStats.readingGoal ? 'Edit' : 'Set Goal'}
              </button>
            </div>
            {libraryStats.readingGoal ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {libraryStats.readingGoal.current_books} / {libraryStats.readingGoal.target_books}
                  </span>
                  <span className="text-sm text-gray-600">books</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(100, (libraryStats.readingGoal.current_books / libraryStats.readingGoal.target_books) * 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {Math.round((libraryStats.readingGoal.current_books / libraryStats.readingGoal.target_books) * 100)}% complete
                </p>
              </div>
            ) : (
              <p className="text-gray-600">Set a reading goal to track your progress!</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
              2025 Reading Goal
            </h3>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{libraryStats.readingStreak}</div>
                <div className="text-sm text-gray-600">days</div>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-sm ${
                        i < libraryStats.readingStreak 
                          ? 'bg-orange-400' 
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-2">Last 7 days</p>
              </div>
            </div>
          </div>
        </div>
        {/* Top Genres */}
        {libraryStats.topGenres.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
              Your Top Genres
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {libraryStats.topGenres.map((genre, index) => (
                <div key={genre.genre} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{genre.genre}</p>
                  <p className="text-xs text-gray-600">{genre.count} books</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8">
          <div className="p-6">
            {/* Tab Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-4 sm:mb-0">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Books ({libraryStats.totalBooks})
                </button>
                <button
                  onClick={() => setActiveTab('reading')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'reading'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Currently Reading ({libraryStats.totalBooks - libraryStats.readBooks})
                </button>
                <button
                  onClick={() => setActiveTab('read')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'read'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Read ({libraryStats.readBooks})
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'notes'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  With Notes ({libraryStats.booksWithNotes})
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your library..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as any)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white min-w-[160px]"
                >
                  <option value="all">All Books</option>
                  <option value="recent">Recently Added</option>
                  <option value="rated">With Ratings</option>
                  <option value="priority">High Priority</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
            <LoadingSpinner message="Loading your library..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                  <span className="text-red-600 text-lg font-bold">!</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-800">Error Loading Library</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Books Grid */}
        {!isLoading && !error && (
          <>
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredBooks.map((savedBook) => {
                  const StatusIcon = getStatusIcon(savedBook.status);
                  return (
                  <div key={savedBook.id} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex space-x-4">
                      {/* Book Cover */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-32 bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                          <img
                            src={savedBook.book_data.coverImage}
                            alt={`Cover of ${savedBook.book_data.title}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Book Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                            {savedBook.book_data.title}
                          </h3>
                          <div className="flex items-center space-x-1 ml-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getStatusColor(savedBook.status)}`}>
                              <StatusIcon className="w-4 h-4" />
                            </div>
                            {savedBook.is_read && (
                              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <BookOpen className="w-3 h-3 text-green-600" />
                              </div>
                            )}
                            {savedBook.notes && (
                              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                <StickyNote className="w-3 h-3 text-purple-600" />
                              </div>
                            )}
                            {savedBook.priority <= 2 && (
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(savedBook.priority)}`}>
                                {getPriorityLabel(savedBook.priority)}
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          by {savedBook.book_data.authors.join(', ')}
                        </p>

                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Saved {new Date(savedBook.saved_at).toLocaleDateString()}</span>
                          </div>
                          
                          {savedBook.user_rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{savedBook.user_rating}/5</span>
                            </div>
                          )}

                          {savedBook.reading_progress > 0 && (
                            <div className="flex items-center space-x-1">
                              <Target className="w-3 h-3" />
                              <span>{savedBook.reading_progress}%</span>
                            </div>
                          )}

                          {savedBook.date_started && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Started {new Date(savedBook.date_started).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>

                        {savedBook.tags && savedBook.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {savedBook.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Reading Progress Bar */}
                        {savedBook.reading_progress > 0 && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Reading Progress</span>
                              <span>{savedBook.reading_progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${savedBook.reading_progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {savedBook.notes && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {savedBook.notes}
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openDetailsModal(savedBook)}
                              className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-xs font-medium transition-colors"
                            >
                              <BookOpen className="w-3 h-3" />
                              <span>Details</span>
                            </button>
                            
                            {/* Status Change Dropdown */}
                            <div className="relative group">
                              <button className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-xs font-medium transition-colors">
                                <StatusIcon className="w-3 h-3" />
                                <span>Status</span>
                              </button>
                              <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                <button
                                  onClick={() => handleStatusChange(savedBook.book_id, 'want_to_read')}
                                  className="flex items-center space-x-2 px-3 py-2 text-xs hover:bg-gray-50 w-full text-left"
                                >
                                  <Circle className="w-3 h-3 text-gray-500" />
                                  <span>Want to Read</span>
                                </button>
                                <button
                                  onClick={() => handleStatusChange(savedBook.book_id, 'currently_reading')}
                                  className="flex items-center space-x-2 px-3 py-2 text-xs hover:bg-gray-50 w-full text-left"
                                >
                                  <PlayCircle className="w-3 h-3 text-blue-500" />
                                  <span>Currently Reading</span>
                                </button>
                                <button
                                  onClick={() => handleStatusChange(savedBook.book_id, 'read')}
                                  className="flex items-center space-x-2 px-3 py-2 text-xs hover:bg-gray-50 w-full text-left"
                                >
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  <span>Read</span>
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={() => handleToggleRead(savedBook.book_id)}
                              className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                savedBook.is_read
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {savedBook.is_read ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              <span>{savedBook.is_read ? 'Read' : 'Mark as Read'}</span>
                            </button>
                            
                            <button
                              onClick={() => openNotesModal(savedBook)}
                              className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg text-xs font-medium transition-colors"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Notes</span>
                            </button>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveBook(savedBook.book_id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-medium transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {activeTab === 'all' && 'No books in your library yet'}
                  {activeTab === 'want_to_read' && 'No books in your want to read list'}
                  {activeTab === 'currently_reading' && 'No books currently being read'}
                  {activeTab === 'read' && 'No books marked as read'}
                  {activeTab === 'notes' && 'No books with notes'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'all' && 'Start building your library by saving books you want to read.'}
                  {activeTab === 'want_to_read' && 'Add some books to your want to read list!'}
                  {activeTab === 'currently_reading' && 'Start reading some books from your library!'}
                  {activeTab === 'read' && 'Mark books as read to track your reading progress.'}
                  {activeTab === 'notes' && 'Add notes to your books to remember your thoughts and insights.'}
                </p>
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Discover Books
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Notes Modal */}
      {showNotesModal && selectedBook && (
        <NotesModal
          book={{
            id: selectedBook.book_id,
            title: selectedBook.book_data.title,
            authors: selectedBook.book_data.authors,
            coverImage: selectedBook.book_data.coverImage,
            publishedDate: selectedBook.book_data.publishedDate,
            notes: selectedBook.notes,
            userRating: selectedBook.user_rating,
            readAt: selectedBook.read_at
          }}
          onClose={() => setShowNotesModal(false)}
          onSave={handleSaveNotes}
        />
      )}
      
      {/* Book Details Modal */}
      {showDetailsModal && selectedBookForDetails && (
        <BookDetailsModal
          book={{
            id: selectedBookForDetails.book_id,
            title: selectedBookForDetails.book_data.title,
            authors: selectedBookForDetails.book_data.authors,
            description: selectedBookForDetails.book_data.description,
            coverImage: selectedBookForDetails.book_data.coverImage,
            publishedDate: selectedBookForDetails.book_data.publishedDate,
            pageCount: selectedBookForDetails.book_data.pageCount,
            categories: selectedBookForDetails.book_data.categories,
            rating: selectedBookForDetails.book_data.rating,
            ratingCount: selectedBookForDetails.book_data.ratingCount,
            googleBooksUrl: selectedBookForDetails.book_data.googleBooksUrl,
            isbn: selectedBookForDetails.book_data.isbn
          }}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {/* Reading Goal Modal */}
      {showGoalModal && (
        <ReadingGoalModal
          currentGoal={libraryStats.readingGoal}
          onClose={() => setShowGoalModal(false)}
          onSave={handleSetGoal}
        />
      )}
    </div>
  );
};

export default LibraryPage;