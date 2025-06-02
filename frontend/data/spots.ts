export interface SpotPhoto {
  id: string;
  url: string;
  title: string;
  description?: string;
  photographer?: string;
  tags?: string[];
}

export interface SurfSpot {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  difficulty: string;
  description: string;
  conditionsRating: string;
  currentConditions: {
    swellHeight: string;
    swellPeriod: string;
    swellDirection: string;
    windSpeed: string;
    windDirection: string;
    tide: string;
    waterTemp: string;
    airTemp: string;
  };
  bestConditions: {
    swellSize: string;
    swellDirection: string[];
    windDirection: string[];
    tide: string[];
  };
  forecast: Array<{
    date: string;
    swellHeight: string;
    swellPeriod: string;
    swellDirection: string;
    windSpeed: string;
    windDirection: string;
  }>;
  photos: SpotPhoto[];
}

export const surfSpots: SurfSpot[] = [
  {
    id: 'mavericks',
    name: 'Mavericks',
    location: {
      lat: 37.4925,
      lng: -122.5014,
    },
    difficulty: 'Expert',
    description: 'World-famous big wave surf spot. Only for the most experienced surfers.',
    conditionsRating: 'Good',
    currentConditions: {
      swellHeight: '15-20ft',
      swellPeriod: '16s',
      swellDirection: 'NW',
      windSpeed: '12mph',
      windDirection: 'E',
      tide: 'Mid tide, rising',
      waterTemp: '58°F',
      airTemp: '62°F',
    },
    bestConditions: {
      swellSize: '15-25ft+',
      swellDirection: ['NW', 'W'],
      windDirection: ['E', 'SE', 'Light'],
      tide: ['Mid', 'High'],
    },
    forecast: [
      {
        date: 'Today',
        swellHeight: '15-20ft',
        swellPeriod: '16s',
        swellDirection: 'NW',
        windSpeed: '12mph',
        windDirection: 'E',
      },
      {
        date: 'Tomorrow',
        swellHeight: '12-18ft',
        swellPeriod: '15s',
        swellDirection: 'NW',
        windSpeed: '8mph',
        windDirection: 'NE',
      },
      {
        date: 'Day 3',
        swellHeight: '10-15ft',
        swellPeriod: '14s',
        swellDirection: 'NW',
        windSpeed: '6mph',
        windDirection: 'Variable',
      },
    ],
    photos: [
      {
        id: 'mav-1',
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        title: 'Mavericks Big Wave',
        description: 'Massive waves breaking at the legendary Mavericks surf spot in Half Moon Bay.',
        photographer: 'Unsplash',
        tags: ['big wave', 'dangerous', 'expert only']
      },
      {
        id: 'mav-2',
        url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        title: 'Surfer at Mavericks',
        description: 'A brave surfer taking on the powerful waves at Mavericks.',
        photographer: 'Unsplash',
        tags: ['surfer', 'big wave', 'action']
      },
      {
        id: 'mav-3',
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        title: 'California Coast',
        description: 'The rugged Northern California coastline near Mavericks.',
        photographer: 'Unsplash',
        tags: ['coastline', 'california', 'landscape']
      }
    ]
  },
  {
    id: 'steamer-lane',
    name: 'Steamer Lane',
    location: {
      lat: 36.9560,
      lng: -122.0264,
    },
    difficulty: 'Advanced',
    description: 'Classic Santa Cruz surf break known for consistent waves.',
    conditionsRating: 'Excellent',
    currentConditions: {
      swellHeight: '6-8ft',
      swellPeriod: '12s',
      swellDirection: 'NW',
      windSpeed: '8mph',
      windDirection: 'NE',
      tide: 'Low tide, rising',
      waterTemp: '61°F',
      airTemp: '68°F',
    },
    bestConditions: {
      swellSize: '4-10ft',
      swellDirection: ['NW', 'W'],
      windDirection: ['E', 'NE', 'Offshore'],
      tide: ['Low', 'Mid'],
    },
    forecast: [
      {
        date: 'Today',
        swellHeight: '6-8ft',
        swellPeriod: '12s',
        swellDirection: 'NW',
        windSpeed: '8mph',
        windDirection: 'NE',
      },
      {
        date: 'Tomorrow',
        swellHeight: '5-7ft',
        swellPeriod: '11s',
        swellDirection: 'NW',
        windSpeed: '10mph',
        windDirection: 'E',
      },
      {
        date: 'Day 3',
        swellHeight: '4-6ft',
        swellPeriod: '10s',
        swellDirection: 'NW',
        windSpeed: '6mph',
        windDirection: 'Variable',
      },
    ],
    photos: [
      {
        id: 'steam-1',
        url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        title: 'Perfect Barrel',
        description: 'A classic barrel wave similar to those found at Steamer Lane.',
        photographer: 'Unsplash',
        tags: ['barrel', 'tube', 'perfect wave']
      },
      {
        id: 'steam-2',
        url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        title: 'Santa Cruz Surfing',
        description: 'Surfers enjoying the consistent waves in Santa Cruz.',
        photographer: 'Unsplash',
        tags: ['santa cruz', 'surfing', 'california']
      },
      {
        id: 'steam-3',
        url: 'https://images.unsplash.com/photo-1520962494026-5ba0bb5db5e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        title: 'Lighthouse View',
        description: 'View from the famous lighthouse near Steamer Lane.',
        photographer: 'Unsplash',
        tags: ['lighthouse', 'view', 'santa cruz']
      }
    ]
  },
  {
    id: 'rincon',
    name: 'Rincon',
    location: {
      lat: 34.3486,
      lng: -119.4773,
    },
    difficulty: 'Intermediate',
    description: 'Perfect right-hand point break, known as the "Queen of the Coast".',
    conditionsRating: 'Fair',
    currentConditions: {
      swellHeight: '3-5ft',
      swellPeriod: '8s',
      swellDirection: 'S',
      windSpeed: '6mph',
      windDirection: 'N',
      tide: 'High tide, falling',
      waterTemp: '65°F',
      airTemp: '72°F',
    },
    bestConditions: {
      swellSize: '3-8ft',
      swellDirection: ['S', 'SW'],
      windDirection: ['N', 'NE', 'Light'],
      tide: ['Mid', 'Low'],
    },
    forecast: [
      {
        date: 'Today',
        swellHeight: '3-5ft',
        swellPeriod: '8s',
        swellDirection: 'S',
        windSpeed: '6mph',
        windDirection: 'N',
      },
      {
        date: 'Tomorrow',
        swellHeight: '4-6ft',
        swellPeriod: '9s',
        swellDirection: 'SW',
        windSpeed: '8mph',
        windDirection: 'NW',
      },
      {
        date: 'Day 3',
        swellHeight: '3-4ft',
        swellPeriod: '7s',
        swellDirection: 'S',
        windSpeed: '5mph',
        windDirection: 'Variable',
      },
    ],
    photos: [
      {
        id: 'rincon-1',
        url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        title: 'Perfect Point Break',
        description: 'Long right-hand waves peeling perfectly down the point.',
        photographer: 'Unsplash',
        tags: ['point break', 'right hand', 'perfect']
      },
      {
        id: 'rincon-2',
        url: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        title: 'Longboard Session',
        description: 'Longboarders enjoying the gentle waves at Rincon.',
        photographer: 'Unsplash',
        tags: ['longboard', 'classic', 'style']
      },
      {
        id: 'rincon-3',
        url: 'https://images.unsplash.com/photo-1493219686142-5a8641badc78?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        title: 'California Coastline',
        description: 'Beautiful Southern California coastline near Rincon.',
        photographer: 'Unsplash',
        tags: ['coastline', 'california', 'scenic']
      }
    ]
  },
  {
    id: 'malibu',
    name: 'Malibu',
    location: {
      lat: 34.0361,
      lng: -118.6919,
    },
    difficulty: 'Beginner',
    description: 'World-famous beginner-friendly break, perfect for learning.',
    conditionsRating: 'Good',
    currentConditions: {
      swellHeight: '2-4ft',
      swellPeriod: '6s',
      swellDirection: 'S',
      windSpeed: '4mph',
      windDirection: 'Variable',
      tide: 'Mid tide, stable',
      waterTemp: '68°F',
      airTemp: '75°F',
    },
    bestConditions: {
      swellSize: '2-6ft',
      swellDirection: ['S', 'SW'],
      windDirection: ['Any', 'Light'],
      tide: ['Any'],
    },
    forecast: [
      {
        date: 'Today',
        swellHeight: '2-4ft',
        swellPeriod: '6s',
        swellDirection: 'S',
        windSpeed: '4mph',
        windDirection: 'Variable',
      },
      {
        date: 'Tomorrow',
        swellHeight: '3-5ft',
        swellPeriod: '7s',
        swellDirection: 'SW',
        windSpeed: '6mph',
        windDirection: 'W',
      },
      {
        date: 'Day 3',
        swellHeight: '2-3ft',
        swellPeriod: '5s',
        swellDirection: 'S',
        windSpeed: '3mph',
        windDirection: 'Light',
      },
    ],
    photos: [
      {
        id: 'malibu-1',
        url: 'https://images.unsplash.com/photo-1527631746610-bca32be5cd00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        title: 'Malibu Surf Lesson',
        description: 'Perfect gentle waves for learning to surf at Malibu.',
        photographer: 'Unsplash',
        tags: ['beginner', 'lesson', 'gentle waves']
      },
      {
        id: 'malibu-2',
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        title: 'Malibu Beach',
        description: 'The famous Malibu beach with perfect conditions for new surfers.',
        photographer: 'Unsplash',
        tags: ['beach', 'malibu', 'california']
      },
      {
        id: 'malibu-3',
        url: 'https://images.unsplash.com/photo-1465447142348-e9952c393450?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        title: 'Longboard Style',
        description: 'Classic longboard surfing at Malibu point.',
        photographer: 'Unsplash',
        tags: ['longboard', 'classic', 'vintage']
      }
    ]
  },
]; 