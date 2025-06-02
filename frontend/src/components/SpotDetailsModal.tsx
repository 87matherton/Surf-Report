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
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SurfSpot } from '../../data/spots';
import WeatherDisplay from './WeatherDisplay';
import TideChart from './TideChart';
import { useWeatherData } from '../hooks/useWeatherData';

interface SpotDetailsModalProps {
  open: boolean;
  onClose: () => void;
  spot: SurfSpot | null;
}

const SpotDetailsModal: React.FC<SpotDetailsModalProps> = ({ open, onClose, spot }) => {
  if (!spot) return null;

  const { data: weatherData } = useWeatherData(spot.location.lat, spot.location.lng, true);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4">{spot.name}</Typography>
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
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          {spot.description}
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Difficulty: {spot.difficulty}
        </Typography>
        
        <Grid container spacing={3}>
          {/* Current Conditions */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Current Conditions</Typography>
                <Typography variant="body2">
                  Swell: {spot.currentConditions.swellHeight}ft @ {spot.currentConditions.swellPeriod}s ({spot.currentConditions.swellDirection})
                </Typography>
                <Typography variant="body2">
                  Wind: {spot.currentConditions.windSpeed}mph {spot.currentConditions.windDirection}
                </Typography>
                <Typography variant="body2">Tide: {spot.currentConditions.tide}</Typography>
                <Typography variant="body2">Water Temp: {spot.currentConditions.waterTemp}°F</Typography>
                <Typography variant="body2">Air Temp: {spot.currentConditions.airTemp}°F</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Best Conditions */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Best Conditions</Typography>
                <Typography variant="body2">
                  Swell: {spot.bestConditions.swellDirection.join(', ')} {spot.bestConditions.swellSize}
                </Typography>
                <Typography variant="body2">
                  Wind: {spot.bestConditions.windDirection.join(', ')}
                </Typography>
                <Typography variant="body2">
                  Tide: {spot.bestConditions.tide.join(', ')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Forecast */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Forecast</Typography>
                {spot.forecast.map((f, i) => (
                  <Box key={i} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">{f.date}</Typography>
                    <Typography variant="body2">
                      Swell: {f.swellHeight}ft @ {f.swellPeriod}s ({f.swellDirection})
                    </Typography>
                    <Typography variant="body2">
                      Wind: {f.windSpeed}mph {f.windDirection}
                    </Typography>
                    {i < spot.forecast.length - 1 && <Divider sx={{ my: 1 }} />}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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