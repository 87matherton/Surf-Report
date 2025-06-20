# Surf Report App

A modern, responsive surf forecast application built with Next.js, TypeScript, and Tailwind CSS.

## 🌊 Features

### Live Data Integration
- **Real-time surf conditions** from Open-Meteo Marine API
- **Live weather data** including wind, temperature, and precipitation
- **7-day surf forecasts** with quality ratings
- **Smart caching** (10-minute cache duration)
- **Automatic quality calculation** based on wave height, wind, and swell period
- **Fallback data** when APIs are unavailable

### Pages & Navigation
- **Homepage**: Featured spot with live conditions and popular spots overview
- **Forecast**: 7-day detailed forecasts for any surf spot
- **Favorites**: Personalized list with live data updates
- **Profile**: User preferences and surf statistics
- **Map**: Interactive surf spot locations (coming soon)

### User Experience
- **Mobile-first responsive design**
- **Real-time loading indicators**
- **Manual refresh functionality**
- **Search and filtering**
- **LocalStorage persistence**
- **Error handling with graceful fallbacks**

## 🚀 Live Data Features

### Weather Service
- Fetches marine conditions (wave height, period, direction)
- Gets weather data (wind speed/direction, temperature)
- Calculates surf quality ratings (Poor/Fair/Good/Excellent)
- Handles API rate limiting with intelligent batching
- Provides realistic fallback data based on location

### Smart Caching
- 10-minute cache duration for optimal performance
- Automatic cache invalidation
- Background refresh every 10 minutes
- Reduces API calls while keeping data fresh

### Quality Scoring Algorithm
```
Wave Height (30%): Optimal range based on spot characteristics
Wind Speed (25%): Lower is better (offshore preferred)
Swell Period (25%): Longer periods score higher
Direction (20%): Matches spot's optimal swell/wind directions
```

### Real-time Updates
- Live status indicators (green dot = fresh data)
- Loading animations during updates
- Last updated timestamps
- Error states with retry functionality

## 🏄‍♂️ Surf Spots Database

10 world-class surf spots included:
- **Mavericks** (Half Moon Bay, CA) - Big wave expert break
- **Pipeline** (Oahu, HI) - Legendary reef break
- **Malibu** (California) - Classic longboard point break
- **Steamer Lane** (Santa Cruz, CA) - Consistent point break
- And 6 more premium locations...

Each spot includes:
- GPS coordinates for live data fetching
- Detailed break information (type, bottom, hazards)
- Optimal conditions (swell size, direction, wind, tide)
- Difficulty ratings and crowd factors
- Photo galleries and local knowledge

## 🛠 Technical Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Open-Meteo APIs** for live weather/marine data
- **LocalStorage** for favorites persistence
- **Custom hooks** for data management

## 📱 Mobile Optimization

- Touch-friendly interface
- Responsive breakpoints
- Optimized for iOS/Android browsers
- Fast loading with efficient caching
- Offline-ready fallback data

## 🔄 Data Flow

1. **Initial Load**: Fetch live data for popular spots
2. **User Interaction**: Select spots, add favorites
3. **Background Sync**: Auto-refresh every 10 minutes
4. **Manual Refresh**: User-triggered updates
5. **Caching**: Store results for 10 minutes
6. **Fallback**: Use static data if APIs fail

## 🎯 Future Enhancements

- Interactive Mapbox integration
- Push notifications for optimal conditions
- Tide charts and graphs
- Wave height predictions
- Social features and spot reviews
- PWA installation support

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🌐 API Integration

The app integrates with:
- **Open-Meteo Marine API** - Wave and ocean data
- **Open-Meteo Weather API** - Wind and temperature data

No API keys required - uses free tier with intelligent caching and rate limiting.

---

Built with ❤️ for the surfing community
