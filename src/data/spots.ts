export interface SurfSpot {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  bestConditions: {
    swellDirection: string[];
    windDirection: string[];
    tide: string[];
    swellSize: string;
  };
  currentConditions: {
    swellHeight: number;
    swellPeriod: number;
    swellDirection: string;
    windSpeed: number;
    windDirection: string;
    tide: string;
    waterTemp: number;
    airTemp: number;
  };
  forecast: {
    date: string;
    swellHeight: number;
    swellPeriod: number;
    swellDirection: string;
    windSpeed: number;
    windDirection: string;
  }[];
  conditionsRating: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  region: string;
  state: string;
  breakInfo?: {
    type: string;
    waveDirection: string;
    bottom: string;
    peakSections?: string[];
    hazards: string[];
    bestTime: string;
    crowdFactor: string;
    experience: string;
  };
  photos?: {
    id: string;
    url: string;
    title: string;
    description?: string;
    photographer?: string;
    tags?: string[];
  }[];
}

export const surfSpots: SurfSpot[] = [
  // NORTHERN CALIFORNIA
  {
    id: 'nc1',
    name: 'Mavericks',
    location: { lat: 37.4914, lng: -122.5014 },
    description: 'World-famous big wave break. Only for expert surfers in large swells.',
    difficulty: 'Expert',
    region: 'Half Moon Bay',
    state: 'California',
    bestConditions: {
      swellDirection: ['West', 'Northwest'],
      windDirection: ['East', 'Northeast'],
      tide: ['Mid', 'High'],
      swellSize: '15-60ft',
    },
    currentConditions: {
      swellHeight: 25,
      swellPeriod: 18,
      swellDirection: 'West',
      windSpeed: 8,
      windDirection: 'East',
      tide: 'High',
      waterTemp: 58,
      airTemp: 65,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 25,
        swellPeriod: 18,
        swellDirection: 'West',
        windSpeed: 8,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 30,
        swellPeriod: 20,
        swellDirection: 'Northwest',
        windSpeed: 5,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Excellent',
    breakInfo: {
      type: 'Reef Break',
      waveDirection: 'West/Northwest',
      bottom: 'Rocky reef',
      hazards: ['Extremely large waves', 'Strong currents', 'Rocky bottom', 'Sharks'],
      bestTime: 'Big winter swells, mid to high tide',
      crowdFactor: 'Low - experts only',
      experience: 'Legendary big wave break that produces some of the largest rideable waves in the world.'
    }
  },
  {
    id: 'nc2',
    name: 'Ocean Beach (SF)',
    location: { lat: 37.7749, lng: -122.5094 },
    description: 'Powerful beach break in San Francisco with consistent surf but challenging conditions.',
    difficulty: 'Advanced',
    region: 'San Francisco',
    state: 'California',
    bestConditions: {
      swellDirection: ['West', 'Northwest'],
      windDirection: ['East', 'Northeast'],
      tide: ['Mid', 'Low'],
      swellSize: '4-12ft',
    },
    currentConditions: {
      swellHeight: 6,
      swellPeriod: 12,
      swellDirection: 'West',
      windSpeed: 15,
      windDirection: 'West',
      tide: 'Mid',
      waterTemp: 60,
      airTemp: 62,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 6,
        swellPeriod: 12,
        swellDirection: 'West',
        windSpeed: 15,
        windDirection: 'West',
      },
      {
        date: '2024-06-02',
        swellHeight: 8,
        swellPeriod: 14,
        swellDirection: 'Northwest',
        windSpeed: 10,
        windDirection: 'East',
      },
    ],
    conditionsRating: 'Fair',
  },
  {
    id: 'nc3',
    name: 'Steamer Lane',
    location: { lat: 36.9741, lng: -122.0308 },
    description: 'Classic Santa Cruz point break with consistent waves and rich surf history.',
    difficulty: 'Intermediate',
    region: 'Santa Cruz',
    state: 'California',
    bestConditions: {
      swellDirection: ['West', 'Northwest'],
      windDirection: ['East', 'Northeast'],
      tide: ['Mid', 'High'],
      swellSize: '4-15ft',
    },
    currentConditions: {
      swellHeight: 8,
      swellPeriod: 14,
      swellDirection: 'Northwest',
      windSpeed: 5,
      windDirection: 'East',
      tide: 'High',
      waterTemp: 62,
      airTemp: 68,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 8,
        swellPeriod: 14,
        swellDirection: 'Northwest',
        windSpeed: 5,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 10,
        swellPeriod: 16,
        swellDirection: 'West',
        windSpeed: 8,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Excellent',
  },

  // CENTRAL CALIFORNIA
  {
    id: 'cc1',
    name: 'Malibu (First Point)',
    location: { lat: 34.0259, lng: -118.6765 },
    description: 'World-famous right-hand point break, perfect for longboarding.',
    difficulty: 'Beginner',
    region: 'Malibu',
    state: 'California',
    bestConditions: {
      swellDirection: ['South', 'Southwest'],
      windDirection: ['North', 'Northeast'],
      tide: ['Mid', 'High'],
      swellSize: '2-8ft',
    },
    currentConditions: {
      swellHeight: 4,
      swellPeriod: 10,
      swellDirection: 'South',
      windSpeed: 3,
      windDirection: 'North',
      tide: 'Mid',
      waterTemp: 68,
      airTemp: 75,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 4,
        swellPeriod: 10,
        swellDirection: 'South',
        windSpeed: 3,
        windDirection: 'North',
      },
      {
        date: '2024-06-02',
        swellHeight: 5,
        swellPeriod: 12,
        swellDirection: 'Southwest',
        windSpeed: 5,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Good',
  },
  {
    id: 'cc2',
    name: 'Trestles (Lower)',
    location: { lat: 33.3894, lng: -117.5931 },
    description: 'World-class wave quality with perfect cobblestone point break.',
    difficulty: 'Intermediate',
    region: 'San Clemente',
    state: 'California',
    bestConditions: {
      swellDirection: ['South', 'Southwest'],
      windDirection: ['North', 'Northeast'],
      tide: ['Mid', 'Low'],
      swellSize: '3-10ft',
    },
    currentConditions: {
      swellHeight: 5,
      swellPeriod: 12,
      swellDirection: 'Southwest',
      windSpeed: 7,
      windDirection: 'Northeast',
      tide: 'Low',
      waterTemp: 66,
      airTemp: 72,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 5,
        swellPeriod: 12,
        swellDirection: 'Southwest',
        windSpeed: 7,
        windDirection: 'Northeast',
      },
      {
        date: '2024-06-02',
        swellHeight: 6,
        swellPeriod: 14,
        swellDirection: 'South',
        windSpeed: 5,
        windDirection: 'North',
      },
    ],
    conditionsRating: 'Good',
  },
  {
    id: 'cc3',
    name: 'Manhattan Beach',
    location: { lat: 33.8847, lng: -118.4109 },
    description: 'Consistent beach break in the South Bay with good surf infrastructure.',
    difficulty: 'Intermediate',
    region: 'South Bay',
    state: 'California',
    bestConditions: {
      swellDirection: ['South', 'Southwest', 'West'],
      windDirection: ['North', 'Northeast'],
      tide: ['All'],
      swellSize: '2-8ft',
    },
    currentConditions: {
      swellHeight: 3,
      swellPeriod: 8,
      swellDirection: 'Southwest',
      windSpeed: 10,
      windDirection: 'West',
      tide: 'Mid',
      waterTemp: 65,
      airTemp: 70,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 3,
        swellPeriod: 8,
        swellDirection: 'Southwest',
        windSpeed: 10,
        windDirection: 'West',
      },
      {
        date: '2024-06-02',
        swellHeight: 4,
        swellPeriod: 10,
        swellDirection: 'South',
        windSpeed: 8,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Fair',
  },

  // SOUTHERN CALIFORNIA
  {
    id: 'sc1',
    name: 'Pipeline (Banzai)',
    location: { lat: 21.6644, lng: -158.0522 },
    description: 'World-famous barrel wave in Hawaii. Extremely dangerous and challenging.',
    difficulty: 'Expert',
    region: 'North Shore',
    state: 'Hawaii',
    bestConditions: {
      swellDirection: ['North', 'Northwest'],
      windDirection: ['South', 'Southeast'],
      tide: ['Mid', 'Low'],
      swellSize: '6-20ft',
    },
    currentConditions: {
      swellHeight: 12,
      swellPeriod: 16,
      swellDirection: 'North',
      windSpeed: 12,
      windDirection: 'Southeast',
      tide: 'Low',
      waterTemp: 78,
      airTemp: 82,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 12,
        swellPeriod: 16,
        swellDirection: 'North',
        windSpeed: 12,
        windDirection: 'Southeast',
      },
      {
        date: '2024-06-02',
        swellHeight: 15,
        swellPeriod: 18,
        swellDirection: 'Northwest',
        windSpeed: 8,
        windDirection: 'South',
      },
    ],
    conditionsRating: 'Excellent',
  },
  {
    id: 'sc2',
    name: 'Huntington Beach',
    location: { lat: 33.6595, lng: -117.9988 },
    description: 'Surf City USA - consistent beach break with great surf culture.',
    difficulty: 'Beginner',
    region: 'Orange County',
    state: 'California',
    bestConditions: {
      swellDirection: ['South', 'Southwest', 'West'],
      windDirection: ['North', 'Northeast'],
      tide: ['All'],
      swellSize: '2-10ft',
    },
    currentConditions: {
      swellHeight: 4,
      swellPeriod: 9,
      swellDirection: 'Southwest',
      windSpeed: 6,
      windDirection: 'Northeast',
      tide: 'High',
      waterTemp: 67,
      airTemp: 74,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 4,
        swellPeriod: 9,
        swellDirection: 'Southwest',
        windSpeed: 6,
        windDirection: 'Northeast',
      },
      {
        date: '2024-06-02',
        swellHeight: 5,
        swellPeriod: 11,
        swellDirection: 'South',
        windSpeed: 4,
        windDirection: 'North',
      },
    ],
    conditionsRating: 'Good',
  },
  {
    id: 'sc3',
    name: 'Blacks Beach',
    location: { lat: 32.8898, lng: -117.2509 },
    description: 'Powerful beach break near UC San Diego, clothing optional beach.',
    difficulty: 'Advanced',
    region: 'San Diego',
    state: 'California',
    bestConditions: {
      swellDirection: ['West', 'Northwest'],
      windDirection: ['East', 'Northeast'],
      tide: ['Mid', 'Low'],
      swellSize: '4-15ft',
    },
    currentConditions: {
      swellHeight: 7,
      swellPeriod: 13,
      swellDirection: 'West',
      windSpeed: 9,
      windDirection: 'East',
      tide: 'Mid',
      waterTemp: 64,
      airTemp: 69,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 7,
        swellPeriod: 13,
        swellDirection: 'West',
        windSpeed: 9,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 9,
        swellPeriod: 15,
        swellDirection: 'Northwest',
        windSpeed: 6,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Good',
  },
];

// Helper functions for working with surf spots
export const getSpotById = (id: string): SurfSpot | undefined => {
  return surfSpots.find(spot => spot.id === id);
};

export const getSpotsByRegion = (region: string): SurfSpot[] => {
  return surfSpots.filter(spot => spot.region === region);
};

export const getSpotsByDifficulty = (difficulty: SurfSpot['difficulty']): SurfSpot[] => {
  return surfSpots.filter(spot => spot.difficulty === difficulty);
};

export const getSpotsByRating = (rating: SurfSpot['conditionsRating']): SurfSpot[] => {
  return surfSpots.filter(spot => spot.conditionsRating === rating);
};

export const getPopularSpots = (): SurfSpot[] => {
  // Return spots that are considered popular/famous
  const popularIds = ['nc1', 'nc3', 'cc1', 'cc2', 'sc1', 'sc2'];
  return surfSpots.filter(spot => popularIds.includes(spot.id));
};

export const searchSpots = (query: string): SurfSpot[] => {
  const lowercaseQuery = query.toLowerCase();
  return surfSpots.filter(spot => 
    spot.name.toLowerCase().includes(lowercaseQuery) ||
    spot.region.toLowerCase().includes(lowercaseQuery) ||
    spot.description.toLowerCase().includes(lowercaseQuery)
  );
}; 