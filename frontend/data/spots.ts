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
}

export const surfSpots: SurfSpot[] = [
  {
    id: '1',
    name: 'Mavericks',
    location: { lat: 37.495, lng: -122.495 },
    description: 'World-famous big wave spot',
    difficulty: 'Expert',
    bestConditions: {
      swellDirection: ['West', 'Northwest'],
      windDirection: ['East', 'Southeast'],
      tide: ['Mid'],
      swellSize: '20-60ft',
    },
    currentConditions: {
      swellHeight: 25,
      swellPeriod: 18,
      swellDirection: 'West',
      windSpeed: 10,
      windDirection: 'East',
      tide: 'Mid',
      waterTemp: 55,
      airTemp: 60,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 25,
        swellPeriod: 18,
        swellDirection: 'West',
        windSpeed: 10,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 30,
        swellPeriod: 20,
        swellDirection: 'Northwest',
        windSpeed: 8,
        windDirection: 'Southeast',
      },
    ],
    conditionsRating: 'Good',
  },
  {
    id: '2',
    name: 'Steamer Lane',
    location: { lat: 36.9517, lng: -122.0267 },
    description: 'Iconic point break in Santa Cruz offering consistent waves year-round.',
    difficulty: 'Advanced',
    bestConditions: {
      swellDirection: ['West', 'Northwest'],
      windDirection: ['East', 'Southeast'],
      tide: ['Mid'],
      swellSize: '4-12ft',
    },
    currentConditions: {
      swellHeight: 5,
      swellPeriod: 13,
      swellDirection: 'West',
      windSpeed: 7,
      windDirection: 'East',
      tide: 'Mid',
      waterTemp: 58,
      airTemp: 65,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 5,
        swellPeriod: 13,
        swellDirection: 'West',
        windSpeed: 7,
        windDirection: 'East',
      },
      {
        date: '2024-06-02',
        swellHeight: 7,
        swellPeriod: 15,
        swellDirection: 'Northwest',
        windSpeed: 6,
        windDirection: 'Southeast',
      },
    ],
    conditionsRating: 'Excellent',
  },
  {
    id: '3',
    name: 'Rincon',
    location: { lat: 34.3717, lng: -119.475 },
    description: 'World-class point break known as the "Queen of the Coast" with perfect right-handers.',
    difficulty: 'Intermediate',
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
    id: '4',
    name: 'Malibu',
    location: { lat: 34.0375, lng: -118.6775 },
    description: 'Iconic point break perfect for longboarding and beginners.',
    difficulty: 'Beginner',
    bestConditions: {
      swellDirection: ['South', 'Southwest'],
      windDirection: ['North', 'Northeast'],
      tide: ['Mid to High'],
      swellSize: '2-6ft',
    },
    currentConditions: {
      swellHeight: 3,
      swellPeriod: 10,
      swellDirection: 'South',
      windSpeed: 4,
      windDirection: 'Northeast',
      tide: 'High',
      waterTemp: 63,
      airTemp: 70,
    },
    forecast: [
      {
        date: '2024-06-01',
        swellHeight: 3,
        swellPeriod: 10,
        swellDirection: 'South',
        windSpeed: 4,
        windDirection: 'Northeast',
      },
      {
        date: '2024-06-02',
        swellHeight: 4,
        swellPeriod: 12,
        swellDirection: 'Southwest',
        windSpeed: 3,
        windDirection: 'North',
      },
    ],
    conditionsRating: 'Excellent',
  },
]; 