import React, { useState } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import MoodSelector, { Mood } from './MoodSelector';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  isLoading, 
  placeholder = "Describe the perfect book for you..." 
}) => {
  const [query, setQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [showMoodSelector, setShowMoodSelector] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((query.trim() || selectedMood) && !isLoading) {
      let searchQuery = query.trim();
      
      // Enhance query with mood if selected
      if (selectedMood) {
        searchQuery = searchQuery 
          ? `${searchQuery} ${selectedMood.searchModifier}`
          : `books that are ${selectedMood.searchModifier}`;
      }
      
      onSearch(searchQuery);
    }
  };

  const exampleQueries = [
    "Recent science fiction with strong female leads",
    "Cozy mystery novels set in small towns",
    "Historical fiction about World War II",
    "Self-help books about productivity and focus",
    "Fantasy novels with complex magic systems"
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Mood Selector Toggle */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowMoodSelector(!showMoodSelector)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200 rounded-lg transition-all duration-200 text-indigo-700 hover:text-indigo-800"
        >
          <Sparkles className="w-4 h-4" />
          <span className="font-medium">
            {showMoodSelector ? 'Hide Mood Selector' : 'What\'s your mood today?'}
          </span>
        </button>
      </div>

      {/* Mood Selector */}
      {showMoodSelector && (
        <div className="mb-8">
          <MoodSelector
            selectedMood={selectedMood}
            onMoodSelect={setSelectedMood}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-gray-400" />
            )}
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full pl-12 pr-16 py-4 text-lg border border-gray-200 rounded-2xl 
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-sm hover:shadow-md transition-shadow duration-200
                     placeholder-gray-400"
          />
          
          <button
            type="submit"
            disabled={(!query.trim() && !selectedMood) || isLoading}
            className="absolute inset-y-0 right-0 pr-4 flex items-center
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="bg-indigo-600 hover:bg-indigo-700 disabled:hover:bg-indigo-600 
                          text-white px-4 py-2 rounded-xl transition-colors duration-200
                          flex items-center space-x-2 font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Discover</span>
            </div>
          </button>
        </div>
      </form>

      {/* Example queries */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-3 font-medium">Try these examples:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => {
                setQuery(example);
                setSelectedMood(null);
              }}
              disabled={isLoading}
              className="px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 
                       text-gray-700 rounded-lg transition-colors duration-200
                       border border-gray-200 hover:border-gray-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;