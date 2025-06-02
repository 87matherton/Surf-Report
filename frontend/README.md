# 🌊 WaveCheck - Interactive Surf Report Application

A modern, real-time surf conditions application built with Next.js, React, and Material-UI.

## ✨ Features

### 🏄‍♂️ Interactive Surf Spots Map
- **Custom surf-themed icons** with difficulty and condition indicators
- **Interactive popups** with live weather data for each spot
- **Search functionality** with autocomplete
- **4 Featured Surf Spots**:
  - 🟣 **Mavericks** (Expert) - Big wave surfing
  - 🔴 **Steamer Lane** (Advanced) - Classic California break
  - 🟠 **Rincon** (Intermediate) - Perfect point break
  - 🟢 **Malibu** (Beginner) - Gentle learning waves

### 🌤️ Real-Time Weather Integration
- **Live weather data** from Open-Meteo API (no API key required)
- **Marine conditions** including wave height, period, and direction
- **Current atmospheric conditions**: temperature, humidity, wind, pressure
- **Auto-refresh** every 10 minutes
- **Smart caching** to optimize API calls
- **Offline fallback** with realistic default data

### 📊 Interactive Tide Charts
- **12-hour tide visualization** using Recharts
- **Real-time tide levels** with current position indicator
- **High/Low tide markers** with precise timing
- **Smooth area chart** with gradient styling
- **Interactive tooltips** showing exact times and heights
- **Responsive design** that works on all devices

### 🎨 Beautiful UI/UX
- **Ocean-themed gradient header** with emoji branding
- **Material-UI design system** for consistency
- **Responsive layout** optimized for desktop and mobile
- **Professional color scheme** with surf-appropriate theming
- **Smooth animations** and hover effects
- **Accessibility features** following WCAG guidelines

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/87matherton/Surf-Report.git
   cd Surf-Report/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Technology Stack

### Frontend Framework
- **Next.js 15** - React framework with SSR/SSG
- **React 18** - UI component library
- **TypeScript** - Type-safe JavaScript

### UI & Styling
- **Material-UI (MUI) v5** - React component library
- **Emotion** - CSS-in-JS styling
- **React Leaflet** - Interactive maps
- **Recharts** - Data visualization

### Data & APIs
- **Open-Meteo API** - Free weather and marine data
- **Custom weather service** - Data aggregation and caching
- **Axios** - HTTP client for API requests

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Map.tsx         # Interactive map with surf spots
│   │   ├── WeatherDisplay.tsx    # Comprehensive weather info
│   │   ├── WeatherIndicator.tsx  # Compact weather widget
│   │   ├── TideChart.tsx         # 12-hour tide visualization
│   │   ├── SpotDetailsModal.tsx  # Detailed spot information
│   │   └── MapLegend.tsx         # Icon legend explanation
│   ├── hooks/              # Custom React hooks
│   │   └── useWeatherData.ts     # Weather data management
│   ├── services/           # External service integrations
│   │   └── weatherService.ts     # Weather API integration
│   ├── config/             # Configuration files
│   │   └── api.ts               # API endpoints and settings
│   └── data/               # Static data
│       └── spots.ts             # Surf spot information
├── app/                    # Next.js app directory
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🌊 Surf Spot Details

### Mavericks (Expert) 🟣
- **Location**: Half Moon Bay, CA
- **Difficulty**: Expert only
- **Best Conditions**: 15-25ft+ NW swells, light winds
- **Known For**: Massive waves, world-class big wave surfing

### Steamer Lane (Advanced) 🔴
- **Location**: Santa Cruz, CA
- **Difficulty**: Advanced
- **Best Conditions**: 6-12ft NW swells, offshore winds
- **Known For**: Consistent waves, surf competitions

### Rincon (Intermediate) 🟠
- **Location**: Carpinteria, CA
- **Difficulty**: Intermediate
- **Best Conditions**: 4-8ft S/SW swells, light winds
- **Known For**: Perfect right-hand point break

### Malibu (Beginner) 🟢
- **Location**: Malibu, CA
- **Difficulty**: Beginner-friendly
- **Best Conditions**: 2-6ft S swells, any winds
- **Known For**: Gentle waves, surf lessons, longboarding

## 🔧 API Integration

### Weather Data Sources
- **Open-Meteo Forecast API**: Current weather conditions
- **Open-Meteo Marine API**: Wave and marine data
- **Automatic fallback**: Realistic mock data when APIs are unavailable

### Data Refresh Strategy
- **Auto-refresh**: Every 10 minutes
- **Manual refresh**: Click refresh button in any weather component
- **Smart caching**: Prevents excessive API calls
- **Background updates**: Data updates without interrupting user experience

## 🚢 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
Create a `.env.local` file (optional):
```
NEXT_PUBLIC_WEATHER_API_URL=https://api.open-meteo.com/v1/forecast
NEXT_PUBLIC_MARINE_API_URL=https://marine-api.open-meteo.com/v1/marine
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Open-Meteo** for providing free weather and marine APIs
- **OpenStreetMap** contributors for map tiles
- **Material-UI** team for the excellent component library
- **React Leaflet** for map integration
- **Recharts** for beautiful data visualization

---

**Built with ❤️ for the surfing community** 🏄‍♂️🌊 