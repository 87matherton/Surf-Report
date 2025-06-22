"use client";
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { surfSpots, type SurfSpot } from '../data/spots';

// Mapbox access token - you'll need to set this
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

// Set access token with type assertion
(mapboxgl as any).accessToken = MAPBOX_TOKEN;

interface MapboxMapProps {
  onSpotClick?: (spot: SurfSpot) => void;
  className?: string;
}

// Create custom marker element for surf spots
const createSurfMarker = (spot: SurfSpot): HTMLElement => {
  const el = document.createElement('div');
  el.className = 'surf-marker';
  
  // Get colors based on conditions and difficulty
  const getConditionColor = (rating: string) => {
    switch (rating) {
      case 'Excellent': return '#10B981'; // Green
      case 'Good': return '#3B82F6';      // Blue  
      case 'Fair': return '#F59E0B';      // Amber
      case 'Poor': return '#EF4444';      // Red
      default: return '#6B7280';          // Gray
    }
  };

  const getDifficultySize = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '32px';
      case 'Intermediate': return '36px';
      case 'Advanced': return '40px';
      case 'Expert': return '44px';
      default: return '36px';
    }
  };

  const conditionColor = getConditionColor(spot.conditionsRating);
  const markerSize = getDifficultySize(spot.difficulty);
  
  el.innerHTML = `
    <div class="surf-marker-inner" style="
      width: ${markerSize};
      height: ${markerSize};
      background: ${conditionColor};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
      </svg>
      <div style="
        position: absolute;
        top: -8px;
        right: -8px;
        background: rgba(0,0,0,0.8);
        color: white;
        border-radius: 10px;
        padding: 2px 6px;
        font-size: 10px;
        font-weight: bold;
        min-width: 20px;
        text-align: center;
      ">${spot.currentConditions.swellHeight}ft</div>
    </div>
  `;

  // Add hover effects
  el.addEventListener('mouseenter', () => {
    const inner = el.querySelector('.surf-marker-inner') as HTMLElement;
    if (inner) {
      inner.style.transform = 'scale(1.1)';
      inner.style.zIndex = '1000';
    }
  });

  el.addEventListener('mouseleave', () => {
    const inner = el.querySelector('.surf-marker-inner') as HTMLElement;
    if (inner) {
      inner.style.transform = 'scale(1)';
      inner.style.zIndex = 'auto';
    }
  });

  return el;
};

const MapboxMap: React.FC<MapboxMapProps> = ({ onSpotClick, className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Get West Coast spots for initial display
  const getWestCoastSpots = (): SurfSpot[] => {
    return surfSpots.filter(spot => 
      spot.state === 'Washington' || 
      spot.state === 'Oregon' || 
      spot.state === 'California'
    );
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12', // Great for surf/ocean
      center: [-122.4, 37.8], // San Francisco Bay Area center
      zoom: 6,
      attributionControl: false,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add geolocate control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );

    map.current.on('load', () => {
      setIsLoaded(true);
      addSurfSpotMarkers();
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const addSurfSpotMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    const westCoastSpots = getWestCoastSpots();

    westCoastSpots.forEach(spot => {
      const markerElement = createSurfMarker(spot);
      
      const marker = new mapboxgl.Marker({
        element: markerElement,
        anchor: 'center'
      })
        .setLngLat([spot.location.lng, spot.location.lat])
        .addTo(map.current!);

      // Add click handler
      markerElement.addEventListener('click', () => {
        if (onSpotClick) {
          onSpotClick(spot);
        }
      });

      // Create popup with spot info
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false
      }).setHTML(`
        <div class="p-3 min-w-[200px]">
          <h3 class="font-semibold text-lg mb-2">${spot.name}</h3>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Surf:</span>
              <span class="font-medium">${spot.currentConditions.swellHeight}ft</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Wind:</span>
              <span class="font-medium">${spot.currentConditions.windSpeed}mph ${spot.currentConditions.windDirection}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Conditions:</span>
              <span class="font-medium text-${getConditionColorClass(spot.conditionsRating)}">${spot.conditionsRating}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Difficulty:</span>
              <span class="font-medium">${spot.difficulty}</span>
            </div>
          </div>
          <div class="mt-2 pt-2 border-t border-gray-200">
            <p class="text-xs text-gray-500">Click marker for details</p>
          </div>
        </div>
      `);

      // Show popup on hover
      markerElement.addEventListener('mouseenter', () => {
        popup.setLngLat([spot.location.lng, spot.location.lat])
              .addTo(map.current!);
      });

      markerElement.addEventListener('mouseleave', () => {
        popup.remove();
      });

      markers.current.push(marker);
    });
  };

  const getConditionColorClass = (rating: string) => {
    switch (rating) {
      case 'Excellent': return 'green-600';
      case 'Good': return 'blue-600';
      case 'Fair': return 'yellow-600';
      case 'Poor': return 'red-600';
      default: return 'gray-600';
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Loading Surf Map...</h2>
            <p className="text-lg opacity-90">Getting latest surf conditions</p>
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <h4 className="font-semibold text-sm mb-2">Surf Conditions</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Fair</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Poor</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">Marker size = difficulty level</p>
        </div>
      </div>
    </div>
  );
};

export default MapboxMap; 