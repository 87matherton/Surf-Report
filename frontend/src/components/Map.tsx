import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Typography, Paper, TextField, InputAdornment, Button, Autocomplete, IconButton, BottomNavigation, BottomNavigationAction, Card, CardContent, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HomeIcon from '@mui/icons-material/Home';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { surfSpots, SurfSpot } from '../data/spots';
import SpotDetailsDrawer from './SpotDetailsDrawer';
import MapLegend from './MapLegend';
import WeatherIndicator from './WeatherIndicator';
import weatherService from '../services/weatherService';

// Create custom surf icons based on difficulty and conditions
const createSurfIcon = (difficulty: string, conditionsRating: string, isFavorite: boolean = false, qualityScore?: number) => {
  // Base colors for difficulty levels
  const difficultyColors = {
    'Beginner': '#4CAF50',      // Green
    'Intermediate': '#FF9800',  // Orange  
    'Advanced': '#F44336',      // Red
    'Expert': '#9C27B0'         // Purple
  };

  // Border colors for conditions
  const conditionColors = {
    'Poor': '#757575',          // Grey
    'Fair': '#FF9800',          // Orange
    'Good': '#2196F3',          // Blue
    'Excellent': '#4CAF50'      // Green
  };

  const baseColor = difficultyColors[difficulty as keyof typeof difficultyColors] || '#2196F3';
  const borderColor = conditionColors[conditionsRating as keyof typeof conditionColors] || '#757575';

  // Quality score color
  const getQualityColor = (score: number) => {
    if (score >= 8) return '#4CAF50'; // Green - Excellent
    if (score >= 6) return '#2196F3'; // Blue - Good
    if (score >= 4) return '#FF9800'; // Orange - Fair
    return '#F44336'; // Red - Poor
  };

  const qualityColor = qualityScore ? getQualityColor(qualityScore) : borderColor;

  // Create SVG icon with wave symbol, favorite indicator, and quality score
  const svgIcon = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
      </defs>
      <!-- Outer circle (quality/condition indicator) -->
      <circle cx="20" cy="20" r="18" fill="${qualityColor}" filter="url(#shadow)"/>
      <!-- Inner circle (difficulty indicator) -->
      <circle cx="20" cy="20" r="14" fill="${baseColor}"/>
      
      <!-- Favorite heart indicator -->
      ${isFavorite ? `
        <circle cx="30" cy="10" r="6" fill="#E91E63" stroke="white" stroke-width="1"/>
        <path d="M27 8.5l1.5 1.5 1.5-1.5c0.5-0.5 1.3-0.5 1.8 0s0.5 1.3 0 1.8l-3.3 3.3-3.3-3.3c-0.5-0.5-0.5-1.3 0-1.8s1.3-0.5 1.8 0z" fill="white"/>
      ` : ''}
      
      <!-- Wave symbol -->
      <path d="M10 20 Q15 15 20 20 T30 20" stroke="white" stroke-width="2" fill="none"/>
      <path d="M8 24 Q13 19 18 24 T28 24" stroke="white" stroke-width="1.5" fill="none" opacity="0.8"/>
      
      <!-- Quality score indicator -->
      ${qualityScore ? `
        <circle cx="10" cy="10" r="6" fill="rgba(0,0,0,0.7)"/>
        <text x="10" y="14" text-anchor="middle" font-size="8" font-weight="bold" fill="white">${qualityScore.toFixed(1)}</text>
      ` : ''}
      
      <!-- Difficulty indicator dots -->
      ${difficulty === 'Expert' ? '<circle cx="20" cy="12" r="1.5" fill="white"/>' : ''}
      ${(['Advanced', 'Expert'].includes(difficulty)) ? '<circle cx="17" cy="12" r="1" fill="white"/>' : ''}
      ${(['Intermediate', 'Advanced', 'Expert'].includes(difficulty)) ? '<circle cx="23" cy="12" r="1" fill="white"/>' : ''}
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-surf-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

// Add CSS for the custom icons
const iconStyles = `
  .custom-surf-icon {
    background: none !important;
    border: none !important;
  }
  .custom-surf-icon svg {
    transition: transform 0.2s ease;
  }
  .custom-surf-icon:hover svg {
    transform: scale(1.1);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = iconStyles;
  document.head.appendChild(styleSheet);
}

const defaultCenter = { lat: 37.5, lng: -122.3 };

const Map: React.FC = () => {
  const [center, setCenter] = useState(defaultCenter);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSpotForModal, setSelectedSpotForModal] = useState<SurfSpot | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [qualityScores, setQualityScores] = useState<{ [key: string]: number }>({});
  const [bottomNavValue, setBottomNavValue] = useState(0);
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const mapRef = useRef<any>(null);

  const filteredSpots = surfSpots.filter(spot =>
    spot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load favorites on component mount
  useEffect(() => {
    const loadFavorites = () => {
      const savedFavorites = weatherService.getFavoriteSpots();
      setFavorites(savedFavorites);
    };
    loadFavorites();
  }, []);

  // Load quality scores for all spots
  useEffect(() => {
    const loadQualityScores = async () => {
      const scores: { [key: string]: number } = {};
      
      for (const spot of surfSpots) {
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
    };
    
    loadQualityScores();
  }, []);

  // Toggle favorite status
  const toggleFavorite = (spotId: string) => {
    const newFavorites = weatherService.toggleFavorite(spotId) 
      ? [...favorites, spotId]
      : favorites.filter(id => id !== spotId);
    
    setFavorites(newFavorites);
  };

  // Check if spot is favorite
  const isFavorite = (spotId: string) => {
    return favorites.includes(spotId);
  };

  // Update center when selected spot changes
  useEffect(() => {
    if (selectedSpot) {
      const spot = surfSpots.find(s => s.id === selectedSpot);
      if (spot && mapRef.current) {
        mapRef.current.setView([spot.location.lat, spot.location.lng], 10);
      }
    }
  }, [selectedSpot]);

  const handleExploreSpot = (spotId: string) => {
    const spot = surfSpots.find(s => s.id === spotId);
    if (spot) {
      setSelectedSpotForModal(spot);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSpotForModal(null);
  };

  const handleBottomNavChange = (event: React.SyntheticEvent, newValue: number) => {
    setBottomNavValue(newValue);
    // Reset search visibility when changing tabs
    setIsSearchVisible(true);
  };

  // Handle scroll to show/hide search bar
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = event.currentTarget.scrollTop;
    
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      // Scrolling down & past threshold - hide search
      setIsSearchVisible(false);
    } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
      // Scrolling up or near top - show search
      setIsSearchVisible(true);
    }
    
    setLastScrollY(currentScrollY);
  };

  // Render content based on active tab
  const renderMainContent = () => {
    if (bottomNavValue === 0) {
      // Map tab - show the map
      return (
        <div style={{ height: '100%', width: '100%' }}>
          <MapContainer
            center={[center.lat, center.lng]}
            zoom={7}
            style={{ 
              height: '100%', 
              width: '100%'
            }}
            ref={mapRef}
            attributionControl={true}
            zoomControl={true}
            doubleClickZoom={true}
            scrollWheelZoom={true}
            dragging={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              maxZoom={18}
            />
            {filteredSpots.map((spot) => (
              <Marker
                key={spot.id}
                position={[spot.location.lat, spot.location.lng]}
                icon={createSurfIcon(spot.difficulty, spot.conditionsRating, isFavorite(spot.id), qualityScores[spot.id])}
                eventHandlers={{
                  add: (e) => {
                    if (selectedSpot === spot.id) {
                      e.target.openPopup();
                    }
                  }
                }}
              >
                <Popup>
                  <Paper sx={{ p: 1, maxWidth: 280, borderRadius: '12px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6">{spot.name}</Typography>
                      <IconButton 
                        onClick={() => toggleFavorite(spot.id)}
                        color={isFavorite(spot.id) ? 'error' : 'default'}
                        size="small"
                      >
                        {isFavorite(spot.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                    </Box>
                    
                    <Typography variant="body2">Today's Conditions: <b>{spot.conditionsRating}</b></Typography>
                    <Typography variant="body2">Difficulty: {spot.difficulty}</Typography>
                    
                    {/* Quality Score Display */}
                    {qualityScores[spot.id] && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          Surf Quality:
                        </Typography>
                        <Box 
                          sx={{ 
                            px: 1, 
                            py: 0.5, 
                            borderRadius: '8px',
                            backgroundColor: qualityScores[spot.id] >= 7 ? '#4CAF50' : 
                                           qualityScores[spot.id] >= 5 ? '#FF9800' : '#F44336',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {qualityScores[spot.id].toFixed(1)}/10
                        </Box>
                      </Box>
                    )}
                    
                    <Typography variant="body2" sx={{ mb: 2 }}>{spot.description}</Typography>
                    
                    {/* Live Weather Data */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                        🌊 Live Conditions
                      </Typography>
                      <WeatherIndicator 
                        lat={spot.location.lat} 
                        lng={spot.location.lng} 
                        compact={false}
                      />
                    </Box>
                    
                    {/* Basic conditions from spot data */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                        📊 Static Conditions
                      </Typography>
                      <Typography variant="body2">
                        Swell: {spot.currentConditions.swellHeight}ft @ {spot.currentConditions.swellPeriod}s ({spot.currentConditions.swellDirection})
                      </Typography>
                      <Typography variant="body2">
                        Wind: {spot.currentConditions.windSpeed}mph {spot.currentConditions.windDirection}
                      </Typography>
                      <Typography variant="body2">
                        Water: {spot.currentConditions.waterTemp}°F | Air: {spot.currentConditions.airTemp}°F
                      </Typography>
                    </Box>
                    
                    <Button
                      variant="contained"
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '8px',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        }
                      }}
                      size="small"
                      startIcon={<ExploreIcon />}
                      onClick={() => handleExploreSpot(spot.id)}
                      fullWidth
                    >
                      Explore Spot
                    </Button>
                  </Paper>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      );
    }

    // Other tabs - placeholder content
    return renderPlaceholderContent();
  };

  const renderPlaceholderContent = () => {
    switch (bottomNavValue) {
      case 1: // Favorites
        return (
          <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
            p: 4
          }}>
            <Box sx={{ fontSize: '120px', mb: 2 }}>⭐</Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              Your Favorites
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              {favorites.length} spots saved
            </Typography>
            
            {favorites.length > 0 ? (
              <Box sx={{ width: '100%', maxWidth: '400px' }}>
                {favorites.slice(0, 3).map((favId) => {
                  const spot = surfSpots.find(s => s.id === favId);
                  return spot ? (
                    <Card key={spot.id} sx={{ mb: 2, backgroundColor: 'rgba(255,255,255,0.9)' }}>
                      <CardContent>
                        <Typography variant="h6" color="primary">{spot.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {spot.region}, {spot.state} • {spot.conditionsRating}
                        </Typography>
                      </CardContent>
                    </Card>
                  ) : null;
                })}
                {favorites.length > 3 && (
                  <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
                    +{favorites.length - 3} more favorites
                  </Typography>
                )}
              </Box>
            ) : (
              <Box>
                <Typography variant="body1" sx={{ mb: 2, opacity: 0.8 }}>
                  Start adding spots to your favorites by tapping the ❤️ icon
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  Your favorite surf spots will appear here for quick access
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 2: // Forecast
        return (
          <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
            color: 'white',
            textAlign: 'center',
            p: 4
          }}>
            <Box sx={{ fontSize: '120px', mb: 2 }}>📊</Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              Surf Forecast
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              West Coast Conditions
            </Typography>
            
            <Box sx={{ width: '100%', maxWidth: '400px' }}>
              <Card sx={{ mb: 2, backgroundColor: 'rgba(255,255,255,0.9)' }}>
                <CardContent>
                  <Typography variant="h6" color="primary">Today's Highlights</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    🌊 Best Conditions: Central California
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    📈 Swell Building: 3-5ft tomorrow
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    💨 Light offshore winds morning
                  </Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ mb: 2, backgroundColor: 'rgba(255,255,255,0.9)' }}>
                <CardContent>
                  <Typography variant="h6" color="primary">5-Day Outlook</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Weekend storm system approaching - expect increasing surf!
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
              Detailed forecasts available in spot details
            </Typography>
          </Box>
        );

      case 3: // Profile
        return (
          <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)',
            color: 'white',
            textAlign: 'center',
            p: 4
          }}>
            <Box sx={{ fontSize: '120px', mb: 2 }}>🏄‍♂️</Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              Surfer Profile
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Track Your Sessions
            </Typography>
            
            <Box sx={{ width: '100%', maxWidth: '400px' }}>
              <Card sx={{ mb: 2, backgroundColor: 'rgba(255,255,255,0.9)' }}>
                <CardContent>
                  <Typography variant="h6" color="primary">Your Stats</Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Spots Visited
                      </Typography>
                      <Typography variant="h5" color="primary">
                        {Math.min(favorites.length * 3, 24)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Sessions
                      </Typography>
                      <Typography variant="h5" color="primary">
                        {Math.min(favorites.length * 5, 42)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Card sx={{ mb: 2, backgroundColor: 'rgba(255,255,255,0.9)' }}>
                <CardContent>
                  <Typography variant="h6" color="primary">Recent Activity</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    🏄‍♂️ Surfed Mavericks - Epic session!
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    ⭐ Added Ocean Beach to favorites
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📱 Checked conditions 12 times today
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
              Sign up to save your surf sessions and stats
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Box sx={{ 
        height: '100vh', 
        width: '100vw', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#f5f5f5'
      }}>
        {/* Search bar - only show on map tab */}
        {bottomNavValue === 0 && (
          <>
            <Box sx={{ 
              position: 'absolute',
              top: isSearchVisible ? 16 : -80,
              left: 16,
              right: 16,
              zIndex: 1000,
              backgroundColor: 'white', 
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              transition: 'top 0.3s ease-in-out, opacity 0.3s ease-in-out',
              opacity: isSearchVisible ? 1 : 0
            }}>
              <Box sx={{ p: 2 }}>
                <Autocomplete
                  freeSolo
                  options={surfSpots.map((spot) => spot.name)}
                  inputValue={searchQuery}
                  onInputChange={(_, newInputValue) => setSearchQuery(newInputValue)}
                  onChange={(_, value) => {
                    const spot = surfSpots.find(s => s.name === value);
                    if (spot) {
                      setCenter({ lat: spot.location.lat, lng: spot.location.lng });
                      setSelectedSpot(spot.id);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      placeholder="Search surf spots..."
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          '&:hover': {
                            borderColor: '#667eea',
                            backgroundColor: 'white'
                          },
                          '&.Mui-focused': {
                            borderColor: '#667eea',
                            backgroundColor: 'white',
                            boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                          },
                        }
                      }}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Box>
            </Box>
            
            {/* Search hint indicator when hidden */}
            {!isSearchVisible && (
              <Box sx={{
                position: 'absolute',
                top: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 999,
                backgroundColor: 'rgba(102, 126, 234, 0.9)',
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                opacity: 0.8,
                transition: 'opacity 0.3s ease-in-out'
              }}>
                ↑ Scroll up to search
              </Box>
            )}
          </>
        )}

        {/* Main Content Container */}
        <Box sx={{ 
          flex: 1, 
          position: 'relative',
          mb: 7, // Make room for bottom navigation
          overflow: 'hidden'
        }}>
          {renderMainContent()}
          {bottomNavValue === 0 && <MapLegend />}
        </Box>

        {/* Bottom Navigation */}
        <BottomNavigation
          value={bottomNavValue}
          onChange={handleBottomNavChange}
          showLabels
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: 70,
            backgroundColor: 'white',
            borderTop: '1px solid #e0e0e0',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
            '& .MuiBottomNavigationAction-root': {
              color: '#9e9e9e',
              '&.Mui-selected': {
                color: '#667eea',
              }
            }
          }}
        >
          <BottomNavigationAction 
            label="Map" 
            icon={<HomeIcon />} 
          />
          <BottomNavigationAction 
            label={`Favorites (${favorites.length})`}
            icon={<BookmarkIcon />} 
          />
          <BottomNavigationAction 
            label="Forecast" 
            icon={<TrendingUpIcon />} 
          />
          <BottomNavigationAction 
            label="Profile" 
            icon={<PersonIcon />} 
          />
        </BottomNavigation>
      </Box>
      
      <SpotDetailsDrawer
        open={modalOpen}
        onClose={handleCloseModal}
        spot={selectedSpotForModal}
        onScroll={handleScroll}
      />
    </>
  );
};

export default Map; 