import React from 'react';
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
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';

interface TideDataPoint {
  time: string;
  timeLabel: string;
  height: number;
  type?: 'high' | 'low' | null;
}

interface TideChartProps {
  tideData: TideDataPoint[];
  currentTideHeight: number;
  locationName: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
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
          Tide Height: {data.height.toFixed(1)}m
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

export const TideChart: React.FC<TideChartProps> = ({ 
  tideData, 
  currentTideHeight, 
  locationName 
}) => {
  const theme = useTheme();

  // Find high and low tide points
  const extremePoints = tideData.filter(point => point.type);
  
  // Get current time in the same format as chart data
  const now = new Date();
  const currentTimeStr = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  });

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          🌊 12-Hour Tide Chart - {locationName}
        </Typography>
        
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={tideData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20
              }}
            >
              <defs>
                <linearGradient id="tideGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2196F3" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2196F3" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              
              <XAxis 
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                interval="preserveStartEnd"
              />
              
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                label={{ 
                  value: 'Height (m)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: theme.palette.text.secondary }
                }}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              {/* Current tide level reference line */}
              <ReferenceLine 
                y={currentTideHeight} 
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
                x={currentTimeStr} 
                stroke="#9C27B0" 
                strokeWidth={3}
                strokeOpacity={0.8}
                label={{ 
                  value: "Now", 
                  position: "top",
                  style: { fill: '#9C27B0', fontWeight: 'bold', fontSize: '12px' }
                }}
              />
              
              {/* High tide markers */}
              {extremePoints.filter(p => p.type === 'high').map((point, index) => (
                <ReferenceLine 
                  key={`high-${index}`}
                  x={point.time} 
                  stroke="#4CAF50" 
                  strokeWidth={2}
                  strokeOpacity={0.7}
                />
              ))}
              
              {/* Low tide markers */}
              {extremePoints.filter(p => p.type === 'low').map((point, index) => (
                <ReferenceLine 
                  key={`low-${index}`}
                  x={point.time} 
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
                fill="url(#tideGradient)"
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
            <Typography variant="caption">Tide Level</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 3, bgcolor: '#FF5722', borderRadius: 1 }} />
            <Typography variant="caption">Current Level</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 3, height: 12, bgcolor: '#9C27B0', borderRadius: 1 }} />
            <Typography variant="caption">Current Time</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 3, height: 12, bgcolor: '#4CAF50', borderRadius: 1 }} />
            <Typography variant="caption">High Tide</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 3, height: 12, bgcolor: '#FF9800', borderRadius: 1 }} />
            <Typography variant="caption">Low Tide</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TideChart; 