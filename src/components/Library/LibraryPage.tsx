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
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLibrary } from '../../hooks/useLibrary';
import { SavedBook } from '../../lib/supabase';
import NotesModal from './NotesModal';
import LoadingSpinner from '../Common/LoadingSpinner';

const LibraryPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    savedBooks, 
    libraryStats, 
    isLoading, 
    error,
    loadLibrary,
    removeBook,
    toggleReadStatus,
    saveNotesAndRating
  } = useLibrary();
  
  const [activeTab, setActiveTab] = useState<'all' | 'reading' | 'read' | 'notes'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'rated' | 'progress'>('all');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<SavedBook | null>(null);

  // Filter books based on active tab and filters
  const filteredBooks = savedBooks.filter(book => {
    // Tab filtering
    if (activeTab === 'reading' && book.is_read) return false;
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
    if (filterBy === 'progress' && book.reading_progress === 0) return false;

    return true;
  });

  const handleRemoveBook = async (bookId: string) => {
    if (window.confirm('Are you sure you want to remove this book from your library?')) {
      await removeBook(bookId);
    }
  };

  const handleToggleRead = async (bookId: string) => {
    await toggleReadStatus(bookId);
  };

  const openNotesModal = (book: SavedBook) => {
    setSelectedBook(book);
    setShowNotesModal(true);
  };

  const handleSaveNotes = async (bookId: string, notes: string, rating?: number) => {
    await saveNotesAndRating(bookId, notes, rating);
    setShowNotesModal(false);
  };

  const handleRefresh = () => {
    loadLibrary({
      search: searchQuery || undefined,
      hasNotes: activeTab === 'notes' ? true : undefined,
      isRead: activeTab === 'read' ? true : activeTab === 'reading' ? false : undefined
    });
  };

  // Load library with filters when they change
  useEffect(() => {
    if (user) {
      loadLibrary({
        search: searchQuery || undefined,
        hasNotes: activeTab === 'notes' ? true : undefined,
        isRead: activeTab === 'read' ? true : activeTab === 'reading' ? false : undefined
      });
    }
  }, [user, searchQuery, activeTab, loadLibrary]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to access your library</h2>
          <p className="text-gray-600 mb-6">Create an account to save books, track your reading progress, and get personalized recommendations.</p>
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            Get Started
          </button>
        </div>
      </div>
    );
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
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
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <Star className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-3xl font-bold text-gray-900">
                  {libraryStats.averageRating > 0 ? libraryStats.averageRating.toFixed(1) : '—'}
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
          
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <StickyNote className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">With Notes</p>
                <p className="text-3xl font-bold text-gray-900">{libraryStats.booksWithNotes}</p>
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
                  <option value="progress">In Progress</option>
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
                {filteredBooks.map((savedBook) => (
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
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {activeTab === 'all' && 'No books in your library yet'}
                  {activeTab === 'reading' && 'No books currently being read'}
                  {activeTab === 'read' && 'No books marked as read'}
                  {activeTab === 'notes' && 'No books with notes'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'all' && 'Start building your library by saving books you want to read.'}
                  {activeTab === 'reading' && 'Save some books and start your reading journey!'}
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
    </div>
  );
};

export default LibraryPage;