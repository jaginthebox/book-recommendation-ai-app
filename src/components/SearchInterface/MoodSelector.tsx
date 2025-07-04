import React from 'react';
import { Heart, Zap, Coffee, Moon, Sun, Brain, Smile, Frown, Star, Wind } from 'lucide-react';

export interface Mood {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  searchModifier: string;
}

const moods: Mood[] = [
  {
    id: 'happy',
    name: 'Happy',
    icon: Smile,
    color: 'from-yellow-400 to-orange-400',
    description: 'Feeling great and want something uplifting',
    searchModifier: 'uplifting positive feel-good heartwarming inspiring'
  },
  {
    id: 'romantic',
    name: 'Romantic',
    icon: Heart,
    color: 'from-pink-400 to-red-400',
    description: 'In the mood for love and romance',
    searchModifier: 'romance love romantic relationship heartfelt emotional'
  },
  {
    id: 'adventurous',
    name: 'Adventurous',
    icon: Zap,
    color: 'from-blue-400 to-cyan-400',
    description: 'Ready for excitement and thrills',
    searchModifier: 'adventure action thriller exciting fast-paced journey'
  },
  {
    id: 'contemplative',
    name: 'Thoughtful',
    icon: Brain,
    color: 'from-purple-400 to-indigo-400',
    description: 'Want something deep and meaningful',
    searchModifier: 'philosophical thought-provoking deep meaningful literary'
  },
  {
    id: 'cozy',
    name: 'Cozy',
    icon: Coffee,
    color: 'from-amber-400 to-yellow-400',
    description: 'Looking for comfort and warmth',
    searchModifier: 'cozy comfort gentle warm slice-of-life peaceful'
  },
  {
    id: 'mysterious',
    name: 'Mysterious',
    icon: Moon,
    color: 'from-gray-400 to-slate-400',
    description: 'Craving mystery and suspense',
    searchModifier: 'mystery suspense thriller detective crime investigation'
  },
  {
    id: 'energetic',
    name: 'Energetic',
    icon: Sun,
    color: 'from-orange-400 to-red-400',
    description: 'Full of energy and want something dynamic',
    searchModifier: 'energetic dynamic action-packed exciting high-energy'
  },
  {
    id: 'melancholy',
    name: 'Reflective',
    icon: Wind,
    color: 'from-blue-400 to-gray-400',
    description: 'In a reflective, contemplative mood',
    searchModifier: 'melancholy reflective bittersweet emotional introspective'
  },
  {
    id: 'inspired',
    name: 'Inspired',
    icon: Star,
    color: 'from-yellow-400 to-pink-400',
    description: 'Seeking inspiration and motivation',
    searchModifier: 'inspiring motivational uplifting biographical success'
  },
  {
    id: 'sad',
    name: 'Emotional',
    icon: Frown,
    color: 'from-blue-400 to-purple-400',
    description: 'Want something that understands emotions',
    searchModifier: 'emotional touching moving cathartic healing therapeutic'
  }
];

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onMoodSelect: (mood: Mood | null) => void;
  className?: string;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onMoodSelect, className = '' }) => {
  return (
    <div className={`${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          What's your mood today?
        </h3>
        <p className="text-sm text-gray-600">
          Select how you're feeling to get personalized recommendations
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
        {moods.map((mood) => {
          const IconComponent = mood.icon;
          const isSelected = selectedMood?.id === mood.id;
          
          return (
            <button
              key={mood.id}
              onClick={() => onMoodSelect(isSelected ? null : mood)}
              className={`group relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                isSelected
                  ? 'border-indigo-300 bg-indigo-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${mood.color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium transition-colors ${
                  isSelected ? 'text-indigo-700' : 'text-gray-700'
                }`}>
                  {mood.name}
                </span>
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                {mood.description}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedMood && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${selectedMood.color} flex items-center justify-center`}>
              <selectedMood.icon className="w-4 h-4 text-white" />
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
    </div>
  );
};

export default MoodSelector;
export { moods };
export type { Mood };