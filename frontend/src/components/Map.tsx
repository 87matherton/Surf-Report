import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Typography, Paper, TextField, InputAdornment, Button, Autocomplete, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { surfSpots, SurfSpot } from '../data/spots';
import SpotDetailsModal from './SpotDetailsModal';
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

  return (
    <>
      <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
        {/* Header with title */}
        <Box sx={{ 
          p: 2, 
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
          textAlign: 'center',
          boxShadow: 2
        }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            🌊 WaveCheck 🏄‍♂️
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Find the perfect surf conditions near you
          </Typography>
        </Box>

        {/* Search bar */}
        <Box sx={{ p: 2, backgroundColor: 'grey.50' }}>
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
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#2196F3',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2196F3',
                    },
                  }
                }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#2196F3' }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Box>
        <Box sx={{ flex: 1, position: 'relative' }}>
          <div style={{ height: '100%', width: '100%' }}>
            <MapContainer
              center={[center.lat, center.lng]}
              zoom={7}
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
              attributionControl={true}
              zoomControl={true}
              doubleClickZoom={true}
              scrollWheelZoom={true}
              dragging={true}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
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
                    <Paper sx={{ p: 1, maxWidth: 280 }}>
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
                              borderRadius: 1,
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
                        color="primary"
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
          <MapLegend />
        </Box>
      </Box>
      
      <SpotDetailsModal
        open={modalOpen}
        onClose={handleCloseModal}
        spot={selectedSpotForModal}
      />
    </>
  );
};

export default Map; 