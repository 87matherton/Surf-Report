import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
  Alert
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  WaterDrop as WaterDropIcon,
  Air as AirIcon,
  Thermostat as ThermostatIcon,
  Visibility as VisibilityIcon,
  Speed as SpeedIcon,
  WbSunny as SunIcon,
  Waves as WavesIcon
} from '@mui/icons-material';
import { useWeatherData } from '../hooks/useWeatherData';

interface WeatherDisplayProps {
  lat: number;
  lng: number;
  locationName: string;
}

const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

const formatLastUpdated = (date: Date | null): string => {
  if (!date) return '';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
};

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ lat, lng, locationName }) => {
  const { data, loading, error, lastUpdated, refresh } = useWeatherData(lat, lng, true);

  if (loading && !data) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <CircularProgress size={24} sx={{ mr: 2 }} />
          <Typography>Loading weather data...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error && !data) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Box display="flex" justifyContent="center">
            <IconButton onClick={refresh} color="primary">
              <RefreshIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const { weather, marine, tide } = data;

  return (
    <Card sx={{ mb: 2, bgcolor: 'background.paper' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h3" sx={{ display: 'flex', alignItems: 'center' }}>
            🌊 Live Weather - {locationName}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            {lastUpdated && (
              <Typography variant="caption" color="text.secondary">
                {formatLastUpdated(lastUpdated)}
              </Typography>
            )}
            <Tooltip title="Refresh weather data">
              <IconButton size="small" onClick={refresh} disabled={loading}>
                <RefreshIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Grid container spacing={2}>
          {/* Current Weather */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
              🌤️ Current Conditions
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <ThermostatIcon fontSize="small" color="primary" />
                  <Typography variant="body2">
                    {Math.round(weather.temperature)}°C
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" color="text.secondary">
                    Feels {Math.round(weather.feelsLike)}°C
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <AirIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {Math.round(weather.windSpeed)} km/h {getWindDirection(weather.windDirection)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <WaterDropIcon fontSize="small" color="info" />
                  <Typography variant="body2">
                    {weather.humidity}% humidity
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <SpeedIcon fontSize="small" color="secondary" />
                  <Typography variant="body2">
                    {Math.round(weather.pressure)} hPa
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <SunIcon fontSize="small" color="warning" />
                  <Typography variant="body2">
                    UV {weather.uvIndex}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Box mt={1}>
              <Chip 
                label={weather.description} 
                size="small" 
                variant="outlined" 
                color="primary"
              />
            </Box>
          </Grid>

          {/* Marine Conditions */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
              🌊 Marine Conditions
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <WavesIcon fontSize="small" color="primary" />
                  <Typography variant="body2">
                    {marine.waveHeight.toFixed(1)}m waves
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  {marine.wavePeriod}s period
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  Swell: {marine.swellHeight.toFixed(1)}m
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  {marine.swellPeriod}s period
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  Direction: {getWindDirection(marine.swellDirection)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  Wind waves: {marine.windWaveHeight.toFixed(1)}m
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* Tide Information */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
              🌊 Tide Information
            </Typography>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Chip 
                label={`Currently ${tide.current}`} 
                size="small" 
                color={tide.current === 'Rising' ? 'success' : 'warning'}
                variant="filled"
              />
              {tide.next.slice(0, 2).map((tideEvent, index) => (
                <Chip
                  key={index}
                  label={`${tideEvent.type === 'high' ? '↑' : '↓'} ${tideEvent.type} ${tideEvent.time}`}
                  size="small"
                  variant="outlined"
                  color={tideEvent.type === 'high' ? 'primary' : 'secondary'}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WeatherDisplay; 