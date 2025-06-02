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
  Legend
} from 'recharts';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  useTheme, 
  FormControlLabel, 
  Switch,
  Stack 
} from '@mui/material';

interface WaveDataPoint {
  time: string;
  timeLabel: string;
  height: number;
  period?: number;
  direction?: string;
  type?: 'peak' | 'low' | null;
}

interface WaveChartProps {
  waveData: WaveDataPoint[];
  currentWaveHeight: number;
  locationName: string;
}

const CustomTooltip = ({ active, payload, label, isMetric }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const height = isMetric ? data.height : data.height * 3.28084; // Convert m to ft
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
          {data.timeLabel}
        </Typography>
        <Typography variant="body2" sx={{ color: '#2196F3' }}>
          Wave Height: {height.toFixed(1)}{unit}
        </Typography>
        {data.period && (
          <Typography variant="body2" sx={{ color: '#FF9800' }}>
            Period: {data.period}s
          </Typography>
        )}
        {data.direction && (
          <Typography variant="body2" sx={{ color: '#4CAF50' }}>
            Direction: {data.direction}
          </Typography>
        )}
        {data.type && (
          <Typography variant="caption" sx={{ 
            color: data.type === 'peak' ? '#4CAF50' : '#FF9800',
            fontWeight: 'bold'
          }}>
            {data.type === 'peak' ? '🔺 Wave Peak' : '🔻 Wave Low'}
          </Typography>
        )}
      </Box>
    );
  }
  return null;
};

export const WaveChart: React.FC<WaveChartProps> = ({ 
  waveData, 
  currentWaveHeight, 
  locationName 
}) => {
  const theme = useTheme();
  const [isMetric, setIsMetric] = useState(true);

  // Convert data based on unit preference
  const convertedWaveData = useMemo(() => {
    if (isMetric) return waveData;
    
    return waveData.map(point => ({
      ...point,
      height: point.height * 3.28084 // Convert meters to feet
    }));
  }, [waveData, isMetric]);

  const convertedCurrentHeight = useMemo(() => {
    return isMetric ? currentWaveHeight : currentWaveHeight * 3.28084;
  }, [currentWaveHeight, isMetric]);

  // Find peak and low wave points
  const extremePoints = convertedWaveData.filter(point => point.type);
  
  // Get current time and find closest match in chart data
  const now = new Date();
  const currentTimeLabel = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Find the closest time point in our data to the current time
  const currentTime = now.getTime();
  let closestDataPoint = convertedWaveData[0];
  let closestTimeDiff = Infinity;

  convertedWaveData.forEach(point => {
    // Parse the time from the data point
    const pointTime = new Date(point.time).getTime();
    const timeDiff = Math.abs(pointTime - currentTime);
    
    if (timeDiff < closestTimeDiff) {
      closestTimeDiff = timeDiff;
      closestDataPoint = point;
    }
  });

  console.log(`🕐 Current time: ${currentTimeLabel}`);
  console.log(`📊 Closest data point: ${closestDataPoint.timeLabel}`);
  console.log(`🌊 Chart time range: ${convertedWaveData[0]?.timeLabel} to ${convertedWaveData[convertedWaveData.length - 1]?.timeLabel}`);

  const unit = isMetric ? 'm' : 'ft';
  const unitLabel = isMetric ? 'Wave Height (m)' : 'Wave Height (ft)';

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            🌊 12-Hour Wave Forecast - {locationName}
          </Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={isMetric}
                onChange={(e) => setIsMetric(e.target.checked)}
                color="primary"
                size="small"
              />
            }
            label={
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                {isMetric ? 'Metric (m)' : 'Imperial (ft)'}
              </Typography>
            }
            sx={{ m: 0 }}
          />
        </Stack>
        
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={convertedWaveData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 30
              }}
            >
              <defs>
                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00BCD4" stopOpacity={0.4}/>
                  <stop offset="50%" stopColor="#2196F3" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3F51B5" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              
              <XAxis 
                dataKey="timeLabel"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                interval="preserveStartEnd"
                angle={-20}
                textAnchor="end"
                height={60}
              />
              
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                label={{ 
                  value: unitLabel, 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: theme.palette.text.secondary }
                }}
              />
              
              <Tooltip content={(props) => <CustomTooltip {...props} isMetric={isMetric} />} />
              
              {/* Current wave height reference line */}
              <ReferenceLine 
                y={convertedCurrentHeight} 
                stroke="#FF5722" 
                strokeDasharray="5 5" 
                strokeWidth={2}
                label={{ 
                  value: "Current", 
                  position: "top",
                  style: { fill: '#FF5722', fontWeight: 'bold' }
                }}
              />
              
              {/* Current time vertical line */}
              <ReferenceLine 
                x={closestDataPoint.timeLabel} 
                stroke="#9C27B0" 
                strokeWidth={3}
                strokeOpacity={0.8}
                label={{ 
                  value: "Now", 
                  position: "top",
                  style: { fill: '#9C27B0', fontWeight: 'bold', fontSize: '12px' }
                }}
              />
              
              {/* Wave peak markers */}
              {extremePoints.filter(p => p.type === 'peak').map((point, index) => (
                <ReferenceLine 
                  key={`peak-${index}`}
                  x={point.timeLabel} 
                  stroke="#4CAF50" 
                  strokeWidth={2}
                  strokeOpacity={0.7}
                />
              ))}
              
              {/* Wave low markers */}
              {extremePoints.filter(p => p.type === 'low').map((point, index) => (
                <ReferenceLine 
                  key={`low-${index}`}
                  x={point.timeLabel} 
                  stroke="#FF9800" 
                  strokeWidth={2}
                  strokeOpacity={0.7}
                />
              ))}
              
              <Area
                type="monotone"
                dataKey="height"
                stroke="#2196F3"
                strokeWidth={3}
                fill="url(#waveGradient)"
                dot={{ fill: '#2196F3', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 6, stroke: '#2196F3', strokeWidth: 2, fill: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
        
        {/* Legend */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 3, bgcolor: '#2196F3', borderRadius: 1 }} />
            <Typography variant="caption">Wave Height</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 3, bgcolor: '#FF5722', borderRadius: 1 }} />
            <Typography variant="caption">Current Height</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 3, height: 12, bgcolor: '#9C27B0', borderRadius: 1 }} />
            <Typography variant="caption">Current Time</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 3, height: 12, bgcolor: '#4CAF50', borderRadius: 1 }} />
            <Typography variant="caption">Wave Peak</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 3, height: 12, bgcolor: '#FF9800', borderRadius: 1 }} />
            <Typography variant="caption">Wave Low</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WaveChart; 