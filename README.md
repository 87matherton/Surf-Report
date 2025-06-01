# 🌊 WaveCheck - Surf Report Application

A modern, interactive surf report application built with Next.js, React, and Leaflet maps.

## 🏄‍♂️ Features

- **Interactive Map**: Full-screen Leaflet map with clickable surf spot markers
- **4 Surf Spots**: Mavericks, Steamer Lane, Rincon, and Malibu
- **Search Functionality**: Autocomplete search to quickly find spots
- **Detailed Information**: Current conditions, forecasts, and best surfing conditions
- **Modern UI**: Material-UI components with responsive design
- **Modal Details**: Comprehensive spot information in beautiful modal dialogs

## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:3000` (or next available port).

## 📦 Stable Build - v1.0

This repository contains a stable, working version of WaveCheck that you can always roll back to.

### Features of v1.0-stable:
✅ All Leaflet initialization issues resolved  
✅ Hydration errors fixed  
✅ React Strict Mode optimized for development  
✅ Material-UI properly integrated  
✅ 4 complete surf spots with data  
✅ Search and modal functionality working  

## 🔄 How to Rollback to Stable Version

If you need to rollback to this stable version in the future:

```bash
# Rollback to the exact stable commit
git checkout v1.0-stable

# Or create a new branch from the stable version
git checkout -b rollback-stable v1.0-stable

# Or reset your main branch to stable (destructive)
git reset --hard v1.0-stable
```

## 🛠️ Technical Stack

- **Next.js 15** with TypeScript
- **React 18** with hooks
- **Material-UI** for components and theming
- **React Leaflet** for interactive maps
- **Leaflet** for mapping functionality

## 🔧 Configuration

- **React Strict Mode**: Disabled in development to prevent Leaflet double-initialization
- **Dynamic Imports**: Map component dynamically imported to avoid SSR issues
- **Custom Markers**: Leaflet marker icons properly configured for Next.js

## 📱 Deployment Ready

This build is ready for production deployment with proper:
- SSR/CSR handling
- Environment configuration
- Build optimization
- Error handling

---

**Created**: December 2024  
**Version**: 1.0-stable  
**Status**: ✅ Production Ready 