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
        maxWidth: 320
      }}
    >
      <IconButton
        onClick={() => setOpen(!open)}
        sx={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          border: '1px solid rgba(0,0,0,0.1)',
          '&:hover': { 
            backgroundColor: '#f8f9fa',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 25px rgba(0,0,0,0.2)'
          },
          transition: 'all 0.2s ease'
        }}
      >
        {open ? <CloseIcon sx={{ color: '#667eea' }} /> : <InfoIcon sx={{ color: '#667eea' }} />}
      </IconButton>
      
      <Collapse in={open}>
        <Paper sx={{ 
          mt: 1, 
          p: 3, 
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid rgba(0,0,0,0.05)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
        }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            🏄‍♂️ Surf Spot Guide
          </Typography>
          
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1.5, 
              fontWeight: 'bold',
              color: '#2c3e50'
            }}
          >
            Difficulty Levels (Inner Circle):
          </Typography>
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            {difficultyLevels.map((item) => (
              <Box key={item.level} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    border: '2px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                />
                <Typography variant="body2" sx={{ color: '#2c3e50' }}>
                  <strong>{item.level}</strong> - {item.description}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1.5, 
              fontWeight: 'bold',
              color: '#2c3e50'
            }}
          >
            Current Conditions (Outer Ring):
          </Typography>
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            {conditions.map((item) => (
              <Box key={item.rating} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    border: '3px solid',
                    borderColor: item.color,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                />
                <Typography variant="body2" sx={{ color: '#2c3e50' }}>
                  <strong>{item.rating}</strong> - {item.description}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Box sx={{ 
            mt: 2, 
            p: 2, 
            background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
            borderRadius: '12px',
            border: '1px solid rgba(102, 126, 234, 0.1)'
          }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#37474f',
                fontWeight: 500,
                lineHeight: 1.4
              }}
            >
              💡 <strong>Tip:</strong> Icons show wave symbols and difficulty dots. 
              Quality scores (0-10) appear in top-left corners. 
              Click any spot for detailed conditions and forecasts!
            </Typography>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default MapLegend; 