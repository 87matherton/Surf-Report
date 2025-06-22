'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { surfSpots } from '../../src/data/spots';
import { useLiveData, useLiveDataFormatters } from '../../src/hooks/useLiveData';
import { weatherService } from '../../src/services/weatherService';
import { getQualityEmoji } from '../../src/utils/surfUtils';
import BottomNavigation from '../../src/components/BottomNavigation';
import SearchModal from '../../src/components/SearchModal';
import SearchButton from '../../src/components/SearchButton';
import SurfBackground from '../../src/components/SurfBackgroundNoSSR';

export default function ForecastPage() {
  const searchParams = useSearchParams();
  const { 
    liveDataState, 
    updateSpots, 
    getSpot, 
    isSpotUpdated, 
    hasUpdatedSpots 
  } = useLiveData();
  
  const { formatLastUpdated, getConditionsBadgeColor } = useLiveDataFormatters();

  // Initialize selectedSpot based on URL parameter or default to first spot
  const getInitialSpot = () => {
    const spotId = searchParams?.get('spot');
    if (spotId) {
      const foundSpot = surfSpots.find(spot => spot.id === spotId);
      if (foundSpot) {
        return foundSpot;
      }
    }
    return surfSpots[0];
  };

  const [selectedSpot, setSelectedSpot] = useState(getInitialSpot());
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);
  const [activeTab, setActiveTab] = useState('7-day');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Popular spots for quick access
  const popularSpotIds = ['nc1', 'sc1', 'cc1', 'nc3'];
  const popularSpots = surfSpots.filter(spot => popularSpotIds.includes(spot.id));

  // Load 7-day forecast for selected spot
  useEffect(() => {
    const loadForecast = async () => {
      if (selectedSpot) {
        setIsLoadingForecast(true);
        try {
          const forecast = await weatherService.fetchSurfForecast(
            selectedSpot.location.lat, 
            selectedSpot.location.lng
          );
          setForecastData(forecast);
        } catch (error) {
          console.error('Error loading forecast:', error);
        } finally {
          setIsLoadingForecast(false);
        }
      }
    };

    loadForecast();
  }, [selectedSpot]);

  // Handle manual refresh
  const handleRefresh = async () => {
    if (selectedSpot) {
      setIsLoadingForecast(true);
      try {
        const forecast = await weatherService.fetchSurfForecast(
          selectedSpot.location.lat, 
          selectedSpot.location.lng
        );
        setForecastData(forecast);
        
        // Also update current conditions
        await updateSpots([selectedSpot]);
      } catch (error) {
        console.error('Error refreshing forecast:', error);
      } finally {
        setIsLoadingForecast(false);
      }
    }
  };

  // Get updated spot with live data
  const updatedSelectedSpot = getSpot(selectedSpot);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  // Calculate forecast quality
  const getForecastQuality = (day: any) => {
    let score = 0;
    
    // Wave height (0-3 points)
    if (day.swellHeight >= 4 && day.swellHeight <= 8) score += 3;
    else if (day.swellHeight >= 2 && day.swellHeight <= 12) score += 2;
    else score += 1;
    
    // Wind speed (0-2 points)
    if (day.windSpeed <= 10) score += 2;
    else if (day.windSpeed <= 15) score += 1;
    
    // Swell period (0-2 points)
    if (day.swellPeriod >= 12) score += 2;
    else if (day.swellPeriod >= 8) score += 1;
    
    // Precipitation (0-1 point)
    if ((day.precipitation || 0) < 2) score += 1;
    
    if (score >= 7) return 'Excellent';
    if (score >= 5) return 'Good';
    if (score >= 3) return 'Fair';
    return 'Poor';
  };

  return (
    <SurfBackground imageUrl="/ForecastBackground.png">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Forecast</h1>
              <div className="flex items-center gap-2 md:gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isLoadingForecast ? 'bg-yellow-400 animate-pulse' : hasUpdatedSpots ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="text-white/80 text-sm md:text-base">
                    {isLoadingForecast ? 'Loading...' : `Updated ${formatLastUpdated(liveDataState.lastUpdated)}`}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <SearchButton onClick={() => setIsSearchModalOpen(true)} />
              <button
                onClick={handleRefresh}
                disabled={isLoadingForecast}
                className="p-2 md:p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
              >
                <svg 
                  className={`w-5 h-5 md:w-6 md:h-6 text-white ${isLoadingForecast ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Spot Selector */}
          <div className="relative">
            <select
              value={selectedSpot.id}
              onChange={(e) => setSelectedSpot(surfSpots.find(s => s.id === e.target.value) || surfSpots[0])}
              className="w-full md:max-w-lg px-4 py-3 md:py-4 bg-white/20 border border-white/30 rounded-full text-white text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none"
            >
              <optgroup label="Popular Spots">
                {popularSpots.map(spot => (
                  <option key={spot.id} value={spot.id} className="bg-blue-600 text-white">
                    {spot.name} - {spot.region}
                  </option>
                ))}
              </optgroup>
              <optgroup label="All Spots">
                {surfSpots.filter(spot => !popularSpotIds.includes(spot.id)).map(spot => (
                  <option key={spot.id} value={spot.id} className="bg-blue-600 text-white">
                    {spot.name} - {spot.region}
                  </option>
                ))}
              </optgroup>
            </select>
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white/60 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 pb-24 space-y-6 md:space-y-8">
        {/* Current Conditions */}
        <div className="bg-white/10 backdrop-blur-md rounded-[15px] p-4 md:p-6 lg:p-8 border border-white/20">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-white">Current Conditions</h2>
            {isSpotUpdated(updatedSelectedSpot.id) && (
              <span className="px-2 py-1 md:px-3 md:py-1.5 bg-green-500/20 rounded-full text-xs md:text-sm text-green-200 border border-green-500/30">
                Live
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">{updatedSelectedSpot.name}</h3>
              <p className="text-white/70 text-sm md:text-base">{updatedSelectedSpot.region}, {updatedSelectedSpot.state}</p>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-2xl md:text-3xl lg:text-4xl">{getQualityEmoji(updatedSelectedSpot.conditionsRating)}</span>
              <div className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-sm md:text-base font-medium ${getConditionsBadgeColor(updatedSelectedSpot.conditionsRating)} text-white`}>
                {updatedSelectedSpot.conditionsRating}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            <div className="bg-white/10 rounded-lg p-3 md:p-4">
              <p className="text-white/70 text-xs md:text-sm uppercase tracking-wide">Wave Height</p>
              <p className="text-white font-bold text-xl md:text-2xl lg:text-3xl">{updatedSelectedSpot.currentConditions.swellHeight}ft</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 md:p-4">
              <p className="text-white/70 text-xs md:text-sm uppercase tracking-wide">Period</p>
              <p className="text-white font-bold text-xl md:text-2xl lg:text-3xl">{updatedSelectedSpot.currentConditions.swellPeriod}s</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 md:p-4">
              <p className="text-white/70 text-xs md:text-sm uppercase tracking-wide">Wind</p>
              <p className="text-white font-bold text-base md:text-lg lg:text-xl">{updatedSelectedSpot.currentConditions.windSpeed}mph</p>
              <p className="text-white/80 text-sm md:text-base">{updatedSelectedSpot.currentConditions.windDirection}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 md:p-4">
              <p className="text-white/70 text-xs md:text-sm uppercase tracking-wide">Water Temp</p>
              <p className="text-white font-bold text-xl md:text-2xl lg:text-3xl">{updatedSelectedSpot.currentConditions.waterTemp}°F</p>
            </div>
          </div>
        </div>

        {/* Forecast */}
        <div className="bg-white/10 backdrop-blur-md rounded-[15px] p-4 md:p-6 lg:p-8 border border-white/20">
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-white mb-4 md:mb-6">7-Day Forecast</h2>
          
          {isLoadingForecast ? (
            <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 lg:gap-6 md:space-y-0">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="bg-white/10 rounded-lg p-3 md:p-4 animate-pulse">
                  <div className="h-4 bg-white/20 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-white/20 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 lg:gap-6 md:space-y-0">
              {forecastData.map((day, index) => {
                const quality = getForecastQuality(day);
                return (
                  <div key={index} className="bg-white/10 rounded-lg p-4 md:p-5 lg:p-6 hover:bg-white/20 transition-colors">
                    <div className="flex flex-col md:flex-col items-start justify-between mb-3 md:mb-4">
                      <div className="flex-1 w-full">
                        <div className="flex flex-col md:flex-col items-start md:items-start gap-2 md:gap-3 mb-2 md:mb-3">
                          <span className="text-white font-semibold text-base md:text-lg">{formatDate(day.date)}</span>
                          <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-xl md:text-2xl lg:text-3xl">{getQualityEmoji(quality)}</span>
                            <div className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-medium ${getConditionsBadgeColor(quality)} text-white`}>
                              {quality}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-left md:text-center w-full md:w-auto">
                        <p className="text-white font-bold text-lg md:text-xl lg:text-2xl">{day.swellHeight}ft</p>
                        <p className="text-white/70 text-sm md:text-base">{day.swellPeriod}s period</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-1 gap-2 md:gap-3 text-sm md:text-base">
                      <div className="bg-white/10 rounded-lg p-2 md:p-3">
                        <p className="text-white/60 text-xs md:text-sm uppercase tracking-wide">Wind</p>
                        <p className="text-white font-medium">{day.windSpeed}mph {day.windDirection}</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2 md:p-3">
                        <p className="text-white/60 text-xs md:text-sm uppercase tracking-wide">Air Temp</p>
                        <p className="text-white font-medium">{day.airTemp}°F</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2 md:p-3">
                        <p className="text-white/60 text-xs md:text-sm uppercase tracking-wide">Water Temp</p>
                        <p className="text-white font-medium">{day.waterTemp}°F</p>
                      </div>
                    </div>
                    
                    {day.precipitation > 0 && (
                      <div className="mt-3 md:mt-4 p-2 md:p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-200 text-lg md:text-xl">🌧️</span>
                          <span className="text-blue-200 text-sm md:text-base">
                            <span className="font-medium">{day.precipitation.toFixed(1)}mm</span> precipitation
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
      
      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSpotSelect={(spot) => {
          setSelectedSpot(spot);
                 }}
       />
    </SurfBackground>
  );
} 