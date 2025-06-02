export const API_CONFIG = {
  // Weather API endpoints
  WEATHER_API_URL: 'https://api.open-meteo.com/v1/forecast',
  MARINE_API_URL: 'https://marine-api.open-meteo.com/v1/marine',
  
  // Cache settings
  CACHE_DURATION: 10 * 60 * 1000, // 10 minutes in milliseconds
  
  // App settings
  AUTO_REFRESH_INTERVAL: 10 * 60 * 1000, // 10 minutes
  
  // Default coordinates (San Francisco Bay Area)
  DEFAULT_COORDINATES: {
    lat: 37.5,
    lng: -122.3
  }
};

export default API_CONFIG; 