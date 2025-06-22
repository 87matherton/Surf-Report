"use client";
import React, { useState, useEffect } from 'react';
import { surfSpots, type SurfSpot } from '../data/spots';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpotSelect: (spot: SurfSpot) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSpotSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSpots, setFilteredSpots] = useState<SurfSpot[]>([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      // Show popular spots when no search query
      setFilteredSpots(surfSpots.slice(0, 8));
    } else {
      // Filter spots based on search query
      const filtered = surfSpots.filter(spot =>
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.state.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSpots(filtered.slice(0, 10));
    }
  }, [searchQuery]);

  const handleSpotClick = (spot: SurfSpot) => {
    onSpotSelect(spot);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[70vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Search Surf Spots</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, region, or state..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-96">
          {searchQuery.trim() === '' && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Popular Spots</h3>
            </div>
          )}
          
          {filteredSpots.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredSpots.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => handleSpotClick(spot)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{spot.name}</h4>
                      <p className="text-sm text-gray-600">{spot.region}, {spot.state}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">{spot.currentConditions.swellHeight}ft</span>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        spot.conditionsRating === 'Excellent' ? 'bg-green-100 text-green-800' :
                        spot.conditionsRating === 'Good' ? 'bg-blue-100 text-blue-800' :
                        spot.conditionsRating === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {spot.conditionsRating}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <p className="text-gray-500">No spots found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal; 