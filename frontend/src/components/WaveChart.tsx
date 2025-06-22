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
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';

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
      <div className="bg-background p-3 border rounded shadow">
        <p className="text-sm font-bold">
          {data.timeLabel}
        </p>
        <p className="text-sm text-blue-500">
          Wave Height: {height.toFixed(1)}{unit}
        </p>
        {data.period && (
          <p className="text-sm text-orange-500">
            Period: {data.period}s
          </p>
        )}
        {data.direction && (
          <p className="text-sm text-green-500">
            Direction: {data.direction}
          </p>
        )}
        {data.type && (
          <p className={`text-xs font-bold ${data.type === 'peak' ? 'text-green-500' : 'text-orange-500'}`}>
            {data.type === 'peak' ? '🔺 Wave Peak' : '🔻 Wave Low'}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const WaveChart: React.FC<WaveChartProps> = ({ 
  waveData, 
  currentWaveHeight, 
  locationName 
}) => {
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

  // Calculate Y-axis domain based on converted data
  const yAxisDomain = useMemo(() => {
    if (convertedWaveData.length === 0) return [0, 10];
    
    const heights = convertedWaveData.map(point => point.height);
    const minHeight = Math.min(...heights);
    const maxHeight = Math.max(...heights);
    
    // Ensure we have a reasonable range
    const range = maxHeight - minHeight;
    const safeRange = range > 0.1 ? range : 1; // Minimum range of 1 unit
    
    // Add padding (20% of range, minimum 0.5 units)
    const padding = Math.max(safeRange * 0.2, 0.5);
    const domainMin = Math.max(0, minHeight - padding);
    const domainMax = maxHeight + padding;
    
    // Round to clean numbers for better display
    const roundedMin = Math.floor(domainMin * 10) / 10;
    const roundedMax = Math.ceil(domainMax * 10) / 10;
    
    const domain = [roundedMin, roundedMax];
    console.log(`📊 Wave Y-axis domain (${isMetric ? 'metric' : 'imperial'}):`, domain);
    
    return domain;
  }, [convertedWaveData, isMetric]);

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

  const unitLabel = isMetric ? 'Wave Height (m)' : 'Wave Height (ft)';

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          🌊 12-Hour Wave Forecast - {locationName}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Switch
            checked={isMetric}
            onCheckedChange={setIsMetric}
          />
          <Label className="font-bold">
            {isMetric ? 'Metric (m)' : 'Imperial (ft)'}
          </Label>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              key={`wave-chart-${isMetric ? 'metric' : 'imperial'}`}
              data={convertedWaveData}
              margin={{
                top: 20,
                right: 30,
                left: 60,
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
              
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              
              <XAxis 
                dataKey="timeLabel"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                interval="preserveStartEnd"
                angle={-20}
                textAnchor="end"
                height={60}
              />
              
              <YAxis 
                domain={yAxisDomain}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(value) => `${value.toFixed(1)}`}
                width={50}
                label={{ 
                  value: unitLabel, 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#6b7280' }
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
        </div>
      </CardContent>
    </Card>
  );
};

export default WaveChart; 