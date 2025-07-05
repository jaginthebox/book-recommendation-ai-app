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
      <header className="bg-white shadow-2xl sticky top-0 z-40 relative overflow-hidden">
        {/* Library Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=400&fit=crop&crop=center')`,
            filter: 'blur(0.5px) brightness(1.2) contrast(0.8)'
          }}
        ></div>
        
        {/* Gradient Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/90"></div>
        
        {/* Additional subtle pattern overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23818cf8' fill-opacity='0.03'%3E%3Cpath d='M20 20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8zm0-20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        {/* Floating book elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-6 left-20 w-4 h-5 bg-indigo-200 rounded-sm opacity-20 transform rotate-12 animate-pulse"></div>
          <div className="absolute top-12 left-40 w-3 h-4 bg-purple-200 rounded-sm opacity-15 transform -rotate-6 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-8 left-60 w-2 h-3 bg-pink-200 rounded-sm opacity-25 transform rotate-45 animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          <div className="absolute top-6 right-20 w-4 h-5 bg-purple-200 rounded-sm opacity-20 transform -rotate-12 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-10 right-40 w-3 h-4 bg-indigo-200 rounded-sm opacity-15 transform rotate-6 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-14 right-60 w-2 h-3 bg-pink-200 rounded-sm opacity-25 transform -rotate-30 animate-pulse" style={{ animationDelay: '0.8s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-20 sm:h-24">
            {/* Beautiful Logo with Real Book */}
            <div className="flex items-center">
              <button 
                onClick={() => handleNavigation('')}
                className="relative group cursor-pointer"
              >
                <div className="flex items-center space-x-4 sm:space-x-5 p-3 sm:p-4 rounded-3xl hover:bg-white hover:bg-opacity-90 transition-all duration-300 hover:shadow-2xl backdrop-blur-sm border border-white/20">
                  <div className="relative">
                    {/* Real Book Logo Design */}
                    <div className="relative w-14 h-14 sm:w-18 sm:h-18 group-hover:scale-105 transition-transform duration-300">
                      {/* Book spine and pages effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 rounded-lg shadow-2xl transform rotate-3"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-lg shadow-xl transform -rotate-1"></div>
                      
                      {/* Main book cover */}
                      <div className="relative w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-lg shadow-2xl flex flex-col items-center justify-center border-2 border-white/20">
                        {/* Book title area */}
                        <div className="w-10 h-2 bg-white/90 rounded-full mb-1 shadow-sm"></div>
                        <div className="w-8 h-1 bg-white/70 rounded-full mb-2"></div>
                        
                        {/* Book icon */}
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 rounded-md flex items-center justify-center backdrop-blur-sm">
                          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        
                        {/* Book pages effect */}
                        <div className="absolute right-0 top-1 bottom-1 w-1 bg-white/30 rounded-r-lg"></div>
                        <div className="absolute right-0.5 top-1.5 bottom-1.5 w-0.5 bg-white/20 rounded-r-lg"></div>
                      </div>
                      
                      {/* Premium sparkle */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      
                      {/* Magical glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg blur-xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div>
                    {/* Beautiful Typography */}
                    <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-800 bg-clip-text text-transparent tracking-tight drop-shadow-sm" style={{ fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
                      Readpop
                    </h1>
                    <p className="text-sm sm:text-base text-indigo-700 font-bold tracking-wider uppercase opacity-90" style={{ fontFamily: '"JetBrains Mono", ui-monospace, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace' }}>
                      AI Discovery
                    </p>
                  </div>
                </div>
              </button>
            </div>
            
            {/* Desktop Navigation with Enhanced Bright Icons */}
            <nav className="hidden lg:flex items-center space-x-3">
              <a
                href="#"
                onClick={() => handleNavigation('')}
                className="flex items-center space-x-3 text-gray-800 hover:text-indigo-800 transition-colors font-bold text-lg hover:bg-white hover:bg-opacity-90 px-5 py-4 rounded-2xl cursor-pointer group backdrop-blur-sm shadow-lg hover:shadow-2xl border border-white/30"
              >
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform border-2 border-white/30">
                  <Search className="w-6 h-6 text-white drop-shadow-sm" />
                </div>
                <span className="drop-shadow-sm">Discover</span>
              </a>
              <a
                href="#library"
                onClick={() => handleNavigation('#library')}
                className="flex items-center space-x-3 text-gray-800 hover:text-emerald-800 transition-colors font-bold text-lg hover:bg-white hover:bg-opacity-90 px-5 py-4 rounded-2xl cursor-pointer group backdrop-blur-sm shadow-lg hover:shadow-2xl border border-white/30"
              >
                <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform border-2 border-white/30">
                  <Library className="w-6 h-6 text-white drop-shadow-sm" />
                </div>
                <span className="drop-shadow-sm">My Library</span>
              </a>
              <a
                href="#recommendations"
                onClick={() => handleNavigation('#recommendations')}
                className="flex items-center space-x-3 text-gray-800 hover:text-pink-800 transition-colors font-bold text-lg hover:bg-white hover:bg-opacity-90 px-5 py-4 rounded-2xl cursor-pointer group backdrop-blur-sm shadow-lg hover:shadow-2xl border border-white/30"
              >
                <div className="w-11 h-11 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform border-2 border-white/30">
                  <Heart className="w-6 h-6 text-white drop-shadow-sm" />
                </div>
                <span className="drop-shadow-sm">Recommendations</span>
              </a>
              <a
                href="#about"
                onClick={() => handleNavigation('#about')}
                className="flex items-center space-x-3 text-gray-800 hover:text-purple-800 transition-colors font-bold text-lg hover:bg-white hover:bg-opacity-90 px-5 py-4 rounded-2xl cursor-pointer group backdrop-blur-sm shadow-lg hover:shadow-2xl border border-white/30"
              >
                <div className="w-11 h-11 bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform border-2 border-white/30">
                  <Book className="w-6 h-6 text-white drop-shadow-sm" />
                </div>
                <span className="drop-shadow-sm">About</span>
              </a>
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="hidden sm:flex items-center space-x-4 bg-white bg-opacity-90 rounded-2xl px-5 py-4 backdrop-blur-sm border border-white/30 shadow-xl">
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 drop-shadow-sm">Welcome back!</p>
                      <p className="text-xs text-gray-700 font-medium">{user.name}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  {/* Mobile user indicator */}
                  <div className="sm:hidden w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-3 text-sm text-gray-800 hover:text-red-700 transition-colors hover:bg-white hover:bg-opacity-90 rounded-2xl font-bold backdrop-blur-sm shadow-lg hover:shadow-2xl border border-white/30"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden sm:inline drop-shadow-sm">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="hidden lg:flex items-center space-x-4">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="px-6 py-4 text-lg font-bold text-gray-800 hover:text-indigo-800 transition-colors hover:bg-white hover:bg-opacity-90 rounded-2xl backdrop-blur-sm shadow-lg hover:shadow-2xl border border-white/30 drop-shadow-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-200 shadow-2xl hover:shadow-3xl border-2 border-white/20 backdrop-blur-sm"
                  >
                    Get Started
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-4 rounded-2xl text-gray-800 hover:text-indigo-800 hover:bg-white hover:bg-opacity-90 transition-colors backdrop-blur-sm shadow-lg hover:shadow-2xl border border-white/30"
              >
                {showMobileMenu ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>

          {/* Enhanced Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden border-t border-white/30 py-6 bg-white bg-opacity-95 backdrop-blur-xl rounded-b-3xl mx-4 mb-6 shadow-2xl border-x border-b border-white/40">
              <div className="flex flex-col space-y-3">
                <a
                  href="#"
                  onClick={() => handleNavigation('')}
                  className="flex items-center space-x-4 px-6 py-5 text-gray-800 hover:text-indigo-800 transition-colors font-bold text-lg hover:bg-gray-50 rounded-2xl mx-3 shadow-md hover:shadow-lg"
                >
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <span>Discover</span>
                </a>
                <a
                  href="#library"
                  onClick={() => handleNavigation('#library')}
                  className="flex items-center space-x-4 px-6 py-5 text-gray-800 hover:text-emerald-800 transition-colors font-bold text-lg hover:bg-gray-50 rounded-2xl mx-3 shadow-md hover:shadow-lg"
                >
                  <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30">
                    <Library className="w-6 h-6 text-white" />
                  </div>
                  <span>My Library</span>
                </a>
                <a
                  href="#recommendations"
                  onClick={() => handleNavigation('#recommendations')}
                  className="flex items-center space-x-4 px-6 py-5 text-gray-800 hover:text-pink-800 transition-colors font-bold text-lg hover:bg-gray-50 rounded-2xl mx-3 shadow-md hover:shadow-lg"
                >
                  <div className="w-11 h-11 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <span>Recommendations</span>
                </a>
                <a
                  href="#about"
                  onClick={() => handleNavigation('#about')}
                  className="flex items-center space-x-4 px-6 py-5 text-gray-800 hover:text-purple-800 transition-colors font-bold text-lg hover:bg-gray-50 rounded-2xl mx-3 shadow-md hover:shadow-lg"
                >
                  <div className="w-11 h-11 bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30">
                    <Book className="w-6 h-6 text-white" />
                  </div>
                  <span>About</span>
                </a>
                
                {user ? (
                  <div className="px-6 py-4 border-t border-gray-200 mx-3 mt-4">
                    <div className="flex items-center space-x-4 mb-4 bg-gray-50 rounded-2xl p-4 shadow-md">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-700 font-medium">Signed in</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700 font-bold"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="px-6 py-4 border-t border-gray-200 space-y-4 mx-3 mt-4">
                    <button
                      onClick={() => handleAuthClick('login')}
                      className="w-full px-6 py-4 text-lg font-bold text-gray-800 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleAuthClick('register')}
                      className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-200 shadow-2xl"
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