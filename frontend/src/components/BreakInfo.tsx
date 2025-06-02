import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Waves as WavesIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Groups as GroupsIcon,
  Terrain as TerrainIcon,
  Navigation as DirectionIcon,
  Info as InfoIcon
} from '@mui/icons-material';

interface BreakInfo {
  type: string;
  waveDirection: string;
  bottom: string;
  peakSections?: string[];
  hazards: string[];
  bestTime: string;
  crowdFactor: string;
  experience: string;
}

interface BreakInfoProps {
  spotName: string;
  breakInfo: BreakInfo;
}

const BreakInfo: React.FC<BreakInfoProps> = ({ spotName, breakInfo }) => {
  const getCrowdColor = (crowdFactor: string): 'success' | 'warning' | 'error' | 'default' => {
    const factor = crowdFactor.toLowerCase();
    if (factor.includes('low') || factor.includes('uncrowded')) return 'success';
    if (factor.includes('medium') || factor.includes('moderate')) return 'warning';
    if (factor.includes('high') || factor.includes('very') || factor.includes('extremely')) return 'error';
    return 'default';
  };

  const getHazardIcon = (hazard: string) => {
    const h = hazard.toLowerCase();
    if (h.includes('rock') || h.includes('reef')) return '🪨';
    if (h.includes('current') || h.includes('rip')) return '🌊';
    if (h.includes('crowd')) return '👥';
    if (h.includes('shark')) return '🦈';
    if (h.includes('kelp')) return '🌿';
    if (h.includes('cold')) return '🧊';
    if (h.includes('beginner')) return '🔰';
    return '⚠️';
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          🏄‍♂️ Break Information - {spotName}
        </Typography>
        
        <Grid container spacing={3}>
          {/* Break Type & Direction */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WavesIcon sx={{ mr: 1, fontSize: 18 }} />
                Break Type & Direction
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Chip label={breakInfo.type} color="primary" size="small" />
                <Chip label={breakInfo.waveDirection} color="secondary" size="small" />
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TerrainIcon sx={{ mr: 1, fontSize: 18 }} />
                Bottom Composition
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {breakInfo.bottom}
              </Typography>
            </Box>

            {breakInfo.peakSections && breakInfo.peakSections.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <DirectionIcon sx={{ mr: 1, fontSize: 18 }} />
                  Peak Sections
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {breakInfo.peakSections.map((section, index) => (
                    <Chip 
                      key={index}
                      label={section} 
                      variant="outlined" 
                      size="small"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Grid>

          {/* Timing & Crowds */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ScheduleIcon sx={{ mr: 1, fontSize: 18 }} />
                Best Time to Surf
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {breakInfo.bestTime}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <GroupsIcon sx={{ mr: 1, fontSize: 18 }} />
                Crowd Factor
              </Typography>
              <Chip 
                label={breakInfo.crowdFactor}
                color={getCrowdColor(breakInfo.crowdFactor)}
                size="small"
              />
            </Box>
          </Grid>

          {/* Experience Description */}
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InfoIcon sx={{ mr: 1, fontSize: 18 }} />
                Surfing Experience
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                {breakInfo.experience}
              </Typography>
            </Box>
          </Grid>

          {/* Hazards */}
          {breakInfo.hazards && breakInfo.hazards.length > 0 && (
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WarningIcon sx={{ mr: 1, fontSize: 18, color: 'warning.main' }} />
                Hazards & Safety Considerations
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {breakInfo.hazards.map((hazard, index) => (
                  <Chip 
                    key={index}
                    label={`${getHazardIcon(hazard)} ${hazard}`}
                    color="warning"
                    variant="outlined"
                    size="small"
                    sx={{ fontSize: '0.75rem' }}
                  />
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BreakInfo; 