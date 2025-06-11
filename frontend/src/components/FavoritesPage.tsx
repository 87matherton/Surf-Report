import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WavesIcon from '@mui/icons-material/Waves';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ExploreIcon from '@mui/icons-material/Explore';
import { surfSpots, SurfSpot } from '../data/spots';
import weatherService from '../services/weatherService';
import WeatherIndicator from './WeatherIndicator';

interface FavoritesPageProps {
  favorites: string[];
  onExploreSpot: (spotId: string) => void;
  onToggleFavorite: (spotId: string) => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ 
  favorites, 
  onExploreSpot, 
  onToggleFavorite 
}) => {
  const [qualityScores, setQualityScores] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  const favoriteSpots = surfSpots.filter(spot => favorites.includes(spot.id));

  // Load quality scores for favorite spots
  useEffect(() => {
    const loadQualityScores = async () => {
      setLoading(true);
      const scores: { [key: string]: number } = {};
      
      for (const spot of favoriteSpots) {
        try {
          const enhancedData = await weatherService.getEnhancedSurfData(
            spot.id, 
            spot.location.lat, 
            spot.location.lng
          );
          scores[spot.id] = enhancedData.qualityScore;
        } catch (error) {
          console.error(`Error loading quality score for ${spot.name}:`, error);
          scores[spot.id] = 5.0; // Default score
        }
      }
      
      setQualityScores(scores);
      setLoading(false);
    };
    
    if (favoriteSpots.length > 0) {
      loadQualityScores();
    } else {
      setLoading(false);
    }
  }, [favorites]);

  const getQualityColor = (score: number) => {
    if (score >= 8) return '#4CAF50'; // Green - Excellent
    if (score >= 6) return '#2196F3'; // Blue - Good
    if (score >= 4) return '#FF9800'; // Orange - Fair
    return '#F44336'; // Red - Poor
  };

  const getQualityText = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Poor';
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '60vh',
        gap: 2
      }}>
        <CircularProgress size={60} sx={{ color: '#667eea' }} />
        <Typography variant="h6" sx={{ color: '#667eea' }}>
          Loading your favorite spots...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fetching real-time surf conditions
        </Typography>
      </Box>
    );
  }

  if (favoriteSpots.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <FavoriteIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No Favorite Spots Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start adding your favorite surf spots by clicking the heart icon on any location in the map!
          </Typography>
        </Box>
        
        <Alert severity="info" sx={{ maxWidth: 400, mx: 'auto' }}>
          <Typography variant="body2">
            💡 <strong>Tip:</strong> Your favorite spots will appear here with live conditions and quick access to detailed forecasts.
          </Typography>
        </Alert>
      </Box>
    );
  }

  // Sort favorite spots by quality score (highest first)
  const sortedFavorites = [...favoriteSpots].sort((a, b) => 
    (qualityScores[b.id] || 0) - (qualityScores[a.id] || 0)
  );

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1
        }}>
          🏄‍♂️ Your Favorite Spots
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {favoriteSpots.length} favorite{favoriteSpots.length !== 1 ? 's' : ''} • Sorted by current conditions
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {sortedFavorites.map((spot) => (
          <Grid item xs={12} sm={6} key={spot.id}>
            <Card 
              sx={{ 
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.05)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s ease'
                }
              }}
            >
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {spot.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      <LocationOnIcon sx={{ fontSize: 16, color: '#667eea' }} />
                      <Typography variant="body2" color="text.secondary">
                        {spot.region}, {spot.state}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Quality Score Badge */}
                  {qualityScores[spot.id] && (
                    <Chip
                      label={`${qualityScores[spot.id].toFixed(1)}/10`}
                      sx={{
                        backgroundColor: getQualityColor(qualityScores[spot.id]),
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.875rem'
                      }}
                    />
                  )}
                </Box>

                {/* Conditions Summary */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Conditions:</strong> {spot.conditionsRating} • <strong>Difficulty:</strong> {spot.difficulty}
                  </Typography>
                  
                  {qualityScores[spot.id] && (
                    <Typography variant="body2" sx={{ color: getQualityColor(qualityScores[spot.id]) }}>
                      <strong>Quality:</strong> {getQualityText(qualityScores[spot.id])}
                    </Typography>
                  )}
                </Box>

                {/* Live Weather Indicator */}
                <Box sx={{ mb: 2 }}>
                  <WeatherIndicator 
                    lat={spot.location.lat} 
                    lng={spot.location.lng} 
                    compact={true}
                  />
                </Box>

                {/* Quick Stats */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<WavesIcon />}
                    label={`${spot.currentConditions.swellHeight}ft`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip 
                    label={`${spot.currentConditions.windSpeed}mph ${spot.currentConditions.windDirection}`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip 
                    label={`${spot.currentConditions.waterTemp}°F`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
              
              <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
                <Button
                  startIcon={<ExploreIcon />}
                  onClick={() => onExploreSpot(spot.id)}
                  variant="contained"
                  sx={{
                    flex: 1,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    }
                  }}
                >
                  Explore
                </Button>
                <Button
                  startIcon={<FavoriteIcon />}
                  onClick={() => onToggleFavorite(spot.id)}
                  variant="outlined"
                  color="error"
                  sx={{ borderRadius: '12px' }}
                >
                  Remove
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FavoritesPage; 