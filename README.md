# 🌊 Surf Report App - Modern Glassmorphism UI

A beautiful, modern surf forecast application built with Next.js, TypeScript, and Tailwind CSS featuring a stunning glassmorphism design.

## ✨ Features

### 🎨 Modern Glassmorphism Design
- **Beautiful Ocean Wave Background** with gradient effects and wave patterns
- **Frosted Glass UI** with backdrop blur and transparency layers
- **Mobile-first responsive design** optimized for all devices
- **Smooth animations** and interactive elements

### 🔍 Advanced Search System
- **Real-time search** with debounced input
- **Popular spots suggestions** for quick access
- **Comprehensive spot information** in search results
- **Modal-based interface** for seamless user experience

### 🌊 Live Data Integration
- **Real-time surf conditions** from Open-Meteo Marine API
- **Live weather data** including wind, temperature, and precipitation
- **7-day surf forecasts** with quality ratings
- **Smart caching** (10-minute cache duration)
- **Automatic quality calculation** based on wave height, wind, and swell period
- **Fallback data** when APIs are unavailable

### 📱 Pages & Navigation
- **Homepage**: Featured spot with live conditions and popular spots overview
- **Forecast**: 7-day detailed forecasts for any surf spot with quality ratings
- **Favorites**: Personalized list with live data updates
- **Profile**: User preferences and surf statistics
- **Map**: Interactive surf spot locations

### 🏄‍♂️ Surf Spots Database

9 world-class surf spots included:
- **Mavericks** (Half Moon Bay, CA) - Big wave expert break
- **Pipeline (Banzai)** (Oahu, HI) - Legendary reef break
- **Malibu (First Point)** (California) - Classic longboard point break
- **Steamer Lane** (Santa Cruz, CA) - Consistent point break
- **Trestles (Lower)** (San Clemente, CA) - High-performance waves
- **Manhattan Beach** (California) - Beach break
- **Ocean Beach** (San Francisco, CA) - Powerful beach break
- **Huntington Beach** (California) - Classic beach break
- **Blacks Beach** (La Jolla, CA) - Advanced beach break

Each spot includes:
- GPS coordinates for live data fetching
- Detailed break information (type, bottom, hazards)
- Optimal conditions (swell size, direction, wind, tide)
- Difficulty ratings and crowd factors
- Current conditions and forecasts

## 🛠 Technical Stack

- **Next.js 15** with App Router and Turbopack
- **TypeScript** for type safety
- **Tailwind CSS** for styling with custom glassmorphism effects
- **Open-Meteo APIs** for live weather/marine data
- **LocalStorage** for favorites persistence
- **Custom hooks** for data management

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

## 🎯 Recent Updates

### v2.0 - Glassmorphism Redesign
- ✅ Complete UI redesign with glassmorphism effects
- ✅ Ocean wave gradient background with pattern overlays
- ✅ Advanced search modal with popular spots
- ✅ Enhanced forecast page with quality ratings
- ✅ Live data integration with loading states
- ✅ Mobile-optimized bottom navigation
- ✅ Improved error handling and user feedback

---

Built with ❤️ for the surfing community
