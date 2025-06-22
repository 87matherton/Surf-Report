"use client";
import React, { useState } from 'react';
import { surfSpots } from '../../src/data/spots';
import SearchModal from '../../src/components/SearchModal';

export default function ForecastPage() {
  const [selectedSpot, setSelectedSpot] = useState(surfSpots[0]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

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
    <div className="min-h-screen relative">
      {/* Subtle coastal background */}
      <div className="fixed inset-0 bg-gradient-to-br from-sky-100 via-blue-50 to-blue-100"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Forecast</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-gray-600 text-sm">Live data</span>
                  </div>
                </div>
              </div>
              {/* Search Button */}
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

            {/* Spot Selector */}
            <div className="relative">
              <select
                value={selectedSpot.id}
                onChange={(e) => setSelectedSpot(surfSpots.find(s => s.id === e.target.value) || surfSpots[0])}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <optgroup label="Popular Spots">
                  {popularSpots.map(spot => (
                    <option key={spot.id} value={spot.id}>
                      {spot.name} - {spot.region}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="All Spots">
                  {surfSpots.filter(spot => !popularSpotIds.includes(spot.id)).map(spot => (
                    <option key={spot.id} value={spot.id}>
                      {spot.name} - {spot.region}
                    </option>
                  ))}
                </optgroup>
              </select>
              <svg className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-6 pb-24">
          {/* Current Conditions */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Current Conditions</h2>
              <span className="px-2 py-1 bg-green-100 rounded-full text-xs text-green-800 border border-green-200">
                Live
              </span>
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
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-600 text-xs uppercase tracking-wide">Wave Height</p>
                <p className="text-gray-900 font-bold text-xl">{selectedSpot.currentConditions.swellHeight}ft</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-600 text-xs uppercase tracking-wide">Wind</p>
                <p className="text-gray-900 font-bold text-xl">{selectedSpot.currentConditions.windSpeed}mph</p>
                <p className="text-gray-600 text-xs">{selectedSpot.currentConditions.windDirection}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-600 text-xs uppercase tracking-wide">Water Temp</p>
                <p className="text-gray-900 font-bold text-xl">{selectedSpot.currentConditions.waterTemp}°F</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
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

          {/* Search Modal */}
          <SearchModal 
            isOpen={isSearchModalOpen}
            onClose={() => setIsSearchModalOpen(false)}
            onSpotSelect={(spot) => {
              setSelectedSpot(spot);
              setIsSearchModalOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
} 