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
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Surf Report</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${liveDataState.isLoading ? 'bg-yellow-400 animate-pulse' : hasUpdatedSpots ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="text-white/80 text-sm">
                    {liveDataState.isLoading ? 'Updating...' : `Updated ${formatLastUpdated(liveDataState.lastUpdated)}`}
                  </span>
                </div>
                {isSignedIn && (
                  <span className="text-white/60 text-xs">
                    Welcome, {user?.name}!
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <SearchButton onClick={() => setIsSearchModalOpen(true)} />
              
              {/* Auth Buttons */}
              {isSignedIn ? (
                <button
                  onClick={signOut}
                  className="px-3 py-2 text-sm bg-white/20 hover:bg-white/30 transition-colors rounded-full text-white/90"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => router.push('/signin')}
                  className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 transition-colors rounded-full text-white font-medium"
                >
                  Sign In
                </button>
              )}
              
              <button
                onClick={handleRefresh}
                disabled={liveDataState.isLoading}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
              >
                <svg 
                  className={`w-5 h-5 text-white ${liveDataState.isLoading ? 'animate-spin' : ''}`} 
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

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Error Message */}
        {liveDataState.error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-100 text-sm">{liveDataState.error}</p>
          </div>
        )}

        {/* Featured Spot */}
        {updatedFeaturedSpot && (
          <div className="bg-white/10 backdrop-blur-md rounded-[15px] p-4 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-white">Featured Spot</h2>
              {isSpotUpdated(updatedFeaturedSpot.id) && (
                <span className="px-2 py-1 bg-green-500/20 rounded-full text-xs text-green-200 border border-green-500/30">
                  Live
                </span>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                                     <h3 className="text-xl font-bold text-white">{updatedFeaturedSpot.name}</h3>
                   <p className="text-white/70 text-sm">{updatedFeaturedSpot.region}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getQualityEmoji(updatedFeaturedSpot.conditionsRating)}</span>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionsBadgeColor(updatedFeaturedSpot.conditionsRating)} text-white`}>
                    {updatedFeaturedSpot.conditionsRating}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-white/70 text-xs uppercase tracking-wide">Wave Height</p>
                  <p className="text-white font-semibold text-lg">{updatedFeaturedSpot.currentConditions.swellHeight}ft</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-white/70 text-xs uppercase tracking-wide">Wind</p>
                  <p className="text-white font-semibold text-lg">{updatedFeaturedSpot.currentConditions.windSpeed}mph {updatedFeaturedSpot.currentConditions.windDirection}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-white/70 text-xs uppercase tracking-wide">Water Temp</p>
                  <p className="text-white font-semibold text-lg">{updatedFeaturedSpot.currentConditions.waterTemp}°F</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-white/70 text-xs uppercase tracking-wide">Period</p>
                  <p className="text-white font-semibold text-lg">{updatedFeaturedSpot.currentConditions.swellPeriod}s</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Popular Spots */}
        <div className="bg-white/10 backdrop-blur-md rounded-[15px] p-4 border border-white/20">
          <h2 className="text-lg font-semibold text-white mb-4">Popular Spots</h2>
          
          <div className="space-y-3">
            {updatedPopularSpots.map((spot) => (
              <div key={spot.id} className="bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white">{spot.name}</h3>
                      <div className="flex items-center gap-2">
                        {isSpotUpdated(spot.id) && (
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        )}
                        <span className="text-lg">{getQualityEmoji(spot.conditionsRating)}</span>
                      </div>
                    </div>
                                         <p className="text-white/70 text-sm mb-2">{spot.region}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-white/80">
                        <span>{spot.currentConditions.swellHeight}ft</span>
                        <span>{spot.currentConditions.windSpeed}mph {spot.currentConditions.windDirection}</span>
                        <span>{spot.currentConditions.waterTemp}°F</span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionsBadgeColor(spot.conditionsRating)} text-white`}>
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
        <div className="bg-white/10 backdrop-blur-md rounded-[15px] p-4 border border-white/20">
          <h2 className="text-lg font-semibold text-white mb-4">Today's Summary</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-white/70 text-sm">Best Conditions</p>
              <p className="text-white font-semibold">
                {updatedPopularSpots.find(s => s.conditionsRating === 'Excellent')?.name || 
                 updatedPopularSpots.find(s => s.conditionsRating === 'Good')?.name || 
                 'Check back later'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/70 text-sm">Avg Wave Height</p>
              <p className="text-white font-semibold">
                {Math.round(updatedPopularSpots.reduce((sum, spot) => sum + spot.currentConditions.swellHeight, 0) / updatedPopularSpots.length * 10) / 10}ft
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
