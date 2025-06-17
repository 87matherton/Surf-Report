"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { surfSpots, type SurfSpot } from '../data/spots';

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

const SearchButton = () => (
  <button className="absolute bg-white left-3 top-[13px] rounded-full size-[60px] border border-slate-200 flex items-center justify-center shadow-sm z-10">
    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  </button>
);

const UserAvatar = () => (
  <div className="absolute right-3 top-[13px] size-[60px] rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center z-10">
    <span className="text-white text-xl font-bold">👤</span>
  </div>
);

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

const BottomTabBar = () => {
  const router = useRouter();
  
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[377px] z-10">
      <div className="bg-white rounded-full border border-slate-300 flex">
        <button 
          className="flex-1 py-3 px-5 font-medium text-sm text-black hover:bg-slate-50"
          onClick={() => router.push('/')}
        >
          Map
        </button>
        <button className="flex-1 py-3 px-5 bg-slate-100 rounded-full font-medium text-sm text-black">
          Favorites
        </button>
        <button 
          className="flex-1 py-3 px-5 font-medium text-sm text-black hover:bg-slate-50"
          onClick={() => router.push('/forecast')}
        >
          Forecast
        </button>
      </div>
    </div>
  );
};

const FavoritesPage = () => {
  const favoriteSpots = getFavoriteSpots();
  
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-gray-50">
      <div className="relative w-full h-full">
        {/* Header */}
        <SearchButton />
        <UserAvatar />
        
        {/* Content */}
        <div className="pt-20 pb-24 h-full overflow-y-auto">
          <div className="px-4 mb-4">
            <h1 className="text-2xl font-bold text-slate-800">Favorites</h1>
            <p className="text-slate-600 text-sm">Your saved surf spots</p>
          </div>
          
          {/* Surf Spots List */}
          <div className="bg-white mx-4 rounded-lg shadow-sm overflow-hidden">
            {favoriteSpots.map((spot) => (
              <SurfSpotRow key={spot.id} spot={spot} />
            ))}
          </div>
        </div>
        
        {/* Bottom Navigation */}
        <BottomTabBar />
      </div>
    </div>
  );
};

export default FavoritesPage; 