import React, { useState } from 'react';

interface Mood {
  id: string;
  name: string;
  emoji: string;
  description: string;
  searchModifier: string;
  angle: number;
}

const moods: Mood[] = [
  {
    id: 'happy',
    name: 'Happy',
    emoji: '😊',
    description: 'Feeling great and want something uplifting',
    searchModifier: 'uplifting positive feel-good heartwarming inspiring',
    angle: 0
  },
  {
    id: 'romantic',
    name: 'Romantic',
    emoji: '💕',
    description: 'In the mood for love and romance',
    searchModifier: 'romance love romantic relationship heartfelt emotional',
    angle: 45
  },
  {
    id: 'adventurous',
    name: 'Adventurous',
    emoji: '⚡',
    description: 'Ready for excitement and thrills',
    searchModifier: 'adventure action thriller exciting fast-paced journey',
    angle: 90
  },
  {
    id: 'contemplative',
    name: 'Thoughtful',
    emoji: '🧠',
    description: 'Want something deep and meaningful',
    searchModifier: 'philosophical thought-provoking deep meaningful literary',
    angle: 135
  },
  {
    id: 'cozy',
    name: 'Cozy',
    emoji: '☕',
    description: 'Looking for comfort and warmth',
    searchModifier: 'cozy comfort gentle warm slice-of-life peaceful',
    angle: 180
  },
  {
    id: 'mysterious',
    name: 'Mysterious',
    emoji: '🌙',
    description: 'Craving mystery and suspense',
    searchModifier: 'mystery suspense thriller detective crime investigation',
    angle: 225
  },
  {
    id: 'energetic',
    name: 'Energetic',
    emoji: '☀️',
    description: 'Full of energy and want something dynamic',
    searchModifier: 'energetic dynamic action-packed exciting high-energy',
    angle: 270
  },
  {
    id: 'emotional',
    name: 'Emotional',
    emoji: '💙',
    description: 'Want something that understands emotions',
    searchModifier: 'emotional touching moving cathartic healing therapeutic',
    angle: 315
  }
];

interface FlowerMenuProps {
  onMoodSelect: (mood: { searchModifier: string; name: string } | null) => void;
  className?: string;
}

const FlowerMenu: React.FC<FlowerMenuProps> = ({ onMoodSelect, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
  };

  const radius = 120;

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Title and Description */}
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          What's your mood today?
        </h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Hover over the flower petals to discover different reading moods, then click to add to your search
        </p>
      </div>

      {/* Flower Menu Container */}
      <div className="relative">
        {/* Center Button */}
        <div 
          className="relative z-20 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => {
            setTimeout(() => setIsOpen(false), 200);
          }}
        >
          <span className="text-2xl">🌸</span>
        </div>

        {/* Mood Petals */}
        <div 
          className={`absolute inset-0 transition-all duration-500 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => {
            setTimeout(() => setIsOpen(false), 200);
          }}
        >
          {moods.map((mood, index) => {
            const angle = (index * 45) * (Math.PI / 180);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const isHovered = hoveredMood?.id === mood.id;
            const isSelected = selectedMood?.id === mood.id;

            return (
              <div
                key={mood.id}
                className={`absolute w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-125 ${
                  isSelected 
                    ? 'bg-gradient-to-br from-indigo-400 to-purple-500 shadow-lg ring-4 ring-indigo-200' 
                    : isHovered
                    ? 'bg-gradient-to-br from-pink-300 to-rose-400 shadow-lg'
                    : 'bg-gradient-to-br from-pink-200 to-rose-300 hover:shadow-md'
                }`}
                style={{
                  left: `calc(50% + ${x}px - 24px)`,
                  top: `calc(50% + ${y}px - 24px)`,
                  animationDelay: `${index * 100}ms`
                }}
                onClick={() => handleMoodClick(mood)}
                onMouseEnter={() => setHoveredMood(mood)}
                onMouseLeave={() => setHoveredMood(null)}
              >
                <span className="text-xl">{mood.emoji}</span>
                
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-30 opacity-0 animate-fade-in">
                    <div className="font-medium">{mood.name}</div>
                    <div className="text-gray-300 text-xs mt-1">{mood.description}</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Connecting Lines (Stems) */}
        <div className={`absolute inset-0 transition-all duration-500 ${isOpen ? 'opacity-30' : 'opacity-0'}`}>
          {moods.map((mood, index) => {
            const angle = (index * 45) * (Math.PI / 180);
            const x = Math.cos(angle) * (radius / 2);
            const y = Math.sin(angle) * (radius / 2);

            return (
              <div
                key={`stem-${mood.id}`}
                className="absolute w-0.5 bg-gradient-to-r from-green-300 to-green-400 origin-bottom"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  height: `${radius / 2}px`,
                  transform: `rotate(${index * 45 + 90}deg)`,
                  transformOrigin: 'bottom center'
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Selected Mood Display */}
      {selectedMood && (
        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200 max-w-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-lg">{selectedMood.emoji}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-indigo-900">
                Perfect! We'll find books that match your {selectedMood.name.toLowerCase()} mood.
              </p>
              <p className="text-xs text-indigo-700 mt-1">
                {selectedMood.description}
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FlowerMenu;