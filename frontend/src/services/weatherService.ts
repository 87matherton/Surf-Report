import axios from 'axios';
import { API_CONFIG } from '../config/api';

// Interface for Spitcast forecast data
interface SpitcastForecast {
  date: string;
  day: string;
  hour: string;
  size_ft: number;
  shape_full: string;
  shape: string; // 'poor', 'poor-fair', 'fair', 'good'
  size: number;
  latitude: number;
  longitude: number;
  spot_id: number;
  spot_name: string;
  warnings?: any[];
  shape_detail?: {
    swell?: string;
    wind?: string;
    tide?: string;
  };
}

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
      const [weatherData, marineData, tideData] = await Promise.all([
        this.fetchWeatherData(lat, lng),
        this.fetchMarineData(lat, lng),
        this.fetchTideData(lat, lng)
      ]);
      
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

  private async fetchTideData(lat: number, lng: number): Promise<TideData> {
    try {
      // Find closest NOAA tide station
      const tideStation = this.findClosestTideStation(lat, lng);
      console.log(`🌊 Using NOAA tide station: ${tideStation.name} (${tideStation.stationId})`);
      
      // Fetch real tide predictions from NOAA
      const tideData = await this.fetchNOAATideData(tideStation.stationId);
      return tideData;
    } catch (error) {
      console.warn('Failed to fetch NOAA tide data, using fallback data:', error);
      // Fallback to synthetic data if NOAA API fails
      return this.generateSyntheticTideData();
    }
  }

  private findClosestTideStation(lat: number, lng: number) {
    const stations = API_CONFIG.TIDE_STATIONS;
    let closestStation = stations.mavericks; // Default fallback
    let closestDistance = Infinity;

    // Calculate distance to each station using simple Euclidean distance
    // (Good enough for our purposes since all stations are in California)
    Object.values(stations).forEach(station => {
      const distance = Math.sqrt(
        Math.pow(lat - station.lat, 2) + Math.pow(lng - station.lng, 2)
      );
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestStation = station;
      }
    });

    return closestStation;
  }

  private async fetchNOAATideData(stationId: string): Promise<TideData> {
    const url = API_CONFIG.NOAA_TIDES_API_URL;
    const params = {
      station: stationId,
      product: 'predictions',
      datum: 'MLLW',
      time_zone: 'lst_ldt',
      units: 'metric',
      format: 'json',
      range: '24' // Get 24 hours of data
    };

    console.log(`🌊 Fetching NOAA tide data for station ${stationId}`);

    const response = await fetch(`${url}?${new URLSearchParams(params)}`);
    if (!response.ok) {
      throw new Error(`NOAA API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('🌊 Raw NOAA tide response:', data);

    if (!data.predictions || !Array.isArray(data.predictions)) {
      throw new Error('Invalid NOAA tide API response format');
    }

    return this.processNOAATideData(data.predictions);
  }

  private processNOAATideData(predictions: Array<{t: string, v: string}>): TideData {
    const now = new Date();
    
    // Process the tide predictions for chart display
    const chartData: Array<{
      time: string;
      timeLabel: string;
      height: number;
      type?: 'high' | 'low' | null;
    }> = [];

    // Find current time index and get 12 hours of data centered around now
    let currentIndex = 0;
    const currentTime = now.getTime();
    
    // Find closest time point to current time
    predictions.forEach((prediction, index) => {
      const predictionTime = new Date(prediction.t).getTime();
      const currentClosest = new Date(predictions[currentIndex].t).getTime();
      
      if (Math.abs(predictionTime - currentTime) < Math.abs(currentClosest - currentTime)) {
        currentIndex = index;
      }
    });

    // Get 12 hours of data (6 hours before and after current time)
    const startIndex = Math.max(0, currentIndex - 36); // 36 points = 6 hours (6min intervals)
    const endIndex = Math.min(predictions.length, startIndex + 72); // 72 points = 12 hours

    for (let i = startIndex; i < endIndex; i += 6) { // Take every 6th point (30-minute intervals)
      const prediction = predictions[i];
      if (!prediction) continue;

      const time = new Date(prediction.t);
      const height = parseFloat(prediction.v);

      // Determine if this is a high or low tide
      let type: 'high' | 'low' | null = null;
      
      // Look at neighboring points to determine extremes
      if (i > startIndex && i < endIndex - 6) {
        const prevHeight = parseFloat(predictions[i - 6]?.v || prediction.v);
        const nextHeight = parseFloat(predictions[i + 6]?.v || prediction.v);
        
        if (height > prevHeight && height > nextHeight && height > 1.0) {
          type = 'high';
        } else if (height < prevHeight && height < nextHeight && height < 0.5) {
          type = 'low';
        }
      }

      chartData.push({
        time: time.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        }),
        timeLabel: time.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        height: Math.round(height * 100) / 100,
        type
      });
    }

    // Find current tide height and status
    const currentPrediction = predictions[currentIndex];
    const currentHeight = parseFloat(currentPrediction.v);
    
    // Determine if tide is rising or falling
    const nextPrediction = predictions[currentIndex + 1];
    const nextHeight = nextPrediction ? parseFloat(nextPrediction.v) : currentHeight;
    const tideDirection = nextHeight > currentHeight ? 'Rising' : 'Falling';

    // Extract next few high/low tides for summary
    const nextTides: Array<{
      time: string;
      type: 'high' | 'low';
      height: number;
    }> = [];

    // Find the next 4 tide extremes
    for (let i = currentIndex; i < Math.min(predictions.length - 6, currentIndex + 144) && nextTides.length < 4; i += 6) {
      if (i + 6 >= predictions.length) break;
      
      const prev = parseFloat(predictions[i - 6]?.v || predictions[i].v);
      const curr = parseFloat(predictions[i].v);
      const next = parseFloat(predictions[i + 6]?.v || predictions[i].v);
      
      if (curr > prev && curr > next && curr > 1.0) {
        nextTides.push({
          time: new Date(predictions[i].t).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          type: 'high',
          height: Math.round(curr * 100) / 100
        });
      } else if (curr < prev && curr < next && curr < 0.5) {
        nextTides.push({
          time: new Date(predictions[i].t).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          type: 'low',
          height: Math.round(curr * 100) / 100
        });
      }
    }

    console.log(`🌊 Processed ${chartData.length} tide data points from NOAA`);
    console.log(`🌊 Current tide: ${currentHeight.toFixed(2)}m and ${tideDirection}`);
    console.log(`🌊 Next ${nextTides.length} tide extremes found`);

    return {
      current: tideDirection,
      currentHeight: Math.round(currentHeight * 100) / 100,
      next: nextTides,
      chartData
    };
  }

  private generateSyntheticTideData(): TideData {
    // Keep the existing synthetic method as fallback
    const now = new Date();
    // FIXED: Use realistic California tide heights (0.5-2.5m) to match NOAA data scale
    const currentHeight = 1.5 + Math.sin(Date.now() / 1000000) * 1.0; // 0.5-2.5m range
    
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
    
    // Generate 12 hours of synthetic tide data as fallback
    for (let i = 0; i < 24; i++) {
      const timeOffset = i * 30 * 60 * 1000;
      const futureTime = new Date(now.getTime() + timeOffset);
      
      const tidePhase = (Date.now() + timeOffset) / 1000000;
      // FIXED: Use realistic tide amplitude (1.5m ± 1.0m = 0.5-2.5m range)
      const baseHeight = 1.5 + Math.sin(tidePhase) * 1.0; // Realistic California tides
      const randomVariation = (Math.random() - 0.5) * 0.3; // Smaller variation
      const height = Math.max(0.3, Math.min(2.8, baseHeight + randomVariation)); // Realistic limits
      
      let type: 'high' | 'low' | null = null;
      if (i > 0 && i < 23) {
        const prevHeight = chartData[i - 1]?.height || height;
        const nextPhase = tidePhase + 0.1;
        const nextHeight = 1.5 + Math.sin(nextPhase) * 1.0;
        
        // FIXED: Use realistic thresholds for tide extremes
        if (height > prevHeight && height > nextHeight && height > 2.0) type = 'high'; // 2m+ for high
        if (height < prevHeight && height < nextHeight && height < 1.0) type = 'low';  // 1m- for low
      }
      
      chartData.push({
        time: futureTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        }),
        timeLabel: futureTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        height: parseFloat(height.toFixed(1)),
        type
      });
      
      if (type && nextTides.length < 4) {
        nextTides.push({
          time: futureTime.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          type,
          height: parseFloat(height.toFixed(1))
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

  // SPITCAST API INTEGRATION
  
  // Fetch Spitcast forecast data
  async fetchSpitcastForecast(spotId: string): Promise<SpitcastForecast[] | null> {
    try {
      const spitcastSpot = API_CONFIG.SPITCAST_SPOTS[spotId as keyof typeof API_CONFIG.SPITCAST_SPOTS];
      if (!spitcastSpot) {
        console.warn(`No Spitcast mapping found for spot ${spotId}`);
        return null;
      }

      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();

      const url = `${API_CONFIG.SPITCAST_API_URL}/spot_forecast/${spitcastSpot.spitcastId}/${year}/${month}/${day}`;
      
      console.log(`Fetching Spitcast data from: ${url}`);
      
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'WaveCheck-App/1.0'
        }
      });

      if (response.data && Array.isArray(response.data)) {
        return response.data as SpitcastForecast[];
      }
      
      console.log('Spitcast API returned non-array data:', response.data);
      return null;
    } catch (error) {
      console.error('Error fetching Spitcast data:', error);
      return null;
    }
  }

  // Calculate surf quality score (1-10) based on multiple factors
  calculateSurfQualityScore(
    waveHeight: number,
    wavePeriod: number,
    windSpeed: number,
    windDirection: number,
    waveDirection: number,
    spitcastShape?: string
  ): number {
    let score = 5.0; // Base score

    // Wave height scoring (optimal 3-8ft for most spots)
    if (waveHeight >= 3 && waveHeight <= 8) {
      score += 2.0;
    } else if (waveHeight >= 2 && waveHeight <= 10) {
      score += 1.0;
    } else if (waveHeight >= 1 && waveHeight <= 12) {
      score += 0.5;
    } else {
      score -= 1.0;
    }

    // Wave period scoring (longer period = better quality)
    if (wavePeriod >= 12) {
      score += 2.0;
    } else if (wavePeriod >= 10) {
      score += 1.5;
    } else if (wavePeriod >= 8) {
      score += 1.0;
    } else if (wavePeriod >= 6) {
      score += 0.5;
    } else {
      score -= 1.0;
    }

    // Wind scoring (light offshore is best)
    const windAngleDiff = Math.abs(((windDirection - waveDirection + 180) % 360) - 180);
    
    if (windSpeed <= 5) {
      score += 1.5; // Light wind
    } else if (windSpeed <= 10 && windAngleDiff > 90) {
      score += 1.0; // Light offshore
    } else if (windSpeed <= 15 && windAngleDiff > 90) {
      score += 0.5; // Moderate offshore
    } else if (windSpeed > 20) {
      score -= 2.0; // Strong wind (poor conditions)
    } else if (windAngleDiff < 45) {
      score -= 1.0; // Onshore wind
    }

    // Spitcast shape bonus (if available)
    if (spitcastShape) {
      const shapeScore = this.getSpitcastShapeScore(spitcastShape);
      score += shapeScore;
    }

    // Ensure score is between 1 and 10
    return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
  }

  private getSpitcastShapeScore(shape: string): number {
    const shapeScores: { [key: string]: number } = {
      'poor': -1.5,
      'poor-fair': -0.5,
      'fair': 0.0,
      'fair-good': 0.5,
      'good': 1.0,
      'good-epic': 1.5,
      'epic': 2.0
    };
    
    return shapeScores[shape.toLowerCase()] || 0;
  }

  // Get enhanced surf data with Spitcast and quality scoring
  async getEnhancedSurfData(spotId: string, lat: number, lng: number): Promise<{
    spitcast: SpitcastForecast[] | null;
    qualityScore: number;
    recommendation: string;
    conditions: any;
  }> {
    try {
      // Fetch current weather/marine data
      const weatherData = await this.getWeatherData(lat, lng);
      
      // Fetch Spitcast data
      const spitcastData = await this.fetchSpitcastForecast(spotId);
      
      // Calculate quality score
      const qualityScore = this.calculateSurfQualityScore(
        weatherData.marine.waveHeight,
        weatherData.marine.wavePeriod,
        weatherData.weather.windSpeed,
        weatherData.weather.windDirection,
        weatherData.marine.waveDirection,
        spitcastData?.[0]?.shape
      );

      // Generate recommendation
      const recommendation = this.generateSurfRecommendation(qualityScore, weatherData.marine.waveHeight);

      return {
        spitcast: spitcastData,
        qualityScore,
        recommendation,
        conditions: {
          waveHeight: weatherData.marine.waveHeight,
          wavePeriod: weatherData.marine.wavePeriod,
          windSpeed: weatherData.weather.windSpeed,
          windDirection: weatherData.weather.windDirection,
          temperature: weatherData.weather.temperature
        }
      };
    } catch (error) {
      console.error('Error getting enhanced surf data:', error);
      return {
        spitcast: null,
        qualityScore: 5.0,
        recommendation: 'Check local conditions',
        conditions: {}
      };
    }
  }

  private generateSurfRecommendation(score: number, waveHeight: number): string {
    if (score >= 8.5) {
      return "🔥 Epic conditions! Drop everything and surf!";
    } else if (score >= 7.5) {
      return "🏄‍♂️ Excellent surf! Great session ahead!";
    } else if (score >= 6.5) {
      return "👍 Good conditions for a surf session";
    } else if (score >= 5.5) {
      return "🌊 Fair conditions, worth checking out";
    } else if (score >= 4.0) {
      return "📚 Better for practice or longboarding";
    } else if (waveHeight < 1) {
      return "📖 Flat day - time to read surf magazines";
    } else {
      return "☕ Grab a coffee and wait for better conditions";
    }
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
        // FIXED: Use realistic California tide heights to match NOAA data scale
        height: event.type === 'high' ? 
          1.8 + Math.random() * 0.7 :  // High: 1.8-2.5m (6-8ft)
          0.3 + Math.random() * 0.9    // Low: 0.3-1.2m (1-4ft) 
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

  // FAVORITES MANAGEMENT
  
  private getFavoritesKey(): string {
    return 'wavecheck_favorite_spots';
  }

  // Get user's favorite spots from localStorage
  getFavoriteSpots(): string[] {
    try {
      const favorites = localStorage.getItem(this.getFavoritesKey());
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error reading favorites from localStorage:', error);
      return [];
    }
  }

  // Add a spot to favorites
  addToFavorites(spotId: string): boolean {
    try {
      const favorites = this.getFavoriteSpots();
      if (!favorites.includes(spotId)) {
        favorites.push(spotId);
        localStorage.setItem(this.getFavoritesKey(), JSON.stringify(favorites));
        return true;
      }
      return false; // Already in favorites
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  }

  // Remove a spot from favorites
  removeFromFavorites(spotId: string): boolean {
    try {
      const favorites = this.getFavoriteSpots();
      const index = favorites.indexOf(spotId);
      if (index > -1) {
        favorites.splice(index, 1);
        localStorage.setItem(this.getFavoritesKey(), JSON.stringify(favorites));
        return true;
      }
      return false; // Not in favorites
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  }

  // Check if a spot is in favorites
  isFavorite(spotId: string): boolean {
    return this.getFavoriteSpots().includes(spotId);
  }

  // Toggle favorite status
  toggleFavorite(spotId: string): boolean {
    if (this.isFavorite(spotId)) {
      return this.removeFromFavorites(spotId);
    } else {
      return this.addToFavorites(spotId);
    }
  }

  // Clear all favorites
  clearFavorites(): void {
    try {
      localStorage.removeItem(this.getFavoritesKey());
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  }

  // Get favorites with enhanced data
  async getFavoritesWithData(): Promise<Array<{
    spotId: string;
    qualityScore: number;
    recommendation: string;
    conditions: any;
    spitcast: SpitcastForecast[] | null;
  }>> {
    const favoriteSpots = this.getFavoriteSpots();
    const favoritesData: Array<{
      spotId: string;
      qualityScore: number;
      recommendation: string;
      conditions: any;
      spitcast: SpitcastForecast[] | null;
    }> = [];

    for (const spotId of favoriteSpots) {
      try {
        // Get coordinates for the spot (you'd need to map these)
        const spotCoords = this.getSpotCoordinates(spotId);
        if (spotCoords) {
          const enhancedData = await this.getEnhancedSurfData(spotId, spotCoords.lat, spotCoords.lng);
          favoritesData.push({
            spotId,
            qualityScore: enhancedData.qualityScore,
            recommendation: enhancedData.recommendation,
            conditions: enhancedData.conditions,
            spitcast: enhancedData.spitcast
          });
        }
      } catch (error) {
        console.error(`Error getting data for favorite spot ${spotId}:`, error);
      }
    }

    return favoritesData;
  }

  private getSpotCoordinates(spotId: string): { lat: number; lng: number } | null {
    // Map spot IDs to coordinates (this would ideally come from the spots data)
    const spotCoordinates: { [key: string]: { lat: number; lng: number } } = {
      'mavericks': { lat: 37.495, lng: -122.495 },
      'steamer_lane': { lat: 36.9517, lng: -122.0267 },
      'rincon': { lat: 34.3717, lng: -119.475 },
      'malibu': { lat: 34.0375, lng: -118.6775 }
    };

    return spotCoordinates[spotId] || null;
  }
}

export default WeatherService.getInstance(); 