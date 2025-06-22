'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { surfSpots } from '../src/data/spots';
import { useLiveData, useLiveDataFormatters } from '../src/hooks/useLiveData';
import { getQualityColor, getQualityEmoji } from '../src/utils/surfUtils';
import { useAuth } from '../src/hooks/useAuth';
import BottomNavigation from '../src/components/BottomNavigation';
import SearchModal from '../src/components/SearchModal';
import SearchButton from '../src/components/SearchButton';
import SurfBackground from '../src/components/SurfBackgroundNoSSR';


export default function HomePage() {
  const router = useRouter();
  const { user, isSignedIn, signOut } = useAuth();
  
  const { 
    liveDataState, 
    updateSpots, 
    getSpot, 
    isSpotUpdated, 
    refreshAll,
    hasUpdatedSpots 
  } = useLiveData();
  
  const { formatLastUpdated, getConditionsBadgeColor } = useLiveDataFormatters();

  const [spots, setSpots] = useState(surfSpots);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Popular spot IDs to feature
  const popularSpotIds = ['nc1', 'sc1', 'cc1', 'nc3'];
  const popularSpots = spots.filter(spot => popularSpotIds.includes(spot.id));
  const featuredSpot = popularSpots[0];

  // Load live data on component mount
  useEffect(() => {
    const loadLiveData = async () => {
      if (isInitialLoad) {
        console.log('Loading live surf data...');
        const updatedSpots = await updateSpots(popularSpots);
        setSpots(prevSpots => 
          prevSpots.map(spot => 
            updatedSpots.find(updated => updated.id === spot.id) || spot
          )
        );
        setIsInitialLoad(false);
      }
    };

    loadLiveData();
  }, [isInitialLoad, updateSpots]);

  // Handle manual refresh
  const handleRefresh = async () => {
    console.log('Refreshing surf data...');
    const updatedSpots = await updateSpots(popularSpots);
    setSpots(prevSpots => 
      prevSpots.map(spot => 
        updatedSpots.find(updated => updated.id === spot.id) || spot
      )
    );
  };

  // Get updated spot data
  const getUpdatedSpot = (originalSpot: any) => {
    return getSpot(originalSpot);
  };

  const updatedFeaturedSpot = featuredSpot ? getUpdatedSpot(featuredSpot) : null;
  const updatedPopularSpots = popularSpots.map(getUpdatedSpot);

  return (
    <SurfBackground imageUrl="/HomeBackground.png">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Surf Report</h1>
              <div className="flex items-center gap-2 md:gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${liveDataState.isLoading ? 'bg-yellow-400 animate-pulse' : hasUpdatedSpots ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="text-white/80 text-sm md:text-base">
                    {liveDataState.isLoading ? 'Updating...' : `Updated ${formatLastUpdated(liveDataState.lastUpdated)}`}
                  </span>
                </div>
                {isSignedIn && (
                  <span className="text-white/60 text-xs md:text-sm">
                    Welcome, {user?.name}!
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <SearchButton onClick={() => setIsSearchModalOpen(true)} />
              
              <button
                onClick={handleRefresh}
                disabled={liveDataState.isLoading}
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
        </div>
      </div>

      <div className="max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 pb-24 space-y-6 md:space-y-8">
        {/* Error Message */}
        {liveDataState.error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-100 text-sm">{liveDataState.error}</p>
          </div>
        )}

        {/* Featured Spot */}
        {updatedFeaturedSpot && (
          <div className="bg-white/10 backdrop-blur-md rounded-[15px] p-4 md:p-6 lg:p-8 border border-white/20">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-white">Featured Spot</h2>
              {isSpotUpdated(updatedFeaturedSpot.id) && (
                <span className="px-2 py-1 md:px-3 md:py-1.5 bg-green-500/20 rounded-full text-xs md:text-sm text-green-200 border border-green-500/30">
                  Live
                </span>
              )}
            </div>
            
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">{updatedFeaturedSpot.name}</h3>
                  <p className="text-white/70 text-sm md:text-base">{updatedFeaturedSpot.region}</p>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-2xl md:text-3xl lg:text-4xl">{getQualityEmoji(updatedFeaturedSpot.conditionsRating)}</span>
                  <div className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-sm md:text-base font-medium ${getConditionsBadgeColor(updatedFeaturedSpot.conditionsRating)} text-white`}>
                    {updatedFeaturedSpot.conditionsRating}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white/10 rounded-lg p-3 md:p-4">
                  <p className="text-white/70 text-xs md:text-sm uppercase tracking-wide">Wave Height</p>
                  <p className="text-white font-semibold text-lg md:text-xl lg:text-2xl">{updatedFeaturedSpot.currentConditions.swellHeight}ft</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 md:p-4">
                  <p className="text-white/70 text-xs md:text-sm uppercase tracking-wide">Wind</p>
                  <p className="text-white font-semibold text-lg md:text-xl lg:text-2xl">{updatedFeaturedSpot.currentConditions.windSpeed}mph {updatedFeaturedSpot.currentConditions.windDirection}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 md:p-4">
                  <p className="text-white/70 text-xs md:text-sm uppercase tracking-wide">Water Temp</p>
                  <p className="text-white font-semibold text-lg md:text-xl lg:text-2xl">{updatedFeaturedSpot.currentConditions.waterTemp}°F</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 md:p-4">
                  <p className="text-white/70 text-xs md:text-sm uppercase tracking-wide">Period</p>
                  <p className="text-white font-semibold text-lg md:text-xl lg:text-2xl">{updatedFeaturedSpot.currentConditions.swellPeriod}s</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Popular Spots */}
        <div className="bg-white/10 backdrop-blur-md rounded-[15px] p-4 md:p-6 lg:p-8 border border-white/20">
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-white mb-4 md:mb-6">Popular Spots</h2>
          
          <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 md:gap-4 lg:gap-6 md:space-y-0">
            {updatedPopularSpots.map((spot) => (
              <div key={spot.id} className="bg-white/10 rounded-lg p-3 md:p-4 lg:p-5 hover:bg-white/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1 md:mb-2">
                      <h3 className="font-semibold text-white text-sm md:text-base lg:text-lg">{spot.name}</h3>
                      <div className="flex items-center gap-2">
                        {isSpotUpdated(spot.id) && (
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        )}
                        <span className="text-lg md:text-xl lg:text-2xl">{getQualityEmoji(spot.conditionsRating)}</span>
                      </div>
                    </div>
                    <p className="text-white/70 text-xs md:text-sm mb-2 md:mb-3">{spot.region}</p>
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4">
                      <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-white/80 flex-wrap">
                        <span>{spot.currentConditions.swellHeight}ft</span>
                        <span>{spot.currentConditions.windSpeed}mph {spot.currentConditions.windDirection}</span>
                        <span>{spot.currentConditions.waterTemp}°F</span>
                      </div>
                      <div className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-medium ${getConditionsBadgeColor(spot.conditionsRating)} text-white shrink-0`}>
                        {spot.conditionsRating}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white/10 backdrop-blur-md rounded-[15px] p-4 md:p-6 lg:p-8 border border-white/20">
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-white mb-4 md:mb-6">Today's Summary</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="text-center md:col-span-2 lg:col-span-1">
              <p className="text-white/70 text-sm md:text-base">Best Conditions</p>
              <p className="text-white font-semibold text-base md:text-lg lg:text-xl">
                {updatedPopularSpots.find(s => s.conditionsRating === 'Excellent')?.name || 
                 updatedPopularSpots.find(s => s.conditionsRating === 'Good')?.name || 
                 'Check back later'}
              </p>
            </div>
            <div className="text-center md:col-span-2 lg:col-span-1">
              <p className="text-white/70 text-sm md:text-base">Avg Wave Height</p>
              <p className="text-white font-semibold text-base md:text-lg lg:text-xl">
                {Math.round(updatedPopularSpots.reduce((sum, spot) => sum + spot.currentConditions.swellHeight, 0) / updatedPopularSpots.length * 10) / 10}ft
              </p>
            </div>
            <div className="text-center col-span-2 md:col-span-2 lg:col-span-1">
              <p className="text-white/70 text-sm md:text-base">Active Spots</p>
              <p className="text-white font-semibold text-base md:text-lg lg:text-xl">
                {updatedPopularSpots.length}
              </p>
            </div>
            <div className="text-center col-span-2 md:col-span-2 lg:col-span-1">
              <p className="text-white/70 text-sm md:text-base">Last Updated</p>
              <p className="text-white font-semibold text-base md:text-lg lg:text-xl">
                {formatLastUpdated(liveDataState.lastUpdated)}
              </p>
            </div>
          </div>
        </div>
      </div>

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
