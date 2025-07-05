import React, { useState, useEffect } from 'react';
import { X, Star, Save, BookOpen, Calendar, User } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  authors: string[];
  coverImage: string;
  publishedDate: string;
  notes?: string;
  userRating?: number;
  readAt?: string;
}

interface NotesModalProps {
  book: Book;
  onClose: () => void;
  onSave: (bookId: string, notes: string, userRating?: number) => void;
}

const NotesModal: React.FC<NotesModalProps> = ({ book, onClose, onSave }) => {
  const [notes, setNotes] = useState(book.notes || '');
  const [rating, setRating] = useState(book.userRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSave = () => {
    onSave(book.id, notes, rating || undefined);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-start space-x-4">
            <div className="w-16 h-22 bg-white bg-opacity-20 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold mb-1 line-clamp-2">{book.title}</h2>
              <p className="text-purple-100 text-sm mb-2">by {book.authors.join(', ')}</p>
              <div className="flex items-center space-x-4 text-xs text-purple-100">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Published {book.publishedDate}</span>
                </div>
                {book.readAt && (
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-3 h-3" />
                    <span>Read {new Date(book.readAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
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

          {/* Notes Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Notes & Thoughts
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you think about this book? Share your thoughts, favorite quotes, or key takeaways..."
              className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                {notes.length} characters
              </p>
              <p className="text-xs text-gray-500">
                Tip: Include quotes, themes, or personal reflections
              </p>
            </div>
          </div>

          {/* Quick Templates */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quick Templates
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "What I loved: ",
                "Key takeaways: ",
                "Favorite quote: \"",
                "Would recommend because: ",
                "Similar to: ",
                "Made me think about: "
              ].map((template, index) => (
                <button
                  key={index}
                  onClick={() => setNotes(prev => prev + (prev ? '\n\n' : '') + template)}
                  className="text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  {template}
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
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>Save Notes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;