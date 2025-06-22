import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  Avatar,
  LinearProgress
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import WavesIcon from '@mui/icons-material/Waves';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import { surfSpots, SurfSpot } from '../data/spots';
import weatherService from '../services/weatherService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`forecast-tabpanel-${index}`}
      aria-labelledby={`forecast-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface ForecastPageProps {
  onExploreSpot: (spotId: string) => void;
}

const ForecastPage: React.FC<ForecastPageProps> = ({ onExploreSpot }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [qualityScores, setQualityScores] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [forecastData, setForecastData] = useState<{ [key: string]: any }>({});

  // Load quality scores and forecast data
  useEffect(() => {
    const loadForecastData = async () => {
      setLoading(true);
      const scores: { [key: string]: number } = {};
      const forecasts: { [key: string]: any } = {};
      
      for (const spot of surfSpots) {
        try {
          const enhancedData = await weatherService.getEnhancedSurfData(
            spot.id, 
            spot.location.lat, 
            spot.location.lng
          );
          scores[spot.id] = enhancedData.qualityScore;
          
          // Mock forecast trend data (in real app, this would come from API)
          forecasts[spot.id] = {
            trend: Math.random() > 0.5 ? 'improving' : Math.random() > 0.5 ? 'declining' : 'stable',
            peakTime: `${8 + Math.floor(Math.random() * 8)}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
            confidence: 70 + Math.floor(Math.random() * 30)
          };
        } catch (error) {
          console.error(`Error loading forecast data for ${spot.name}:`, error);
          scores[spot.id] = 5.0;
          forecasts[spot.id] = { trend: 'stable', peakTime: '12:00 PM', confidence: 75 };
        }
      }
      
      setQualityScores(scores);
      setForecastData(forecasts);
      setLoading(false);
    };
    
    loadForecastData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getQualityColor = (score: number) => {
    if (score >= 8) return '#4CAF50'; // Green - Excellent
    if (score >= 6) return '#2196F3'; // Blue - Good
    if (score >= 4) return '#FF9800'; // Orange - Fair
    return '#F44336'; // Red - Poor
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUpIcon sx={{ color: '#4CAF50' }} />;
      case 'declining':
        return <TrendingDownIcon sx={{ color: '#F44336' }} />;
      default:
        return <TrendingFlatIcon sx={{ color: '#FF9800' }} />;
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'Improving';
      case 'declining':
        return 'Declining';
      default:
        return 'Stable';
    }
  };

  // Sort spots by quality score for different views
  const bestSpots = [...surfSpots]
    .sort((a, b) => (qualityScores[b.id] || 0) - (qualityScores[a.id] || 0))
    .slice(0, 10);

  const improvingSpots = [...surfSpots]
    .filter(spot => forecastData[spot.id]?.trend === 'improving')
    .sort((a, b) => (qualityScores[b.id] || 0) - (qualityScores[a.id] || 0));

  const todaysForecast = [...surfSpots]
    .sort((a, b) => (qualityScores[b.id] || 0) - (qualityScores[a.id] || 0));

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
          Loading forecast data...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Analyzing surf conditions across all spots
        </Typography>
      </Box>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <div className="relative w-full h-full">
        <Box>
          {/* Header */}
          <Box sx={{ mb: 3, textAlign: 'center', p: 2 }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              🌊 Surf Forecast
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Comprehensive surf forecasts and trends across the West Coast
            </Typography>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab label="Best Conditions" />
              <Tab label="Improving Spots" />
              <Tab label="Today's Forecast" />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <TabPanel value={activeTab} index={0}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon sx={{ color: '#FFD700' }} />
              Top 10 Spots Right Now
            </Typography>
            <Grid container spacing={2}>
              {bestSpots.map((spot, index) => (
                <Grid item xs={12} sm={6} md={4} key={spot.id}>
                  <Card sx={{ 
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    position: 'relative',
                    '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.2s ease' }
                  }}>
                    {/* Ranking Badge */}
                    <Box sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      backgroundColor: index < 3 ? '#FFD700' : '#667eea',
                      color: 'white',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      zIndex: 1
                    }}>
                      {index + 1}
                    </Box>

                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', pl: 2 }}>
                          {spot.name}
                        </Typography>
                        {qualityScores[spot.id] && (
                          <Chip
                            label={`${qualityScores[spot.id].toFixed(1)}/10`}
                            sx={{
                              backgroundColor: getQualityColor(qualityScores[spot.id]),
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                        )}
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <LocationOnIcon sx={{ fontSize: 14, color: '#667eea' }} />
                        <Typography variant="body2" color="text.secondary">
                          {spot.region}, {spot.state}
                        </Typography>
                      </Box>

                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {spot.conditionsRating} conditions • {spot.difficulty} level
                      </Typography>

                      {forecastData[spot.id] && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          {getTrendIcon(forecastData[spot.id].trend)}
                          <Typography variant="body2">
                            {getTrendText(forecastData[spot.id].trend)}
                          </Typography>
                          <Chip label={`${forecastData[spot.id].confidence}% confidence`} size="small" />
                        </Box>
                      )}

                      <Button
                        onClick={() => onExploreSpot(spot.id)}
                        variant="contained"
                        size="small"
                        fullWidth
                        sx={{
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon sx={{ color: '#4CAF50' }} />
              Spots Getting Better
            </Typography>
            {improvingSpots.length === 0 ? (
              <Alert severity="info">
                No spots are currently showing improving trends. Check back later!
              </Alert>
            ) : (
              <List>
                {improvingSpots.map((spot) => (
                  <ListItem 
                    key={spot.id} 
                    sx={{ 
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      mb: 1,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      '&:hover': { backgroundColor: '#f8f9fa' }
                    }}
                  >
                    <Avatar sx={{ mr: 2, backgroundColor: '#4CAF50' }}>
                      <TrendingUpIcon />
                    </Avatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {spot.name}
                          </Typography>
                          {qualityScores[spot.id] && (
                            <Chip
                              label={`${qualityScores[spot.id].toFixed(1)}/10`}
                              size="small"
                              sx={{
                                backgroundColor: getQualityColor(qualityScores[spot.id]),
                                color: 'white'
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {spot.region}, {spot.state} • {spot.conditionsRating} conditions
                          </Typography>
                          {forecastData[spot.id] && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <AccessTimeIcon sx={{ fontSize: 14 }} />
                              <Typography variant="body2">
                                Peak at {forecastData[spot.id].peakTime}
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={forecastData[spot.id].confidence}
                                sx={{ 
                                  width: 60, 
                                  ml: 1,
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#4CAF50'
                                  }
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                      }
                    />
                    <Button
                      onClick={() => onExploreSpot(spot.id)}
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: '8px' }}
                    >
                      Details
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WavesIcon sx={{ color: '#2196F3' }} />
              All Spots - Today's Conditions
            </Typography>
            <Grid container spacing={1}>
              {todaysForecast.map((spot) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={spot.id}>
                  <Card sx={{ 
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    '&:hover': { 
                      transform: 'translateY(-1px)', 
                      boxShadow: '0 4px 15px rgba(0,0,0,0.12)',
                      transition: 'all 0.2s ease' 
                    }
                  }}
                  onClick={() => onExploreSpot(spot.id)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                          {spot.name}
                        </Typography>
                        {qualityScores[spot.id] && (
                          <Chip
                            label={qualityScores[spot.id].toFixed(1)}
                            size="small"
                            sx={{
                              backgroundColor: getQualityColor(qualityScores[spot.id]),
                              color: 'white',
                              fontSize: '0.75rem',
                              height: 20
                            }}
                          />
                        )}
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 1 }}>
                        {spot.region} • {spot.conditionsRating}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {forecastData[spot.id] && getTrendIcon(forecastData[spot.id].trend)}
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                          {spot.currentConditions.swellHeight}ft • {spot.currentConditions.windSpeed}mph
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </Box>
      </div>
    </div>
  );
};

export default ForecastPage; 