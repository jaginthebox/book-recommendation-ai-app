import React from 'react';
import { Sparkles, Clock, Heart, TrendingUp, Shield, Zap } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-300 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-indigo-300 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-300 rounded-full blur-xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Social Proof Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-purple-100">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              2,847 people found their perfect book today
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your Next
            <span className="block bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Favorite Book
            </span>
            <span className="block text-4xl md:text-5xl lg:text-6xl">in 30 Seconds</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            AI-powered recommendations based on your mood, preferences, and reading history. 
            <span className="font-semibold text-purple-700"> No more endless browsing.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <button 
              onClick={onGetStarted}
              className="group bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2 min-w-[280px] justify-center"
            >
              <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
              <span>Get Personalized Recommendations</span>
            </button>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Free • No credit card required</span>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Instant Results</div>
                <div className="text-sm text-gray-600">AI finds matches in seconds</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">97% Match Rate</div>
                <div className="text-sm text-gray-600">Readers love our picks</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Money-Back</div>
                <div className="text-sm text-gray-600">Love it or first month free</div>
              </div>
            </div>
          </div>

          {/* Urgency Banner */}
          <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="w-5 h-5 animate-pulse" />
              <span className="font-bold text-lg">Limited Time Offer</span>
            </div>
            <p className="text-orange-100">
              First book recommendation free for new members. Join 500,000+ readers today!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;