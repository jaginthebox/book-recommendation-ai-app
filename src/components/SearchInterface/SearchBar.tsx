import React, { useState } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
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
    <div className="w-full max-w-4xl mx-auto">
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
            disabled={!query.trim() || isLoading}
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
      <div className="mt-6">
        <p className="text-sm text-gray-600 mb-3 font-medium">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => setQuery(example)}
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