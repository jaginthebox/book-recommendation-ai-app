import React, { useState } from 'react';
import { BookOpen, User, LogOut, Menu, X, Library, Heart, Compass, Book, Search } from 'lucide-react';
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
    if (hash === '') {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
      window.location.hash = hash;
    }
    setShowMobileMenu(false);
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Professional Logo with Real Book */}
            <div className="flex items-center">
              <button 
                onClick={() => handleNavigation('')}
                className="flex items-center space-x-3 group"
              >
                {/* Real Book Logo */}
                <div className="relative">
                  {/* Book spine layers for 3D effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-800 rounded-r-md transform translate-x-1 translate-y-1 w-10 h-10"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 rounded-r-md transform translate-x-0.5 translate-y-0.5 w-10 h-10"></div>
                  
                  {/* Main book cover */}
                  <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-md shadow-lg flex items-center justify-center border border-indigo-800">
                    {/* Book pages effect */}
                    <div className="absolute right-0 top-1 bottom-1 w-1 bg-white opacity-30 rounded-r-sm"></div>
                    <div className="absolute right-0.5 top-1.5 bottom-1.5 w-0.5 bg-white opacity-20 rounded-r-sm"></div>
                    
                    {/* Book icon */}
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                {/* Brand Text */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: '"Inter", system-ui, sans-serif' }}>
                    Readpop
                  </h1>
                  <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                    AI Discovery
                  </p>
                </div>
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <a
                href="#"
                onClick={() => handleNavigation('')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <span>Discover</span>
              </a>
              <a
                href="#library"
                onClick={() => handleNavigation('#library')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium"
              >
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Library className="w-4 h-4 text-white" />
                </div>
                <span>My Library</span>
              </a>
              <a
                href="#recommendations"
                onClick={() => handleNavigation('#recommendations')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium"
              >
                <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span>Recommendations</span>
              </a>
              <a
                href="#about"
                onClick={() => handleNavigation('#about')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium"
              >
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Book className="w-4 h-4 text-white" />
                </div>
                <span>About</span>
              </a>
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                      <p className="text-xs text-gray-600">{user.name}</p>
                    </div>
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-gray-200 py-4 bg-white">
              <div className="flex flex-col space-y-2">
                <a
                  href="#"
                  onClick={() => handleNavigation('')}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <span>Discover</span>
                </a>
                <a
                  href="#library"
                  onClick={() => handleNavigation('#library')}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Library className="w-4 h-4 text-white" />
                  </div>
                  <span>My Library</span>
                </a>
                <a
                  href="#recommendations"
                  onClick={() => handleNavigation('#recommendations')}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <span>Recommendations</span>
                </a>
                <a
                  href="#about"
                  onClick={() => handleNavigation('#about')}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Book className="w-4 h-4 text-white" />
                  </div>
                  <span>About</span>
                </a>
                
                {user ? (
                  <div className="px-4 py-3 border-t border-gray-200 mt-2">
                    <div className="flex items-center space-x-3 mb-3 bg-gray-50 rounded-lg p-3">
                      <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-600">Signed in</p>
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
                  <div className="px-4 py-3 border-t border-gray-200 space-y-3 mt-2">
                    <button
                      onClick={() => handleAuthClick('login')}
                      className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Sign In
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