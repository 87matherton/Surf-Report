'use client';

import { useState, useEffect } from 'react';
import { getTimeBasedSurfBackground, getSurfBackgroundByCategory, createFallbackGradient, type SurfBackgroundImage } from '../services/backgroundService';

interface SurfBackgroundProps {
  children: React.ReactNode;
  className?: string;
  imageUrl?: string; // Optional: direct image URL (takes priority over category)
  category?: SurfBackgroundImage['category']; // Optional: force a specific category
  videoUrl?: string; // Optional: use a video background instead
  videoPoster?: string; // Optional: poster image for video
}

const SurfBackground: React.FC<SurfBackgroundProps> = ({ 
  children, 
  className = '', 
  imageUrl,
  category, 
  videoUrl,
  videoPoster 
}) => {
  const [currentImage, setCurrentImage] = useState<SurfBackgroundImage | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      // Use direct image URL (highest priority)
      const directImage: SurfBackgroundImage = {
        id: 'custom',
        url: imageUrl,
        category: 'wave',
        description: 'Custom background image',
        fallbackColor: '#0ea5e9'
      };
      setCurrentImage(directImage);
      
      if (!videoUrl) {
        setImageLoaded(false);
        const img = new Image();
        img.onload = () => setImageLoaded(true);
        img.onerror = () => {
          console.warn('Failed to load direct image, using fallback');
          setImageLoaded(false);
        };
        img.src = imageUrl;
      }
    } else {
      // Fallback to category system
      const selectedImage = category 
        ? getSurfBackgroundByCategory(category)
        : getTimeBasedSurfBackground();
      
      setCurrentImage(selectedImage);

      if (!videoUrl) {
        setImageLoaded(false);
        const img = new Image();
        img.onload = () => setImageLoaded(true);
        img.onerror = () => {
          console.warn('Failed to load background image, using fallback');
          setImageLoaded(false);
        };
        img.src = selectedImage.url;
      }
    }
  }, [imageUrl, category, videoUrl]);

  const handleVideoLoad = () => {
    console.log('Video loaded successfully');
    setVideoLoaded(true);
  };

  const handleVideoError = (e: any) => {
    console.error('Failed to load background video:', e);
    setVideoLoaded(false);
  };

  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${className}`} style={{ minHeight: '100vh', width: '100vw' }}>
      {/* Video Background */}
      {videoUrl && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={videoPoster}
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          onCanPlay={handleVideoLoad}
          className={`absolute transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            filter: 'brightness(0.8)',
            top: '50%',
            left: '50%',
            minWidth: '100vw',
            minHeight: '100vh',
            width: '100vw',
            height: '100vh',
            transform: 'translate(-50%, -50%) scale(1.2)',
            objectFit: 'cover',
            zIndex: -1,
          }}
        >
          <source src={videoUrl} type="video/mp4" />
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

      {/* Fallback gradient - only show when video/image not loaded */}
      {!(videoUrl && videoLoaded) && !(currentImage && imageLoaded) && (
        <div 
          className="absolute inset-0"
          style={{
            background: currentImage 
              ? createFallbackGradient(currentImage)
              : `linear-gradient(135deg, #0ea5e9 0%, #0284c7 25%, #0369a1 50%, #075985 75%, #0c4a6e 100%)`,
          }}
        />
      )}
      
      {/* Glass effects - much lighter when video is playing */}
      <div className={`absolute inset-0 ${videoUrl && videoLoaded ? 'bg-blue-900/5' : 'bg-blue-900/30'}`} />
      {!(videoUrl && videoLoaded) && (
        <>
          <div className="absolute inset-0 bg-white/15" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-white/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && videoUrl && (
        <div className="fixed top-4 right-4 bg-black/50 text-white p-2 rounded text-xs z-50">
          Video: {videoLoaded ? '✅ Loaded' : '❌ Loading...'}
        </div>
      )}
    </div>
  );
};

export default SurfBackground; 