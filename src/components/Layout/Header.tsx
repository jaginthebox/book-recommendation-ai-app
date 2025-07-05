import React, { useState } from 'react';
import { BookOpen, Sparkles, User, LogOut, Menu, X, Library, Heart, Compass, Book, Layers, Zap, BookMarked, Bookmark, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.tsx';
import AuthModal from '../Auth/AuthModal';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    logout();
    setShowMobileMenu(false);
  };

  const handleNavigation = (hash: string) => {
    console.log('Navigating to:', hash); // Debug log
    if (hash === '') {
      // For home page, remove hash completely
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
      // For other pages, set the hash
      window.location.hash = hash;
    }
    setShowMobileMenu(false);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 shadow-lg sticky top-0 z-40 relative overflow-hidden border-b border-orange-200">
        {/* Decorative library elements */}
        <div className="absolute inset-0 opacity-10">
          {/* Floating book icons */}
          <div className="absolute top-2 left-8 w-4 h-4 text-amber-600 animate-pulse">
            <BookOpen className="w-full h-full" />
          </div>
          <div className="absolute top-6 left-20 w-3 h-3 text-orange-600 animate-bounce">
            <Book className="w-full h-full" />
          </div>
          <div className="absolute top-3 left-32 w-3 h-3 text-red-600 animate-pulse" style={{ animationDelay: '0.5s' }}>
            <Bookmark className="w-full h-full" />
          </div>
          
          <div className="absolute top-2 right-8 w-4 h-4 text-amber-600 animate-pulse" style={{ animationDelay: '1s' }}>
            <BookMarked className="w-full h-full" />
          </div>
          <div className="absolute top-5 right-20 w-3 h-3 text-orange-600 animate-bounce" style={{ animationDelay: '0.3s' }}>
            <Library className="w-full h-full" />
          </div>
          <div className="absolute top-1 right-32 w-3 h-3 text-red-600 animate-pulse" style={{ animationDelay: '0.8s' }}>
            <Sparkles className="w-full h-full" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo Section - Optimized for mobile */}
            <div className="flex items-center">
              <button 
                onClick={() => handleNavigation('')}
                className="relative group cursor-pointer"
              >
                <div className="flex items-center space-x-2 sm:space-x-4 p-2 sm:p-3 rounded-xl hover:bg-white hover:bg-opacity-60 transition-all duration-300 hover:shadow-md backdrop-blur-sm">
                  <div className="relative">
                    {/* Library-themed logo */}
                    <div className="relative w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      {/* Stack of books effect */}
                      <div className="relative">
                        <div className="absolute -top-0.5 -left-0.5 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded opacity-70 transform rotate-12"></div>
                        <div className="absolute -top-0.5 -right-0.5 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded opacity-70 transform -rotate-12"></div>
                        <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-white relative z-10" />
                      </div>
                      
                      {/* Sparkle accent */}
                      <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-full flex items-center justify-center shadow-sm">
                        <Sparkles className="w-1 h-1 sm:w-1.5 sm:h-1.5 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-800 via-orange-800 to-red-800 bg-clip-text text-transparent drop-shadow-sm">
                      Readpop
                    </h1>
                    <p className="text-xs text-orange-700 font-medium tracking-wide uppercase">AI Book Discovery</p>
                  </div>
                  {/* Mobile-only compact title */}
                  <div className="sm:hidden">
                    <h1 className="text-lg font-bold bg-gradient-to-r from-amber-800 via-orange-800 to-red-800 bg-clip-text text-transparent">
                      Readpop
                    </h1>
                  </div>
                </div>
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <a
                href="#"
                onClick={() => handleNavigation('')}
                className="flex items-center space-x-2 text-orange-800 hover:text-red-800 transition-colors font-semibold text-base hover:bg-white hover:bg-opacity-60 px-4 py-2 rounded-xl cursor-pointer group backdrop-blur-sm"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <span>Discover</span>
              </a>
              <a
                href="#library"
                onClick={() => handleNavigation('#library')}
                className="flex items-center space-x-2 text-orange-800 hover:text-red-800 transition-colors font-semibold text-base hover:bg-white hover:bg-opacity-60 px-4 py-2 rounded-xl cursor-pointer group backdrop-blur-sm"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Library className="w-4 h-4 text-white" />
                </div>
                <span>My Library</span>
              </a>
              <a
                href="#recommendations"
                onClick={() => handleNavigation('#recommendations')}
                className="flex items-center space-x-2 text-orange-800 hover:text-red-800 transition-colors font-semibold text-base hover:bg-white hover:bg-opacity-60 px-4 py-2 rounded-xl cursor-pointer group backdrop-blur-sm"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span>Recommendations</span>
              </a>
              <a
                href="#about"
                onClick={() => handleNavigation('#about')}
                className="flex items-center space-x-2 text-orange-800 hover:text-red-800 transition-colors font-semibold text-base hover:bg-white hover:bg-opacity-60 px-4 py-2 rounded-xl cursor-pointer group backdrop-blur-sm"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Book className="w-4 h-4 text-white" />
                </div>
                <span>About</span>
              </a>
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {user ? (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="hidden sm:flex items-center space-x-3 bg-white bg-opacity-50 rounded-xl px-3 sm:px-5 py-2 sm:py-3 backdrop-blur-sm border border-orange-200 shadow-sm">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-orange-900">Welcome back!</p>
                      <p className="text-xs text-orange-700">{user.name}</p>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white border-opacity-50">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>
                  {/* Mobile user indicator */}
                  <div className="sm:hidden w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white border-opacity-50">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-sm text-orange-800 hover:text-red-600 transition-colors hover:bg-white hover:bg-opacity-50 rounded-xl font-medium backdrop-blur-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="px-4 py-2 text-base font-semibold text-orange-800 hover:text-red-800 transition-colors hover:bg-white hover:bg-opacity-50 rounded-xl backdrop-blur-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:from-orange-700 hover:via-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-white border-opacity-30 backdrop-blur-sm"
                  >
                    Get Started
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 sm:p-3 rounded-xl text-orange-800 hover:text-red-800 hover:bg-white hover:bg-opacity-50 transition-colors backdrop-blur-sm"
              >
                {showMobileMenu ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu - Improved */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-orange-200 py-4 bg-white bg-opacity-80 backdrop-blur-md rounded-b-2xl mx-2 mb-4 shadow-xl">
              <div className="flex flex-col space-y-1">
                <a
                  href="#"
                  onClick={() => handleNavigation('')}
                  className="flex items-center space-x-3 px-4 py-3 text-orange-800 hover:text-red-800 transition-colors font-semibold text-base hover:bg-orange-50 rounded-xl mx-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <span>Discover</span>
                </a>
                <a
                  href="#library"
                  onClick={() => handleNavigation('#library')}
                  className="flex items-center space-x-3 px-4 py-3 text-orange-800 hover:text-red-800 transition-colors font-semibold text-base hover:bg-orange-50 rounded-xl mx-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-md">
                    <Library className="w-4 h-4 text-white" />
                  </div>
                  <span>My Library</span>
                </a>
                <a
                  href="#recommendations"
                  onClick={() => handleNavigation('#recommendations')}
                  className="flex items-center space-x-3 px-4 py-3 text-orange-800 hover:text-red-800 transition-colors font-semibold text-base hover:bg-orange-50 rounded-xl mx-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center shadow-md">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <span>Recommendations</span>
                </a>
                <a
                  href="#about"
                  onClick={() => handleNavigation('#about')}
                  className="flex items-center space-x-3 px-4 py-3 text-orange-800 hover:text-red-800 transition-colors font-semibold text-base hover:bg-orange-50 rounded-xl mx-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                    <Book className="w-4 h-4 text-white" />
                  </div>
                  <span>About</span>
                </a>
                
                {user ? (
                  <div className="px-4 py-3 border-t border-orange-200 mx-2 mt-2">
                    <div className="flex items-center space-x-3 mb-3 bg-orange-50 rounded-xl p-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-orange-900">{user.name}</p>
                        <p className="text-xs text-orange-700">Signed in</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="px-4 py-3 border-t border-orange-200 space-y-3 mx-2 mt-2">
                    <button
                      onClick={() => handleAuthClick('login')}
                      className="w-full px-4 py-3 text-base font-semibold text-orange-800 border-2 border-orange-300 rounded-xl hover:bg-orange-50 transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleAuthClick('register')}
                      className="w-full px-4 py-3 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white text-base font-semibold rounded-xl hover:from-orange-700 hover:via-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}
    </>
  );
};

export default Header;