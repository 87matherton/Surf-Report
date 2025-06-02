export const API_CONFIG = {
  // Weather API endpoints
  WEATHER_API_URL: 'https://api.open-meteo.com/v1/forecast',
  MARINE_API_URL: 'https://marine-api.open-meteo.com/v1/marine',
  
  // NOAA Tides & Currents API
  NOAA_TIDES_API_URL: 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter',
  
  // Spitcast API endpoints
  SPITCAST_API_URL: 'https://api.spitcast.com/api',
  
  // Cache settings
  CACHE_DURATION: 10 * 60 * 1000, // 10 minutes in milliseconds
  
  // App settings
  AUTO_REFRESH_INTERVAL: 10 * 60 * 1000, // 10 minutes
  
  // Default coordinates (San Francisco Bay Area)
  DEFAULT_COORDINATES: {
    lat: 37.5,
    lng: -122.3
  },
  
  // NOAA Tide Station mappings for surf spots
  // Maps surf spot coordinates to nearest NOAA tide stations
  TIDE_STATIONS: {
    // Mavericks (Half Moon Bay) - closest to San Francisco station
    'mavericks': {
      stationId: '9414290',
      name: 'San Francisco, CA',
      lat: 37.495,
      lng: -122.495
    },
    // Steamer Lane (Santa Cruz) - Monterey Harbor station
    'steamer_lane': {
      stationId: '9413450', 
      name: 'Monterey, CA',
      lat: 36.9741,
      lng: -122.0308
    },
    // Rincon (Carpinteria) - Santa Barbara station
    'rincon': {
      stationId: '9411340',
      name: 'Santa Barbara, CA', 
      lat: 34.3853,
      lng: -119.5103
    },
    // Malibu - Los Angeles Harbor station
    'malibu': {
      stationId: '9410660',
      name: 'Los Angeles, CA',
      lat: 34.0259,
      lng: -118.2668
    }
  },
  
  // Spitcast Spot ID mappings
  // Maps our surf spot IDs to Spitcast spot IDs
  SPITCAST_SPOTS: {
    'mavericks': {
      spitcastId: 122,
      name: 'Mavericks'
    },
    'steamer_lane': {
      spitcastId: 2,
      name: 'Steamer Lane'
    },
    'rincon': {
      spitcastId: 198,
      name: 'Rincon'
    },
    'malibu': {
      spitcastId: 205,
      name: 'Malibu'
    }
  }
}; 