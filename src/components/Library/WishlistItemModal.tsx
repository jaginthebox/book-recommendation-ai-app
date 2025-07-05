import React, { useState } from 'react';
import { X, Star, Flag, Tag, MessageCircle, Save } from 'lucide-react';
import { WishlistItem } from '../../lib/supabase';

interface WishlistItemModalProps {
  item: WishlistItem;
  onClose: () => void;
  onSave: (bookId: string, rating?: number, comments?: string, priority?: number, tags?: string[]) => void;
}

const WishlistItemModal: React.FC<WishlistItemModalProps> = ({ item, onClose, onSave }) => {
  const [rating, setRating] = useState(item.user_rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comments, setComments] = useState(item.comments || '');
  const [priority, setPriority] = useState(item.priority);
  const [tags, setTags] = useState<string[]>(item.tags || []);
  const [newTag, setNewTag] = useState('');

  const handleSave = () => {
    onSave(item.book_id, rating || undefined, comments, priority, tags);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTag();
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

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'from-red-500 to-red-600';
      case 2: return 'from-orange-500 to-orange-600';
      case 3: return 'from-yellow-500 to-yellow-600';
      case 4: return 'from-blue-500 to-blue-600';
      case 5: return 'from-gray-500 to-gray-600';
      default: return 'from-yellow-500 to-yellow-600';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-start space-x-4">
            <div className="w-16 h-22 bg-white bg-opacity-20 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={item.book_data.coverImage}
                alt={`Cover of ${item.book_data.title}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold mb-1 line-clamp-2">{item.book_data.title}</h2>
              <p className="text-pink-100 text-sm mb-2">by {item.book_data.authors.join(', ')}</p>
              <p className="text-xs text-pink-100">
                Added {new Date(item.added_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Rating Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Rating
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-3 text-sm text-gray-600">
                  {rating} out of 5 stars
                </span>
              )}
            </div>
          </div>

          {/* Priority Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Priority Level
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setPriority(level)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    priority === level
                      ? `bg-gradient-to-r ${getPriorityColor(level)} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Flag className="w-4 h-4 mx-auto mb-1" />
                  <div className="text-xs font-medium">{getPriorityLabel(level)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Comments & Notes
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Why do you want to read this book? What interests you about it?"
              className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                {comments.length} characters
              </p>
              <p className="text-xs text-gray-500">
                Share your thoughts and expectations
              </p>
            </div>
          </div>

          {/* Tags Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-800"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-pink-600 hover:text-pink-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors text-sm font-medium"
              >
                <Tag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Tag Suggestions */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Quick Tags:</p>
            <div className="flex flex-wrap gap-2">
              {['must-read', 'recommended', 'bestseller', 'award-winner', 'new-release', 'classic'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    if (!tags.includes(suggestion)) {
                      setTags([...tags, suggestion]);
                    }
                  }}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistItemModal;