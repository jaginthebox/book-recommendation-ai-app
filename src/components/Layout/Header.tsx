import React from 'react';
import { BookOpen, Sparkles, Star, Users } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                BookMind
              </h1>
              <p className="text-xs text-gray-500">Find Your Perfect Book in 30 Seconds</p>
            </div>
          </div>
          
          {/* Trust Signals */}
          <div className="hidden lg:flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="font-medium">500,000+ readers</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium">4.9/5 rating</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="hidden md:block text-gray-600 hover:text-purple-600 transition-colors font-medium">
              How it Works
            </button>
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
              Start Reading Free
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;