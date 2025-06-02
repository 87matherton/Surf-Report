import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  LabelList
} from 'recharts';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  useTheme, 
  FormControlLabel, 
  Switch,
  Stack,
  IconButton,
  Chip
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Brightness3Icon from '@mui/icons-material/Brightness3';

interface TideDataPoint {
  time: string;
  timeLabel: string;
  height: number;
  type?: 'high' | 'low' | null;
  dayIndex?: number;
  hour?: number;
  isExtreme?: boolean;
  extremeLabel?: string;
}

interface TideChartProps {
  tideData: TideDataPoint[];
  currentTideHeight: number;
  locationName: string;
}

// Generate comprehensive 3-day tide data
const generateThreeDayTideData = (isMetric: boolean) => {
  const data: TideDataPoint[] = [];
  const extremes: Array<{time: string, height: number, type: 'high' | 'low', dayIndex: number}> = [];
  const now = new Date();
  
  // Generate 3 days of hourly tide data
  for (let day = 0; day < 3; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const time = new Date(now.getTime() + (day * 24 + hour) * 60 * 60 * 1000);
      
      // Create realistic tide curve using multiple sine waves
      const timeHours = day * 24 + hour;
      const tideBase = 1.2; // Base tide level in meters
      const tideAmplitude = 1.3; // Tide range
      
      // Primary tidal component (12.42 hour cycle)
      const primaryTide = Math.sin((timeHours / 12.42) * 2 * Math.PI);
      // Secondary tidal component (12 hour cycle)  
      const secondaryTide = 0.3 * Math.sin((timeHours / 12) * 2 * Math.PI);
      // Daily variation
      const dailyVariation = 0.2 * Math.sin((timeHours / 24) * 2 * Math.PI);
      
      let height = tideBase + tideAmplitude * (primaryTide + secondaryTide + dailyVariation);
      
      // Convert to imperial if needed
      if (!isMetric) {
        height = height * 3.28084;
      }
      
      // Determine if this is an extreme point
      let type: 'high' | 'low' | null = null;
      let isExtreme = false;
      
      // Check for extremes by looking at surrounding points
      if (hour > 0 && hour < 23) {
        const prevHeight = tideBase + tideAmplitude * (
          Math.sin(((timeHours - 1) / 12.42) * 2 * Math.PI) +
          0.3 * Math.sin(((timeHours - 1) / 12) * 2 * Math.PI) +
          0.2 * Math.sin(((timeHours - 1) / 24) * 2 * Math.PI)
        );
        const nextHeight = tideBase + tideAmplitude * (
          Math.sin(((timeHours + 1) / 12.42) * 2 * Math.PI) +
          0.3 * Math.sin(((timeHours + 1) / 12) * 2 * Math.PI) +
          0.2 * Math.sin(((timeHours + 1) / 24) * 2 * Math.PI)
        );
        
        const currentMetric = tideBase + tideAmplitude * (primaryTide + secondaryTide + dailyVariation);
        
        if (currentMetric > prevHeight && currentMetric > nextHeight && currentMetric > 1.8) {
          type = 'high';
          isExtreme = true;
          extremes.push({
            time: time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            height: height,
            type: 'high',
            dayIndex: day
          });
        } else if (currentMetric < prevHeight && currentMetric < nextHeight && currentMetric < 0.8) {
          type = 'low';
          isExtreme = true;
          extremes.push({
            time: time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            height: height,
            type: 'low',
            dayIndex: day
          });
        }
      }
      
      data.push({
        time: time.toISOString(),
        timeLabel: time.getHours().toString(),
        height: Math.round(height * 100) / 100,
        type,
        dayIndex: day,
        hour: time.getHours(),
        isExtreme,
        extremeLabel: isExtreme ? `${time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} ${height.toFixed(1)}${isMetric ? 'm' : 'ft'}` : undefined
      });
    }
  }
  
  return { data, extremes };
};

// Generate sunrise/sunset data for 3 days
const generateSunData = (): Array<{
  day: number;
  sunrise: string;
  sunset: string;
  firstLight: string;
  lastLight: string;
}> => {
  const sunData: Array<{
    day: number;
    sunrise: string;
    sunset: string;
    firstLight: string;
    lastLight: string;
  }> = [];
  const now = new Date();
  
  for (let day = 0; day < 3; day++) {
    const date = new Date(now.getTime() + day * 24 * 60 * 60 * 1000);
    
    // Approximate sunrise/sunset times for San Francisco
    const sunrise = new Date(date);
    sunrise.setHours(6, 20 + Math.random() * 40, 0, 0); // 6:20-7:00 AM
    
    const sunset = new Date(date);
    sunset.setHours(19, 30 + Math.random() * 30, 0, 0); // 7:30-8:00 PM
    
    const firstLight = new Date(sunrise.getTime() - 30 * 60 * 1000); // 30 min before sunrise
    const lastLight = new Date(sunset.getTime() + 30 * 60 * 1000); // 30 min after sunset
    
    sunData.push({
      day,
      sunrise: sunrise.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      sunset: sunset.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      firstLight: firstLight.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      lastLight: lastLight.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    });
  }
  
  return sunData;
};

const CustomTooltip = ({ active, payload, label, isMetric }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const unit = isMetric ? 'm' : 'ft';
    
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 1.5,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 2
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {data.timeLabel}:00
        </Typography>
        <Typography variant="body2" sx={{ color: '#2196F3' }}>
          Tide: {data.height.toFixed(1)}{unit}
        </Typography>
        {data.type && (
          <Typography variant="caption" sx={{ 
            color: data.type === 'high' ? '#4CAF50' : '#FF9800',
            fontWeight: 'bold'
          }}>
            {data.type === 'high' ? '🔺 High Tide' : '🔻 Low Tide'}
          </Typography>
        )}
      </Box>
    );
  }
  return null;
};

const TideLabel = ({ x, y, payload }: any) => {
  if (payload && payload.isExtreme) {
    return (
      <g>
        <text 
          x={x} 
          y={y - 10} 
          textAnchor="middle" 
          fontSize="10" 
          fill="#333"
          fontWeight="bold"
        >
          {payload.extremeLabel}
        </text>
      </g>
    );
  }
  return null;
};

export const TideChart: React.FC<TideChartProps> = ({ 
  currentTideHeight, 
  locationName 
}) => {
  const theme = useTheme();
  const [isMetric, setIsMetric] = useState(false); // Default to Imperial to match the image
  
  // Generate 3-day tide data
  const { data: threeDayTideData, extremes } = useMemo(() => generateThreeDayTideData(isMetric), [isMetric]);
  const sunData = useMemo(() => generateSunData(), []);
  
  // Current tide info
  const currentTide = useMemo(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
    const height = isMetric ? currentTideHeight : currentTideHeight * 3.28084;
    return {
      time: timeStr,
      height: height.toFixed(1),
      unit: isMetric ? 'm' : 'ft'
    };
  }, [currentTideHeight, isMetric]);

  // Calculate Y-axis domain
  const yAxisDomain = useMemo(() => {
    if (threeDayTideData.length === 0) return [0, 10];
    
    const heights = threeDayTideData.map(point => point.height);
    const minHeight = Math.min(...heights);
    const maxHeight = Math.max(...heights);
    
    const range = maxHeight - minHeight;
    const safeRange = range > 0.1 ? range : 1;
    const padding = Math.max(safeRange * 0.15, 0.3);
    
    const domainMin = minHeight - padding;
    const domainMax = maxHeight + padding;
    
    return [Math.floor(domainMin * 10) / 10, Math.ceil(domainMax * 10) / 10];
  }, [threeDayTideData, isMetric]);

  // Generate X-axis labels (3, 6, 9, 12, etc.)
  const xAxisTicks = useMemo((): number[] => {
    const ticks: number[] = [];
    for (let day = 0; day < 3; day++) {
      for (let hour = 3; hour <= 24; hour += 3) {
        ticks.push(day * 24 + (hour === 24 ? 0 : hour));
      }
    }
    return ticks;
  }, []);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
              Tides ({isMetric ? 'm' : 'ft'})
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {locationName}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isMetric}
                  onChange={(e) => setIsMetric(e.target.checked)}
                  size="small"
                />
              }
              label={
                <Typography variant="caption">
                  {isMetric ? 'Metric' : 'Imperial'}
                </Typography>
              }
              sx={{ m: 0 }}
            />
            <IconButton size="small">
              <CalendarTodayIcon fontSize="small" />
            </IconButton>
            <Typography variant="caption" sx={{ color: '#666' }}>
              Tide calendar
            </Typography>
          </Box>
        </Stack>

        {/* Current Tide Display */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
            {currentTide.height}{currentTide.unit}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            {currentTide.time}
          </Typography>
        </Box>

        {/* Main Chart */}
        <Box sx={{ width: '100%', height: 280, bgcolor: '#f5f5f5', borderRadius: 1, p: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              key={`tide-chart-3day-${isMetric ? 'metric' : 'imperial'}`}
              data={threeDayTideData}
              margin={{ top: 30, right: 20, left: 20, bottom: 40 }}
            >
              <defs>
                <linearGradient id="tideGradient3Day" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2196F3" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2196F3" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="1 1" stroke="#ddd" />
              
              <XAxis 
                dataKey="hour"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#666' }}
                ticks={xAxisTicks}
                domain={[0, 72]}
                type="number"
                scale="linear"
                tickFormatter={(value) => {
                  const hour = value % 24;
                  return hour === 0 ? '12' : hour > 12 ? (hour - 12).toString() : hour.toString();
                }}
              />
              
              <YAxis 
                domain={yAxisDomain}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#666' }}
                tickFormatter={(value) => `${value.toFixed(1)}`}
                width={40}
              />
              
              <Tooltip content={(props) => <CustomTooltip {...props} isMetric={isMetric} />} />
              
              {/* Tide curve */}
              <Area
                type="monotone"
                dataKey="height"
                stroke="#1976d2"
                strokeWidth={2}
                fill="url(#tideGradient3Day)"
                dot={false}
                activeDot={{ r: 4, stroke: '#1976d2', strokeWidth: 2, fill: '#fff' }}
              >
                <LabelList 
                  content={TideLabel}
                  position="top"
                />
              </Area>
              
              {/* Current time line */}
              <ReferenceLine 
                x={new Date().getHours()} 
                stroke="#9C27B0" 
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        {/* Sun/Moon Data for each day */}
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={4} justifyContent="space-around">
            {sunData.map((day, index) => (
              <Box key={index} sx={{ textAlign: 'center', flex: 1 }}>
                <Stack direction="row" justifyContent="center" spacing={1} sx={{ mb: 0.5 }}>
                  <WbSunnyIcon sx={{ fontSize: 16, color: '#ff9800' }} />
                  <Typography variant="caption" sx={{ fontSize: 11 }}>
                    First light
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ fontSize: 11, display: 'block' }}>
                  {day.firstLight}
                </Typography>
                
                <Typography variant="caption" sx={{ fontSize: 11, display: 'block', fontWeight: 'bold' }}>
                  Sunrise: {day.sunrise}
                </Typography>
                
                <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 1, mb: 0.5 }}>
                  <Brightness3Icon sx={{ fontSize: 16, color: '#3f51b5' }} />
                  <Typography variant="caption" sx={{ fontSize: 11 }}>
                    Sunset
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ fontSize: 11, display: 'block' }}>
                  {day.sunset}
                </Typography>
                
                <Typography variant="caption" sx={{ fontSize: 11, display: 'block' }}>
                  Last light: {day.lastLight}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TideChart; 