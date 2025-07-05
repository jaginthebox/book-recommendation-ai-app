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
      <header className="bg-white shadow-lg sticky top-0 z-40 relative overflow-hidden border-b border-gray-100">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 opacity-30"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23818cf8' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        {/* Decorative floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-16 w-2 h-2 bg-indigo-300 rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute top-8 left-32 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-6 left-48 w-1 h-1 bg-pink-300 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="absolute top-4 right-16 w-2 h-2 bg-purple-300 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-7 right-32 w-1.5 h-1.5 bg-indigo-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0.8s' }}></div>
          <div className="absolute top-5 right-48 w-1 h-1 bg-pink-300 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Beautiful Logo Section */}
            <div className="flex items-center">
              <button 
                onClick={() => handleNavigation('')}
                className="relative group cursor-pointer"
              >
                <div className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-2xl hover:bg-white hover:bg-opacity-80 transition-all duration-300 hover:shadow-lg backdrop-blur-sm">
                  <div className="relative">
                    {/* Premium Logo Design */}
                    <div className="relative w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      {/* Layered book effect */}
                      <div className="absolute inset-1 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl opacity-60 transform rotate-3"></div>
                      <div className="absolute inset-1 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl opacity-60 transform -rotate-3"></div>
                      
                      {/* Main icon */}
                      <div className="relative z-10 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center shadow-inner">
                        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                      </div>
                      
                      {/* Premium sparkle */}
                      <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                        <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                      </div>
                      
                      {/* Subtle glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    </div>
                  </div>
                  
                  <div>
                    {/* Beautiful Typography */}
                    <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 bg-clip-text text-transparent tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
                      Readpop
                    </h1>
                    <p className="text-xs sm:text-sm text-indigo-600 font-semibold tracking-wider uppercase opacity-80" style={{ fontFamily: 'ui-monospace, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace' }}>
                      AI Discovery
                    </p>
                  </div>
                </div>
              </button>
            </div>
            
            {/* Desktop Navigation with Bright Icons */}
            <nav className="hidden md:flex items-center space-x-2">
              <a
                href="#"
                onClick={() => handleNavigation('')}
                className="flex items-center space-x-3 text-gray-700 hover:text-indigo-700 transition-colors font-semibold text-base hover:bg-white hover:bg-opacity-80 px-4 py-3 rounded-xl cursor-pointer group backdrop-blur-sm shadow-sm hover:shadow-md"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span>Discover</span>
              </a>
              <a
                href="#library"
                onClick={() => handleNavigation('#library')}
                className="flex items-center space-x-3 text-gray-700 hover:text-emerald-700 transition-colors font-semibold text-base hover:bg-white hover:bg-opacity-80 px-4 py-3 rounded-xl cursor-pointer group backdrop-blur-sm shadow-sm hover:shadow-md"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Library className="w-5 h-5 text-white" />
                </div>
                <span>My Library</span>
              </a>
              <a
                href="#recommendations"
                onClick={() => handleNavigation('#recommendations')}
                className="flex items-center space-x-3 text-gray-700 hover:text-pink-700 transition-colors font-semibold text-base hover:bg-white hover:bg-opacity-80 px-4 py-3 rounded-xl cursor-pointer group backdrop-blur-sm shadow-sm hover:shadow-md"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span>Recommendations</span>
              </a>
              <a
                href="#about"
                onClick={() => handleNavigation('#about')}
                className="flex items-center space-x-3 text-gray-700 hover:text-purple-700 transition-colors font-semibold text-base hover:bg-white hover:bg-opacity-80 px-4 py-3 rounded-xl cursor-pointer group backdrop-blur-sm shadow-sm hover:shadow-md"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Book className="w-5 h-5 text-white" />
                </div>
                <span>About</span>
              </a>
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex items-center space-x-3 bg-white bg-opacity-80 rounded-xl px-4 py-3 backdrop-blur-sm border border-gray-200 shadow-sm">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">Welcome back!</p>
                      <p className="text-xs text-gray-600">{user.name}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  {/* Mobile user indicator */}
                  <div className="sm:hidden w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors hover:bg-white hover:bg-opacity-80 rounded-xl font-medium backdrop-blur-sm shadow-sm hover:shadow-md"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="px-5 py-3 text-base font-semibold text-gray-700 hover:text-indigo-700 transition-colors hover:bg-white hover:bg-opacity-80 rounded-xl backdrop-blur-sm shadow-sm hover:shadow-md"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-base font-semibold rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-3 rounded-xl text-gray-700 hover:text-indigo-700 hover:bg-white hover:bg-opacity-80 transition-colors backdrop-blur-sm shadow-sm hover:shadow-md"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Enhanced Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-gray-200 py-4 bg-white bg-opacity-95 backdrop-blur-lg rounded-b-2xl mx-2 mb-4 shadow-2xl">
              <div className="flex flex-col space-y-2">
                <a
                  href="#"
                  onClick={() => handleNavigation('')}
                  className="flex items-center space-x-3 px-4 py-4 text-gray-700 hover:text-indigo-700 transition-colors font-semibold text-base hover:bg-gray-50 rounded-xl mx-2"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <span>Discover</span>
                </a>
                <a
                  href="#library"
                  onClick={() => handleNavigation('#library')}
                  className="flex items-center space-x-3 px-4 py-4 text-gray-700 hover:text-emerald-700 transition-colors font-semibold text-base hover:bg-gray-50 rounded-xl mx-2"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Library className="w-5 h-5 text-white" />
                  </div>
                  <span>My Library</span>
                </a>
                <a
                  href="#recommendations"
                  onClick={() => handleNavigation('#recommendations')}
                  className="flex items-center space-x-3 px-4 py-4 text-gray-700 hover:text-pink-700 transition-colors font-semibold text-base hover:bg-gray-50 rounded-xl mx-2"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <span>Recommendations</span>
                </a>
                <a
                  href="#about"
                  onClick={() => handleNavigation('#about')}
                  className="flex items-center space-x-3 px-4 py-4 text-gray-700 hover:text-purple-700 transition-colors font-semibold text-base hover:bg-gray-50 rounded-xl mx-2"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Book className="w-5 h-5 text-white" />
                  </div>
                  <span>About</span>
                </a>
                
                {user ? (
                  <div className="px-4 py-3 border-t border-gray-200 mx-2 mt-2">
                    <div className="flex items-center space-x-3 mb-3 bg-gray-50 rounded-xl p-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
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
                  <div className="px-4 py-3 border-t border-gray-200 space-y-3 mx-2 mt-2">
                    <button
                      onClick={() => handleAuthClick('login')}
                      className="w-full px-4 py-3 text-base font-semibold text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleAuthClick('register')}
                      className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-base font-semibold rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
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