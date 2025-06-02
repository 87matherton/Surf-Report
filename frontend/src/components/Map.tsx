import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Typography, Paper, TextField, InputAdornment, Button, Autocomplete } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { surfSpots, SurfSpot } from '../../data/spots';
import SpotDetailsModal from './SpotDetailsModal';
import MapLegend from './MapLegend';
import WeatherIndicator from './WeatherIndicator';

// Create custom surf icons based on difficulty and conditions
const createSurfIcon = (difficulty: string, conditionsRating: string) => {
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

  // Create SVG icon with wave symbol
  const svgIcon = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
      </defs>
      <!-- Outer circle (condition indicator) -->
      <circle cx="20" cy="20" r="18" fill="${borderColor}" filter="url(#shadow)"/>
      <!-- Inner circle (difficulty indicator) -->
      <circle cx="20" cy="20" r="14" fill="${baseColor}"/>
      <!-- Wave symbol -->
      <path d="M10 20 Q15 15 20 20 T30 20" stroke="white" stroke-width="2" fill="none"/>
      <path d="M8 24 Q13 19 18 24 T28 24" stroke="white" stroke-width="1.5" fill="none" opacity="0.8"/>
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
  const [mapKey, setMapKey] = useState(() => Math.random().toString(36).substr(2, 9));
  const mapRef = useRef<any>(null);

  const filteredSpots = surfSpots.filter(spot =>
    spot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Force complete remount with unique key on every mount to prevent double initialization
  useEffect(() => {
    setMapKey(Math.random().toString(36).substr(2, 9));
  }, []);

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
          <div key={mapKey} style={{ height: '100%', width: '100%' }}>
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
                  icon={createSurfIcon(spot.difficulty, spot.conditionsRating)}
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
                      <Typography variant="h6">{spot.name}</Typography>
                      <Typography variant="body2">Today's Conditions: <b>{spot.conditionsRating}</b></Typography>
                      <Typography variant="body2">Difficulty: {spot.difficulty}</Typography>
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