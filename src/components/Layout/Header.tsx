import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">BookMind</h1>
              <p className="text-xs text-gray-500">AI-Powered Book Discovery</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              Discover
            </a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              My Library
            </a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              About
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;