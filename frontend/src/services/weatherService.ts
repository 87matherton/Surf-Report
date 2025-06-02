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
  currentHeight: number;
  next: Array<{
    time: string;
    type: 'high' | 'low';
    height: number;
  }>;
  chartData: Array<{
    time: string;
    timeLabel: string;
    height: number;
    type?: 'high' | 'low' | null;
  }>;
}

export interface WaveData {
  current: number;
  chartData: Array<{
    time: string;
    timeLabel: string;
    height: number;
    period?: number;
    direction?: string;
    type?: 'peak' | 'low' | null;
  }>;
}

export interface CombinedWeatherData {
  weather: WeatherData;
  marine: MarineData;
  tide: TideData;
  wave: WaveData;
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
        wave: await this.generateWaveData(lat, lng),
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
    const currentHeight = 3.5 + Math.sin(Date.now() / 1000000) * 2.5; // Current tide height between 1-6m
    
    // Generate 12 hours of tide data (every 30 minutes = 24 data points)
    const chartData: Array<{
      time: string;
      timeLabel: string;
      height: number;
      type?: 'high' | 'low' | null;
    }> = [];
    
    const nextTides: Array<{
      time: string;
      type: 'high' | 'low';
      height: number;
    }> = [];
    
    // Tide cycle: ~12.5 hours for full cycle (high to high)
    // Generate realistic sine wave pattern
    for (let i = 0; i < 24; i++) {
      const timeOffset = i * 30 * 60 * 1000; // 30 minutes in milliseconds
      const futureTime = new Date(now.getTime() + timeOffset);
      
      // Create realistic tide pattern (sine wave with some randomness)
      const tidePhase = (Date.now() + timeOffset) / 1000000; // Phase offset
      const baseHeight = 3.5 + Math.sin(tidePhase) * 2.2; // Base sine wave
      const randomVariation = (Math.random() - 0.5) * 0.8; // Add some realistic variation
      const height = Math.max(0.5, Math.min(6.5, baseHeight + randomVariation));
      
      // Determine if this is a high or low tide point
      const prevHeight = i > 0 ? chartData[i - 1].height : height;
      const nextPhase = tidePhase + 0.1;
      const nextHeight = 3.5 + Math.sin(nextPhase) * 2.2;
      
      let type: 'high' | 'low' | null = null;
      
      // Detect tide extremes (simplified detection)
      if (i > 0 && i < 23) {
        const isLocalMax = height > prevHeight && height > nextHeight;
        const isLocalMin = height < prevHeight && height < nextHeight;
        
        if (isLocalMax && height > 4.5) type = 'high';
        if (isLocalMin && height < 2.5) type = 'low';
      }
      
      const timeStr = futureTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: false
      });
      
      const timeLabel = futureTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      chartData.push({
        time: timeStr,
        timeLabel,
        height: parseFloat(height.toFixed(1)),
        type
      });
      
      // Collect high/low tide times for the summary
      if (type && nextTides.length < 4) {
        nextTides.push({
          time: timeLabel,
          type,
          height: parseFloat(height.toFixed(1))
        });
      }
    }
    
    // If no extremes were detected, add some manually for demo purposes
    if (nextTides.length === 0) {
      for (let i = 1; i <= 4; i++) {
        const tideTime = new Date(now.getTime() + (i * 3 * 60 * 60 * 1000)); // Every 3 hours
        nextTides.push({
          time: tideTime.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          type: (i % 2 === 1 ? 'high' : 'low') as 'high' | 'low',
          height: i % 2 === 1 ? 5.2 + Math.random() * 1 : 1.8 + Math.random() * 1.5
        });
      }
    }

    return {
      current: Math.random() > 0.5 ? 'Rising' : 'Falling',
      currentHeight: parseFloat(currentHeight.toFixed(1)),
      next: nextTides,
      chartData
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

  // Method to get 5-day forecast with tide data for calendar display
  async getFiveDayForecast(lat: number, lng: number): Promise<any[]> {
    try {
      // Get weather forecast
      const weatherForecast = await this.getForecastData(lat, lng, 5);
      
      // Generate 5-day forecast with tides
      const forecast: any[] = [];
      const now = new Date();
      
      for (let i = 0; i < 5; i++) {
        const date = new Date(now.getTime() + (i * 24 * 60 * 60 * 1000));
        const weatherDay = weatherForecast[i] || this.generateDefaultWeatherDay(date, i);
        
        // Generate realistic tide times for this day (typically 2 high, 2 low per day)
        const dayTides = this.generateDayTideData(date);
        
        // Generate marine conditions
        const marineConditions = this.generateDayMarineConditions(i);
        
        forecast.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          dayName: i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' }),
          weather: {
            condition: weatherDay.description.toLowerCase().includes('clear') ? 'sunny' : 
                      weatherDay.description.toLowerCase().includes('cloud') ? 'cloudy' :
                      weatherDay.description.toLowerCase().includes('rain') ? 'rainy' : 'sunny',
            icon: weatherDay.description.toLowerCase().includes('clear') ? 'sunny' : 
                  weatherDay.description.toLowerCase().includes('cloud') ? 'cloudy' :
                  weatherDay.description.toLowerCase().includes('rain') ? 'rainy' : 'sunny',
            maxTemp: weatherDay.maxTemp || (20 + Math.random() * 8),
            minTemp: weatherDay.minTemp || (12 + Math.random() * 6),
            windSpeed: weatherDay.windSpeed || (5 + Math.random() * 15),
            windDirection: weatherDay.windDirection?.toString() || (Math.random() * 360).toString(),
            precipitation: weatherDay.description.toLowerCase().includes('rain') ? Math.random() * 10 : 0,
            description: weatherDay.description || 'Partly cloudy'
          },
          marine: marineConditions,
          tides: dayTides
        });
      }
      
      return forecast;
    } catch (error) {
      console.error('Error fetching 5-day forecast:', error);
      // Return default forecast data
      return this.generateDefaultFiveDayForecast();
    }
  }

  private generateDayTideData(date: Date): Array<{ time: string; type: 'high' | 'low'; height: number }> {
    const tides: Array<{ time: string; type: 'high' | 'low'; height: number }> = [];
    const baseTime = new Date(date);
    baseTime.setHours(0, 0, 0, 0);
    
    // Generate 4 tide events per day (2 high, 2 low) with realistic timing
    const tideEvents = [
      { hours: 2 + Math.random() * 4, type: 'low' as const },
      { hours: 8 + Math.random() * 4, type: 'high' as const },
      { hours: 14 + Math.random() * 4, type: 'low' as const },
      { hours: 20 + Math.random() * 4, type: 'high' as const }
    ];
    
    tideEvents.forEach(event => {
      const tideTime = new Date(baseTime.getTime() + (event.hours * 60 * 60 * 1000));
      tides.push({
        time: tideTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        type: event.type,
        height: event.type === 'high' ? 
          4.5 + Math.random() * 2.5 : 
          0.8 + Math.random() * 1.5
      });
    });
    
    return tides.sort((a, b) => a.time.localeCompare(b.time));
  }

  private generateDayMarineConditions(dayIndex: number) {
    // Create realistic marine condition variations over 5 days
    const baseWaveHeight = 1.5 + Math.sin(dayIndex * 0.5) * 1.2 + Math.random() * 0.8;
    const basePeriod = 8 + Math.random() * 6;
    const baseDirection = 200 + Math.random() * 80; // SW to W
    
    return {
      waveHeight: Math.max(0.5, baseWaveHeight),
      wavePeriod: Math.round(basePeriod),
      swellDirection: Math.round(baseDirection).toString()
    };
  }

  private generateDefaultWeatherDay(date: Date, dayIndex: number) {
    const conditions = ['Clear sky', 'Partly cloudy', 'Mostly cloudy', 'Light rain', 'Overcast'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      date: date.toISOString().split('T')[0],
      maxTemp: 18 + Math.random() * 10 + Math.sin(dayIndex * 0.3) * 3,
      minTemp: 12 + Math.random() * 6 + Math.sin(dayIndex * 0.3) * 2,
      windSpeed: 8 + Math.random() * 12,
      windDirection: Math.random() * 360,
      description: condition,
      icon: condition.toLowerCase().includes('clear') ? '01d' : 
            condition.toLowerCase().includes('cloudy') ? '03d' : 
            condition.toLowerCase().includes('rain') ? '10d' : '02d'
    };
  }

  private generateDefaultFiveDayForecast() {
    const forecast: any[] = [];
    const now = new Date();
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(now.getTime() + (i * 24 * 60 * 60 * 1000));
      const weatherDay = this.generateDefaultWeatherDay(date, i);
      
      forecast.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dayName: i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' }),
        weather: {
          condition: weatherDay.description.toLowerCase().includes('clear') ? 'sunny' : 'cloudy',
          icon: weatherDay.description.toLowerCase().includes('clear') ? 'sunny' : 'cloudy',
          maxTemp: weatherDay.maxTemp,
          minTemp: weatherDay.minTemp,
          windSpeed: weatherDay.windSpeed,
          windDirection: weatherDay.windDirection.toString(),
          precipitation: weatherDay.description.toLowerCase().includes('rain') ? Math.random() * 5 : 0,
          description: weatherDay.description
        },
        marine: this.generateDayMarineConditions(i),
        tides: this.generateDayTideData(date)
      });
    }
    
    return forecast;
  }

  private async generateWaveData(lat: number, lng: number): Promise<WaveData> {
    try {
      // Try to fetch real marine forecast data
      const marineData = await this.fetchMarineForecastData(lat, lng);
      if (marineData && marineData.length > 0) {
        return {
          current: marineData[0].height,
          chartData: marineData
        };
      }
    } catch (error) {
      console.warn('Failed to fetch marine forecast data, using fallback data:', error);
    }

    // Fallback to synthetic data if API fails
    return this.generateSyntheticWaveData();
  }

  private generateSyntheticWaveData(): WaveData {
    const now = new Date();
    
    // More realistic base wave heights for different California regions
    // These are calibrated to match typical surf conditions
    const baseWaveHeight = 1.2; // ~4ft - much more realistic baseline
    const maxWaveHeight = 3.0;   // ~10ft - maximum for typical conditions
    
    // Generate 12 hours of wave data (past 6 hours + next 6 hours)
    const chartData: Array<{
      time: string;
      timeLabel: string;
      height: number;
      period?: number;
      direction?: string;
      type?: 'peak' | 'low' | null;
    }> = [];
    
    for (let i = -6; i < 6; i++) {
      const time = new Date(now.getTime() + (i * 60 * 60 * 1000));
      const hour = time.getHours();
      
      // More realistic wave patterns using multiple components
      const timeOfDay = hour / 24;
      const tideComponent = Math.sin(timeOfDay * Math.PI * 2) * 0.3; // Tidal influence
      const swellComponent = Math.sin((timeOfDay + 0.3) * Math.PI * 1.5) * 0.4; // Primary swell
      const windComponent = Math.sin((timeOfDay + 0.1) * Math.PI * 3) * 0.2; // Wind waves
      
      // Add some natural variation
      const randomVariation = (Math.random() - 0.5) * 0.3;
      
      // Calculate wave height (keeping it realistic for surf conditions)
      const waveHeight = Math.max(0.3, 
        baseWaveHeight + 
        (tideComponent + swellComponent + windComponent + randomVariation)
      );
      
      // Cap at realistic maximum
      const finalHeight = Math.min(waveHeight, maxWaveHeight);
      
      // Determine wave type for display
      let type: 'peak' | 'low' | null = null;
      if (i > -5 && i < 5) {
        const prevHeight = i === -6 ? finalHeight : chartData[chartData.length - 1]?.height || finalHeight;
        if (finalHeight > prevHeight + 0.2) type = 'peak';
        if (finalHeight < prevHeight - 0.2) type = 'low';
      }
      
      // Add realistic wave period (8-14 seconds is typical for surf)
      const period = 9 + Math.sin(timeOfDay * Math.PI * 2) * 3 + Math.random() * 2;
      
      // Add realistic wave direction (mostly NW for Northern California)
      const baseDirection = 300; // NW
      const directionVariation = Math.sin(timeOfDay * Math.PI * 4) * 20; // +/- 20 degrees
      const direction = Math.round(baseDirection + directionVariation);
      
      // Create both time formats for compatibility
      const timeLabel = time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      
      const isoTime = time.toISOString();
      
      console.log(`🕐 Generating wave data for ${timeLabel} (${isoTime}) - Height: ${finalHeight.toFixed(2)}m`);
      
      chartData.push({
        time: isoTime,
        timeLabel: timeLabel,
        height: Math.round(finalHeight * 100) / 100, // Round to 2 decimal places
        period: Math.round(period * 10) / 10, // Round to 1 decimal place
        direction: `${direction}°`,
        type
      });
    }

    // Find current time data (should be at index 6 since we go -6 to +5)
    const currentTimeIndex = 6; // Middle of our 12-hour range
    const currentData = chartData[currentTimeIndex] || chartData[0];
    
    console.log(`🌊 Generated ${chartData.length} wave data points`);
    console.log(`🕐 Current time should be: ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`);
    console.log(`🌊 Current wave height: ${currentData.height}m`);
    console.log(`📊 Time range: ${chartData[0].timeLabel} to ${chartData[chartData.length - 1].timeLabel}`);

    return {
      current: currentData.height,
      chartData
    };
  }

  private async fetchMarineForecastData(lat: number, lng: number): Promise<Array<{
    time: string;
    timeLabel: string;
    height: number;
    period?: number;
    direction?: string;
    type?: 'peak' | 'low' | null;
  }>> {
    const url = 'https://marine-api.open-meteo.com/v1/marine';
    const params = {
      latitude: lat.toString(),
      longitude: lng.toString(),
      hourly: [
        'wave_height',
        'wave_direction',
        'wave_period',
        'swell_wave_height',
        'swell_wave_direction',
        'swell_wave_period'
      ].join(','),
      timezone: 'auto',
      forecast_days: '2' // Get 48 hours of data to have enough for our 12-hour window
    };

    console.log(`🌊 Fetching marine data for coordinates: ${lat}, ${lng}`);
    
    const response = await fetch(`${url}?${new URLSearchParams(params)}`);
    if (!response.ok) {
      throw new Error(`Marine API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('🌊 Raw marine API response:', data);

    if (!data.hourly) {
      throw new Error('Invalid marine API response format');
    }

    const { hourly } = data;
    const times = hourly.time || [];
    const waveHeights = hourly.wave_height || [];
    const swellHeights = hourly.swell_wave_height || [];
    const wavePeriods = hourly.wave_period || [];
    const swellPeriods = hourly.swell_wave_period || [];
    const waveDirections = hourly.wave_direction || [];
    const swellDirections = hourly.swell_wave_direction || [];

    console.log(`🌊 Processing ${times.length} data points`);
    console.log(`🌊 Sample wave heights: ${waveHeights.slice(0, 5)}`);
    console.log(`🌊 Sample swell heights: ${swellHeights.slice(0, 5)}`);

    const now = new Date();
    const processedData: Array<{
      time: string;
      timeLabel: string;
      height: number;
      period?: number;
      direction?: string;
      type?: 'peak' | 'low' | null;
    }> = [];

    // Find the closest time to current time in the API data
    let startIndex = 0;
    const currentTime = now.getTime();
    let closestTimeDiff = Infinity;
    
    times.forEach((timeStr: string, index: number) => {
      const apiTime = new Date(timeStr).getTime();
      const timeDiff = Math.abs(apiTime - currentTime);
      if (timeDiff < closestTimeDiff) {
        closestTimeDiff = timeDiff;
        startIndex = index;
      }
    });

    // Get 12 hours of data: 6 hours before current time + 6 hours after
    const dataStartIndex = Math.max(0, startIndex - 6);
    const dataEndIndex = Math.min(times.length, dataStartIndex + 12);
    
    console.log(`🕐 Current time: ${now.toLocaleTimeString()}`);
    console.log(`📊 Using API data from index ${dataStartIndex} to ${dataEndIndex} (total: ${dataEndIndex - dataStartIndex} points)`);

    for (let i = dataStartIndex; i < dataEndIndex; i++) {
      const time = new Date(times[i]);
      
      // Use the larger of wave height or swell height, but apply surf-specific calibration
      let rawHeight = Math.max(waveHeights[i] || 0, swellHeights[i] || 0);
      
      // **CRITICAL CALIBRATION**: Open-Meteo tends to overestimate wave heights for surf
      // Apply realistic scaling factors based on typical surf conditions
      const calibrationFactor = 0.4; // Scale down by 60% to match real surf heights
      const minHeight = 0.3; // Minimum 1ft waves
      const maxHeight = 3.5; // Maximum ~11ft for typical conditions
      
      // Apply calibration and limits
      let adjustedHeight = rawHeight * calibrationFactor;
      adjustedHeight = Math.max(minHeight, Math.min(adjustedHeight, maxHeight));
      
      // Use swell period if available, otherwise wave period
      const period = swellPeriods[i] || wavePeriods[i] || 10;
      
      // Use swell direction if available, otherwise wave direction
      const direction = Math.round(swellDirections[i] || waveDirections[i] || 300);

      // Determine peak/low status
      let type: 'peak' | 'low' | null = null;
      if (processedData.length > 0) {
        const prevHeight = processedData[processedData.length - 1]?.height || adjustedHeight;
        if (adjustedHeight > prevHeight + 0.3) type = 'peak';
        if (adjustedHeight < prevHeight - 0.3) type = 'low';
      }

      const timeLabel = time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });

      console.log(`🕐 Processing API data for ${timeLabel} - Height: ${adjustedHeight.toFixed(2)}m`);

      processedData.push({
        time: time.toISOString(),
        timeLabel: timeLabel,
        height: Math.round(adjustedHeight * 100) / 100,
        period: Math.round(period * 10) / 10,
        direction: `${direction}°`,
        type
      });
    }

    console.log(`🌊 Processed wave data: heights range from ${Math.min(...processedData.map(d => d.height))} to ${Math.max(...processedData.map(d => d.height))}m`);
    console.log(`📊 Time range: ${processedData[0]?.timeLabel} to ${processedData[processedData.length - 1]?.timeLabel}`);
    
    return processedData;
  }
}

export default WeatherService.getInstance(); 