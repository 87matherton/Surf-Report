import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Typography, Paper, TextField, InputAdornment, Button, Autocomplete } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { surfSpots, SurfSpot } from '../../data/spots';
import SpotDetailsModal from './SpotDetailsModal';

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
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
                  eventHandlers={{
                    add: (e) => {
                      if (selectedSpot === spot.id) {
                        e.target.openPopup();
                      }
                    }
                  }}
                >
                  <Popup>
                    <Paper sx={{ p: 1, maxWidth: 220 }}>
                      <Typography variant="h6">{spot.name}</Typography>
                      <Typography variant="body2">Today's Conditions: <b>{spot.conditionsRating}</b></Typography>
                      <Typography variant="body2">Difficulty: {spot.difficulty}</Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>{spot.description}</Typography>
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