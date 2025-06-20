import { SurfSpot } from '../data/spots';

// Calculate surf quality score (0-10)
export const calculateSurfQuality = (spot: SurfSpot): number => {
  const { currentConditions, bestConditions } = spot;
  
  let score = 0;
  
  // Wave height score (30% weight) - optimal range varies by spot
  const waveHeight = currentConditions.swellHeight;
  const optimalRange = parseSwellSize(bestConditions.swellSize);
  const heightScore = calculateHeightScore(waveHeight, optimalRange);
  score += heightScore * 0.3;
  
  // Wind conditions score (25% weight)
  const windScore = calculateWindScore(
    currentConditions.windSpeed,
    currentConditions.windDirection,
    bestConditions.windDirection
  );
  score += windScore * 0.25;
  
  // Swell period score (20% weight) - longer periods are generally better
  const periodScore = Math.min(currentConditions.swellPeriod / 15, 1) * 10;
  score += periodScore * 0.2;
  
  // Tide score (15% weight)
  const tideScore = calculateTideScore(currentConditions.tide, bestConditions.tide);
  score += tideScore * 0.15;
  
  // Temperature comfort score (10% weight)
  const tempScore = calculateTempScore(currentConditions.waterTemp);
  score += tempScore * 0.1;
  
  return Math.round(Math.max(0, Math.min(10, score)));
};

// Parse swell size string like "4-12ft" to get optimal range
const parseSwellSize = (swellSize: string): { min: number; max: number } => {
  const match = swellSize.match(/(\d+)-(\d+)ft/);
  if (match) {
    return { min: parseInt(match[1]), max: parseInt(match[2]) };
  }
  return { min: 2, max: 8 }; // default
};

// Calculate height score based on optimal range
const calculateHeightScore = (height: number, optimal: { min: number; max: number }): number => {
  if (height >= optimal.min && height <= optimal.max) {
    return 10; // Perfect size
  } else if (height < optimal.min) {
    return Math.max(0, (height / optimal.min) * 10);
  } else {
    // Too big - score decreases more gradually
    const excess = height - optimal.max;
    return Math.max(0, 10 - (excess * 0.5));
  }
};

// Calculate wind score
const calculateWindScore = (
  windSpeed: number,
  windDirection: string,
  bestDirections: string[]
): number => {
  let score = 10;
  
  // Penalize strong winds
  if (windSpeed > 20) score -= 6;
  else if (windSpeed > 15) score -= 4;
  else if (windSpeed > 10) score -= 2;
  
  // Bonus for favorable wind direction
  if (bestDirections.includes(windDirection)) {
    score += 2;
  } else {
    score -= 3; // Penalty for unfavorable direction
  }
  
  return Math.max(0, Math.min(10, score));
};

// Calculate tide score
const calculateTideScore = (currentTide: string, bestTides: string[]): number => {
  if (bestTides.includes('All') || bestTides.includes(currentTide)) {
    return 10;
  }
  return 6; // Not optimal but still surfable
};

// Calculate temperature comfort score
const calculateTempScore = (waterTemp: number): number => {
  if (waterTemp >= 70) return 10; // Tropical
  if (waterTemp >= 65) return 8;  // Warm
  if (waterTemp >= 60) return 6;  // Cool but comfortable
  if (waterTemp >= 55) return 4;  // Cold
  return 2; // Very cold
};

// Get quality color based on score
export const getQualityColor = (rating: SurfSpot['conditionsRating']): string => {
  switch (rating) {
    case 'Excellent': return 'text-green-400';
    case 'Good': return 'text-blue-400';
    case 'Fair': return 'text-yellow-400';
    case 'Poor': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

// Get quality emoji
export const getQualityEmoji = (rating: SurfSpot['conditionsRating']): string => {
  switch (rating) {
    case 'Excellent': return '🔥';
    case 'Good': return '👍';
    case 'Fair': return '👌';
    case 'Poor': return '👎';
    default: return '❓';
  }
};

// Get difficulty color
export const getDifficultyColor = (difficulty: SurfSpot['difficulty']): string => {
  switch (difficulty) {
    case 'Beginner': return 'text-green-400';
    case 'Intermediate': return 'text-yellow-400';
    case 'Advanced': return 'text-orange-400';
    case 'Expert': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

// Format wave height with proper units
export const formatWaveHeight = (height: number): string => {
  if (height < 1) return `${Math.round(height * 12)}"`;
  return `${height}ft`;
};

// Format wind speed and direction
export const formatWind = (speed: number, direction: string): string => {
  return `${speed}mph ${direction}`;
};

// Get wind quality indicator
export const getWindQuality = (speed: number): 'light' | 'moderate' | 'strong' | 'very-strong' => {
  if (speed <= 5) return 'light';
  if (speed <= 15) return 'moderate';
  if (speed <= 25) return 'strong';
  return 'very-strong';
}; 