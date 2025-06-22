import { useState, useEffect, useCallback } from 'react';
import weatherService, { CombinedWeatherData } from '../services/weatherService';

export interface UseWeatherDataResult {
  data: CombinedWeatherData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

export function useWeatherData(lat: number, lng: number, autoRefresh: boolean = true): UseWeatherDataResult {
  const [data, setData] = useState<CombinedWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    if (!lat || !lng) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const weatherData = await weatherService.getWeatherData(lat, lng);
      setData(weatherData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, [lat, lng]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 10 minutes if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData();
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [fetchData, autoRefresh]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh
  };
}

export default useWeatherData; 