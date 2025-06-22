import React from 'react';
import { Box, Typography, Chip, CircularProgress } from '@mui/material';
import { useWeatherData } from '../hooks/useWeatherData';

interface WeatherIndicatorProps {
  lat: number;
  lng: number;
  compact?: boolean;
}

const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

const getConditionColor = (temperature: number, windSpeed: number, waveHeight: number): 'success' | 'warning' | 'error' | 'default' => {
  // Simple scoring system for overall conditions
  let score = 0;
  
  // Temperature scoring (optimal around 15-25°C)
  if (temperature >= 15 && temperature <= 25) score += 2;
  else if (temperature >= 10 && temperature <= 30) score += 1;
  
  // Wind scoring (less is better for most surf spots)
  if (windSpeed <= 10) score += 2;
  else if (windSpeed <= 20) score += 1;
  
  // Wave height scoring (depends on spot, but 1-3m is generally good)
  if (waveHeight >= 1 && waveHeight <= 3) score += 2;
  else if (waveHeight >= 0.5 && waveHeight <= 4) score += 1;
  
  if (score >= 5) return 'success';
  if (score >= 3) return 'warning';
  if (score >= 1) return 'default';
  return 'error';
};

export const WeatherIndicator: React.FC<WeatherIndicatorProps> = ({ lat, lng, compact = false }) => {
  const { data, loading, error } = useWeatherData(lat, lng, true);

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" p={0.5}>
        <CircularProgress size={16} />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Chip 
        label="No data" 
        size="small" 
        color="default" 
        sx={{ fontSize: '0.7rem', height: 20 }}
      />
    );
  }

  const { weather, marine } = data;
  const conditionColor = getConditionColor(weather.temperature, weather.windSpeed, marine.waveHeight);

  if (compact) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
        <Chip
          label={`${Math.round(weather.temperature)}°C`}
          size="small"
          color={conditionColor}
          sx={{ fontSize: '0.7rem', height: 18, minWidth: 45 }}
        />
        <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
          {marine.waveHeight.toFixed(1)}m
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 0.5, 
        p: 1, 
        bgcolor: 'background.paper', 
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
        minWidth: 120
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Chip
          label={`${Math.round(weather.temperature)}°C`}
          size="small"
          color={conditionColor}
          sx={{ fontSize: '0.75rem' }}
        />
        <Typography variant="caption" color="text.secondary">
          {weather.description.split(' ')[0]}
        </Typography>
      </Box>
      
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" color="text.secondary">
          💨 {Math.round(weather.windSpeed)}km/h {getWindDirection(weather.windDirection)}
        </Typography>
      </Box>
      
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" color="text.secondary">
          🌊 {marine.waveHeight.toFixed(1)}m @ {marine.wavePeriod}s
        </Typography>
      </Box>
    </Box>
  );
};

export default WeatherIndicator; 