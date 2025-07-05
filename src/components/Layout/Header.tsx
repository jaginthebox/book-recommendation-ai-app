import React, { useState } from 'react';
import { BookOpen, Sparkles, User, LogOut, Menu, X, Library, Heart, Compass, Book, Layers, Zap } from 'lucide-react';
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
      <header className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 shadow-xl sticky top-0 z-40 relative overflow-hidden border-b-4 border-gradient-to-r from-sky-300 to-blue-400">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-8">
          {/* Floating geometric shapes */}
          <div className="absolute top-3 left-12 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-lg animate-pulse"></div>
          <div className="absolute top-6 left-24 w-4 h-4 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full shadow-md animate-bounce"></div>
          <div className="absolute top-2 left-36 w-5 h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full shadow-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          
          <div className="absolute top-4 right-12 w-6 h-6 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full shadow-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-7 right-24 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-md animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute top-1 right-36 w-5 h-5 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full shadow-lg animate-pulse" style={{ animationDelay: '0.8s' }}></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Professional Logo Section */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => handleNavigation('')}
                className="relative group cursor-pointer"
              >
                <div className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-white hover:bg-opacity-50 transition-all duration-300 hover:shadow-lg backdrop-blur-sm">
                  <div className="relative">
                    {/* Professional Logo Design */}
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      {/* Main book icon */}
                      <div className="relative">
                        <Layers className="w-6 h-6 text-white" />
                        {/* Accent sparkle */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full flex items-center justify-center shadow-sm">
                          <Zap className="w-1.5 h-1.5 text-white" />
                        </div>
                      </div>
                      
                      {/* Professional border accent */}
                      <div className="absolute inset-0 rounded-xl border-2 border-white border-opacity-20"></div>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent drop-shadow-sm">
                      Readpop
                    </h1>
                    <p className="text-xs text-blue-700 font-medium tracking-wide uppercase">AI Discovery Platform</p>
                  </div>
                </div>
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <a
                href="#"
                onClick={() => handleNavigation('')}
                className="flex items-center space-x-3 text-blue-800 hover:text-indigo-800 transition-colors font-semibold text-base hover:bg-white hover:bg-opacity-50 px-5 py-3 rounded-xl cursor-pointer group backdrop-blur-sm"
              >
                <Compass className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Discover</span>
              </a>
              <a
                href="#library"
                onClick={() => handleNavigation('#library')}
                className="flex items-center space-x-3 text-blue-800 hover:text-indigo-800 transition-colors font-semibold text-base hover:bg-white hover:bg-opacity-50 px-5 py-3 rounded-xl cursor-pointer group backdrop-blur-sm"
              >
                <Library className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>My Library</span>
              </a>
              <a
                href="#recommendations"
                onClick={() => handleNavigation('#recommendations')}
                className="flex items-center space-x-3 text-blue-800 hover:text-indigo-800 transition-colors font-semibold text-base hover:bg-white hover:bg-opacity-50 px-5 py-3 rounded-xl cursor-pointer group backdrop-blur-sm"
              >
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Recommendations</span>
              </a>
              <a
                href="#about"
                onClick={() => handleNavigation('#about')}
                className="flex items-center space-x-3 text-blue-800 hover:text-indigo-800 transition-colors font-semibold text-base hover:bg-white hover:bg-opacity-50 px-5 py-3 rounded-xl cursor-pointer group backdrop-blur-sm"
              >
                <Book className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                <span>About</span>
              </a>
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden md:flex items-center space-x-3 bg-white bg-opacity-40 rounded-2xl px-5 py-3 backdrop-blur-sm border border-white border-opacity-50 shadow-sm">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-blue-900">Welcome back!</p>
                      <p className="text-xs text-blue-700">{user.name}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white border-opacity-50">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-800 hover:text-red-600 transition-colors hover:bg-white hover:bg-opacity-50 rounded-xl font-medium backdrop-blur-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="px-5 py-3 text-base font-semibold text-blue-800 hover:text-indigo-800 transition-colors hover:bg-white hover:bg-opacity-50 rounded-xl backdrop-blur-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-base font-semibold rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-white border-opacity-30 backdrop-blur-sm"
                  >
                    Get Started
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-3 rounded-xl text-blue-800 hover:text-indigo-800 hover:bg-white hover:bg-opacity-50 transition-colors backdrop-blur-sm"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-blue-200 py-4 bg-white bg-opacity-30 backdrop-blur-sm rounded-b-2xl mx-4 mb-4 shadow-lg">
              <div className="flex flex-col space-y-2">
                <a
                  href="#"
                  onClick={() => handleNavigation('')}
                  className="flex items-center space-x-3 px-4 py-4 text-blue-800 hover:text-indigo-800 transition-colors font-semibold text-base hover:bg-white hover:bg-opacity-50 rounded-xl mx-2"
                >
                  <Compass className="w-5 h-5" />
                  <span>Discover</span>
                </a>
                <a
                  href="#library"
                  onClick={() => handleNavigation('#library')}
                  className="flex items-center space-x-3 px-4 py-4 text-blue-800 hover:text-indigo-800 transition-colors font-semibold text-base hover:bg-white hover:bg-opacity-50 rounded-xl mx-2"
                >
                  <Library className="w-5 h-5" />
                  <span>My Library</span>
                </a>
                <a
                  href="#recommendations"
                  onClick={() => handleNavigation('#recommendations')}
                  className="flex items-center space-x-3 px-4 py-4 text-blue-800 hover:text-indigo-800 transition-colors font-semibold text-base hover:bg-white hover:bg-opacity-50 rounded-xl mx-2"
                >
                  <Heart className="w-5 h-5" />
                  <span>Recommendations</span>
                </a>
                <a
                  href="#about"
                  onClick={() => handleNavigation('#about')}
                  className="flex items-center space-x-3 px-4 py-4 text-blue-800 hover:text-indigo-800 transition-colors font-semibold text-base hover:bg-white hover:bg-opacity-50 rounded-xl mx-2"
                >
                  <Book className="w-5 h-5" />
                  <span>About</span>
                </a>
                
                {user ? (
                  <div className="px-4 py-3 border-t border-blue-200 mx-2 mt-2">
                    <div className="flex items-center space-x-3 mb-3 bg-white bg-opacity-40 rounded-xl p-3 backdrop-blur-sm">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-900">{user.name}</p>
                        <p className="text-xs text-blue-700">Signed in</p>
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
                  <div className="px-4 py-3 border-t border-blue-200 space-y-3 mx-2 mt-2">
                    <button
                      onClick={() => handleAuthClick('login')}
                      className="w-full px-4 py-3 text-base font-semibold text-blue-800 border-2 border-blue-300 rounded-xl hover:bg-white hover:bg-opacity-50 transition-colors backdrop-blur-sm"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleAuthClick('register')}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-base font-semibold rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
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