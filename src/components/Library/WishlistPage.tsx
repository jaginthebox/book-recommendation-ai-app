import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Star, 
  Calendar, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  ArrowRight,
  BookOpen,
  Plus,
  RefreshCw,
  Flag,
  MessageCircle,
  ShoppingCart
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLibrary } from '../../hooks/useLibrary';
import { WishlistItem } from '../../lib/supabase';
import LoadingSpinner from '../Common/LoadingSpinner';
import WishlistItemModal from './WishlistItemModal';
import BookDetailsModal from '../BookResults/BookDetailsModal';

const WishlistPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    wishlistItems, 
    libraryStats,
    isLoading, 
    error,
    loadWishlist,
    removeFromWishlist,
    updateWishlistItem,
    moveFromWishlistToLibrary
  } = useLibrary();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'high_priority' | 'rated' | 'recent'>('all');
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<WishlistItem | null>(null);

  // Filter wishlist items
  const filteredItems = wishlistItems.filter(item => {
    // Search filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = item.book_data.title.toLowerCase().includes(query);
      const matchesAuthor = item.book_data.authors.some(author => 
        author.toLowerCase().includes(query)
      );
      const matchesComments = item.comments?.toLowerCase().includes(query);
      
      if (!matchesTitle && !matchesAuthor && !matchesComments) return false;
    }

    // Additional filtering
    if (filterBy === 'high_priority' && item.priority > 2) return false;
    if (filterBy === 'rated' && !item.user_rating) return false;
    if (filterBy === 'recent') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(item.added_at) > weekAgo;
    }

    return true;
  });

  const handleRemoveItem = async (bookId: string) => {
    if (window.confirm('Are you sure you want to remove this book from your wishlist?')) {
      await removeFromWishlist(bookId);
    }
  };

  const handleMoveToLibrary = async (bookId: string, status: 'want_to_read' | 'currently_reading' | 'read' = 'want_to_read') => {
    await moveFromWishlistToLibrary(bookId, status);
  };

  const openItemModal = (item: WishlistItem) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const openDetailsModal = (item: WishlistItem) => {
    setSelectedItemForDetails(item);
    setShowDetailsModal(true);
  };

  const handleSaveItem = async (bookId: string, rating?: number, comments?: string, priority?: number, tags?: string[]) => {
    const updates: any = {};
    if (rating !== undefined) updates.user_rating = rating;
    if (comments !== undefined) updates.comments = comments;
    if (priority !== undefined) updates.priority = priority;
    if (tags !== undefined) updates.tags = tags;
    
    await updateWishlistItem(bookId, updates);
    setShowItemModal(false);
  };

  const handleRefresh = () => {
    loadWishlist({
      search: searchQuery || undefined,
      priority: filterBy === 'high_priority' ? 2 : undefined
    });
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-100 text-red-700 border-red-200';
      case 2: return 'bg-orange-100 text-orange-700 border-orange-200';
      case 3: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 4: return 'bg-blue-100 text-blue-700 border-blue-200';
      case 5: return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'Must Read';
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
          <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-pink-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to access your wishlist</h2>
          <p className="text-gray-600 mb-6">Create an account to save books to your wishlist and rate them.</p>
          <button 
            onClick={() => window.location.hash = ''}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
                <p className="text-xl text-white text-opacity-90">
                  {wishlistItems.length} books you want to read
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
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Wishlist</p>
                <p className="text-3xl font-bold text-gray-900">{wishlistItems.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <Flag className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-3xl font-bold text-gray-900">
                  {wishlistItems.filter(item => item.priority <= 2).length}
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
                <p className="text-sm font-medium text-gray-600">Rated</p>
                <p className="text-3xl font-bold text-gray-900">
                  {wishlistItems.filter(item => item.user_rating).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">With Comments</p>
                <p className="text-3xl font-bold text-gray-900">
                  {wishlistItems.filter(item => item.comments).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as any)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none bg-white min-w-[160px]"
                >
                  <option value="all">All Items</option>
                  <option value="high_priority">High Priority</option>
                  <option value="rated">With Ratings</option>
                  <option value="recent">Recently Added</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
            <LoadingSpinner message="Loading your wishlist..." />
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
                <h3 className="text-lg font-semibold text-red-800">Error Loading Wishlist</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Items */}
        {!isLoading && !error && (
          <>
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex space-x-4">
                      {/* Book Cover */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-32 bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                          <img
                            src={item.book_data.coverImage}
                            alt={`Cover of ${item.book_data.title}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Book Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                            {item.book_data.title}
                          </h3>
                          <div className="flex items-center space-x-1 ml-2">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                              {getPriorityLabel(item.priority)}
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          by {item.book_data.authors.join(', ')}
                        </p>

                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Added {new Date(item.added_at).toLocaleDateString()}</span>
                          </div>
                          
                          {item.user_rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{item.user_rating}/5</span>
                            </div>
                          )}
                        </div>

                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-pink-50 text-pink-600 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {item.comments && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {item.comments}
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openDetailsModal(item)}
                              className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-xs font-medium transition-colors"
                            >
                              <BookOpen className="w-3 h-3" />
                              <span>Details</span>
                            </button>
                            
                            <button
                              onClick={() => openItemModal(item)}
                              className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg text-xs font-medium transition-colors"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => handleMoveToLibrary(item.book_id, 'want_to_read')}
                              className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-xs font-medium transition-colors"
                            >
                              <ArrowRight className="w-3 h-3" />
                              <span>Add to Library</span>
                            </button>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(item.book_id)}
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
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-600 mb-6">
                  Start adding books you want to read to your wishlist. You can rate them and add comments too!
                </p>
                <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Discover Books
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Wishlist Item Modal */}
      {showItemModal && selectedItem && (
        <WishlistItemModal
          item={selectedItem}
          onClose={() => setShowItemModal(false)}
          onSave={handleSaveItem}
        />
      )}
      
      {/* Book Details Modal */}
      {showDetailsModal && selectedItemForDetails && (
        <BookDetailsModal
          book={{
            id: selectedItemForDetails.book_id,
            title: selectedItemForDetails.book_data.title,
            authors: selectedItemForDetails.book_data.authors,
            description: selectedItemForDetails.book_data.description,
            coverImage: selectedItemForDetails.book_data.coverImage,
            publishedDate: selectedItemForDetails.book_data.publishedDate,
            pageCount: selectedItemForDetails.book_data.pageCount,
            categories: selectedItemForDetails.book_data.categories,
            rating: selectedItemForDetails.book_data.rating,
            ratingCount: selectedItemForDetails.book_data.ratingCount,
            googleBooksUrl: selectedItemForDetails.book_data.googleBooksUrl,
            isbn: selectedItemForDetails.book_data.isbn
          }}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
};

export default WishlistPage;