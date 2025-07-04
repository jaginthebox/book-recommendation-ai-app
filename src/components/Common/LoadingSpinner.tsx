import React from 'react';
import { Loader2, BookOpen, Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  showBookAnimation?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Searching for your perfect books...", 
  showBookAnimation = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {showBookAnimation ? (
        <div className="relative mb-6">
          <div className="relative">
            <BookOpen className="w-16 h-16 text-indigo-300 animate-pulse" />
            <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2 animate-bounce" />
          </div>
          <div className="absolute inset-0 animate-spin">
            <div className="w-20 h-20 border-2 border-indigo-200 border-t-indigo-600 rounded-full"></div>
          </div>
        </div>
      ) : (
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
      )}
      
      <p className="text-gray-600 text-center max-w-md">
        {message}
      </p>
      
      <div className="mt-4 flex space-x-1">
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;