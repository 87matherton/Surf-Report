'use client';

import { useState, useEffect } from 'react';
import { getTimeBasedSurfBackground, getSurfBackgroundByCategory, createFallbackGradient, type SurfBackgroundImage } from '../services/backgroundService';

interface SurfBackgroundProps {
  children: React.ReactNode;
  className?: string;
  category?: SurfBackgroundImage['category']; // Optional: force a specific category
  videoUrl?: string; // Optional: use a video background instead
  videoPoster?: string; // Optional: poster image for video
}

const SurfBackground: React.FC<SurfBackgroundProps> = ({ 
  children, 
  className = '', 
  category, 
  videoUrl,
  videoPoster 
}) => {
  const [currentImage, setCurrentImage] = useState<SurfBackgroundImage | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (!videoUrl) {
      // Get background image based on category or time of day
      const selectedImage = category 
        ? getSurfBackgroundByCategory(category)
        : getTimeBasedSurfBackground();
      
      setCurrentImage(selectedImage);
      setImageLoaded(false);
      
      // Preload the image
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => {
        console.warn('Failed to load background image, using fallback');
        setImageLoaded(false);
      };
      img.src = selectedImage.url;
    }
  }, [category, videoUrl]);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  const handleVideoError = () => {
    console.warn('Failed to load background video, using fallback');
    setVideoLoaded(false);
  };

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Video Background */}
      {videoUrl && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={videoPoster}
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          onCanPlay={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            filter: 'brightness(0.7)', // Slightly darken video for better text readability
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          {/* Fallback message */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-blue-800 flex items-center justify-center">
            <p className="text-white/70 text-center">
              Your browser does not support video backgrounds.<br />
              Loading image fallback...
            </p>
          </div>
        </video>
      )}

      {/* Image Background (when not using video) */}
      {!videoUrl && currentImage && (
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${currentImage.url})`,
          }}
        />
      )}

      {/* Fallback Ocean Wave Gradient Background (shows while loading) */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          (videoUrl ? videoLoaded : imageLoaded) ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background: currentImage 
            ? createFallbackGradient(currentImage)
            : `linear-gradient(135deg, #0ea5e9 0%, #0284c7 25%, #0369a1 50%, #075985 75%, #0c4a6e 100%)`,
        }}
      />
      
      {/* Color Overlay for better text readability */}
      <div className="absolute inset-0 bg-blue-900/30" />
      
      {/* Frosted Glass Overlay Effect */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/15" />
      
      {/* Additional glass texture with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-white/15" />
      
      {/* Soft edge vignette for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default SurfBackground; 