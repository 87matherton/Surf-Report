'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { searchSpots, getPopularSpots, type SurfSpot } from '../data/spots';
import { getQualityEmoji } from '../utils/surfUtils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpotSelect?: (spot: SurfSpot) => void;
}

const SearchResultItem = ({ spot, onClick }: { spot: SurfSpot; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 hover:bg-white/10 hover:backdrop-blur-sm transition-all duration-200 text-left border-b border-white/10 last:border-b-0"
  >
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-semibold text-white text-lg">{spot.name}</h3>
        <span className="text-lg">{getQualityEmoji(spot.conditionsRating)}</span>
      </div>
      <p className="text-white/70 text-sm mb-1">{spot.region}, {spot.state}</p>
      <p className="text-white/60 text-xs">{spot.difficulty} • {spot.conditionsRating}</p>
    </div>
    <div className="flex items-center gap-4 text-right">
      <div className="text-center">
        <div className="text-white text-sm font-medium">{spot.currentConditions.swellHeight}ft</div>
        <div className="text-white/60 text-xs">waves</div>
      </div>
      <div className="text-center">
        <div className="text-white text-sm font-medium">{spot.currentConditions.windSpeed}mph</div>
        <div className="text-white/60 text-xs">{spot.currentConditions.windDirection}</div>
      </div>
      <div className="text-center">
        <div className="text-white text-sm font-medium">{spot.currentConditions.waterTemp}°F</div>
        <div className="text-white/60 text-xs">water</div>
      </div>
    </div>
  </button>
);

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSpotSelect }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SurfSpot[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Get popular spots for suggestions
  const popularSpots = useMemo(() => getPopularSpots(), []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      const results = searchSpots(searchQuery);
      setSearchResults(results.slice(0, 20)); // Limit to 20 results
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSpotClick = (spot: SurfSpot) => {
    if (onSpotSelect) {
      onSpotSelect(spot);
    } else {
      router.push(`/forecast?spot=${spot.id}`);
    }
    onClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    onClose();
  };

  const handlePopularSpotClick = (spotName: string) => {
    setSearchQuery(spotName);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Search Modal */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl w-full max-w-md mx-4 mt-8 relative shadow-2xl border border-white/20 max-h-[85vh] overflow-hidden">
        {/* Search Input */}
        <div className="p-4 border-b border-white/20">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search surf spots..."
              className="w-full px-4 py-3 pr-12 text-lg bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all duration-200"
              autoFocus
            />
            <button
              onClick={handleClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto">
          {searchQuery.trim() === '' ? (
            /* Empty State with Popular Spots */
            <div className="p-6">
              <div className="text-center mb-6">
                <svg className="w-12 h-12 mx-auto mb-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <h2 className="text-xl font-bold text-white mb-2">Search Surf Spots</h2>
                <p className="text-white/70 text-sm">Find surf spots by name, location, difficulty, or conditions</p>
              </div>

              {/* Popular Searches */}
              <div>
                <p className="text-sm font-medium text-white/80 uppercase tracking-wide mb-3">Popular Spots</p>
                <div className="space-y-2">
                  {popularSpots.slice(0, 6).map((spot) => (
                    <button
                      key={spot.id}
                      onClick={() => handlePopularSpotClick(spot.name)}
                      className="w-full flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm hover:bg-white/15 rounded-lg transition-all duration-200 text-left border border-white/10 hover:border-white/20"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getQualityEmoji(spot.conditionsRating)}</span>
                        <div>
                          <p className="text-white font-medium">{spot.name}</p>
                          <p className="text-white/60 text-sm">{spot.region}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm font-medium">{spot.currentConditions.swellHeight}ft</p>
                        <p className="text-white/60 text-xs">{spot.conditionsRating}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Tips */}
              <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <p className="text-white/80 text-sm font-medium mb-2">Search Tips:</p>
                <ul className="text-white/60 text-xs space-y-1">
                  <li>• Try "beginner", "advanced", or "expert" for difficulty</li>
                  <li>• Search "excellent" or "good" for conditions</li>
                  <li>• Look for "reef break" or "beach break"</li>
                  <li>• Find spots by region like "Santa Cruz"</li>
                </ul>
              </div>
            </div>
          ) : isSearching ? (
            /* Loading State */
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white/80">Searching surf spots...</p>
            </div>
          ) : searchResults.length === 0 ? (
            /* No Results */
            <div className="p-8 text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <h3 className="text-lg font-bold text-white mb-2">No Results Found</h3>
              <p className="text-white/70 text-sm mb-4">Try searching for a different location or condition</p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-all duration-200 border border-white/20 hover:border-white/30"
              >
                Clear Search
              </button>
            </div>
          ) : (
            /* Search Results */
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-white/60 uppercase tracking-wide border-b border-white/10">
                {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'}
              </div>
              {searchResults.map((spot) => (
                <SearchResultItem
                  key={spot.id}
                  spot={spot}
                  onClick={() => handleSpotClick(spot)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal; 