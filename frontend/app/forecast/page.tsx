"use client";
import React, { useState } from 'react';
import { surfSpots } from '../../src/data/spots';
import SearchModal from '../../src/components/SearchModal';
import MobileBottomNav from '../../src/components/MobileBottomNav';

export default function ForecastPage() {
  const [selectedSpot, setSelectedSpot] = useState(surfSpots[0]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showSpotSelector, setShowSpotSelector] = useState(false);

  // Get popular spots for the dropdown
  const popularSpots = surfSpots.filter(spot => 
    spot.region === 'Half Moon Bay' || 
    spot.region === 'Santa Cruz' || 
    spot.region === 'Malibu'
  );
  const popularSpotIds = popularSpots.map(spot => spot.id);

  const formatDate = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    
    if (offset === 0) return 'Today';
    if (offset === 1) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getForecastQuality = (day: number) => {
    // Simple mock logic for forecast quality
    const qualities = ['Excellent', 'Good', 'Fair', 'Poor'];
    return qualities[day % 4];
  };

  const getQualityEmoji = (quality: string) => {
    switch (quality) {
      case 'Excellent': return '🔥';
      case 'Good': return '👍';
      case 'Fair': return '👌';
      default: return '😐';
    }
  };

  const getConditionsBadgeColor = (rating: string) => {
    switch (rating) {
      case 'Excellent': return 'bg-green-500';
      case 'Good': return 'bg-blue-500';
      case 'Fair': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-100">
      {/* Coastal Background with Frosted Glass Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 opacity-30"></div>
      <div className="fixed inset-0 bg-white/20 backdrop-blur-sm"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Forecast</h1>
            <p className="text-sm text-gray-600">5-day surf forecast</p>
          </div>
          <button 
            onClick={() => setIsSearchModalOpen(true)}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-6 space-y-6 apple-scroll">
          {/* Current Spot Selector */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20 apple-transition">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Current Location</h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{selectedSpot.name}</h3>
                <p className="text-gray-600">{selectedSpot.region}, {selectedSpot.state}</p>
              </div>
              <button 
                onClick={() => setShowSpotSelector(!showSpotSelector)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors apple-transition"
              >
                Change Spot
              </button>
            </div>
          </div>

          {/* Current Conditions */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm apple-transition">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Current Conditions</h2>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-gray-600 text-sm">Live</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedSpot.name}</h3>
                <p className="text-gray-600 text-sm">{selectedSpot.region}, {selectedSpot.state}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getQualityEmoji(selectedSpot.conditionsRating)}</span>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionsBadgeColor(selectedSpot.conditionsRating)} text-white`}>
                  {selectedSpot.conditionsRating}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 apple-transition hover:bg-gray-100 transition-colors duration-200">
                <p className="text-gray-600 text-xs uppercase tracking-wide">Wave Height</p>
                <p className="text-gray-900 font-bold text-xl">{selectedSpot.currentConditions.swellHeight}ft</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 apple-transition hover:bg-gray-100 transition-colors duration-200">
                <p className="text-gray-600 text-xs uppercase tracking-wide">Wind</p>
                <p className="text-gray-900 font-bold text-xl">{selectedSpot.currentConditions.windSpeed}mph</p>
                <p className="text-gray-600 text-xs">{selectedSpot.currentConditions.windDirection}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 apple-transition hover:bg-gray-100 transition-colors duration-200">
                <p className="text-gray-600 text-xs uppercase tracking-wide">Water Temp</p>
                <p className="text-gray-900 font-bold text-xl">{selectedSpot.currentConditions.waterTemp}°F</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 apple-transition hover:bg-gray-100 transition-colors duration-200">
                <p className="text-gray-600 text-xs uppercase tracking-wide">Air Temp</p>
                <p className="text-gray-900 font-bold text-xl">{selectedSpot.currentConditions.airTemp}°F</p>
              </div>
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">5-Day Forecast</h2>
            
            <div className="space-y-3">
              {[0, 1, 2, 3, 4].map((day) => {
                const quality = getForecastQuality(day);
                return (
                  <div key={day} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getQualityEmoji(quality)}</span>
                      <div>
                        <p className="font-medium text-gray-900">{formatDate(day)}</p>
                        <p className="text-sm text-gray-600">{quality} conditions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{2 + day}ft</p>
                      <p className="text-sm text-gray-600">{10 + day}mph NW</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tide Information */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Tides</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-blue-600 text-sm font-medium">High Tide</div>
                <div className="text-gray-900 font-bold text-lg">6:42 AM</div>
                <div className="text-gray-600 text-sm">5.2 ft</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-blue-600 text-sm font-medium">Low Tide</div>
                <div className="text-gray-900 font-bold text-lg">12:18 PM</div>
                <div className="text-gray-600 text-sm">1.8 ft</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-blue-600 text-sm font-medium">High Tide</div>
                <div className="text-gray-900 font-bold text-lg">7:15 PM</div>
                <div className="text-gray-600 text-sm">4.9 ft</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-blue-600 text-sm font-medium">Low Tide</div>
                <div className="text-gray-900 font-bold text-lg">1:33 AM</div>
                <div className="text-gray-600 text-sm">0.9 ft</div>
              </div>
            </div>
          </div>

          {/* Spot Details */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Spot Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Difficulty</span>
                <span className="font-medium text-gray-900">{selectedSpot.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Break Type</span>
                <span className="font-medium text-gray-900">{selectedSpot.breakInfo?.type || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Best Swell</span>
                <span className="font-medium text-gray-900">{selectedSpot.bestConditions.swellDirection}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Best Wind</span>
                <span className="font-medium text-gray-900">{selectedSpot.bestConditions.windDirection}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Best Tide</span>
                <span className="font-medium text-gray-900">{selectedSpot.bestConditions.tide}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm leading-relaxed">{selectedSpot.description}</p>
            </div>
          </div>

          {/* Weather Details */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Weather Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-1">☀️</div>
                <div className="text-gray-600 text-sm">UV Index</div>
                <div className="text-gray-900 font-bold">7 (High)</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-1">👁️</div>
                <div className="text-gray-600 text-sm">Visibility</div>
                <div className="text-gray-900 font-bold">10 miles</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-1">💧</div>
                <div className="text-gray-600 text-sm">Humidity</div>
                <div className="text-gray-900 font-bold">78%</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-1">🌅</div>
                <div className="text-gray-600 text-sm">Sunrise</div>
                <div className="text-gray-900 font-bold">6:24 AM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSpotSelect={(spot) => {
          setSelectedSpot(spot);
          setIsSearchModalOpen(false);
        }}
      />
      
      <MobileBottomNav />
    </div>
  );
} 