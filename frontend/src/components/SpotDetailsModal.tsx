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
import { SurfSpot } from '../../data/spots';
import WeatherDisplay from './WeatherDisplay';
import TideChart from './TideChart';
import SpotPhotoGallery from './SpotPhotoGallery';
import ForecastCalendar from './ForecastCalendar';
import { useWeatherData } from '../hooks/useWeatherData';
import { useForecastData } from '../hooks/useForecastData';

interface SpotDetailsModalProps {
  open: boolean;
  onClose: () => void;
  spot: SurfSpot | null;
}

const SpotDetailsModal: React.FC<SpotDetailsModalProps> = ({ open, onClose, spot }) => {
  if (!spot) return null;

  const { data: weatherData } = useWeatherData(spot.location.lat, spot.location.lng, true);
  const { forecast } = useForecastData(spot.location.lat, spot.location.lng);

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
        
        {/* Tide Chart */}
        {weatherData && (
          <TideChart
            tideData={weatherData.tide.chartData}
            currentTideHeight={weatherData.tide.currentHeight}
            locationName={spot.name}
          />
        )}
        
        {/* 5-Day Forecast Calendar */}
        <ForecastCalendar 
          locationName={spot.name}
          forecast={forecast}
        />
        
        {/* Photo Gallery */}
        <SpotPhotoGallery 
          spotName={spot.name}
          photos={spot.photos}
        />
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          {spot.description}
        </Typography>
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