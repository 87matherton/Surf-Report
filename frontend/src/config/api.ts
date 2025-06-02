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
    // NORTHERN CALIFORNIA (San Francisco Bay Area)
    'mavericks': {
      stationId: '9414290',
      name: 'San Francisco, CA',
      lat: 37.495,
      lng: -122.495
    },
    'ocean_beach': {
      stationId: '9414290',
      name: 'San Francisco, CA',
      lat: 37.7749,
      lng: -122.5094
    },
    'pacifica': {
      stationId: '9414290',
      name: 'San Francisco, CA',
      lat: 37.6138,
      lng: -122.4869
    },
    'linda_mar': {
      stationId: '9414290',
      name: 'San Francisco, CA',
      lat: 37.5856,
      lng: -122.4983
    },
    
    // CENTRAL CALIFORNIA (Santa Cruz / Monterey)
    'steamer_lane': {
      stationId: '9413450', 
      name: 'Monterey, CA',
      lat: 36.9741,
      lng: -122.0308
    },
    'pleasure_point': {
      stationId: '9413450',
      name: 'Monterey, CA',
      lat: 36.9614,
      lng: -121.9758
    },
    'mondos': {
      stationId: '9412110',
      name: 'Port San Luis, CA',
      lat: 35.3606,
      lng: -120.8478
    },
    'pismo_beach': {
      stationId: '9412110',
      name: 'Port San Luis, CA',
      lat: 35.1428,
      lng: -120.6413
    },
    
    // SOUTHERN CALIFORNIA (Santa Barbara)
    'rincon': {
      stationId: '9411340',
      name: 'Santa Barbara, CA', 
      lat: 34.3853,
      lng: -119.5103
    },
    
    // SOUTHERN CALIFORNIA (Los Angeles)
    'malibu': {
      stationId: '9410660',
      name: 'Los Angeles, CA',
      lat: 34.0259,
      lng: -118.2668
    },
    'santa_monica': {
      stationId: '9410660',
      name: 'Los Angeles, CA',
      lat: 34.0195,
      lng: -118.4912
    },
    'venice_beach': {
      stationId: '9410660',
      name: 'Los Angeles, CA',
      lat: 33.9850,
      lng: -118.4695
    },
    'manhattan_beach': {
      stationId: '9410660',
      name: 'Los Angeles, CA',
      lat: 33.8847,
      lng: -118.4109
    },
    'el_segundo': {
      stationId: '9410660',
      name: 'Los Angeles, CA',
      lat: 33.9178,
      lng: -118.4192
    },
    'huntington_beach': {
      stationId: '9410580',
      name: 'Newport Beach, CA',
      lat: 33.6553,
      lng: -117.9988
    },
    'newport_beach': {
      stationId: '9410580',
      name: 'Newport Beach, CA',
      lat: 33.5931,
      lng: -117.8814
    },
    'trestles': {
      stationId: '9410170',
      name: 'La Jolla, CA',
      lat: 33.3892,
      lng: -117.5931
    },
    
    // SAN DIEGO AREA
    'swamis': {
      stationId: '9410170',
      name: 'La Jolla, CA',
      lat: 33.0361,
      lng: -117.2911
    },
    'windansea': {
      stationId: '9410170',
      name: 'La Jolla, CA',
      lat: 32.8331,
      lng: -117.2778
    },
    'la_jolla_shores': {
      stationId: '9410170',
      name: 'La Jolla, CA',
      lat: 32.8569,
      lng: -117.2569
    }
  },
  
  // Spitcast Spot ID mappings
  // Maps our surf spot IDs to Spitcast spot IDs
  SPITCAST_SPOTS: {
    // NORTHERN CALIFORNIA
    'mavericks': {
      spitcastId: 122,
      name: 'Mavericks'
    },
    'ocean_beach': {
      spitcastId: 151,
      name: 'Ocean Beach'
    },
    'pacifica': {
      spitcastId: 127,
      name: 'Pacifica'
    },
    'linda_mar': {
      spitcastId: 127, // Same as Pacifica - close proximity
      name: 'Linda Mar'
    },
    
    // CENTRAL CALIFORNIA
    'steamer_lane': {
      spitcastId: 2,
      name: 'Steamer Lane'
    },
    'pleasure_point': {
      spitcastId: 1,
      name: 'Pleasure Point'
    },
    'mondos': {
      spitcastId: 172,
      name: 'Mondos'
    },
    'pismo_beach': {
      spitcastId: 173,
      name: 'Pismo Beach'
    },
    
    // SOUTHERN CALIFORNIA
    'rincon': {
      spitcastId: 198,
      name: 'Rincon'
    },
    'malibu': {
      spitcastId: 205,
      name: 'Malibu'
    },
    'santa_monica': {
      spitcastId: 207,
      name: 'Santa Monica'
    },
    'venice_beach': {
      spitcastId: 206,
      name: 'Venice Beach'
    },
    'manhattan_beach': {
      spitcastId: 203,
      name: 'Manhattan Beach'
    },
    'el_segundo': {
      spitcastId: 203, // Same as Manhattan Beach - close proximity
      name: 'El Segundo'
    },
    'huntington_beach': {
      spitcastId: 204,
      name: 'Huntington Beach'
    },
    'newport_beach': {
      spitcastId: 200,
      name: 'Newport Beach'
    },
    'trestles': {
      spitcastId: 208,
      name: 'Trestles'
    },
    'swamis': {
      spitcastId: 157,
      name: 'Swamis'
    },
    'windansea': {
      spitcastId: 155,
      name: 'Windansea'
    },
    'la_jolla_shores': {
      spitcastId: 154,
      name: 'La Jolla Shores'
    }
  }
}; 