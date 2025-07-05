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
    gradient: 'from-yellow-400 to-orange-400'
  },
  {
    id: 'romantic',
    name: 'Romantic',
    emoji: '💕',
    description: 'In the mood for love and romance',
    searchModifier: 'romance love romantic relationship heartfelt emotional',
    gradient: 'from-pink-400 to-red-400'
  },
  {
    id: 'adventurous',
    name: 'Adventurous',
    emoji: '⚡',
    description: 'Ready for excitement and thrills',
    searchModifier: 'adventure action thriller exciting fast-paced journey',
    gradient: 'from-blue-400 to-cyan-400'
  },
  {
    id: 'thoughtful',
    name: 'Thoughtful',
    emoji: '🧠',
    description: 'Want something deep and meaningful',
    searchModifier: 'philosophical thought-provoking deep meaningful literary',
    gradient: 'from-purple-400 to-indigo-400'
  },
  {
    id: 'cozy',
    name: 'Cozy',
    emoji: '☕',
    description: 'Looking for comfort and warmth',
    searchModifier: 'cozy comfort gentle warm slice-of-life peaceful',
    gradient: 'from-amber-400 to-yellow-400'
  },
  {
    id: 'mysterious',
    name: 'Mysterious',
    emoji: '🌙',
    description: 'Craving mystery and suspense',
    searchModifier: 'mystery suspense thriller detective crime investigation',
    gradient: 'from-gray-400 to-slate-400'
  },
  {
    id: 'energetic',
    name: 'Energetic',
    emoji: '☀️',
    description: 'Full of energy and want something dynamic',
    searchModifier: 'energetic dynamic action-packed exciting high-energy',
    gradient: 'from-orange-400 to-red-400'
  },
  {
    id: 'emotional',
    name: 'Emotional',
    emoji: '💙',
    description: 'Want something that understands emotions',
    searchModifier: 'emotional touching moving cathartic healing therapeutic',
    gradient: 'from-blue-400 to-purple-400'
  }
];

interface CompactMoodSelectorProps {
  selectedMood: Mood | null;
  onMoodSelect: (mood: Mood | null) => void;
  className?: string;
}

const CompactMoodSelector: React.FC<CompactMoodSelectorProps> = ({ 
  selectedMood, 
  onMoodSelect, 
  className = '' 
}) => {
  const [hoveredMood, setHoveredMood] = useState<Mood | null>(null);

  const handleMoodClick = (mood: Mood) => {
    if (selectedMood?.id === mood.id) {
      onMoodSelect(null);
    } else {
      onMoodSelect(mood);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Compact Mood Bar */}
      <div className="relative bg-gradient-to-r from-purple-100 via-pink-50 to-indigo-100 rounded-xl p-3 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Label */}
          <div className="flex items-center space-x-2 text-sm text-gray-700 font-medium">
            <span className="text-purple-600">✨</span>
            <span>Mood:</span>
          </div>

          {/* Mood Icons */}
          <div className="flex items-center space-x-2">
            {moods.map((mood) => {
              const isHovered = hoveredMood?.id === mood.id;
              const isSelected = selectedMood?.id === mood.id;

              return (
                <div
                  key={mood.id}
                  className="relative"
                  onMouseEnter={() => setHoveredMood(mood)}
                  onMouseLeave={() => setHoveredMood(null)}
                >
                  {/* Mood Button */}
                  <button
                    onClick={() => handleMoodClick(mood)}
                    className={`relative w-10 h-10 rounded-full transition-all duration-200 transform hover:scale-110 ${
                      isSelected 
                        ? 'ring-2 ring-indigo-400 ring-opacity-60 shadow-lg scale-105' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${mood.gradient} rounded-full opacity-90`} />
                    
                    {/* Hover Overlay */}
                    <div className={`absolute inset-0 bg-white rounded-full transition-opacity duration-200 ${
                      isHovered ? 'opacity-20' : 'opacity-0'
                    }`} />
                    
                    {/* Emoji */}
                    <div className="relative z-10 h-full flex items-center justify-center">
                      <span className="text-lg">{mood.emoji}</span>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center shadow-sm">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>

                  {/* Expanded Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-50">
                      <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl opacity-0 animate-fade-in pointer-events-none">
                        <div className="text-center">
                          <div className="text-lg mb-1">{mood.emoji}</div>
                          <div className="font-medium text-sm">{mood.name}</div>
                          <div className="text-xs text-gray-300 mt-1 max-w-32">
                            {mood.description}
                          </div>
                        </div>
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Clear Selection */}
          {selectedMood && (
            <button
              onClick={() => onMoodSelect(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              title="Clear mood selection"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Selected Mood Indicator */}
        {selectedMood && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 bg-gradient-to-br ${selectedMood.gradient} rounded-full flex items-center justify-center`}>
                <span className="text-sm">{selectedMood.emoji}</span>
              </div>
              <span className="text-sm text-gray-700">
                <span className="font-medium">{selectedMood.name}</span> mood selected
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompactMoodSelector;