import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  WbSunny as SunIcon,
  Cloud as CloudIcon,
  Grain as RainIcon,
  Air as WindIcon,
  Thermostat as TempIcon,
  Waves as WavesIcon,
  Schedule as TimeIcon
} from '@mui/icons-material';

interface DayTide {
  time: string;
  type: 'high' | 'low';
  height: number;
}

interface ForecastDay {
  date: string;
  dayName: string;
  weather: {
    condition: string;
    icon: string;
    maxTemp: number;
    minTemp: number;
    windSpeed: number;
    windDirection: string;
    precipitation: number;
    description: string;
  };
  marine: {
    waveHeight: number;
    wavePeriod: number;
    swellDirection: string;
  };
  tides: DayTide[];
}

interface ForecastCalendarProps {
  locationName: string;
  forecast: ForecastDay[];
}

const getWeatherIcon = (condition: string) => {
  const iconMap: { [key: string]: JSX.Element } = {
    sunny: <SunIcon sx={{ color: '#FFD700' }} />,
    cloudy: <CloudIcon sx={{ color: '#9E9E9E' }} />,
    rainy: <RainIcon sx={{ color: '#2196F3' }} />,
    partlyCloudySun: <SunIcon sx={{ color: '#FFA726' }} />,
    partlyCloudyCloud: <CloudIcon sx={{ color: '#78909C' }} />
  };
  return iconMap[condition] || <SunIcon sx={{ color: '#FFD700' }} />;
};

const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

const getConditionColor = (temp: number, windSpeed: number, waveHeight: number): 'success' | 'warning' | 'error' | 'default' => {
  let score = 0;
  
  // Temperature scoring (optimal around 15-25°C)
  if (temp >= 15 && temp <= 25) score += 2;
  else if (temp >= 10 && temp <= 30) score += 1;
  
  // Wind scoring (less is better for most surf spots)
  if (windSpeed <= 10) score += 2;
  else if (windSpeed <= 20) score += 1;
  
  // Wave height scoring
  if (waveHeight >= 1 && waveHeight <= 3) score += 2;
  else if (waveHeight >= 0.5 && waveHeight <= 4) score += 1;
  
  if (score >= 5) return 'success';
  if (score >= 3) return 'warning';
  if (score >= 1) return 'default';
  return 'error';
};

export const ForecastCalendar: React.FC<ForecastCalendarProps> = ({ locationName, forecast }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!forecast || forecast.length === 0) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            📅 5-Day Forecast - {locationName}
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            Forecast data is loading...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          📅 5-Day Forecast - {locationName}
        </Typography>
        
        <Grid container spacing={isMobile ? 1 : 2}>
          {forecast.map((day, index) => {
            const conditionColor = getConditionColor(
              day.weather.maxTemp, 
              day.weather.windSpeed, 
              day.marine.waveHeight
            );
            const isToday = index === 0;
            
            return (
              <Grid item xs={12} sm={6} md={2.4} key={day.date}>
                <Card 
                  sx={{ 
                    height: '100%',
                    border: isToday ? 2 : 1,
                    borderColor: isToday ? 'primary.main' : 'divider',
                    boxShadow: isToday ? 3 : 1,
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    {/* Day Header */}
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {day.dayName}
                        {isToday && (
                          <Chip 
                            label="Today" 
                            size="small" 
                            color="primary" 
                            sx={{ ml: 1, fontSize: '0.7rem' }}
                          />
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {day.date}
                      </Typography>
                    </Box>

                    {/* Weather Section */}
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                        {getWeatherIcon(day.weather.icon)}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {Math.round(day.weather.maxTemp)}° / {Math.round(day.weather.minTemp)}°
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        {day.weather.description}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    {/* Wind & Waves */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <WindIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption">
                            {Math.round(day.weather.windSpeed)}km/h
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {getWindDirection(parseInt(day.weather.windDirection))}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <WavesIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                          <Typography variant="caption">
                            {day.marine.waveHeight.toFixed(1)}m
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {day.marine.wavePeriod}s
                        </Typography>
                      </Box>

                      {day.weather.precipitation > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <RainIcon sx={{ fontSize: 14, color: 'info.main' }} />
                          <Typography variant="caption">
                            {day.weather.precipitation}mm
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    {/* Tide Times */}
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 1, display: 'block' }}>
                        🌊 Tides
                      </Typography>
                      {day.tides.slice(0, 4).map((tide, tideIndex) => (
                        <Box key={tideIndex} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                            {tide.type === 'high' ? '↑' : '↓'} {tide.type}
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                            {tide.time}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* Condition Rating */}
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Chip 
                        size="small" 
                        color={conditionColor}
                        label={
                          conditionColor === 'success' ? 'Great' :
                          conditionColor === 'warning' ? 'Good' :
                          conditionColor === 'default' ? 'Fair' : 'Poor'
                        }
                        sx={{ fontSize: '0.7rem', height: 24 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ForecastCalendar; 