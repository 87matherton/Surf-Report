import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Collapse,
  Chip,
  Stack
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

const MapLegend: React.FC = () => {
  const [open, setOpen] = useState(false);

  const difficultyLevels = [
    { level: 'Beginner', color: '#4CAF50', description: 'Perfect for learning' },
    { level: 'Intermediate', color: '#FF9800', description: 'Some experience needed' },
    { level: 'Advanced', color: '#F44336', description: 'Experienced surfers only' },
    { level: 'Expert', color: '#9C27B0', description: 'Professional level waves' }
  ];

  const conditions = [
    { rating: 'Poor', color: '#757575', description: 'Not recommended' },
    { rating: 'Fair', color: '#FF9800', description: 'Decent conditions' },
    { rating: 'Good', color: '#2196F3', description: 'Great for surfing' },
    { rating: 'Excellent', color: '#4CAF50', description: 'Perfect conditions' }
  ];

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1000,
        maxWidth: 300
      }}
    >
      <IconButton
        onClick={() => setOpen(!open)}
        sx={{
          backgroundColor: 'white',
          boxShadow: 2,
          '&:hover': { backgroundColor: 'grey.100' }
        }}
      >
        {open ? <CloseIcon /> : <InfoIcon />}
      </IconButton>
      
      <Collapse in={open}>
        <Paper sx={{ mt: 1, p: 2, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>
            🏄‍♂️ Surf Spot Legend
          </Typography>
          
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
            Difficulty Levels (Inner Circle):
          </Typography>
          <Stack spacing={1} sx={{ mb: 2 }}>
            {difficultyLevels.map((item) => (
              <Box key={item.level} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    border: '1px solid #ccc'
                  }}
                />
                <Typography variant="body2">
                  <strong>{item.level}</strong> - {item.description}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
            Current Conditions (Outer Ring):
          </Typography>
          <Stack spacing={1} sx={{ mb: 2 }}>
            {conditions.map((item) => (
              <Box key={item.rating} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    border: '2px solid',
                    borderColor: item.color
                  }}
                />
                <Typography variant="body2">
                  <strong>{item.rating}</strong> - {item.description}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Box sx={{ mt: 2, p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              💡 <strong>Tip:</strong> Icons show wave symbols and difficulty dots. 
              Click any spot for detailed conditions and forecasts!
            </Typography>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default MapLegend; 