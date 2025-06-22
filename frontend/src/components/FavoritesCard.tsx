"use client";
import React, { useState } from 'react';
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

interface FavoritesCardProps {
  isOpen: boolean;
  onClose: () => void;
}

const FavoritesCard: React.FC<FavoritesCardProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const favoriteSpots = getFavoriteSpots();

  // Filter spots based on search query
  const filteredSpots = favoriteSpots.filter(spot =>
    spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spot.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSpotClick = (spotId: string) => {
    router.push(`/spot/${spotId}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Favorites Card */}
      <div className="fixed top-6 left-6 right-6 lg:left-80 lg:right-6 bg-white rounded-[15px] shadow-2xl z-50 max-h-[85vh] overflow-hidden animate-slide-up">
        {/* Header with Search */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="font-semibold text-xl leading-7 tracking-tight text-slate-700">Favorites</h1>
              <p className="text-xs font-medium text-slate-400">Your saved surf spots</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 hover:text-slate-600"
              >
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Spots List */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 140px)' }}>
          {filteredSpots.length > 0 ? (
            <div className="p-3">
              <div className="space-y-2">
                {filteredSpots.map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => handleSpotClick(spot.id)}
                    className="w-full bg-slate-50 hover:bg-slate-100 rounded-lg p-3 text-left transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-700 text-sm leading-5 tracking-tight truncate">
                          {spot.name}
                        </h3>
                        <p className="text-xs font-medium text-slate-400 truncate">
                          {spot.region}, {spot.state}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3 ml-3">
                        {/* Wave Height */}
                        <div className="text-center">
                          <div className="text-slate-700 text-xs font-medium">
                            {spot.currentConditions.swellHeight}ft
                          </div>
                          <div className="text-slate-400 text-xs">waves</div>
                        </div>
                        
                        {/* Conditions Badge */}
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          spot.conditionsRating === 'Excellent' ? 'bg-green-100 text-green-700' :
                          spot.conditionsRating === 'Good' ? 'bg-blue-100 text-blue-700' :
                          spot.conditionsRating === 'Fair' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {spot.conditionsRating}
                        </div>
                        
                        {/* Temperature */}
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500"></div>
                          <span className="text-slate-700 text-xs font-medium">{spot.currentConditions.airTemp}°</span>
                        </div>
                        
                        {/* Arrow */}
                        <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <h3 className="font-medium text-slate-700 mb-1">No spots found</h3>
              <p className="text-xs text-slate-400">
                {searchQuery ? 'Try a different search term' : 'No favorites saved yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FavoritesCard; 