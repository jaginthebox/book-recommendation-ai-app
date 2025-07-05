import React, { useState } from 'react';
import { X, Trophy, Target, BookOpen, Calendar, Save } from 'lucide-react';
import { ReadingGoal } from '../../lib/supabase';

interface ReadingGoalModalProps {
  currentGoal: ReadingGoal | null;
  onClose: () => void;
  onSave: (targetBooks: number, targetPages?: number) => void;
}

const ReadingGoalModal: React.FC<ReadingGoalModalProps> = ({ currentGoal, onClose, onSave }) => {
  const [targetBooks, setTargetBooks] = useState(currentGoal?.target_books || 12);
  const [targetPages, setTargetPages] = useState(currentGoal?.target_pages || 0);
  const [includePages, setIncludePages] = useState(!!currentGoal?.target_pages);

  const handleSave = () => {
    onSave(targetBooks, includePages ? targetPages : undefined);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const currentYear = new Date().getFullYear();
  const booksPerMonth = targetBooks / 12;
  const pagesPerDay = includePages && targetPages > 0 ? Math.ceil(targetPages / 365) : 0;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Set Reading Goal</h2>
              <p className="text-yellow-100 text-sm">Challenge yourself for {currentYear}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Books Goal */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Books to Read in {currentYear}</span>
              </div>
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="365"
                value={targetBooks}
                onChange={(e) => setTargetBooks(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg font-semibold text-center"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                books
              </div>
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-600">
                That's about <span className="font-semibold text-yellow-600">{booksPerMonth.toFixed(1)} books per month</span>
              </p>
            </div>
          </div>

          {/* Pages Goal Toggle */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <input
                type="checkbox"
                id="includePages"
                checked={includePages}
                onChange={(e) => setIncludePages(e.target.checked)}
                className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              />
              <label htmlFor="includePages" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Target className="w-4 h-4 text-green-600" />
                <span>Also set a pages goal</span>
              </label>
            </div>

            {includePages && (
              <div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="50000"
                    step="100"
                    value={targetPages}
                    onChange={(e) => setTargetPages(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-semibold text-center"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    pages
                  </div>
                </div>
                {pagesPerDay > 0 && (
                  <div className="mt-2 text-center">
                    <p className="text-sm text-gray-600">
                      That's about <span className="font-semibold text-green-600">{pagesPerDay} pages per day</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Goal Suggestions */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Popular Goals:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { books: 12, label: 'Casual Reader' },
                { books: 24, label: 'Book Lover' },
                { books: 52, label: 'Avid Reader' },
                { books: 100, label: 'Book Addict' }
              ].map((suggestion) => (
                <button
                  key={suggestion.books}
                  onClick={() => setTargetBooks(suggestion.books)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    targetBooks === suggestion.books
                      ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="font-semibold">{suggestion.books} books</div>
                  <div className="text-xs">{suggestion.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Current Progress */}
          {currentGoal && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Current Progress</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Books Read</p>
                  <p className="font-semibold text-yellow-700">
                    {currentGoal.current_books} / {currentGoal.target_books}
                  </p>
                </div>
                {currentGoal.target_pages && (
                  <div>
                    <p className="text-gray-600">Pages Read</p>
                    <p className="font-semibold text-green-700">
                      {currentGoal.current_pages} / {currentGoal.target_pages}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Motivation */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Reading Benefits</h4>
            </div>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Improves vocabulary and knowledge</li>
              <li>• Reduces stress and improves focus</li>
              <li>• Enhances empathy and creativity</li>
              <li>• Provides entertainment and escape</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Goal for 2025
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
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>{currentGoal ? 'Update Goal' : 'Set Goal'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingGoalModal;