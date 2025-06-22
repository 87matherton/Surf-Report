import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  LinearProgress,
  IconButton
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExploreIcon from '@mui/icons-material/Explore';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WavesIcon from '@mui/icons-material/Waves';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EditIcon from '@mui/icons-material/Edit';
import { surfSpots } from '../data/spots';
import weatherService from '../services/weatherService';

interface ProfilePageProps {
  favorites: string[];
  onExploreSpot: (spotId: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ favorites, onExploreSpot }) => {
  const [notifications, setNotifications] = useState(true);
  const [units, setUnits] = useState('imperial');
  const [qualityThreshold, setQualityThreshold] = useState(7);
  const [userStats, setUserStats] = useState({
    spotsVisited: Math.floor(Math.random() * 15) + 5,
    totalSessions: Math.floor(Math.random() * 50) + 20,
    favoriteSpots: 0,
    bestSession: 8.5 + Math.random() * 1.5
  });

  const favoriteSpots = surfSpots.filter(spot => favorites.includes(spot.id));

  useEffect(() => {
    setUserStats(prev => ({ ...prev, favoriteSpots: favorites.length }));
  }, [favorites]);

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const [skillLevel, setSkillLevel] = useState('Intermediate');

  const achievements = [
    { 
      name: 'First Wave', 
      description: 'Caught your first wave!', 
      icon: '🌊', 
      unlocked: true 
    },
    { 
      name: 'Explorer', 
      description: 'Visited 10 different surf spots', 
      icon: '🗺️', 
      unlocked: userStats.spotsVisited >= 10 
    },
    { 
      name: 'Surf Enthusiast', 
      description: 'Completed 25 surf sessions', 
      icon: '🏄‍♂️', 
      unlocked: userStats.totalSessions >= 25 
    },
    { 
      name: 'Perfect Session', 
      description: 'Rated a session 9.0 or higher', 
      icon: '⭐', 
      unlocked: userStats.bestSession >= 9.0 
    },
    { 
      name: 'Collector', 
      description: 'Added 5 favorite spots', 
      icon: '💎', 
      unlocked: favorites.length >= 5 
    }
  ];

  const recentActivity = [
    { action: 'Added to favorites', spot: 'Mavericks', time: '2 hours ago' },
    { action: 'Viewed forecast', spot: 'Ocean Beach SF', time: '5 hours ago' },
    { action: 'Explored spot', spot: 'Steamer Lane', time: '1 day ago' },
    { action: 'Updated profile', spot: '', time: '3 days ago' }
  ].filter(activity => activity.spot === '' || surfSpots.some(spot => spot.name === activity.spot));

  const handleNotificationToggle = () => {
    setNotifications(!notifications);
  };

  const handleUnitsChange = (event: any) => {
    setUnits(event.target.value);
  };

  const handleSkillLevelChange = (event: any) => {
    setSkillLevel(event.target.value);
  };

  const handleQualityThresholdChange = (event: any) => {
    setQualityThreshold(event.target.value);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Avatar 
          sx={{ 
            width: 80, 
            height: 80, 
            mx: 'auto', 
            mb: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          <PersonIcon sx={{ fontSize: 40 }} />
        </Avatar>
        
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1
        }}>
          Surf Profile
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
          <Chip 
            label={skillLevel}
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          />
          <IconButton size="small" sx={{ color: '#667eea' }}>
            <EditIcon />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Card sx={{ 
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <ExploreIcon sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {userStats.spotsVisited}
                  </Typography>
                  <Typography variant="body2">
                    Spots Visited
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Card sx={{ 
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
                color: 'white'
              }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <WavesIcon sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {userStats.totalSessions}
                  </Typography>
                  <Typography variant="body2">
                    Sessions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Card sx={{ 
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                background: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)',
                color: 'white'
              }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <FavoriteIcon sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {userStats.favoriteSpots}
                  </Typography>
                  <Typography variant="body2">
                    Favorites
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Card sx={{ 
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
                color: 'white'
              }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <TrendingUpIcon sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {userStats.bestSession.toFixed(1)}
                  </Typography>
                  <Typography variant="body2">
                    Best Session
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h6" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: 2,
              fontWeight: 'bold'
            }}>
              <SettingsIcon sx={{ color: '#667eea' }} />
              Preferences
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText 
                  primary="Push Notifications"
                  secondary="Get alerts for perfect surf conditions"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notifications}
                    onChange={handleNotificationToggle}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <Divider />
              
              <ListItem>
                <ListItemText primary="Units" />
                <FormControl size="small" sx={{ ml: 2, minWidth: 120 }}>
                  <Select
                    value={units}
                    onChange={handleUnitsChange}
                    displayEmpty
                  >
                    <MenuItem value="imperial">Imperial (ft, °F)</MenuItem>
                    <MenuItem value="metric">Metric (m, °C)</MenuItem>
                  </Select>
                </FormControl>
              </ListItem>
              
              <Divider />
              
              <ListItem>
                <ListItemText primary="Skill Level" />
                <FormControl size="small" sx={{ ml: 2, minWidth: 120 }}>
                  <Select
                    value={skillLevel}
                    onChange={handleSkillLevelChange}
                    displayEmpty
                  >
                    {skillLevels.map((level) => (
                      <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </ListItem>
              
              <Divider />
              
              <ListItem>
                <ListItemText 
                  primary="Quality Alert Threshold"
                  secondary={`Notify when conditions are ${qualityThreshold}/10 or better`}
                />
                <FormControl size="small" sx={{ ml: 2, minWidth: 80 }}>
                  <Select
                    value={qualityThreshold}
                    onChange={handleQualityThresholdChange}
                    displayEmpty
                  >
                    {[5, 6, 7, 8, 9].map((threshold) => (
                      <MenuItem key={threshold} value={threshold}>{threshold}/10</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h6" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: 2,
              fontWeight: 'bold'
            }}>
              <EmojiEventsIcon sx={{ color: '#FFD700' }} />
              Achievements
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Progress: {achievements.filter(a => a.unlocked).length}/{achievements.length} unlocked
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(achievements.filter(a => a.unlocked).length / achievements.length) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }
                }}
              />
            </Box>
            
            <Grid container spacing={1}>
              {achievements.map((achievement, index) => (
                <Grid item xs={12} key={index}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 1.5,
                    backgroundColor: achievement.unlocked ? '#f8f9fa' : '#f5f5f5',
                    borderRadius: '8px',
                    border: achievement.unlocked ? '2px solid #4CAF50' : '1px solid #e0e0e0',
                    opacity: achievement.unlocked ? 1 : 0.6
                  }}>
                    <Typography sx={{ fontSize: '1.5rem', mr: 2 }}>
                      {achievement.icon}
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {achievement.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.description}
                      </Typography>
                    </Box>
                    {achievement.unlocked && (
                      <Chip label="Unlocked" color="success" size="small" />
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h6" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: 2,
              fontWeight: 'bold'
            }}>
              <TrendingUpIcon sx={{ color: '#667eea' }} />
              Recent Activity
            </Typography>
            
            <List>
              {recentActivity.map((activity, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1">
                            {activity.action}
                          </Typography>
                          {activity.spot && (
                            <Chip 
                              label={activity.spot}
                              size="small"
                              variant="outlined"
                              clickable
                              onClick={() => {
                                const spot = surfSpots.find(s => s.name === activity.spot);
                                if (spot) onExploreSpot(spot.id);
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={activity.time}
                    />
                  </ListItem>
                  {index < recentActivity.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12}>
          <Alert severity="info" sx={{ borderRadius: '12px' }}>
            <Typography variant="body2">
              💡 <strong>Tip:</strong> Keep exploring new spots and checking forecasts to unlock more achievements! 
              Your surf journey is tracked automatically as you use WaveCheck.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage; 