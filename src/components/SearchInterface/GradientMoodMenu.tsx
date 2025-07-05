import React, { useState } from 'react';

interface Mood {
  id: string;
  name: string;
  emoji: string;
  description: string;
  searchModifier: string;
  gradient: string;
}

const moods: Mood[] = [
  {
    id: 'happy',
    name: 'Happy',
    emoji: '😊',
    description: 'Feeling great and want something uplifting',
    searchModifier: 'uplifting positive feel-good heartwarming inspiring',
    gradient: 'from-yellow-400 via-orange-400 to-red-400'
  },
  {
    id: 'romantic',
    name: 'Romantic',
    emoji: '💕',
    description: 'In the mood for love and romance',
    searchModifier: 'romance love romantic relationship heartfelt emotional',
    gradient: 'from-pink-400 via-rose-400 to-red-400'
  },
  {
    id: 'adventurous',
    name: 'Adventurous',
    emoji: '⚡',
    description: 'Ready for excitement and thrills',
    searchModifier: 'adventure action thriller exciting fast-paced journey',
    gradient: 'from-blue-400 via-cyan-400 to-teal-400'
  },
  {
    id: 'thoughtful',
    name: 'Thoughtful',
    emoji: '🧠',
    description: 'Want something deep and meaningful',
    searchModifier: 'philosophical thought-provoking deep meaningful literary',
    gradient: 'from-purple-400 via-indigo-400 to-blue-400'
  },
  {
    id: 'cozy',
    name: 'Cozy',
    emoji: '☕',
    description: 'Looking for comfort and warmth',
    searchModifier: 'cozy comfort gentle warm slice-of-life peaceful',
    gradient: 'from-amber-400 via-yellow-400 to-orange-400'
  },
  {
    id: 'mysterious',
    name: 'Mysterious',
    emoji: '🌙',
    description: 'Craving mystery and suspense',
    searchModifier: 'mystery suspense thriller detective crime investigation',
    gradient: 'from-gray-400 via-slate-400 to-gray-600'
  },
  {
    id: 'energetic',
    name: 'Energetic',
    emoji: '☀️',
    description: 'Full of energy and want something dynamic',
    searchModifier: 'energetic dynamic action-packed exciting high-energy',
    gradient: 'from-orange-400 via-red-400 to-pink-400'
  },
  {
    id: 'emotional',
    name: 'Emotional',
    emoji: '💙',
    description: 'Want something that understands emotions',
    searchModifier: 'emotional touching moving cathartic healing therapeutic',
    gradient: 'from-blue-400 via-purple-400 to-indigo-400'
  }
];

interface GradientMoodMenuProps {
  onMoodSelect: (mood: { searchModifier: string; name: string } | null) => void;
  className?: string;
}

const GradientMoodMenu: React.FC<GradientMoodMenuProps> = ({ onMoodSelect, className = '' }) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [hoveredMood, setHoveredMood] = useState<Mood | null>(null);

  const handleMoodClick = (mood: Mood) => {
    if (selectedMood?.id === mood.id) {
      setSelectedMood(null);
      onMoodSelect(null);
    } else {
      setSelectedMood(mood);
      onMoodSelect({
        searchModifier: mood.searchModifier,
        name: mood.name
      });
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Title and Description */}
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          What's your mood today?
        </h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Select your current mood to get personalized book recommendations that match how you're feeling
        </p>
      </div>

      {/* Gradient Menu Container */}
      <div className="relative">
        {/* Main Gradient Background */}
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-2xl p-1 shadow-2xl">
          <div className="bg-white rounded-xl p-6">
            {/* Mood Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {moods.map((mood, index) => {
                const isHovered = hoveredMood?.id === mood.id;
                const isSelected = selectedMood?.id === mood.id;

                return (
                  <div
                    key={mood.id}
                    className="relative group"
                    onMouseEnter={() => setHoveredMood(mood)}
                    onMouseLeave={() => setHoveredMood(null)}
                  >
                    {/* Mood Button */}
                    <button
                      onClick={() => handleMoodClick(mood)}
                      className={`relative w-full aspect-square rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                        isSelected 
                          ? 'ring-4 ring-indigo-400 ring-opacity-50 shadow-xl scale-105' 
                          : 'hover:shadow-lg'
                      }`}
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      {/* Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${mood.gradient} opacity-90`} />
                      
                      {/* Overlay for hover effect */}
                      <div className={`absolute inset-0 bg-white transition-opacity duration-300 ${
                        isHovered ? 'opacity-20' : 'opacity-0'
                      }`} />
                      
                      {/* Content */}
                      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
                        <span className="text-2xl sm:text-3xl mb-2">{mood.emoji}</span>
                        <span className="text-xs sm:text-sm font-medium text-center px-2">
                          {mood.name}
                        </span>
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        </div>
                      )}
                    </button>

                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-30 opacity-0 animate-fade-in pointer-events-none">
                        <div className="font-medium">{mood.name}</div>
                        <div className="text-gray-300 text-xs mt-1 max-w-32 whitespace-normal">
                          {mood.description}
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Animated Border Effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          </div>
        </div>

        {/* Floating Gradient Orbs */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-60 animate-pulse" />
        <div className="absolute -top-2 -right-6 w-6 h-6 bg-gradient-to-br from-pink-400 to-red-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-3 -left-2 w-5 h-5 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-4 -right-4 w-7 h-7 bg-gradient-to-br from-red-400 to-orange-400 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Selected Mood Display */}
      {selectedMood && (
        <div className="mt-6 relative">
          <div className={`bg-gradient-to-r ${selectedMood.gradient} rounded-xl p-1 shadow-lg`}>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${selectedMood.gradient} rounded-full flex items-center justify-center shadow-md`}>
                  <span className="text-xl text-white">{selectedMood.emoji}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Perfect! We'll find books that match your {selectedMood.name.toLowerCase()} mood.
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {selectedMood.description}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedMood(null);
                    onMoodSelect(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradientMoodMenu;