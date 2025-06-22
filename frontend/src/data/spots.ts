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
  // WASHINGTON SPOTS
  {
    id: 'wa1',
    name: 'La Push (First Beach)',
    location: { lat: 47.9021, lng: -124.6357 },
    description: 'Remote beach break on the Olympic Peninsula with powerful Pacific swells.',
    difficulty: 'Advanced',
    region: 'Olympic Peninsula',
    state: 'Washington',
    bestConditions: {
      swellDirection: ['West', 'Northwest'],
      windDirection: ['East', 'Southeast'],
      tide: ['Mid', 'High'],
      swellSize: '6-15ft',
    },
    currentConditions: {
      swellHeight: 8,
      swellPeriod: 14,
      swellDirection: 'West',
      windSpeed: 15,
      windDirection: 'West',
      tide: 'Mid',
      waterTemp: 52,
      airTemp: 58,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 8,
        swellPeriod: 14,
        swellDirection: 'West',
        windSpeed: 15,
        windDirection: 'West',
      },
      {
        date: '2024-06-02',
        swellHeight: 10,
        swellPeriod: 16,
        swellDirection: 'Northwest',
        windSpeed: 12,
        windDirection: 'Southeast',
      },
    ],
    conditionsRating: 'Good',
    breakInfo: {
      type: 'Beach Break',
      waveDirection: 'West/Northwest',
      bottom: 'Sand with rocky outcrops',
      peakSections: ['North Peak', 'Central', 'South Bowl'],
      hazards: ['Strong currents', 'Rocky shoreline', 'Cold water', 'Remote location'],
      bestTime: 'Mid to high tide, early morning',
      crowdFactor: 'Low - remote location',
      experience: 'Powerful waves breaking over sandy bottom with rocky sections. Can produce excellent barrels on the right conditions. Best surfed by experienced surfers due to powerful currents and remote location.'
    },
    photos: [
      {
        id: 'lap_1',
        url: '/images/spots/la-push-1.jpg',
        title: 'La Push at Sunrise',
        description: 'Classic morning session with offshore winds',
        photographer: 'Pacific Northwest Surf',
        tags: ['sunrise', 'offshore', 'barrel']
      },
      {
        id: 'lap_2', 
        url: '/images/spots/la-push-2.jpg',
        title: 'Sea Stacks and Surf',
        description: 'Iconic sea stacks frame perfect waves',
        photographer: 'Olympic Coast Photography',
        tags: ['scenic', 'sea stacks', 'landscape']
      }
    ]
  },
  {
    id: 'wa2',
    name: 'Westport',
    location: { lat: 46.8981, lng: -124.1057 },
    description: 'Consistent beach break with good waves and surf infrastructure.',
    difficulty: 'Intermediate',
    region: 'Central Washington Coast',
    state: 'Washington',
    bestConditions: {
      swellDirection: ['West', 'Southwest'],
      windDirection: ['East', 'Northeast'],
      tide: ['All'],
      swellSize: '4-10ft',
    },
    currentConditions: {
      swellHeight: 5,
      swellPeriod: 12,
      swellDirection: 'West',
      windSpeed: 10,
      windDirection: 'East',
      tide: 'Low',
      waterTemp: 54,
      airTemp: 62,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 5,
        swellPeriod: 12,
        swellDirection: 'West',
        windSpeed: 10,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 6,
        swellPeriod: 13,
        swellDirection: 'Southwest',
        windSpeed: 8,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Good',
  },

  // OREGON SPOTS
  {
    id: 'or1',
    name: 'Cannon Beach',
    location: { lat: 45.8918, lng: -123.9615 },
    description: 'Iconic beach break with dramatic sea stacks and consistent surf.',
    difficulty: 'Intermediate',
    region: 'Northern Oregon',
    state: 'Oregon',
    bestConditions: {
      swellDirection: ['West', 'Northwest'],
      windDirection: ['East', 'Southeast'],
      tide: ['Mid'],
      swellSize: '4-12ft',
    },
    currentConditions: {
      swellHeight: 6,
      swellPeriod: 11,
      swellDirection: 'Northwest',
      windSpeed: 12,
      windDirection: 'East',
      tide: 'Mid',
      waterTemp: 56,
      airTemp: 64,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 6,
        swellPeriod: 11,
        swellDirection: 'Northwest',
        windSpeed: 12,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 7,
        swellPeriod: 12,
        swellDirection: 'West',
        windSpeed: 10,
        windDirection: 'Southeast',
      },
    ],
    conditionsRating: 'Excellent',
  },
  {
    id: 'or2',
    name: 'Short Sand Beach (Oswald West)',
    location: { lat: 45.7547, lng: -123.9700 },
    description: 'Protected cove with quality waves and beautiful forest setting.',
    difficulty: 'Advanced',
    region: 'Northern Oregon',
    state: 'Oregon',
    bestConditions: {
      swellDirection: ['West', 'Northwest'],
      windDirection: ['East', 'Variable'],
      tide: ['Low', 'Mid'],
      swellSize: '6-15ft',
    },
    currentConditions: {
      swellHeight: 8,
      swellPeriod: 13,
      swellDirection: 'West',
      windSpeed: 8,
      windDirection: 'Variable',
      tide: 'Low',
      waterTemp: 57,
      airTemp: 65,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 8,
        swellPeriod: 13,
        swellDirection: 'West',
        windSpeed: 8,
        windDirection: 'Variable',
      },
      {
        date: '2024-06-02',
        swellHeight: 9,
        swellPeriod: 14,
        swellDirection: 'Northwest',
        windSpeed: 6,
        windDirection: 'East',
      },
    ],
    conditionsRating: 'Excellent',
  },

  // NORTHERN CALIFORNIA SPOTS (keeping existing ones and adding more)
  {
    id: 'ca1',
    name: 'Mavericks',
    location: { lat: 37.4938, lng: -122.5005 },
    description: 'World-famous big wave break, one of the most dangerous surf spots in the world.',
    difficulty: 'Expert',
    region: 'Half Moon Bay',
    state: 'California',
    bestConditions: {
      swellDirection: ['West', 'Northwest'],
      windDirection: ['East', 'Southeast'],
      tide: ['Mid', 'High'],
      swellSize: '15-60ft',
    },
    currentConditions: {
      swellHeight: 25,
      swellPeriod: 18,
      swellDirection: 'Northwest',
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
        swellDirection: 'Northwest',
        windSpeed: 8,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 30,
        swellPeriod: 20,
        swellDirection: 'West',
        windSpeed: 5,
        windDirection: 'Southeast',
      },
    ],
    conditionsRating: 'Excellent',
    breakInfo: {
      type: 'Reef Break',
      waveDirection: 'Northwest/West',
      bottom: 'Deep water reef',
      peakSections: ['The Bowl', 'Outside Corner', 'Inside Ledge'],
      hazards: ['Massive waves', 'Shallow reef', 'Strong currents', 'Cold water', 'Great white sharks', 'Long hold-downs'],
      bestTime: 'High tide, big northwest swells',
      crowdFactor: 'Low - invitation only contest waves',
      experience: 'Legendary big wave break that only breaks on huge swells. Produces some of the largest rideable waves in the world. Extremely dangerous - for expert big wave surfers only.'
    },
    photos: [
      {
        id: 'mav_1',
        url: '/images/spots/mavericks-1.jpg',
        title: 'Mavericks Monster Wave',
        description: '40-foot wave at the peak of big wave season',
        photographer: 'Big Wave Photography Co.',
        tags: ['big wave', 'mavericks', 'epic']
      },
      {
        id: 'mav_2',
        url: '/images/spots/mavericks-2.jpg',
        title: 'Dawn Patrol at Mavs',
        description: 'First light reveals massive swells building',
        photographer: 'Northern California Surf',
        tags: ['dawn', 'big wave', 'atmospheric']
      },
      {
        id: 'mav_3',
        url: '/images/spots/mavericks-3.jpg',
        title: 'Aerial View of the Break',
        description: 'Drone shot showing the reef formation',
        photographer: 'Coastal Aerials',
        tags: ['aerial', 'reef', 'overview']
      }
    ]
  },
  {
    id: 'ca2',
    name: 'Trinidad',
    location: { lat: 41.0582, lng: -124.1426 },
    description: 'Scenic Northern California surf spot with consistent waves and beautiful coastline.',
    difficulty: 'Intermediate',
    region: 'Humboldt County',
    state: 'California',
    bestConditions: {
      swellDirection: ['West', 'Northwest'],
      windDirection: ['East', 'Northeast'],
      tide: ['Mid', 'High'],
      swellSize: '4-12ft',
    },
    currentConditions: {
      swellHeight: 6,
      swellPeriod: 13,
      swellDirection: 'West',
      windSpeed: 10,
      windDirection: 'East',
      tide: 'Mid',
      waterTemp: 55,
      airTemp: 63,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 6,
        swellPeriod: 13,
        swellDirection: 'West',
        windSpeed: 10,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 7,
        swellPeriod: 14,
        swellDirection: 'Northwest',
        windSpeed: 8,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Good',
    breakInfo: {
      type: 'Beach Break / Point Break',
      waveDirection: 'West/Northwest',
      bottom: 'Sandy beach with rocky points',
      peakSections: ['North Point', 'Main Beach', 'South Cove'],
      hazards: ['Rocky outcrops', 'Strong currents', 'Cold water', 'Marine life'],
      bestTime: 'Mid to high tide, morning glass',
      crowdFactor: 'Medium - popular but spacious',
      experience: 'Beautiful Northern California surf spot with multiple peaks and scenic backdrop. Offers both beach break and point break waves depending on conditions.'
    },
    photos: [
      {
        id: 'tri_1',
        url: '/images/spots/trinidad-1.jpg',
        title: 'Trinidad Head Sunrise',
        description: 'Morning glass-off with Trinidad Head in background',
        photographer: 'Redwood Coast Photography',
        tags: ['sunrise', 'trinidad head', 'scenic']
      },
      {
        id: 'tri_2',
        url: '/images/spots/trinidad-2.jpg',
        title: 'Perfect Point Wave',
        description: 'Clean right-hand point break at the north end',
        photographer: 'NorCal Surf Stories',
        tags: ['point break', 'right-hand', 'clean']
      }
    ]
  },
  {
    id: 'norcal1',
    name: 'Trinidad',
    location: { lat: 41.0581, lng: -124.1429 },
    description: 'Scenic point break in Humboldt County with consistent surf.',
    difficulty: 'Advanced',
    region: 'Humboldt County',
    state: 'California',
    bestConditions: {
      swellDirection: ['West', 'Northwest'],
      windDirection: ['East', 'Southeast'],
      tide: ['Mid', 'High'],
      swellSize: '6-12ft',
    },
    currentConditions: {
      swellHeight: 7,
      swellPeriod: 13,
      swellDirection: 'Northwest',
      windSpeed: 12,
      windDirection: 'East',
      tide: 'High',
      waterTemp: 54,
      airTemp: 62,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 7,
        swellPeriod: 13,
        swellDirection: 'Northwest',
        windSpeed: 12,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 8,
        swellPeriod: 14,
        swellDirection: 'West',
        windSpeed: 10,
        windDirection: 'Southeast',
      },
    ],
    conditionsRating: 'Good',
  },
  {
    id: 'norcal2',
    name: 'Mendocino',
    location: { lat: 39.3074, lng: -123.8014 },
    description: 'Rugged coastline with powerful waves and dramatic cliffs.',
    difficulty: 'Advanced',
    region: 'Mendocino County',
    state: 'California',
    bestConditions: {
      swellDirection: ['West', 'Northwest'],
      windDirection: ['East', 'Variable'],
      tide: ['Mid'],
      swellSize: '6-15ft',
    },
    currentConditions: {
      swellHeight: 9,
      swellPeriod: 14,
      swellDirection: 'West',
      windSpeed: 15,
      windDirection: 'West',
      tide: 'Mid',
      waterTemp: 56,
      airTemp: 64,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 9,
        swellPeriod: 14,
        swellDirection: 'West',
        windSpeed: 15,
        windDirection: 'West',
      },
      {
        date: '2024-06-02',
        swellHeight: 11,
        swellPeriod: 15,
        swellDirection: 'Northwest',
        windSpeed: 12,
        windDirection: 'East',
      },
    ],
    conditionsRating: 'Fair',
  },
  {
    id: 'norcal3',
    name: 'Bolinas',
    location: { lat: 37.9097, lng: -122.6867 },
    description: 'Protected bay with mellow waves, perfect for longboarding.',
    difficulty: 'Beginner',
    region: 'Marin County',
    state: 'California',
    bestConditions: {
      swellDirection: ['West', 'Southwest'],
      windDirection: ['East', 'Northeast'],
      tide: ['Mid', 'High'],
      swellSize: '3-8ft',
    },
    currentConditions: {
      swellHeight: 4,
      swellPeriod: 10,
      swellDirection: 'West',
      windSpeed: 6,
      windDirection: 'East',
      tide: 'High',
      waterTemp: 58,
      airTemp: 66,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 4,
        swellPeriod: 10,
        swellDirection: 'West',
        windSpeed: 6,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 5,
        swellPeriod: 11,
        swellDirection: 'Southwest',
        windSpeed: 5,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Good',
  },

  // EXISTING CALIFORNIA SPOTS (updated with regions)
  {
    id: 'ca4',
    name: 'Ocean Beach',
    location: { lat: 37.7749, lng: -122.5094 },
    description: 'Powerful beach break in San Francisco with consistent waves and challenging conditions.',
    difficulty: 'Advanced',
    region: 'San Francisco',
    state: 'California',
    bestConditions: {
      swellDirection: ['West', 'Northwest'],
      windDirection: ['East', 'Northeast'],
      tide: ['Low', 'Mid'],
      swellSize: '4-12ft',
    },
    currentConditions: {
      swellHeight: 6,
      swellPeriod: 12,
      swellDirection: 'Northwest',
      windSpeed: 15,
      windDirection: 'West',
      tide: 'Low',
      waterTemp: 58,
      airTemp: 62,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 6,
        swellPeriod: 12,
        swellDirection: 'Northwest',
        windSpeed: 15,
        windDirection: 'West',
      },
      {
        date: '2024-06-02',
        swellHeight: 8,
        swellPeriod: 13,
        swellDirection: 'West',
        windSpeed: 12,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Fair',
    breakInfo: {
      type: 'Beach Break',
      waveDirection: 'West/Northwest',
      bottom: 'Sand',
      peakSections: ['VFW', 'Sloat', 'The Point'],
      hazards: ['Strong currents', 'Great white sharks', 'Cold water', 'Fog', 'Powerful waves'],
      bestTime: 'Low to mid tide, offshore winds',
      crowdFactor: 'Medium - shared with many peaks',
      experience: 'Powerful San Francisco beach break with multiple peaks. Known for heavy waves and challenging conditions. Cold water and strong currents require experience and proper equipment.'
    },
    photos: [
      {
        id: 'ob_1',
        url: '/images/spots/ocean-beach-1.jpg',
        title: 'Golden Gate Bridge Backdrop',
        description: 'Epic surf session with the Golden Gate Bridge in view',
        photographer: 'SF Surf Photography',
        tags: ['golden gate', 'iconic', 'san francisco']
      },
      {
        id: 'ob_2',
        url: '/images/spots/ocean-beach-2.jpg',
        title: 'Heavy Ocean Beach Barrel',
        description: 'Powerful tube ride on a big northwest swell',
        photographer: 'Northern California Surf',
        tags: ['barrel', 'powerful', 'heavy']
      }
    ]
  },
  {
    id: '2',
    name: 'Steamer Lane',
    location: { lat: 36.9508, lng: -122.0228 },
    description: 'Santa Cruz\'s premier surf spot, world-class right-hand point break.',
    difficulty: 'Advanced',
    region: 'Santa Cruz',
    state: 'California',
    bestConditions: {
      swellDirection: ['West', 'Northwest'],
      windDirection: ['East', 'Northeast'],
      tide: ['Mid', 'High'],
      swellSize: '6-15ft',
    },
    currentConditions: {
      swellHeight: 8,
      swellPeriod: 14,
      swellDirection: 'Northwest',
      windSpeed: 6,
      windDirection: 'East',
      tide: 'High',
      waterTemp: 60,
      airTemp: 68,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 8,
        swellPeriod: 14,
        swellDirection: 'Northwest',
        windSpeed: 6,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 10,
        swellPeriod: 15,
        swellDirection: 'West',
        windSpeed: 4,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Excellent',
    breakInfo: {
      type: 'Point Break',
      waveDirection: 'Northwest/West',
      bottom: 'Rock reef',
      peakSections: ['The Point', 'Middle Peak', 'Indicators'],
      hazards: ['Sharp rocks', 'Strong currents', 'Crowds', 'Aggressive locals'],
      bestTime: 'Mid to high tide, northwest swells',
      crowdFactor: 'Very High - world famous spot',
      experience: 'World-class right-hand point break, home to many professional surfers. Consistent and powerful waves with long rides when conditions align. Expect crowds and competitive atmosphere.'
    },
    photos: [
      {
        id: 'steam_1',
        url: '/images/spots/steamer-lane-1.jpg',
        title: 'Classic Steamer Lane Right',
        description: 'Perfect right-hand barrel on a northwest swell',
        photographer: 'Santa Cruz Surf Photography',
        tags: ['barrel', 'right-hand', 'classic']
      },
      {
        id: 'steam_2',
        url: '/images/spots/steamer-lane-2.jpg',
        title: 'Contest Day at Steamer',
        description: 'Professional surf contest with perfect conditions',
        photographer: 'Surf Contest Media',
        tags: ['contest', 'professional', 'crowded']
      },
      {
        id: 'steam_3',
        url: '/images/spots/steamer-lane-3.jpg',
        title: 'Lighthouse and Waves',
        description: 'Iconic Santa Cruz lighthouse overlooking the break',
        photographer: 'Central Coast Visions',
        tags: ['lighthouse', 'iconic', 'santa cruz']
      }
    ]
  },
  {
    id: 'central1',
    name: 'Moss Landing',
    location: { lat: 36.8039, lng: -121.7903 },
    description: 'Jetty break with consistent waves and good for intermediate surfers.',
    difficulty: 'Intermediate',
    region: 'Monterey County',
    state: 'California',
    bestConditions: {
      swellDirection: ['West', 'Southwest'],
      windDirection: ['East', 'Northeast'],
      tide: ['Mid'],
      swellSize: '4-10ft',
    },
    currentConditions: {
      swellHeight: 5,
      swellPeriod: 11,
      swellDirection: 'West',
      windSpeed: 8,
      windDirection: 'East',
      tide: 'Mid',
      waterTemp: 59,
      airTemp: 67,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 5,
        swellPeriod: 11,
        swellDirection: 'West',
        windSpeed: 8,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 6,
        swellPeriod: 12,
        swellDirection: 'Southwest',
        windSpeed: 7,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Good',
  },
  {
    id: '10',
    name: 'Pismo Beach',
    location: { lat: 35.1428, lng: -120.6413 },
    description: 'Long beach break with consistent waves and easy access.',
    difficulty: 'Beginner',
    region: 'San Luis Obispo County',
    state: 'California',
    bestConditions: {
      swellDirection: ['West', 'Southwest'],
      windDirection: ['East', 'Northeast'],
      tide: ['All'],
      swellSize: '2-8ft',
    },
    currentConditions: {
      swellHeight: 4,
      swellPeriod: 11,
      swellDirection: 'West',
      windSpeed: 7,
      windDirection: 'East',
      tide: 'Mid',
      waterTemp: 61,
      airTemp: 69,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 4,
        swellPeriod: 11,
        swellDirection: 'West',
        windSpeed: 7,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 5,
        swellPeriod: 12,
        swellDirection: 'Southwest',
        windSpeed: 6,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Good',
  },

  // SOUTHERN CALIFORNIA SPOTS
  {
    id: '3',
    name: 'Rincon',
    location: { lat: 34.3717, lng: -119.475 },
    description: 'World-class point break known as the "Queen of the Coast" with perfect right-handers.',
    difficulty: 'Intermediate',
    region: 'Santa Barbara County',
    state: 'California',
    bestConditions: {
      swellDirection: ['West', 'Northwest'],
      windDirection: ['East', 'Northeast'],
      tide: ['Mid to High'],
      swellSize: '4-10ft',
    },
    currentConditions: {
      swellHeight: 6,
      swellPeriod: 14,
      swellDirection: 'West',
      windSpeed: 6,
      windDirection: 'East',
      tide: 'High',
      waterTemp: 62,
      airTemp: 68,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 6,
        swellPeriod: 14,
        swellDirection: 'West',
        windSpeed: 6,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 8,
        swellPeriod: 16,
        swellDirection: 'Northwest',
        windSpeed: 5,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Good',
  },
  {
    id: 'ca8',
    name: 'C Street (Ventura)',
    location: { lat: 34.2681, lng: -119.3206 },
    description: 'Classic California point break offering long rides and perfect form.',
    difficulty: 'Intermediate',
    region: 'Ventura County',
    state: 'California',
    bestConditions: {
      swellDirection: ['West', 'Southwest'],
      windDirection: ['North', 'Northeast'],
      tide: ['Mid', 'High'],
      swellSize: '3-10ft',
    },
    currentConditions: {
      swellHeight: 5,
      swellPeriod: 12,
      swellDirection: 'West',
      windSpeed: 8,
      windDirection: 'North',
      tide: 'Mid',
      waterTemp: 64,
      airTemp: 70,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 5,
        swellPeriod: 12,
        swellDirection: 'West',
        windSpeed: 8,
        windDirection: 'North',
      },
      {
        date: '2024-06-02',
        swellHeight: 6,
        swellPeriod: 13,
        swellDirection: 'Southwest',
        windSpeed: 6,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Good',
    breakInfo: {
      type: 'Point Break',
      waveDirection: 'West/Southwest',
      bottom: 'Cobblestone and sand',
      peakSections: ['The Point', 'Mondos', 'Stables'],
      hazards: ['Crowds', 'Rocks', 'Strong currents on bigger days'],
      bestTime: 'Mid to high tide, clean west/southwest swells',
      crowdFactor: 'High - classic California point break',
      experience: 'Perfect California point break offering long, workable waves ideal for progression. Classic right-hand waves breaking over cobblestone bottom. Great for practicing maneuvers and building confidence.'
    },
    photos: [
      {
        id: 'cstreet_1',
        url: '/images/spots/c-street-1.jpg',
        title: 'Perfect Point Break Form',
        description: 'Clean right-hand wave peeling down the point',
        photographer: 'Ventura Surf Co.',
        tags: ['point break', 'clean', 'perfect form']
      },
      {
        id: 'cstreet_2',
        url: '/images/spots/c-street-2.jpg',
        title: 'Longboard Paradise',
        description: 'Classic California longboarding at its finest',
        photographer: 'Central Coast Surf',
        tags: ['longboard', 'classic', 'style']
      },
      {
        id: 'cstreet_3',
        url: '/images/spots/c-street-3.jpg',
        title: 'Ventura Coastline',
        description: 'Aerial view of C Street and the Ventura coastline',
        photographer: 'Coastal California Aerials',
        tags: ['aerial', 'coastline', 'ventura']
      }
    ]
  },
  {
    id: '4',
    name: 'Malibu',
    location: { lat: 34.0361, lng: -118.6797 },
    description: 'World-famous right-hand point break, the birthplace of California surf culture.',
    difficulty: 'Intermediate',
    region: 'Los Angeles County',
    state: 'California',
    bestConditions: {
      swellDirection: ['West', 'Southwest'],
      windDirection: ['North', 'Northeast'],
      tide: ['Mid', 'High'],
      swellSize: '3-8ft',
    },
    currentConditions: {
      swellHeight: 4,
      swellPeriod: 12,
      swellDirection: 'Southwest',
      windSpeed: 5,
      windDirection: 'North',
      tide: 'Mid',
      waterTemp: 68,
      airTemp: 75,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 4,
        swellPeriod: 12,
        swellDirection: 'Southwest',
        windSpeed: 5,
        windDirection: 'North',
      },
      {
        date: '2024-06-02',
        swellHeight: 5,
        swellPeriod: 13,
        swellDirection: 'West',
        windSpeed: 3,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Good',
    breakInfo: {
      type: 'Point Break',
      waveDirection: 'Southwest/West',
      bottom: 'Cobblestone and sand',
      peakSections: ['First Point', 'Second Point', 'Third Point'],
      hazards: ['Crowds', 'Rocks', 'Strong currents on big days'],
      bestTime: 'Mid to high tide, summer south swells',
      crowdFactor: 'Extremely High - world famous',
      experience: 'Legendary surf spot where modern surf culture began. Perfect beginner-friendly waves most of the time, but can handle larger swells. Expect massive crowds and a party atmosphere.'
    },
    photos: [
      {
        id: 'mal_1',
        url: '/images/spots/malibu-1.jpg',
        title: 'Classic Malibu Right',
        description: 'Perfect summer day with glassy conditions',
        photographer: 'Malibu Surf Club',
        tags: ['classic', 'summer', 'glassy']
      },
      {
        id: 'mal_2',
        url: '/images/spots/malibu-2.jpg',
        title: 'Malibu Pier Lineup',
        description: 'Crowded lineup on a weekend morning',
        photographer: 'LA Surf Photography',
        tags: ['crowded', 'pier', 'weekend']
      },
      {
        id: 'mal_3',
        url: '/images/spots/malibu-3.jpg',
        title: 'Sunset Session',
        description: 'Golden hour surf session at First Point',
        photographer: 'California Dreaming Photos',
        tags: ['sunset', 'golden hour', 'first point']
      },
      {
        id: 'mal_4',
        url: '/images/spots/malibu-4.jpg',
        title: 'Vintage Malibu',
        description: 'Classic longboard style at the birthplace of surf culture',
        photographer: 'Surf Heritage Foundation',
        tags: ['longboard', 'vintage', 'heritage']
      }
    ]
  },
  {
    id: 'la1',
    name: 'Zuma Beach',
    location: { lat: 34.0333, lng: -118.8167 },
    description: 'Popular beach break with powerful waves and beautiful setting.',
    difficulty: 'Intermediate',
    region: 'Los Angeles County',
    state: 'California',
    bestConditions: {
      swellDirection: ['South', 'Southwest'],
      windDirection: ['North', 'East'],
      tide: ['Mid'],
      swellSize: '3-8ft',
    },
    currentConditions: {
      swellHeight: 4,
      swellPeriod: 11,
      swellDirection: 'Southwest',
      windSpeed: 6,
      windDirection: 'North',
      tide: 'Mid',
      waterTemp: 64,
      airTemp: 72,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 4,
        swellPeriod: 11,
        swellDirection: 'Southwest',
        windSpeed: 6,
        windDirection: 'North',
      },
      {
        date: '2024-06-02',
        swellHeight: 5,
        swellPeriod: 12,
        swellDirection: 'South',
        windSpeed: 5,
        windDirection: 'East',
      },
    ],
    conditionsRating: 'Good',
  },
  {
    id: '12',
    name: 'Huntington Beach',
    location: { lat: 33.6553, lng: -117.9988 },
    description: 'Famous "Surf City USA" beach break with consistent waves and great facilities.',
    difficulty: 'Intermediate',
    region: 'Orange County',
    state: 'California',
    bestConditions: {
      swellDirection: ['South', 'Southwest'],
      windDirection: ['North', 'Northeast'],
      tide: ['Mid'],
      swellSize: '3-10ft',
    },
    currentConditions: {
      swellHeight: 4,
      swellPeriod: 11,
      swellDirection: 'Southwest',
      windSpeed: 6,
      windDirection: 'North',
      tide: 'Mid',
      waterTemp: 66,
      airTemp: 73,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 4,
        swellPeriod: 11,
        swellDirection: 'Southwest',
        windSpeed: 6,
        windDirection: 'North',
      },
      {
        date: '2024-06-02',
        swellHeight: 5,
        swellPeriod: 12,
        swellDirection: 'South',
        windSpeed: 5,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Good',
  },
  {
    id: '11',
    name: 'Trestles',
    location: { lat: 33.3886, lng: -117.5914 },
    description: 'World-class surf break with multiple peaks, consistent waves year-round.',
    difficulty: 'Intermediate',
    region: 'North County San Diego',
    state: 'California',
    bestConditions: {
      swellDirection: ['West', 'Southwest'],
      windDirection: ['East', 'Northeast'],
      tide: ['Low', 'Mid'],
      swellSize: '3-10ft',
    },
    currentConditions: {
      swellHeight: 5,
      swellPeriod: 11,
      swellDirection: 'Southwest',
      windSpeed: 8,
      windDirection: 'East',
      tide: 'Low',
      waterTemp: 66,
      airTemp: 72,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 5,
        swellPeriod: 11,
        swellDirection: 'Southwest',
        windSpeed: 8,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 6,
        swellPeriod: 12,
        swellDirection: 'West',
        windSpeed: 6,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Excellent',
    breakInfo: {
      type: 'Beach Break / Point Break',
      waveDirection: 'Southwest/West',
      bottom: 'Sand and cobblestone',
      peakSections: ['Uppers', 'Lowers', 'Middles', 'Church'],
      hazards: ['Crowds', 'Rocky areas', 'Strong currents'],
      bestTime: 'Low to mid tide, offshore winds',
      crowdFactor: 'Very High - world tour venue',
      experience: 'Consistently excellent surf with multiple world-class breaks. Home to professional surf contests including World Championship Tour events. Various peaks accommodate all skill levels.'
    },
    photos: [
      {
        id: 'tres_1',
        url: '/images/spots/trestles-1.jpg',
        title: 'Lowers Perfection',
        description: 'World Championship Tour quality waves at Lower Trestles',
        photographer: 'WSL Photography',
        tags: ['professional', 'perfect', 'contest']
      },
      {
        id: 'tres_2',
        url: '/images/spots/trestles-2.jpg',
        title: 'Uppers Dawn Session',
        description: 'Early morning glass at Upper Trestles',
        photographer: 'San Clemente Surf',
        tags: ['dawn', 'uppers', 'glassy']
      },
      {
        id: 'tres_3',
        url: '/images/spots/trestles-3.jpg',
        title: 'Trail to Paradise',
        description: 'The famous walk down to Trestles beach',
        photographer: 'California State Parks',
        tags: ['trail', 'access', 'nature']
      }
    ]
  },
  {
    id: 'oc1',
    name: 'Salt Creek',
    location: { lat: 33.4833, lng: -117.7167 },
    description: 'High-performance reef break with perfect barrels when conditions align.',
    difficulty: 'Expert',
    region: 'Orange County',
    state: 'California',
    bestConditions: {
      swellDirection: ['South', 'Southwest'],
      windDirection: ['North', 'East'],
      tide: ['Low', 'Mid'],
      swellSize: '4-12ft',
    },
    currentConditions: {
      swellHeight: 7,
      swellPeriod: 14,
      swellDirection: 'South',
      windSpeed: 8,
      windDirection: 'East',
      tide: 'Low',
      waterTemp: 66,
      airTemp: 74,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 7,
        swellPeriod: 14,
        swellDirection: 'South',
        windSpeed: 8,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 9,
        swellPeriod: 15,
        swellDirection: 'Southwest',
        windSpeed: 6,
        windDirection: 'North',
      },
    ],
    conditionsRating: 'Excellent',
  },
  {
    id: '20',
    name: 'Swamis',
    location: { lat: 33.0361, lng: -117.2911 },
    description: 'Classic point break in Encinitas with long, fast rides and consistent waves.',
    difficulty: 'Intermediate',
    region: 'San Diego County',
    state: 'California',
    bestConditions: {
      swellDirection: ['South', 'Southwest'],
      windDirection: ['East', 'Northeast'],
      tide: ['Mid'],
      swellSize: '3-8ft',
    },
    currentConditions: {
      swellHeight: 4,
      swellPeriod: 11,
      swellDirection: 'South',
      windSpeed: 5,
      windDirection: 'East',
      tide: 'Mid',
      waterTemp: 66,
      airTemp: 73,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 4,
        swellPeriod: 11,
        swellDirection: 'South',
        windSpeed: 5,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 5,
        swellPeriod: 12,
        swellDirection: 'Southwest',
        windSpeed: 4,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Good',
  },
  {
    id: '18',
    name: 'La Jolla Shores',
    location: { lat: 32.8569, lng: -117.2569 },
    description: 'Gentle beach break perfect for beginners, families, and longboarders.',
    difficulty: 'Beginner',
    region: 'San Diego County',
    state: 'California',
    bestConditions: {
      swellDirection: ['South', 'Southwest'],
      windDirection: ['East', 'Northeast'],
      tide: ['Mid to High'],
      swellSize: '2-5ft',
    },
    currentConditions: {
      swellHeight: 2,
      swellPeriod: 8,
      swellDirection: 'South',
      windSpeed: 4,
      windDirection: 'East',
      tide: 'High',
      waterTemp: 68,
      airTemp: 75,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 2,
        swellPeriod: 8,
        swellDirection: 'South',
        windSpeed: 4,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 3,
        swellPeriod: 9,
        swellDirection: 'Southwest',
        windSpeed: 3,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Good',
  },
  {
    id: '19',
    name: 'Windansea',
    location: { lat: 32.8331, lng: -117.2753 },
    description: 'La Jolla\'s premier surf spot, known for powerful waves and scenic beauty.',
    difficulty: 'Advanced',
    region: 'La Jolla',
    state: 'California',
    bestConditions: {
      swellDirection: ['West', 'Northwest'],
      windDirection: ['East', 'Northeast'],
      tide: ['Mid', 'High'],
      swellSize: '4-12ft',
    },
    currentConditions: {
      swellHeight: 6,
      swellPeriod: 13,
      swellDirection: 'West',
      windSpeed: 7,
      windDirection: 'East',
      tide: 'Mid',
      waterTemp: 68,
      airTemp: 73,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 6,
        swellPeriod: 13,
        swellDirection: 'West',
        windSpeed: 7,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 7,
        swellPeriod: 14,
        swellDirection: 'Northwest',
        windSpeed: 5,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Good',
    breakInfo: {
      type: 'Reef Break',
      waveDirection: 'West/Northwest',
      bottom: 'Rocky reef and sand',
      peakSections: ['The Shack', 'North Peak', 'South Reef'],
      hazards: ['Sharp reef', 'Strong currents', 'Shallow water', 'Sea urchins'],
      bestTime: 'Mid to high tide, winter swells',
      crowdFactor: 'High - famous La Jolla spot',
      experience: 'Powerful and challenging surf break over rocky reef. Known for producing some of San Diego\'s best waves and most photogenic surf sessions. Requires experience due to reef hazards.'
    },
    photos: [
      {
        id: 'wind_1',
        url: '/images/spots/windansea-1.jpg',
        title: 'The Famous Shack',
        description: 'Iconic surf shack with perfect waves breaking behind',
        photographer: 'La Jolla Surf Photography',
        tags: ['shack', 'iconic', 'perfect waves']
      },
      {
        id: 'wind_2',
        url: '/images/spots/windansea-2.jpg',
        title: 'Reef Break Power',
        description: 'Powerful waves breaking over the shallow reef',
        photographer: 'San Diego Surf Stories',
        tags: ['reef break', 'powerful', 'shallow']
      },
      {
        id: 'wind_3',
        url: '/images/spots/windansea-3.jpg',
        title: 'La Jolla Coastline',
        description: 'Aerial view of Windansea and the stunning La Jolla coast',
        photographer: 'Coastal Aerials San Diego',
        tags: ['aerial', 'coastline', 'scenic']
      }
    ]
  },
  {
    id: 'sd1',
    name: 'Ocean Beach (San Diego)',
    location: { lat: 32.7500, lng: -117.2500 },
    description: 'Powerful beach break with consistent surf and local vibe.',
    difficulty: 'Advanced',
    region: 'San Diego County',
    state: 'California',
    bestConditions: {
      swellDirection: ['South', 'Southwest'],
      windDirection: ['East', 'Northeast'],
      tide: ['Low', 'Mid'],
      swellSize: '4-12ft',
    },
    currentConditions: {
      swellHeight: 6,
      swellPeriod: 12,
      swellDirection: 'Southwest',
      windSpeed: 8,
      windDirection: 'East',
      tide: 'Low',
      waterTemp: 67,
      airTemp: 73,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 6,
        swellPeriod: 12,
        swellDirection: 'Southwest',
        windSpeed: 8,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 7,
        swellPeriod: 13,
        swellDirection: 'South',
        windSpeed: 7,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Good',
  },
  {
    id: 'sd2',
    name: 'Sunset Cliffs',
    location: { lat: 32.7157, lng: -117.2544 },
    description: 'Dramatic clifftop surf spot with multiple breaks and stunning sunset views.',
    difficulty: 'Advanced',
    region: 'Ocean Beach',
    state: 'California',
    bestConditions: {
      swellDirection: ['West', 'Southwest'],
      windDirection: ['East', 'Northeast'],
      tide: ['Mid', 'High'],
      swellSize: '4-15ft',
    },
    currentConditions: {
      swellHeight: 7,
      swellPeriod: 12,
      swellDirection: 'Southwest',
      windSpeed: 9,
      windDirection: 'East',
      tide: 'High',
      waterTemp: 67,
      airTemp: 71,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 7,
        swellPeriod: 12,
        swellDirection: 'Southwest',
        windSpeed: 9,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 8,
        swellPeriod: 13,
        swellDirection: 'West',
        windSpeed: 6,
        windDirection: 'Northeast',
      },
    ],
    conditionsRating: 'Good',
    breakInfo: {
      type: 'Reef Break / Point Break',
      waveDirection: 'Southwest/West',
      bottom: 'Rocky reef and underwater caves',
      peakSections: ['Abs', 'Garbage', 'New Break', 'Cornhole'],
      hazards: ['Shallow reef', 'Sharp rocks', 'Strong currents', 'Difficult access', 'Cliff jumping areas'],
      bestTime: 'Mid to high tide, winter swells',
      crowdFactor: 'Medium - challenging access',
      experience: 'Spectacular cliff-side surf spot with multiple challenging breaks. Known for dramatic scenery and powerful waves. Requires advanced skills due to reef hazards and difficult ocean entry/exit.'
    },
    photos: [
      {
        id: 'sunset_1',
        url: '/images/spots/sunset-cliffs-1.jpg',
        title: 'Golden Hour Session',
        description: 'Surfer silhouetted against the famous Sunset Cliffs sunset',
        photographer: 'San Diego Sunsets',
        tags: ['sunset', 'silhouette', 'golden hour']
      },
      {
        id: 'sunset_2',
        url: '/images/spots/sunset-cliffs-2.jpg',
        title: 'Dramatic Cliffside',
        description: 'The rugged beauty of Sunset Cliffs coastline',
        photographer: 'Point Loma Photography',
        tags: ['cliffs', 'dramatic', 'coastline']
      },
      {
        id: 'sunset_3',
        url: '/images/spots/sunset-cliffs-3.jpg',
        title: 'Perfect Reef Break',
        description: 'Clean waves breaking over the shallow reef',
        photographer: 'OB Surf Chronicles',
        tags: ['reef break', 'clean waves', 'shallow']
      },
      {
        id: 'sunset_4',
        url: '/images/spots/sunset-cliffs-4.jpg',
        title: 'Cave and Arch Views',
        description: 'Natural rock formations frame the surf break',
        photographer: 'Geological Wonders',
        tags: ['caves', 'arches', 'geology']
      }
    ]
  }
]; 