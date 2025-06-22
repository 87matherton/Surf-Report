# Video Backgrounds for Surf App

## Overview
The surf app now supports beautiful video backgrounds for an immersive user experience, especially on authentication pages.

## Implementation
The `SurfBackground` component has been enhanced to support both image and video backgrounds:

```tsx
<SurfBackground 
  videoUrl="path/to/video.mp4"
  videoPoster="path/to/poster-image.jpg"
>
  {/* Your content */}
</SurfBackground>
```

## Features
- **Auto-play**: Videos start automatically (muted for browser compatibility)
- **Looping**: Seamless infinite loop
- **Responsive**: Covers full screen on all devices
- **Optimized**: Uses `preload="metadata"` for faster loading
- **Fallback**: Graceful degradation to image backgrounds
- **Accessibility**: Poster image shown while loading

## Video Requirements
- **Format**: MP4 (best browser support)
- **Resolution**: 1920x1080 recommended
- **Frame Rate**: 30fps
- **Duration**: 10-30 seconds (for looping)
- **Size**: Keep under 5MB for web performance

## Recommended Video Sources
1. **Mixkit** (Free): https://mixkit.co/free-stock-video/ocean/
2. **Pexels** (Free): https://www.pexels.com/videos/search/ocean%20waves/
3. **Unsplash** (Free): https://unsplash.com/backgrounds/nature/ocean

## Current Usage
- **Sign In Page**: Ocean waves video background
- **Sign Up Page**: Still using image background (can be upgraded)

## Performance Considerations
- Videos are brightness-filtered (70%) for better text readability
- Poster images provide instant visual feedback
- Graceful fallback to gradient backgrounds
- Mobile-optimized with `playsInline` attribute

## Browser Support
- Chrome: Full support
- Firefox: Full support  
- Safari: Full support
- Edge: Full support
- Mobile browsers: Supported with `playsInline` 