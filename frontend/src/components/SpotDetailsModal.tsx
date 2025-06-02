import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SurfSpot } from '../data/spots';
import WeatherDisplay from './WeatherDisplay';
import WaveChart from './WaveChart';
import ForecastCalendar from './ForecastCalendar';
import BreakInfo from './BreakInfo';
import SpotPhotoGallery from './SpotPhotoGallery';
import { useWeatherData } from '../hooks/useWeatherData';
import { useForecastData } from '../hooks/useForecastData';

interface SpotDetailsModalProps {
  open: boolean;
  onClose: () => void;
  spot: SurfSpot | null;
}

const SpotDetailsModal: React.FC<SpotDetailsModalProps> = ({ open, onClose, spot }) => {
  // Always call hooks with safe defaults to prevent conditional hook calls
  const { data: weatherData } = useWeatherData(spot?.location.lat || 0, spot?.location.lng || 0, !!spot);
  const { forecast } = useForecastData(spot?.location.lat || 0, spot?.location.lng || 0);

  // Early return AFTER hooks to prevent React internal errors
  if (!spot) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
            <Typography variant="h4">{spot.name}</Typography>
            <Chip 
              label={spot.difficulty}
              color={
                spot.difficulty === 'Beginner' ? 'success' :
                spot.difficulty === 'Intermediate' ? 'warning' :
                spot.difficulty === 'Advanced' ? 'error' :
                'default'
              }
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
          <Typography variant="subtitle1" color="text.secondary">
            Today's Conditions: <strong>{spot.conditionsRating}</strong>
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        {/* Real-time Weather Data */}
        <WeatherDisplay 
          lat={spot.location.lat} 
          lng={spot.location.lng} 
          locationName={spot.name}
        />
        
        {/* Break Information */}
        {spot.breakInfo && (
          <BreakInfo 
            spotName={spot.name}
            breakInfo={spot.breakInfo}
          />
        )}
        
        {/* Traditional Break Information Card */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🏄‍♂️ Surf Conditions Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  🌊 Current Conditions
                </Typography>
                <Typography variant="body2">
                  Swell: {spot.currentConditions.swellHeight}ft @ {spot.currentConditions.swellPeriod}s ({spot.currentConditions.swellDirection})
                </Typography>
                <Typography variant="body2">
                  Wind: {spot.currentConditions.windSpeed}mph {spot.currentConditions.windDirection}
                </Typography>
                <Typography variant="body2">
                  Tide: {spot.currentConditions.tide}
                </Typography>
                <Typography variant="body2">
                  Water: {spot.currentConditions.waterTemp}°F | Air: {spot.currentConditions.airTemp}°F
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  ⭐ Best Conditions
                </Typography>
                <Typography variant="body2">
                  Swell: {spot.bestConditions.swellDirection.join(', ')} {spot.bestConditions.swellSize}
                </Typography>
                <Typography variant="body2">
                  Wind: {spot.bestConditions.windDirection.join(', ')}
                </Typography>
                <Typography variant="body2">
                  Tide: {spot.bestConditions.tide.join(', ')}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        {/* Wave Chart */}
        {weatherData && weatherData.wave && (
          <WaveChart
            waveData={weatherData.wave.chartData}
            currentWaveHeight={weatherData.wave.current}
            locationName={spot.name}
          />
        )}
        
        {/* 5-Day Forecast Calendar */}
        <ForecastCalendar 
          locationName={spot.name}
          forecast={forecast}
        />
        
        {/* Photo Gallery */}
        {spot.photos && spot.photos.length > 0 && (
          <SpotPhotoGallery 
            spotName={spot.name}
            photos={spot.photos}
          />
        )}
        
        {/* Spot Description */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📍 About {spot.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {spot.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Location:</strong> {spot.region}, {spot.state}
            </Typography>
          </CardContent>
        </Card>

        {/* Detailed Forecast Data from spot */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📊 Detailed Forecast
            </Typography>
            <Grid container spacing={2}>
              {spot.forecast.map((f, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {f.date}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2">
                        🌊 Swell: {f.swellHeight}ft @ {f.swellPeriod}s ({f.swellDirection})
                      </Typography>
                      <Typography variant="body2">
                        💨 Wind: {f.windSpeed}mph {f.windDirection}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SpotDetailsModal; 