import React, { useState } from 'react';
import { Search, Sparkles, Loader2, Heart, Zap, Coffee, Moon } from 'lucide-react';

interface EnhancedSearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moodButtons = [
    { id: 'adventurous', label: 'Adventurous', icon: Zap, color: 'from-orange-400 to-red-500', query: 'thrilling adventure books with action and excitement' },
    { id: 'romantic', label: 'Romantic', icon: Heart, color: 'from-pink-400 to-rose-500', query: 'heartwarming romance novels with emotional depth' },
    { id: 'thoughtful', label: 'Thoughtful', icon: Coffee, color: 'from-amber-400 to-orange-500', query: 'thought-provoking literary fiction that makes you think' },
    { id: 'mysterious', label: 'Mysterious', icon: Moon, color: 'from-indigo-400 to-purple-500', query: 'gripping mystery and thriller books with plot twists' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleMoodClick = (mood: typeof moodButtons[0]) => {
    setSelectedMood(mood.id);
    setQuery(mood.query);
    onSearch(mood.query);
  };

  const quickExamples = [
    "uplifting romance",
    "dark mystery",
    "sci-fi with strong women",
    "cozy small-town stories"
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* 3 Simple Steps */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">3 Simple Steps to Your Perfect Book</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3">1</div>
            <h3 className="font-semibold text-gray-900 mb-1">Tell us your mood</h3>
            <p className="text-sm text-gray-600">Quick mood buttons or describe what you want</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3">2</div>
            <h3 className="font-semibold text-gray-900 mb-1">Get AI-curated recommendations</h3>
            <p className="text-sm text-gray-600">Our AI analyzes millions of books instantly</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3">3</div>
            <h3 className="font-semibold text-gray-900 mb-1">Start reading instantly</h3>
            <p className="text-sm text-gray-600">Click to read or add to your library</p>
          </div>
        </div>
      </div>

      {/* Mood Buttons */}
      <div className="mb-8">
        <p className="text-center text-lg font-medium text-gray-700 mb-4">What's your mood today?</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {moodButtons.map((mood) => {
            const Icon = mood.icon;
            return (
              <button
                key={mood.id}
                onClick={() => handleMoodClick(mood)}
                disabled={isLoading}
                className={`group relative overflow-hidden bg-gradient-to-br ${mood.color} text-white p-6 rounded-2xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedMood === mood.id ? 'ring-4 ring-white shadow-2xl' : ''
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Icon className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-semibold">{mood.label}</span>
                </div>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            {isLoading ? (
              <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
            ) : (
              <Search className="w-6 h-6 text-gray-400" />
            )}
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe the perfect book for you..."
            disabled={isLoading}
            className="w-full pl-16 pr-20 py-6 text-lg border-2 border-gray-200 rounded-2xl 
                     focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-lg hover:shadow-xl transition-all duration-200
                     placeholder-gray-400 bg-white"
          />
          
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute inset-y-0 right-0 pr-4 flex items-center
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 
                          text-white px-6 py-3 rounded-xl transition-all duration-200
                          flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl
                          transform hover:-translate-y-0.5">
              <Sparkles className="w-5 h-5" />
              <span>Discover</span>
            </div>
          </button>
        </div>
        
        {/* Helper Text */}
        <p className="text-sm text-gray-500 mt-2 text-center">
          Try: {quickExamples.map((example, index) => (
            <span key={example}>
              <button 
                onClick={() => setQuery(example)}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                "{example}"
              </button>
              {index < quickExamples.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      </form>

      {/* Trust Signal */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-green-600">✓ Instant results</span> • 
          <span className="font-semibold text-blue-600"> ✓ No spam</span> • 
          <span className="font-semibold text-purple-600"> ✓ Always free</span>
        </p>
      </div>
    </div>
  );
};

export default EnhancedSearchBar;