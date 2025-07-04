import React from 'react';
import { Search, BookOpen, Lightbulb } from 'lucide-react';

interface EmptyStateProps {
  type: 'initial' | 'no-results' | 'error';
  query?: string;
  onTryExample?: (example: string) => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, query, onTryExample }) => {
  const examples = [
    "Recent science fiction with strong female leads",
    "Cozy mystery novels set in small towns",
    "Historical fiction about World War II",
    "Self-help books about productivity"
  ];

  if (type === 'initial') {
    return (
      <div className="text-center py-16">
        <div className="relative inline-block mb-8">
          <BookOpen className="w-24 h-24 text-indigo-200" />
          <Search className="w-8 h-8 text-indigo-500 absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Discover Your Next Great Read
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Use natural language to describe exactly what you're looking for. 
          Our AI will understand your preferences and find books that match your taste perfectly.
        </p>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Lightbulb className="w-6 h-6 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Try these examples:</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => onTryExample?.(example)}
                className="text-left p-4 bg-white rounded-lg shadow-sm hover:shadow-md 
                         transition-shadow duration-200 border border-gray-100 hover:border-indigo-200
                         group"
              >
                <p className="text-gray-700 group-hover:text-indigo-700 transition-colors">
                  "{example}"
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'no-results') {
    return (
      <div className="text-center py-16">
        <Search className="w-16 h-16 text-gray-300 mx-auto mb-6" />
        
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          No books found for "{query}"
        </h3>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Try adjusting your search terms or being more specific about what you're looking for.
        </p>

        <div className="space-y-2 text-sm text-gray-500">
          <p>💡 <strong>Tips:</strong></p>
          <p>• Try different keywords or synonyms</p>
          <p>• Be more specific about genre or themes</p>
          <p>• Include author names or time periods</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Search className="w-8 h-8 text-red-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        We encountered an error while searching for books. Please try again in a moment.
      </p>
    </div>
  );
};

export default EmptyState;