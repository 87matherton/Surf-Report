'use client';

import { useState, useEffect } from 'react';
import { surfSpots } from '../../src/data/spots';
import { useLiveData, useLiveDataFormatters } from '../../src/hooks/useLiveData';
import { getQualityEmoji } from '../../src/utils/surfUtils';
import BottomNavigation from '../../src/components/BottomNavigation';
import SearchModal from '../../src/components/SearchModal';
import SearchButton from '../../src/components/SearchButton';
import SurfBackground from '../../src/components/SurfBackgroundNoSSR';

export default function FavoritesPage() {
  const { 
    liveDataState, 
    updateSpots, 
    getSpot, 
    isSpotUpdated, 
    hasUpdatedSpots 
  } = useLiveData();
  
  const { formatLastUpdated, getConditionsBadgeColor } = useLiveDataFormatters();

  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('surfFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Get favorite spots with live data
  const favoriteSpots = surfSpots
    .filter(spot => favorites.includes(spot.id))
    .map(spot => getSpot(spot));

  // Load live data for favorites
  useEffect(() => {
    const loadLiveData = async () => {
      if (isInitialLoad && favoriteSpots.length > 0) {
        console.log('Loading live data for favorites...');
        await updateSpots(favoriteSpots);
        setIsInitialLoad(false);
      }
    };

    loadLiveData();
  }, [isInitialLoad, favoriteSpots.length, updateSpots]);

  // Handle manual refresh
  const handleRefresh = async () => {
    if (favoriteSpots.length > 0) {
      console.log('Refreshing favorites data...');
      await updateSpots(favoriteSpots);
    }
  };

  // Filter spots based on search
  const filteredSpots = favoriteSpots.filter(spot =>
    spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spot.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (spotId: string) => {
    const newFavorites = favorites.includes(spotId)
      ? favorites.filter(id => id !== spotId)
      : [...favorites, spotId];
    
    setFavorites(newFavorites);
    localStorage.setItem('surfFavorites', JSON.stringify(newFavorites));
  };

  if (liveDataState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading favorites...</div>
      </div>
    );
  }

  return (
    <SurfBackground imageUrl="/FavoritesBackground.png">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Favorites</h1>
              <div className="flex items-center gap-2 md:gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${liveDataState.isLoading ? 'bg-yellow-400 animate-pulse' : hasUpdatedSpots ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="text-white/80 text-sm md:text-base">
                    {liveDataState.isLoading ? 'Updating...' : `Updated ${formatLastUpdated(liveDataState.lastUpdated)}`}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <SearchButton onClick={() => setIsSearchModalOpen(true)} />
              <button
                onClick={handleRefresh}
                disabled={liveDataState.isLoading || favoriteSpots.length === 0}
                className="p-2 md:p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
              >
                <svg 
                  className={`w-5 h-5 md:w-6 md:h-6 text-white ${liveDataState.isLoading ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search your favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:max-w-lg px-4 py-3 md:py-4 bg-white/20 border border-white/30 rounded-full text-white text-sm md:text-base placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white/60 absolute right-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 pb-24">
        {/* Error Message */}
        {liveDataState.error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
            <p className="text-red-100 text-sm md:text-base">{liveDataState.error}</p>
          </div>
        )}

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-[15px] md:rounded-[20px] p-8 md:p-12 lg:p-16 border border-white/20 text-center max-w-2xl mx-auto">
            <div className="text-6xl md:text-7xl lg:text-8xl mb-4 md:mb-6">🏄‍♂️</div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-4">No Favorites Yet</h2>
            <p className="text-white/70 text-base md:text-lg mb-6 md:mb-8">Start adding your favorite surf spots to keep track of conditions</p>
            <button className="px-6 md:px-8 py-3 md:py-4 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm md:text-base font-medium transition-colors">
              Explore Spots
            </button>
          </div>
        ) : filteredSpots.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-[15px] md:rounded-[20px] p-8 md:p-12 border border-white/20 text-center max-w-2xl mx-auto">
            <div className="text-4xl md:text-5xl lg:text-6xl mb-4 md:mb-6">🔍</div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 md:mb-4">No matches found</h2>
            <p className="text-white/70 text-base md:text-lg">Try adjusting your search terms</p>
          </div>
        ) : (
          /* Favorites List */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredSpots.map((spot) => (
              <div key={spot.id} className="bg-white/10 backdrop-blur-md rounded-[15px] md:rounded-[20px] p-4 md:p-6 border border-white/20">
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg md:text-xl font-bold text-white">{spot.name}</h3>
                      {isSpotUpdated(spot.id) && (
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-white/70 text-sm md:text-base">{spot.region}, {spot.state}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl md:text-3xl">{getQualityEmoji(spot.conditionsRating)}</span>
                      <div className={`px-3 py-1 rounded-full text-sm md:text-base font-medium ${getConditionsBadgeColor(spot.conditionsRating)} text-white`}>
                        {spot.conditionsRating}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(spot.id)}
                      className="p-2 md:p-3 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors"
                    >
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Current Conditions */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-5">
                  <div className="bg-white/10 rounded-lg p-3 md:p-4">
                    <p className="text-white/70 text-xs md:text-sm uppercase tracking-wide">Wave Height</p>
                    <p className="text-white font-bold text-lg md:text-xl">{spot.currentConditions.swellHeight}ft</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 md:p-4">
                    <p className="text-white/70 text-xs md:text-sm uppercase tracking-wide">Period</p>
                    <p className="text-white font-bold text-lg md:text-xl">{spot.currentConditions.swellPeriod}s</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 md:p-4">
                    <p className="text-white/70 text-xs md:text-sm uppercase tracking-wide">Wind</p>
                    <p className="text-white font-bold text-base md:text-lg">{spot.currentConditions.windSpeed}mph {spot.currentConditions.windDirection}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 md:p-4">
                    <p className="text-white/70 text-xs md:text-sm uppercase tracking-wide">Water Temp</p>
                    <p className="text-white font-bold text-lg md:text-xl">{spot.currentConditions.waterTemp}°F</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center justify-between text-sm md:text-base text-white/80">
                  <span>Swell: {spot.currentConditions.swellDirection}</span>
                  <span>Tide: {spot.currentConditions.tide}</span>
                  <span>Air: {spot.currentConditions.airTemp}°F</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
      
      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSpotSelect={(spot) => {
          // Add to favorites if not already there
          if (!favorites.includes(spot.id)) {
            const newFavorites = [...favorites, spot.id];
            setFavorites(newFavorites);
            localStorage.setItem('surfFavorites', JSON.stringify(newFavorites));
          }
                 }}
       />
    </SurfBackground>
  );
} 