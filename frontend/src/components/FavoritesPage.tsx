"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { surfSpots, type SurfSpot } from '../data/spots';
import MobileBottomNav from './MobileBottomNav';

// Get popular surf spots for favorites (mix from different regions)
const getFavoriteSpots = (): SurfSpot[] => {
  const favoriteSpotIds = [
    'ca1', // Mavericks
    '4', // Malibu  
    '12', // Huntington Beach
    '2', // Steamer Lane
    '11', // Trestles
    '20', // Swamis
    'or1', // Cannon Beach
    'norcal3', // Bolinas
    '3', // Rincon
    'oc1', // Salt Creek
    '18', // La Jolla Shores
    '19' // Windansea
  ];
  
  // Get spots that exist in our database
  const availableSpots = surfSpots.filter(spot => favoriteSpotIds.includes(spot.id));
  
  // If we don't have enough spots from the IDs, add more from the database
  if (availableSpots.length < 12) {
    const additionalSpots = surfSpots
      .filter(spot => !favoriteSpotIds.includes(spot.id))
      .slice(0, 12 - availableSpots.length);
    return [...availableSpots, ...additionalSpots];
  }
  
  return availableSpots.slice(0, 12);
};

const SurfSpotRow = ({ spot }: { spot: SurfSpot }) => (
  <div className="flex items-center justify-between py-4 px-4 bg-white border-b border-gray-100">
    <div className="flex-1">
      <h3 className="font-semibold text-slate-700 text-lg">{spot.name}</h3>
      <p className="text-slate-500 text-sm">{spot.region}, {spot.state}</p>
    </div>
    <div className="flex items-center gap-4">
      <div className="text-center">
        <div className="text-slate-700 text-sm font-medium">{spot.currentConditions.swellHeight}ft</div>
        <div className="text-slate-400 text-xs">waves</div>
      </div>
      <div className="text-center">
        <div className="text-slate-700 text-sm font-medium">{spot.currentConditions.windSpeed}mph {spot.currentConditions.windDirection}</div>
        <div className="text-slate-400 text-xs">wind</div>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-[18px] h-[18px] rounded-full bg-gradient-to-br from-yellow-400 to-orange-500"></div>
        <span className="text-slate-700 text-sm font-medium">{spot.currentConditions.airTemp}°</span>
      </div>
    </div>
  </div>
);

const FavoritesPage = () => {
  const favoriteSpots = getFavoriteSpots();
  
  return (
    <div className="min-h-screen relative">
      {/* Subtle coastal background */}
      <div className="fixed inset-0 bg-gradient-to-br from-sky-100 via-blue-50 to-blue-100"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Favorites</h1>
                <p className="text-gray-600 text-sm">Your saved surf spots</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="max-w-md mx-auto px-4 py-6 pb-24">
          {/* Surf Spots List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden border border-white/20">
            {favoriteSpots.map((spot) => (
              <SurfSpotRow key={spot.id} spot={spot} />
            ))}
          </div>
        </div>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default FavoritesPage; 