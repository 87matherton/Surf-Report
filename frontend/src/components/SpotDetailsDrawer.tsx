import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Chip,
  Grid,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tab,
  Tabs,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import DirectionsIcon from '@mui/icons-material/Directions';
import WavesIcon from '@mui/icons-material/Waves';
import AirIcon from '@mui/icons-material/Air';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { SurfSpot } from '../data/spots';
import WeatherDisplay from './WeatherDisplay';
import WaveChart from './WaveChart';
import ForecastCalendar from './ForecastCalendar';
import BreakInfo from './BreakInfo';
import SpotPhotoGallery from './SpotPhotoGallery';
import TideChart from './TideChart';
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
      id={`spot-tabpanel-${index}`}
      aria-labelledby={`spot-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface SpotDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  spot: SurfSpot | null;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
}

const SpotDetailsDrawer: React.FC<SpotDetailsDrawerProps> = ({ open, onClose, spot, onScroll }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (spot) {
      const favorites = weatherService.getFavoriteSpots();
      setIsFavorite(favorites.includes(spot.id));
      
      // Load quality score
      weatherService.getEnhancedSurfData(spot.id, spot.location.lat, spot.location.lng)
        .then(data => setQualityScore(data.qualityScore))
        .catch(() => setQualityScore(7.5)); // Default score
    }
  }, [spot]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleToggleFavorite = () => {
    if (spot) {
      const newIsFavorite = weatherService.toggleFavorite(spot.id);
      setIsFavorite(newIsFavorite);
    }
  };

  const handleShare = () => {
    if (spot && navigator.share) {
      navigator.share({
        title: `${spot.name} - WaveCheck`,
        text: `Check out the surf conditions at ${spot.name}`,
        url: window.location.href
      });
    }
  };

  const handleGetDirections = () => {
    if (spot) {
      const url = `https://maps.google.com/maps?daddr=${spot.location.lat},${spot.location.lng}`;
      window.open(url, '_blank');
    }
  };

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

  if (!spot) return null;

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        }
      }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '100vw' }}>
        {/* Handle bar */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          pt: 2, 
          pb: 1,
          cursor: 'pointer'
        }}
        onClick={onClose}
        >
          <Box sx={{
            width: 40,
            height: 4,
            backgroundColor: '#bdbdbd',
            borderRadius: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#9e9e9e',
              width: 50
            }
          }} />
        </Box>

        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'space-between', 
          p: 3, 
          pb: 2
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              {spot.name}
            </Typography>
            
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
              {spot.region}, {spot.state}
            </Typography>

            {/* Quality Score & Conditions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              {qualityScore && (
                <Chip
                  label={`${qualityScore.toFixed(1)}/10`}
                  sx={{
                    backgroundColor: getQualityColor(qualityScore),
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                />
              )}
              <Chip 
                label={spot.conditionsRating}
                variant="outlined"
                sx={{ fontWeight: 'bold' }}
              />
              <Chip 
                label={spot.difficulty}
                variant="outlined"
                color="primary"
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
                icon={<AirIcon />}
                label={`${spot.currentConditions.windSpeed}mph ${spot.currentConditions.windDirection}`}
                size="small"
                variant="outlined"
              />
              <Chip 
                icon={<ThermostatIcon />}
                label={`${spot.currentConditions.waterTemp}°F`}
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>

          {/* Action buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
            <IconButton 
              onClick={onClose}
              sx={{ 
                backgroundColor: 'rgba(0,0,0,0.05)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' }
              }}
            >
              <CloseIcon />
            </IconButton>
            
            <IconButton 
              onClick={handleToggleFavorite}
              color={isFavorite ? 'error' : 'default'}
              sx={{ 
                backgroundColor: 'rgba(0,0,0,0.05)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' }
              }}
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            
            <IconButton 
              onClick={handleShare}
              sx={{ 
                backgroundColor: 'rgba(0,0,0,0.05)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' }
              }}
            >
              <ShareIcon />
            </IconButton>
            
            <IconButton 
              onClick={handleGetDirections}
              sx={{ 
                backgroundColor: 'rgba(0,0,0,0.05)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' }
              }}
            >
              <DirectionsIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Description */}
        <Box sx={{ px: 3, pb: 2 }}>
          <Typography variant="body1" color="text.secondary">
            {spot.description}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ px: 3, pb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleGetDirections}
                startIcon={<DirectionsIcon />}
                sx={{
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  }
                }}
              >
                Directions
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleShare}
                startIcon={<ShareIcon />}
                sx={{ borderRadius: '12px' }}
              >
                Share
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }
            }}
          >
            <Tab label="Conditions" />
            <Tab label="Forecast" />
            <Tab label="Break Info" />
            <Tab label="Photos" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box 
          sx={{ maxHeight: '50vh', overflow: 'auto' }}
          onScroll={onScroll}
        >
          <TabPanel value={activeTab} index={0}>
            {/* Current Conditions */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <WeatherDisplay 
                  lat={spot.location.lat} 
                  lng={spot.location.lng}
                  locationName={spot.name}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                  <Typography>Wave Chart Coming Soon</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                  <Typography>Tide Chart Coming Soon</Typography>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
              <Typography>Forecast Calendar Coming Soon</Typography>
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            {spot.breakInfo ? (
              <BreakInfo breakInfo={spot.breakInfo} spotName={spot.name} />
            ) : (
              <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                <Typography>Break information coming soon</Typography>
              </Box>
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            {spot.photos && spot.photos.length > 0 ? (
              <SpotPhotoGallery 
                photos={spot.photos} 
                spotName={spot.name}
              />
            ) : (
              <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                <Typography>Photos coming soon</Typography>
              </Box>
            )}
          </TabPanel>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SpotDetailsDrawer; 