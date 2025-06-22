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
        <div className="px-4 py-6 space-y-6 apple-scroll">
          {/* Favorite Spots */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20 apple-transition">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Favorite Spots</h2>
            <div className="space-y-3">
              {favoriteSpots.map((spot) => (
                <div key={spot.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-all duration-200 apple-transition">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{spot.name}</h3>
                    <p className="text-gray-600 text-sm">{spot.region}, {spot.state}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{spot.difficulty}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        spot.conditionsRating === 'Excellent' ? 'bg-green-100 text-green-800' :
                        spot.conditionsRating === 'Good' ? 'bg-blue-100 text-blue-800' :
                        spot.conditionsRating === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {spot.conditionsRating}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-gray-900">{spot.currentConditions.swellHeight}ft</div>
                    <div className="text-sm text-gray-600">{spot.currentConditions.windSpeed}mph {spot.currentConditions.windDirection}</div>
                    <div className="text-xs text-gray-500 mt-1">{spot.currentConditions.waterTemp}°F water</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Favorites Statistics */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20 apple-transition">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Surf Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/50 rounded-lg apple-transition">
                <div className="text-2xl mb-1">🏄‍♂️</div>
                <div className="text-lg font-bold text-gray-900">24</div>
                <div className="text-sm text-gray-600">Sessions This Month</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg apple-transition">
                <div className="text-2xl mb-1">⭐</div>
                <div className="text-lg font-bold text-gray-900">8</div>
                <div className="text-sm text-gray-600">Favorite Spots</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg apple-transition">
                <div className="text-2xl mb-1">🌊</div>
                <div className="text-lg font-bold text-gray-900">4.2ft</div>
                <div className="text-sm text-gray-600">Avg Wave Height</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg apple-transition">
                <div className="text-2xl mb-1">📈</div>
                <div className="text-lg font-bold text-gray-900">85%</div>
                <div className="text-sm text-gray-600">Good Conditions</div>
              </div>
            </div>
          </div>

          {/* Best Conditions Today */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Best Conditions Today</h2>
            <div className="space-y-3">
              {favoriteSpots
                .filter(spot => spot.conditionsRating === 'Excellent' || spot.conditionsRating === 'Good')
                .slice(0, 3)
                .map((spot) => (
                  <div key={spot.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg scroll-smooth-transition hover:bg-white/70 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">
                        {spot.conditionsRating === 'Excellent' ? '🔥' : '👍'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{spot.name}</h3>
                        <p className="text-gray-600 text-sm">{spot.conditionsRating} conditions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{spot.currentConditions.swellHeight}ft</div>
                      <div className="text-sm text-gray-600">{spot.currentConditions.windSpeed}mph</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Surf Tips */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Personalized Tips</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="text-blue-500 text-xl">🎯</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Perfect for Today</h3>
                  <p className="text-gray-600 text-sm">Malibu and Huntington Beach have excellent conditions right now!</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-green-500 text-xl">⏰</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Best Time</h3>
                  <p className="text-gray-600 text-sm">Early morning sessions (6-8am) are ideal for most of your spots.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-yellow-500 text-xl">🌊</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Tide Alert</h3>
                  <p className="text-gray-600 text-sm">High tide at 6:42 AM - perfect for your favorite reef breaks!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-medium">View Reports</span>
              </button>
              <button className="flex items-center justify-center gap-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Plan Session</span>
              </button>
              <button className="flex items-center justify-center gap-2 p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium">Find Nearby</span>
              </button>
              <button className="flex items-center justify-center gap-2 p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-sm font-medium">Surf Guide</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default FavoritesPage; 