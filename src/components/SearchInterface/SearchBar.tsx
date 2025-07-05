import React, { useState } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import { Mood } from './MoodSelector';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  placeholder?: string;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  isLoading, 
  placeholder = "Tell us what you're looking for...",
  searchValue,
  onSearchValueChange
}) => {
  const [query, setQuery] = useState(searchValue || '');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  // Update local query when searchValue prop changes
  React.useEffect(() => {
    if (searchValue !== undefined) {
      setQuery(searchValue);
    }
  }, [searchValue]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (onSearchValueChange) {
      onSearchValueChange(value);
    }
  };

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
    "Science fiction with strong characters",
    "Cozy mystery in small towns",
    "Historical fiction World War II",
    "Self-help productivity books",
    "Fantasy with magic systems"
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
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
            onChange={(e) => handleInputChange(e.target.value)}
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
        <div className="flex flex-wrap gap-2 justify-center mb-2">
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => {
                handleInputChange(example);
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
        <p className="text-xs text-gray-500 mt-2">
          Click any example above or describe what you're looking for
        </p>
      </div>
    </div>
  );
};

export default SearchBar;