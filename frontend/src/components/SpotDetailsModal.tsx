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
  IconButton,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SurfSpot } from '../data/spots';

interface SpotDetailsModalProps {
  open: boolean;
  onClose: () => void;
  spot: SurfSpot | null;
}

const SpotDetailsModal: React.FC<SpotDetailsModalProps> = ({ open, onClose, spot }) => {
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
        {/* Basic Spot Information */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📍 Spot Details
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {spot.description}
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

        {/* Forecast Data from spot */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📊 Forecast
            </Typography>
            <Grid container spacing={2}>
              {spot.forecast.map((f, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2">{f.date}</Typography>
                      <Typography variant="body2">
                        Swell: {f.swellHeight}ft @ {f.swellPeriod}s ({f.swellDirection})
                      </Typography>
                      <Typography variant="body2">
                        Wind: {f.windSpeed}mph {f.windDirection}
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