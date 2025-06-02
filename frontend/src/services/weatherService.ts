import axios from 'axios';
import { API_CONFIG } from '../config/api';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGust?: number;
  visibility: number;
  uvIndex: number;
  cloudCover: number;
  rain?: number;
  seaTemperature?: number;
  timestamp: number;
  description: string;
  icon: string;
}

export interface MarineData {
  waveHeight: number;
  wavePeriod: number;
  waveDirection: number;
  swellHeight: number;
  swellPeriod: number;
  swellDirection: number;
  windWaveHeight: number;
  windWavePeriod: number;
  windWaveDirection: number;
  timestamp: number;
}

export interface TideData {
  current: string;
  next: Array<{
    time: string;
    type: 'high' | 'low';
    height: number;
  }>;
}

export interface CombinedWeatherData {
  weather: WeatherData;
  marine: MarineData;
  tide: TideData;
  lastUpdated: number;
}

class WeatherService {
  private static instance: WeatherService;
  private cache = new Map<string, { data: CombinedWeatherData; timestamp: number }>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  private getCacheKey(lat: number, lng: number): string {
    return `${lat.toFixed(3)}_${lng.toFixed(3)}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  async getWeatherData(lat: number, lng: number): Promise<CombinedWeatherData> {
    const cacheKey = this.getCacheKey(lat, lng);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const [weatherData, marineData] = await Promise.all([
        this.fetchWeatherData(lat, lng),
        this.fetchMarineData(lat, lng)
      ]);

      const tideData = this.generateTideData(); // For now, generate mock tide data
      
      const combinedData: CombinedWeatherData = {
        weather: weatherData,
        marine: marineData,
        tide: tideData,
        lastUpdated: Date.now()
      };

      this.cache.set(cacheKey, { data: combinedData, timestamp: Date.now() });
      return combinedData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  private async fetchWeatherData(lat: number, lng: number): Promise<WeatherData> {
    const url = API_CONFIG.WEATHER_API_URL;
    const params = {
      latitude: lat,
      longitude: lng,
      current: [
        'temperature_2m',
        'apparent_temperature',
        'relative_humidity_2m',
        'pressure_msl',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
        'visibility',
        'uv_index',
        'cloud_cover',
        'precipitation',
        'weather_code'
      ].join(','),
      timezone: 'auto',
      forecast_days: 1
    };

    const response = await axios.get(url, { params });
    const current = response.data.current;

    return {
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      pressure: current.pressure_msl,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      windGust: current.wind_gusts_10m,
      visibility: current.visibility,
      uvIndex: current.uv_index,
      cloudCover: current.cloud_cover,
      rain: current.precipitation,
      timestamp: Date.now(),
      description: this.getWeatherDescription(current.weather_code),
      icon: this.getWeatherIcon(current.weather_code)
    };
  }

  private async fetchMarineData(lat: number, lng: number): Promise<MarineData> {
    const url = API_CONFIG.MARINE_API_URL;
    const params = {
      latitude: lat,
      longitude: lng,
      current: [
        'wave_height',
        'wave_direction',
        'wave_period',
        'wind_wave_height',
        'wind_wave_direction',
        'wind_wave_period',
        'swell_wave_height',
        'swell_wave_direction',
        'swell_wave_period'
      ].join(','),
      timezone: 'auto'
    };

    try {
      const response = await axios.get(url, { params });
      const current = response.data.current;

      return {
        waveHeight: current.wave_height || 0,
        wavePeriod: current.wave_period || 0,
        waveDirection: current.wave_direction || 0,
        swellHeight: current.swell_wave_height || current.wave_height || 0,
        swellPeriod: current.swell_wave_period || current.wave_period || 0,
        swellDirection: current.swell_wave_direction || current.wave_direction || 0,
        windWaveHeight: current.wind_wave_height || 0,
        windWavePeriod: current.wind_wave_period || 0,
        windWaveDirection: current.wind_wave_direction || 0,
        timestamp: Date.now()
      };
    } catch (error) {
      console.warn('Marine data not available for this location, using default values');
      return {
        waveHeight: 1.5,
        wavePeriod: 8,
        waveDirection: 270,
        swellHeight: 1.2,
        swellPeriod: 10,
        swellDirection: 270,
        windWaveHeight: 0.8,
        windWavePeriod: 6,
        windWaveDirection: 270,
        timestamp: Date.now()
      };
    }
  }

  private generateTideData(): TideData {
    const now = new Date();
    const times: Array<{
      time: string;
      type: 'high' | 'low';
      height: number;
    }> = [];
    
    // Generate next 4 tide times (approximately every 6 hours)
    for (let i = 1; i <= 4; i++) {
      const tideTime = new Date(now.getTime() + (i * 6 * 60 * 60 * 1000));
      times.push({
        time: tideTime.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        type: (i % 2 === 1 ? 'high' : 'low') as 'high' | 'low',
        height: i % 2 === 1 ? 5.2 + Math.random() * 2 : 1.8 + Math.random() * 1.5
      });
    }

    return {
      current: Math.random() > 0.5 ? 'Rising' : 'Falling',
      next: times
    };
  }

  private getWeatherDescription(code: number): string {
    const weatherCodes: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Light rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      99: 'Thunderstorm with heavy hail'
    };
    return weatherCodes[code] || 'Unknown';
  }

  private getWeatherIcon(code: number): string {
    const iconCodes: { [key: number]: string } = {
      0: '01d', // Clear sky
      1: '02d', // Mainly clear
      2: '03d', // Partly cloudy
      3: '04d', // Overcast
      45: '50d', // Fog
      48: '50d', // Depositing rime fog
      51: '09d', // Light drizzle
      53: '09d', // Moderate drizzle
      55: '09d', // Dense drizzle
      61: '10d', // Slight rain
      63: '10d', // Moderate rain
      65: '10d', // Heavy rain
      71: '13d', // Slight snow
      73: '13d', // Moderate snow
      75: '13d', // Heavy snow
      80: '09d', // Light rain showers
      81: '09d', // Moderate rain showers
      82: '09d', // Violent rain showers
      95: '11d', // Thunderstorm
      96: '11d', // Thunderstorm with hail
      99: '11d'  // Thunderstorm with heavy hail
    };
    return iconCodes[code] || '01d';
  }

  // Method to get forecast data for the next few days
  async getForecastData(lat: number, lng: number, days: number = 7): Promise<any[]> {
    const url = `https://api.open-meteo.com/v1/forecast`;
    const params = {
      latitude: lat,
      longitude: lng,
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'wind_speed_10m_max',
        'wind_direction_10m_dominant',
        'weather_code'
      ].join(','),
      timezone: 'auto',
      forecast_days: days
    };

    try {
      const response = await axios.get(url, { params });
      const daily = response.data.daily;
      
      return daily.time.map((date: string, index: number) => ({
        date,
        maxTemp: daily.temperature_2m_max[index],
        minTemp: daily.temperature_2m_min[index],
        windSpeed: daily.wind_speed_10m_max[index],
        windDirection: daily.wind_direction_10m_dominant[index],
        description: this.getWeatherDescription(daily.weather_code[index]),
        icon: this.getWeatherIcon(daily.weather_code[index])
      }));
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      return [];
    }
  }

  // Method to clear cache (useful for manual refresh)
  clearCache(): void {
    this.cache.clear();
  }
}

export default WeatherService.getInstance(); 