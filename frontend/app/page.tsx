"use client";
import React, { useState, useRef, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { surfSpots, type SurfSpot } from '../src/data/spots';
import SearchModal from '../src/components/SearchModal';
import MobileBottomNav from '../src/components/MobileBottomNav';

// Get all West Coast surf spots (Washington, Oregon, California)
const getWestCoastSpots = (): SurfSpot[] => {
  return surfSpots.filter(spot => 
    spot.state === 'Washington' || 
    spot.state === 'Oregon' || 
    spot.state === 'California'
  );
};

// Convert lat/lng to SVG coordinates for West Coast
const latLngToSVG = (lat: number, lng: number, zoom: number = 1, panX: number = 0, panY: number = 0) => {
  // West Coast bounds: lat 32-49, lng -125 to -117
  const minLat = 32, maxLat = 49;
  const minLng = -125, maxLng = -117;
  
  const baseX = ((lng - minLng) / (maxLng - minLng)) * 400 + 50;
  const baseY = ((maxLat - lat) / (maxLat - minLat)) * 600 + 50;
  
  // Apply zoom and pan transformations
  const x = (baseX * zoom) + panX;
  const y = (baseY * zoom) + panY;
  
  return { x, y };
};

const SearchButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="absolute bg-white left-3 top-[13px] rounded-full size-[60px] border border-slate-200 flex items-center justify-center shadow-sm z-10 hover:bg-gray-50 transition-colors"
  >
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

const CenterLocationPin = () => (
  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 pointer-events-none">
    <div className="bg-black rounded-full size-11 flex items-center justify-center shadow-lg border-2 border-slate-200">
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
      </svg>
    </div>
    <div className="w-px h-5 bg-black"></div>
  </div>
);

const SurfSpotCard = ({ spot, isSelected = false }: { spot: SurfSpot; isSelected?: boolean }) => (
  <div className={`bg-white rounded-[15px] p-3 min-w-0 flex-shrink-0 ${isSelected ? 'border-4 border-black' : ''}`}>
    <div className="flex items-center justify-between mb-1">
      <h3 className="font-semibold text-slate-700 text-xl leading-7 tracking-tight">{spot.name}</h3>
      <div className="bg-slate-100 rounded-full px-2 py-1 flex items-center gap-1">
        <div className="w-[18px] h-[18px] rounded-full bg-gradient-to-br from-yellow-400 to-orange-500"></div>
        <span className="text-slate-700 text-xs font-medium">{spot.currentConditions.airTemp}°</span>
      </div>
    </div>
    <div className="flex items-end gap-3">
      <span className="text-slate-700 text-xs font-medium">{spot.currentConditions.swellHeight}ft</span>
      <span className="text-slate-400 text-xs font-medium">{spot.currentConditions.windSpeed}mph {spot.currentConditions.windDirection}</span>
    </div>
  </div>
);

const SurfSpotCards = () => {
  const westCoastSpots = getWestCoastSpots().slice(0, 3); // Show first 3 spots
  
  return (
    <div className="absolute bottom-[100px] left-3 right-3 z-10">
      <div className="flex gap-2.5 overflow-x-auto pb-2">
        {westCoastSpots.map((spot, index) => (
          <SurfSpotCard 
            key={spot.id}
            spot={spot}
            isSelected={index === 0}
          />
        ))}
      </div>
    </div>
  );
};

const ZoomControls = ({ zoom, onZoomIn, onZoomOut, onReset }: {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}) => (
  <div className="absolute top-20 left-3 z-20 flex flex-col gap-2">
    <button 
      onClick={onZoomIn}
      className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors"
      disabled={zoom >= 3}
    >
      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" />
        <line x1="8" y1="11" x2="14" y2="11" />
        <line x1="11" y1="8" x2="11" y2="14" />
      </svg>
    </button>
    <button 
      onClick={onZoomOut}
      className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors"
      disabled={zoom <= 0.5}
    >
      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    </button>
    <button 
      onClick={onReset}
      className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700"
    >
      Reset
    </button>
  </div>
);

const WestCoastMap = () => {
  const [selectedSpot, setSelectedSpot] = useState<SurfSpot | null>(null);
  const [hoveredSpot, setHoveredSpot] = useState<SurfSpot | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  
  const westCoastSpots = getWestCoastSpots();

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === svgRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  }, [panX, panY]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev * zoomFactor)));
  }, []);

  const zoomIn = () => setZoom(prev => Math.min(3, prev * 1.2));
  const zoomOut = () => setZoom(prev => Math.max(0.5, prev / 1.2));
  const resetView = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      {/* Zoom Controls */}
      <ZoomControls 
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetView}
      />
      
      {/* West Coast SVG Map */}
      <svg 
        ref={svgRef}
        viewBox="0 0 500 700" 
        className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Ocean background */}
        <defs>
          <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
        
        <g transform={`translate(${panX}, ${panY}) scale(${zoom})`}>
          {/* West Coast outline */}
          <path
            d="M 100 50 L 120 80 L 140 120 L 160 180 L 180 240 L 200 300 L 220 360 L 240 420 L 260 480 L 280 540 L 300 600 L 320 650 L 350 650 L 380 600 L 400 540 L 420 480 L 440 420 L 460 360 L 480 300 L 500 240 L 480 180 L 460 120 L 440 80 L 420 50 Z"
            fill="rgba(34, 197, 94, 0.3)"
            stroke="rgba(34, 197, 94, 0.6)"
            strokeWidth="2"
          />
          
          {/* State labels */}
          <text x="150" y="100" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">WA</text>
          <text x="200" y="200" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">OR</text>
          <text x="300" y="400" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">CA</text>
          
          {/* Surf spots */}
          {westCoastSpots.map((spot) => {
            const { x, y } = latLngToSVG(spot.location.lat, spot.location.lng);
            const isHovered = hoveredSpot?.id === spot.id;
            const isSelected = selectedSpot?.id === spot.id;
            const markerSize = zoom > 1.5 ? 8 : zoom > 1 ? 6 : 5;
            
            return (
              <g key={spot.id}>
                {/* Spot marker */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered || isSelected ? markerSize + 2 : markerSize}
                  fill="#00A86B"
                  stroke="white"
                  strokeWidth={zoom > 1.5 ? "3" : "2"}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredSpot(spot)}
                  onMouseLeave={() => setHoveredSpot(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSpot(isSelected ? null : spot);
                  }}
                />
                
                {/* Spot name on hover or when zoomed in */}
                {(isHovered || zoom > 1.5) && (
                  <text
                    x={x}
                    y={y - (markerSize + 8)}
                    fill="white"
                    fontSize={zoom > 1.5 ? "10" : "8"}
                    fontWeight="bold"
                    textAnchor="middle"
                    className="pointer-events-none"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                  >
                    {spot.name}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      
      {/* Info Panel for selected spot */}
      {selectedSpot && (
        <div className="absolute top-20 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-20">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-slate-800">{selectedSpot.name}</h3>
            <button 
              onClick={() => setSelectedSpot(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-slate-600 mb-3">{selectedSpot.region}, {selectedSpot.state}</p>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Wave Height:</span>
              <span className="font-medium">{selectedSpot.currentConditions.swellHeight}ft</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Wind:</span>
              <span className="font-medium">{selectedSpot.currentConditions.windSpeed}mph {selectedSpot.currentConditions.windDirection}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Water Temp:</span>
              <span className="font-medium">{selectedSpot.currentConditions.waterTemp}°F</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Air Temp:</span>
              <span className="font-medium">{selectedSpot.currentConditions.airTemp}°F</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Conditions:</span>
              <span className={`font-medium ${
                selectedSpot.conditionsRating === 'Excellent' ? 'text-green-600' :
                selectedSpot.conditionsRating === 'Good' ? 'text-blue-600' :
                selectedSpot.conditionsRating === 'Fair' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {selectedSpot.conditionsRating}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Difficulty:</span>
              <span className="font-medium">{selectedSpot.difficulty}</span>
            </div>
          </div>
          
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            {selectedSpot.description}
          </p>
        </div>
      )}
      
      {/* Instructions */}
      <div className="absolute bottom-24 left-4 text-white text-xs bg-black bg-opacity-50 rounded px-2 py-1">
        Drag to pan • Scroll to zoom • Click markers for details
      </div>
    </div>
  );
};

export default function HomePage() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const router = useRouter();

  const handleSpotSelect = (spot: SurfSpot) => {
    router.push(`/spot/${spot.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-100">
      {/* Coastal Background with Frosted Glass Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 opacity-30 pointer-events-none"></div>
      <div className="fixed inset-0 bg-white/20 backdrop-blur-sm pointer-events-none"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20 pointer-events-none"></div>
      
      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Fixed Elements */}
        <SearchButton onClick={() => setIsSearchModalOpen(true)} />
        <UserAvatar />
        
        {/* Map Section - Fixed height but allows page scrolling */}
        <div className="w-full relative" style={{ height: '70vh' }}>
          <WestCoastMap />
          <CenterLocationPin />
          <SurfSpotCards />
        </div>
        
        {/* Scrollable content below the map */}
        <div className="px-4 py-6 space-y-6">
          {/* Popular Spots Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20 apple-transition">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Surf Spots</h2>
            <div className="grid gap-3">
              {getWestCoastSpots().slice(0, 5).map((spot) => (
                <div key={spot.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-all duration-200 apple-transition">
                  <div>
                    <h3 className="font-semibold text-gray-900">{spot.name}</h3>
                    <p className="text-gray-600 text-sm">{spot.region}, {spot.state}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{spot.currentConditions.swellHeight}ft</div>
                    <div className="text-sm text-gray-600">{spot.currentConditions.windSpeed}mph {spot.currentConditions.windDirection}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Conditions Overview */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20 apple-transition">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/50 rounded-lg hover:scale-105 transition-transform duration-200 apple-transition">
                <div className="text-2xl mb-1">🌊</div>
                <div className="text-lg font-bold text-gray-900">3-6ft</div>
                <div className="text-sm text-gray-600">Average Waves</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg hover:scale-105 transition-transform duration-200 apple-transition">
                <div className="text-2xl mb-1">💨</div>
                <div className="text-lg font-bold text-gray-900">12mph</div>
                <div className="text-sm text-gray-600">Average Wind</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg hover:scale-105 transition-transform duration-200 apple-transition">
                <div className="text-2xl mb-1">🌡️</div>
                <div className="text-lg font-bold text-gray-900">68°F</div>
                <div className="text-sm text-gray-600">Water Temp</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg hover:scale-105 transition-transform duration-200 apple-transition">
                <div className="text-2xl mb-1">☀️</div>
                <div className="text-lg font-bold text-gray-900">72°F</div>
                <div className="text-sm text-gray-600">Air Temp</div>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20 apple-transition">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Surf Tips</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 hover:bg-white/30 p-2 rounded-lg transition-all duration-200 apple-transition">
                <div className="text-blue-500 text-xl">💡</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Best Times</h3>
                  <p className="text-gray-600 text-sm">Early morning (6-9am) and late afternoon (4-7pm) typically offer the best conditions.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 hover:bg-white/30 p-2 rounded-lg transition-all duration-200 apple-transition">
                <div className="text-green-500 text-xl">🎯</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Check the Tide</h3>
                  <p className="text-gray-600 text-sm">Most spots work best 2 hours before to 2 hours after high tide.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 hover:bg-white/30 p-2 rounded-lg transition-all duration-200 apple-transition">
                <div className="text-yellow-500 text-xl">⚠️</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Safety First</h3>
                  <p className="text-gray-600 text-sm">Always check local conditions and surf with a buddy when possible.</p>
                </div>
              </div>
            </div>
          </div>

          {/* More Content Sections */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20 apple-transition">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Surf Reports</h2>
            <div className="space-y-3">
              <div className="p-3 bg-white/50 rounded-lg">
                <h3 className="font-semibold text-gray-900">Morning Report</h3>
                <p className="text-gray-600 text-sm">Clean conditions with offshore winds. Perfect for dawn patrol sessions.</p>
              </div>
              <div className="p-3 bg-white/50 rounded-lg">
                <h3 className="font-semibold text-gray-900">Afternoon Forecast</h3>
                <p className="text-gray-600 text-sm">Wind expected to pick up around 2pm. Best to surf before then.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20 apple-transition">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tide Times</h2>
            <div className="grid grid-cols-2 gap-4">
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
            </div>
          </div>

          {/* Add more sections to demonstrate scrolling */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20 apple-transition">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Local Weather</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl mb-1">☀️</div>
                <div className="text-sm font-medium text-gray-900">Sunny</div>
                <div className="text-xs text-gray-600">72°F</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl mb-1">🌤️</div>
                <div className="text-sm font-medium text-gray-900">Partly Cloudy</div>
                <div className="text-xs text-gray-600">68°F</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl mb-1">🌊</div>
                <div className="text-sm font-medium text-gray-900">Good Waves</div>
                <div className="text-xs text-gray-600">4-6ft</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search Modal */}
        <SearchModal 
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          onSpotSelect={handleSpotSelect}
        />
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </div>
  );
} 