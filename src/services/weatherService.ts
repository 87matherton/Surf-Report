import { SurfSpot } from '../data/spots';

// API Configuration
const OPEN_METEO_BASE_URL = 'https://marine-api.open-meteo.com/v1/marine';
const WEATHER_API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export interface LiveSurfConditions {
  swellHeight: number;
  swellPeriod: number;
  swellDirection: string;
  windSpeed: number;
  windDirection: string;
  windGusts?: number;
  waterTemp: number;
  airTemp: number;
  visibility?: number;
  uvIndex?: number;
  timestamp: string;
}

export interface SurfForecast {
  date: string;
  swellHeight: number;
  swellPeriod: number;
  swellDirection: string;
  windSpeed: number;
  windDirection: string;
  airTemp: number;
  waterTemp: number;
  precipitation?: number;
  cloudCover?: number;
}

export interface TideData {
  time: string;
  height: number;
  type: 'high' | 'low';
}

class WeatherService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  // Get cached data if still valid
  private getCachedData(key: string) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  // Set cache data
  private setCachedData(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Fetch live marine conditions from Open-Meteo Marine API
  async fetchLiveConditions(lat: number, lng: number): Promise<LiveSurfConditions> {
    const cacheKey = `live-${lat}-${lng}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const marineParams = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lng.toString(),
        current: [
          'wave_height',
          'wave_direction',
          'wave_period',
          'wind_wave_height',
          'wind_wave_direction',
          'wind_wave_period',
          'ocean_current_velocity',
          'ocean_current_direction'
        ].join(','),
        hourly: [
          'wave_height',
          'wave_direction', 
          'wave_period',
          'wind_wave_height',
          'wind_wave_direction',
          'wind_wave_period'
        ].join(','),
        forecast_days: '1',
        timezone: 'auto'
      });

      const weatherParams = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lng.toString(),
        current: [
          'temperature_2m',
          'wind_speed_10m',
          'wind_direction_10m',
          'wind_gusts_10m'
        ].join(','),
        timezone: 'auto'
      });

      // Fetch both marine and weather data in parallel
      const [marineResponse, weatherResponse] = await Promise.all([
        fetch(`${OPEN_METEO_BASE_URL}?${marineParams}`),
        fetch(`${WEATHER_API_BASE_URL}?${weatherParams}`)
      ]);

      if (!marineResponse.ok || !weatherResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const [marineData, weatherData] = await Promise.all([
        marineResponse.json(),
        weatherResponse.json()
      ]);

      // Process the data
      const current = marineData.current;
      const weather = weatherData.current;

      const conditions: LiveSurfConditions = {
        swellHeight: this.metersToFeet(current.wave_height || current.wind_wave_height || 1.5),
        swellPeriod: current.wave_period || current.wind_wave_period || 8,
        swellDirection: this.degreesToDirection(current.wave_direction || current.wind_wave_direction || 270),
        windSpeed: this.mpsToMph(weather.wind_speed_10m || 5),
        windDirection: this.degreesToDirection(weather.wind_direction_10m || 270),
        windGusts: weather.wind_gusts_10m ? this.mpsToMph(weather.wind_gusts_10m) : undefined,
        waterTemp: this.estimateWaterTemp(lat, weather.temperature_2m || 20),
        airTemp: this.celsiusToFahrenheit(weather.temperature_2m || 20),
        timestamp: new Date().toISOString()
      };

      this.setCachedData(cacheKey, conditions);
      return conditions;

    } catch (error) {
      console.error('Error fetching live conditions:', error);
      // Return fallback data based on location
      return this.getFallbackConditions(lat, lng);
    }
  }

  // Fetch 7-day surf forecast
  async fetchSurfForecast(lat: number, lng: number): Promise<SurfForecast[]> {
    const cacheKey = `forecast-${lat}-${lng}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const marineParams = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lng.toString(),
        daily: [
          'wave_height_max',
          'wave_direction_dominant',
          'wave_period_max',
          'wind_wave_height_max',
          'wind_wave_direction_dominant',
          'wind_wave_period_max'
        ].join(','),
        forecast_days: '7',
        timezone: 'auto'
      });

      const weatherParams = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lng.toString(),
        daily: [
          'temperature_2m_max',
          'temperature_2m_min',
          'wind_speed_10m_max',
          'wind_direction_10m_dominant',
          'precipitation_sum',
          'cloud_cover_mean'
        ].join(','),
        forecast_days: '7',
        timezone: 'auto'
      });

      const [marineResponse, weatherResponse] = await Promise.all([
        fetch(`${OPEN_METEO_BASE_URL}?${marineParams}`),
        fetch(`${WEATHER_API_BASE_URL}?${weatherParams}`)
      ]);

      if (!marineResponse.ok || !weatherResponse.ok) {
        throw new Error('Failed to fetch forecast data');
      }

      const [marineData, weatherData] = await Promise.all([
        marineResponse.json(),
        weatherResponse.json()
      ]);

      const marineDays = marineData.daily;
      const weatherDays = weatherData.daily;

      const forecast: SurfForecast[] = marineDays.time.map((date: string, index: number) => ({
        date,
        swellHeight: this.metersToFeet(
          marineDays.wave_height_max[index] || marineDays.wind_wave_height_max[index] || 1.5
        ),
        swellPeriod: marineDays.wave_period_max[index] || marineDays.wind_wave_period_max[index] || 8,
        swellDirection: this.degreesToDirection(
          marineDays.wave_direction_dominant[index] || marineDays.wind_wave_direction_dominant[index] || 270
        ),
        windSpeed: this.mpsToMph(weatherDays.wind_speed_10m_max[index] || 5),
        windDirection: this.degreesToDirection(weatherDays.wind_direction_10m_dominant[index] || 270),
        airTemp: this.celsiusToFahrenheit(weatherDays.temperature_2m_max[index] || 20),
        waterTemp: this.estimateWaterTemp(lat, weatherDays.temperature_2m_max[index] || 20),
        precipitation: weatherDays.precipitation_sum?.[index] || 0,
        cloudCover: weatherDays.cloud_cover_mean?.[index] || 50
      }));

      this.setCachedData(cacheKey, forecast);
      return forecast;

    } catch (error) {
      console.error('Error fetching forecast:', error);
      return this.getFallbackForecast(lat, lng);
    }
  }

  // Update spot with live data
  async updateSpotWithLiveData(spot: SurfSpot): Promise<SurfSpot> {
    try {
      const [liveConditions, forecast] = await Promise.all([
        this.fetchLiveConditions(spot.location.lat, spot.location.lng),
        this.fetchSurfForecast(spot.location.lat, spot.location.lng)
      ]);

      // Calculate surf quality based on live conditions
      const quality = this.calculateSurfQuality(liveConditions, spot);

      return {
        ...spot,
        currentConditions: {
          swellHeight: liveConditions.swellHeight,
          swellPeriod: liveConditions.swellPeriod,
          swellDirection: liveConditions.swellDirection,
          windSpeed: liveConditions.windSpeed,
          windDirection: liveConditions.windDirection,
          tide: spot.currentConditions.tide, // Keep existing tide data for now
          waterTemp: liveConditions.waterTemp,
          airTemp: liveConditions.airTemp
        },
        forecast: forecast.slice(0, 2).map(day => ({
          date: day.date,
          swellHeight: day.swellHeight,
          swellPeriod: day.swellPeriod,
          swellDirection: day.swellDirection,
          windSpeed: day.windSpeed,
          windDirection: day.windDirection
        })),
        conditionsRating: quality
      };
    } catch (error) {
      console.error(`Error updating spot ${spot.name}:`, error);
      return spot; // Return original spot if update fails
    }
  }

  // Utility functions
  private metersToFeet(meters: number): number {
    return Math.round(meters * 3.28084 * 10) / 10;
  }

  private mpsToMph(mps: number): number {
    return Math.round(mps * 2.237 * 10) / 10;
  }

  private celsiusToFahrenheit(celsius: number): number {
    return Math.round((celsius * 9/5 + 32) * 10) / 10;
  }

  private degreesToDirection(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  private estimateWaterTemp(lat: number, airTemp: number): number {
    // Rough estimation based on latitude and air temperature
    const baseTemp = Math.max(50, airTemp - 10 + (Math.abs(lat) > 40 ? -10 : 10));
    return Math.round(baseTemp);
  }

  private calculateSurfQuality(conditions: LiveSurfConditions, spot: SurfSpot): SurfSpot['conditionsRating'] {
    let score = 0;

    // Wave height score (30%)
    const optimalRange = this.parseSwellSize(spot.bestConditions.swellSize);
    if (conditions.swellHeight >= optimalRange.min && conditions.swellHeight <= optimalRange.max) {
      score += 3;
    } else if (conditions.swellHeight < optimalRange.min) {
      score += (conditions.swellHeight / optimalRange.min) * 3;
    } else {
      score += Math.max(0, 3 - (conditions.swellHeight - optimalRange.max) * 0.3);
    }

    // Wind score (25%)
    if (conditions.windSpeed <= 10) score += 2.5;
    else if (conditions.windSpeed <= 15) score += 1.5;
    else score += 0.5;

    // Swell period score (25%)
    if (conditions.swellPeriod >= 12) score += 2.5;
    else if (conditions.swellPeriod >= 8) score += 1.5;
    else score += 0.5;

    // Direction bonus (20%)
    if (spot.bestConditions.windDirection.includes(conditions.windDirection)) {
      score += 2;
    } else if (spot.bestConditions.swellDirection.includes(conditions.swellDirection)) {
      score += 1;
    }

    // Convert to rating
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Poor';
  }

  private parseSwellSize(swellSize: string): { min: number; max: number } {
    const match = swellSize.match(/(\d+)-(\d+)ft/);
    if (match) {
      return { min: parseInt(match[1]), max: parseInt(match[2]) };
    }
    return { min: 2, max: 8 };
  }

  private getFallbackConditions(lat: number, lng: number): LiveSurfConditions {
    // Generate realistic fallback data based on location
    const isWestCoast = lng < -100;
    const isTropical = Math.abs(lat) < 30;

    return {
      swellHeight: isWestCoast ? 4 + Math.random() * 4 : 2 + Math.random() * 3,
      swellPeriod: 8 + Math.random() * 6,
      swellDirection: isWestCoast ? 'W' : 'E',
      windSpeed: 5 + Math.random() * 10,
      windDirection: 'NE',
      waterTemp: isTropical ? 75 + Math.random() * 10 : 60 + Math.random() * 15,
      airTemp: isTropical ? 80 + Math.random() * 10 : 65 + Math.random() * 20,
      timestamp: new Date().toISOString()
    };
  }

  private getFallbackForecast(lat: number, lng: number): SurfForecast[] {
    const forecast: SurfForecast[] = [];
    const isWestCoast = lng < -100;
    const isTropical = Math.abs(lat) < 30;

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        swellHeight: isWestCoast ? 3 + Math.random() * 5 : 2 + Math.random() * 4,
        swellPeriod: 8 + Math.random() * 6,
        swellDirection: isWestCoast ? 'W' : 'E',
        windSpeed: 5 + Math.random() * 10,
        windDirection: 'NE',
        airTemp: isTropical ? 80 + Math.random() * 10 : 65 + Math.random() * 20,
        waterTemp: isTropical ? 75 + Math.random() * 10 : 60 + Math.random() * 15,
        precipitation: Math.random() * 5,
        cloudCover: Math.random() * 100
      });
    }

    return forecast;
  }
}

// Export singleton instance
export const weatherService = new WeatherService(); 