'use client';

import BottomNavigation from '../../src/components/BottomNavigation';
import SearchModal from '../../src/components/SearchModal';
import SearchButton from '../../src/components/SearchButton';
import SurfBackground from '../../src/components/SurfBackgroundNoSSR';
import { useState } from 'react';

export default function MapPage() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  return (
    <SurfBackground category="tropical" className="relative overflow-hidden">
      {/* Background Ocean Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 to-blue-700/20"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Surf Map</h1>
          <div className="flex items-center space-x-4">
            <SearchButton onClick={() => setIsSearchModalOpen(true)} />
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Map Content */}
      <main className="relative z-10 px-6 pb-24">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Interactive Map</h2>
          <p className="text-white/80 mb-6">
            Interactive map with all surf spots will be displayed here. 
            Click on markers to see detailed conditions for each spot.
          </p>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-white/70 text-sm">
              📍 Coming soon: Mapbox integration with real-time surf spot markers
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
      
      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen}
                 onClose={() => setIsSearchModalOpen(false)}
       />
    </SurfBackground>
  );
} 