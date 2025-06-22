'use client';

import { useState } from 'react';
import { type SurfBackgroundImage } from '../services/backgroundService';

interface BackgroundSelectorProps {
  onCategoryChange: (category: SurfBackgroundImage['category'] | undefined) => void;
  className?: string;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ 
  onCategoryChange, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SurfBackgroundImage['category'] | undefined>();

  const categories: Array<{ key: SurfBackgroundImage['category'] | undefined; label: string; emoji: string }> = [
    { key: undefined, label: 'Auto (Time-based)', emoji: '🕐' },
    { key: 'wave', label: 'Perfect Waves', emoji: '🌊' },
    { key: 'sunset', label: 'Golden Hour', emoji: '🌅' },
    { key: 'tropical', label: 'Tropical Paradise', emoji: '🏝️' },
    { key: 'aerial', label: 'Aerial Views', emoji: '🛰️' },
    { key: 'underwater', label: 'Deep Blue', emoji: '🐠' },
  ];

  const handleCategorySelect = (category: SurfBackgroundImage['category'] | undefined) => {
    setSelectedCategory(category);
    onCategoryChange(category);
    setIsOpen(false);
  };

  const currentCategory = categories.find(cat => cat.key === selectedCategory);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-md border border-white/30"
        title="Change background"
      >
        <span className="text-lg">{currentCategory?.emoji || '🎨'}</span>
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-56 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg z-50 overflow-hidden">
            <div className="p-2">
              <div className="text-xs font-medium text-white/70 uppercase tracking-wide mb-2 px-2">
                Background Style
              </div>
              {categories.map((category) => (
                <button
                  key={category.key || 'auto'}
                  onClick={() => handleCategorySelect(category.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedCategory === category.key
                      ? 'bg-white/30 text-white'
                      : 'hover:bg-white/20 text-white/90'
                  }`}
                >
                  <span className="text-lg">{category.emoji}</span>
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BackgroundSelector; 