import { useState, useEffect, useCallback } from 'react';
import weatherService from '../services/weatherService';

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

export interface UseForecastDataResult {
  forecast: ForecastDay[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useForecastData(lat: number, lng: number): UseForecastDataResult {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateForecastData = useCallback(() => {
    // Generate realistic 5-day forecast data
    const forecastData: ForecastDay[] = [];
    const now = new Date();
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(now.getTime() + (i * 24 * 60 * 60 * 1000));
      
      // Generate weather conditions
      const conditions = ['Clear sky', 'Partly cloudy', 'Mostly cloudy', 'Light rain', 'Overcast'];
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      
      // Generate tide times for the day
      const dayTides: DayTide[] = [];
      const baseTime = new Date(date);
      baseTime.setHours(0, 0, 0, 0);
      
      const tideEvents = [
        { hours: 2 + Math.random() * 4, type: 'low' as const },
        { hours: 8 + Math.random() * 4, type: 'high' as const },
        { hours: 14 + Math.random() * 4, type: 'low' as const },
        { hours: 20 + Math.random() * 4, type: 'high' as const }
      ];
      
      tideEvents.forEach(event => {
        const tideTime = new Date(baseTime.getTime() + (event.hours * 60 * 60 * 1000));
        dayTides.push({
          time: tideTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          type: event.type,
          height: event.type === 'high' ? 
            1.8 + Math.random() * 0.7 :  // High: 1.8-2.5m (6-8ft)
            0.3 + Math.random() * 0.9    // Low: 0.3-1.2m (1-4ft)
        });
      });
      
      // Sort tides by time
      dayTides.sort((a, b) => {
        const timeA = new Date(`1970/01/01 ${a.time}`);
        const timeB = new Date(`1970/01/01 ${b.time}`);
        return timeA.getTime() - timeB.getTime();
      });
      
      // Generate marine conditions
      const baseWaveHeight = 1.5 + Math.sin(i * 0.5) * 1.2 + Math.random() * 0.8;
      
      forecastData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dayName: i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' }),
        weather: {
          condition: condition.toLowerCase().includes('clear') ? 'sunny' : 
                    condition.toLowerCase().includes('cloud') ? 'cloudy' :
                    condition.toLowerCase().includes('rain') ? 'rainy' : 'sunny',
          icon: condition.toLowerCase().includes('clear') ? 'sunny' : 
                condition.toLowerCase().includes('cloud') ? 'cloudy' :
                condition.toLowerCase().includes('rain') ? 'rainy' : 'sunny',
          maxTemp: 18 + Math.random() * 10 + Math.sin(i * 0.3) * 3,
          minTemp: 12 + Math.random() * 6 + Math.sin(i * 0.3) * 2,
          windSpeed: 8 + Math.random() * 12,
          windDirection: (Math.random() * 360).toString(),
          precipitation: condition.toLowerCase().includes('rain') ? Math.random() * 10 : 0,
          description: condition
        },
        marine: {
          waveHeight: Math.max(0.5, baseWaveHeight),
          wavePeriod: Math.round(8 + Math.random() * 6),
          swellDirection: Math.round(200 + Math.random() * 80).toString()
        },
        tides: dayTides
      });
    }
    
    return forecastData;
  }, []);

  const fetchData = useCallback(async () => {
    if (!lat || !lng) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // For now, use generated data. In production, you'd call the weather service
      const forecastData = generateForecastData();
      setForecast(forecastData);
    } catch (err) {
      console.error('Error fetching forecast data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch forecast data');
    } finally {
      setLoading(false);
    }
  }, [lat, lng, generateForecastData]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    forecast,
    loading,
    error,
    refresh
  };
}

export default useForecastData; 