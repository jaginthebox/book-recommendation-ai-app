import React, { useState } from 'react';
import { BookOpen, Sparkles, User, LogOut, Menu, X } from 'lucide-react';
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

  return (
    <>
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg sticky top-0 z-40 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-yellow-300 rounded-full blur-2xl animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-pink-300 rounded-full blur-xl animate-ping"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <div className="relative group cursor-pointer">
                <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white hover:bg-opacity-10 transition-all duration-300">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-white border-opacity-30">
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                    <Sparkles className="w-5 h-5 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                      Readpop
                    </h1>
                    <p className="text-xs text-white text-opacity-80 font-medium">AI-Powered Discovery</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-white text-opacity-90 hover:text-white transition-colors font-medium text-sm hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg">
                Discover
              </a>
              <a href="#library" className="text-white text-opacity-90 hover:text-white transition-colors font-medium text-sm hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg">
                My Library
              </a>
              <a href="#" className="text-white text-opacity-90 hover:text-white transition-colors font-medium text-sm hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg">
                Recommendations
              </a>
              <a href="#" className="text-white text-opacity-90 hover:text-white transition-colors font-medium text-sm hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg">
                About
              </a>
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden md:flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">Welcome back!</p>
                      <p className="text-xs text-white text-opacity-80">{user.email}</p>
                    </div>
                    <div className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white border-opacity-30">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-white text-opacity-90 hover:text-red-300 transition-colors hover:bg-white hover:bg-opacity-10 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="px-4 py-2 text-sm font-medium text-white text-opacity-90 hover:text-white transition-colors hover:bg-white hover:bg-opacity-10 rounded-lg"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="px-6 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white text-sm font-medium rounded-lg hover:bg-opacity-30 transition-all duration-200 shadow-md hover:shadow-lg border border-white border-opacity-30"
                  >
                    Get Started
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-lg text-white text-opacity-90 hover:text-white hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-white border-opacity-20 py-4 bg-black bg-opacity-10 backdrop-blur-sm">
              <div className="flex flex-col space-y-3">
                <a href="#" className="px-4 py-2 text-white text-opacity-90 hover:text-white transition-colors font-medium hover:bg-white hover:bg-opacity-10 rounded-lg mx-4">
                  Discover
                </a>
                <a href="#library" className="px-4 py-2 text-white text-opacity-90 hover:text-white transition-colors font-medium hover:bg-white hover:bg-opacity-10 rounded-lg mx-4">
                  My Library
                </a>
                <a href="#" className="px-4 py-2 text-white text-opacity-90 hover:text-white transition-colors font-medium hover:bg-white hover:bg-opacity-10 rounded-lg mx-4">
                  Recommendations
                </a>
                <a href="#" className="px-4 py-2 text-white text-opacity-90 hover:text-white transition-colors font-medium hover:bg-white hover:bg-opacity-10 rounded-lg mx-4">
                  About
                </a>
                
                {user ? (
                  <div className="px-4 py-2 border-t border-white border-opacity-20 mx-4">
                    <p className="text-sm font-medium text-white mb-1">{user.email}</p>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-sm text-red-300 hover:text-red-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="px-4 py-2 border-t border-white border-opacity-20 space-y-2 mx-4">
                    <button
                      onClick={() => handleAuthClick('login')}
                      className="w-full px-4 py-2 text-sm font-medium text-white text-opacity-90 border border-white border-opacity-30 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleAuthClick('register')}
                      className="w-full px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white text-sm font-medium rounded-lg hover:bg-opacity-30 transition-all duration-200 border border-white border-opacity-30"
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