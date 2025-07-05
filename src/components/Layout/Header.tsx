import React, { useState } from 'react';
import { BookOpen, Sparkles, User, LogOut, Menu, X, Library, Heart, Compass } from 'lucide-react';
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
    window.location.hash = hash;
    setShowMobileMenu(false);
  };

  return (
    <>
      <header className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 shadow-xl sticky top-0 z-40 relative overflow-hidden border-b-4 border-gradient-to-r from-amber-200 to-orange-200">
        {/* Decorative book-themed background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-10 w-8 h-10 bg-amber-600 rounded-sm transform rotate-12 shadow-lg"></div>
          <div className="absolute top-4 left-20 w-6 h-8 bg-orange-600 rounded-sm transform -rotate-6 shadow-md"></div>
          <div className="absolute top-1 left-32 w-7 h-9 bg-red-600 rounded-sm transform rotate-3 shadow-lg"></div>
          
          <div className="absolute top-3 right-10 w-8 h-10 bg-amber-700 rounded-sm transform -rotate-12 shadow-lg"></div>
          <div className="absolute top-5 right-20 w-6 h-8 bg-orange-700 rounded-sm transform rotate-6 shadow-md"></div>
          <div className="absolute top-2 right-32 w-7 h-9 bg-red-700 rounded-sm transform -rotate-3 shadow-lg"></div>
          
          {/* Floating sparkles */}
          <div className="absolute top-6 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-1/3 w-1 h-1 bg-amber-400 rounded-full animate-ping"></div>
          <div className="absolute top-4 left-2/3 w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => handleNavigation('')}
                className="relative group cursor-pointer"
              >
                <div className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-white hover:bg-opacity-40 transition-all duration-300 hover:shadow-lg">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow duration-300 border-2 border-white border-opacity-50">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 via-orange-800 to-red-800 bg-clip-text text-transparent drop-shadow-sm">
                      Readpop
                    </h1>
                    <p className="text-xs text-amber-700 font-semibold tracking-wide">AI-Powered Discovery</p>
                  </div>
                </div>
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => handleNavigation('')}
                className="flex items-center space-x-2 text-amber-800 hover:text-orange-800 transition-colors font-semibold text-sm hover:bg-white hover:bg-opacity-40 px-4 py-3 rounded-xl cursor-pointer group"
              >
                <Compass className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>Discover</span>
              </button>
              <button
                onClick={() => handleNavigation('library')}
                className="flex items-center space-x-2 text-amber-800 hover:text-orange-800 transition-colors font-semibold text-sm hover:bg-white hover:bg-opacity-40 px-4 py-3 rounded-xl cursor-pointer group"
              >
                <Library className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>My Library</span>
              </button>
              <button
                onClick={() => handleNavigation('recommendations')}
                className="flex items-center space-x-2 text-amber-800 hover:text-orange-800 transition-colors font-semibold text-sm hover:bg-white hover:bg-opacity-40 px-4 py-3 rounded-xl cursor-pointer group"
              >
                <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Recommendations</span>
              </button>
              <button
                onClick={() => handleNavigation('about')}
                className="flex items-center space-x-2 text-amber-800 hover:text-orange-800 transition-colors font-semibold text-sm hover:bg-white hover:bg-opacity-40 px-4 py-3 rounded-xl cursor-pointer group"
              >
                <BookOpen className="w-4 h-4 group-hover:rotate-6 transition-transform" />
                <span>About</span>
              </button>
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden md:flex items-center space-x-3 bg-white bg-opacity-30 rounded-2xl px-4 py-2 backdrop-blur-sm border border-white border-opacity-40">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-amber-900">Welcome back!</p>
                      <p className="text-xs text-amber-700">{user.email}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white border-opacity-50">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-amber-800 hover:text-red-600 transition-colors hover:bg-white hover:bg-opacity-40 rounded-xl font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="px-5 py-2 text-sm font-semibold text-amber-800 hover:text-orange-800 transition-colors hover:bg-white hover:bg-opacity-40 rounded-xl"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="px-6 py-2 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white text-sm font-semibold rounded-xl hover:from-amber-700 hover:via-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-white border-opacity-30"
                  >
                    Get Started
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-3 rounded-xl text-amber-800 hover:text-orange-800 hover:bg-white hover:bg-opacity-40 transition-colors"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-amber-200 py-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-b-2xl mx-4 mb-4">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleNavigation('')}
                  className="flex items-center space-x-3 px-4 py-3 text-amber-800 hover:text-orange-800 transition-colors font-semibold hover:bg-white hover:bg-opacity-40 rounded-xl mx-2"
                >
                  <Compass className="w-5 h-5" />
                  <span>Discover</span>
                </button>
                <button
                  onClick={() => handleNavigation('library')}
                  className="flex items-center space-x-3 px-4 py-3 text-amber-800 hover:text-orange-800 transition-colors font-semibold hover:bg-white hover:bg-opacity-40 rounded-xl mx-2"
                >
                  <Library className="w-5 h-5" />
                  <span>My Library</span>
                </button>
                <button
                  onClick={() => handleNavigation('recommendations')}
                  className="flex items-center space-x-3 px-4 py-3 text-amber-800 hover:text-orange-800 transition-colors font-semibold hover:bg-white hover:bg-opacity-40 rounded-xl mx-2"
                >
                  <Heart className="w-5 h-5" />
                  <span>Recommendations</span>
                </button>
                <button
                  onClick={() => handleNavigation('about')}
                  className="flex items-center space-x-3 px-4 py-3 text-amber-800 hover:text-orange-800 transition-colors font-semibold hover:bg-white hover:bg-opacity-40 rounded-xl mx-2"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>About</span>
                </button>
                
                {user ? (
                  <div className="px-4 py-3 border-t border-amber-200 mx-2 mt-2">
                    <div className="flex items-center space-x-3 mb-3 bg-white bg-opacity-30 rounded-xl p-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-amber-900">{user.email}</p>
                        <p className="text-xs text-amber-700">Signed in</p>
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
                  <div className="px-4 py-3 border-t border-amber-200 space-y-3 mx-2 mt-2">
                    <button
                      onClick={() => handleAuthClick('login')}
                      className="w-full px-4 py-3 text-sm font-semibold text-amber-800 border-2 border-amber-300 rounded-xl hover:bg-white hover:bg-opacity-40 transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleAuthClick('register')}
                      className="w-full px-4 py-3 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white text-sm font-semibold rounded-xl hover:from-amber-700 hover:via-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg"
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