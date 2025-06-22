// Surf Background Service - Manages beautiful surf photography backgrounds

export interface SurfBackgroundImage {
  id: string;
  url: string;
  description: string;
  category: 'wave' | 'sunset' | 'tropical' | 'aerial' | 'underwater';
  photographer?: string;
  fallbackColor: string;
}

// Curated high-quality surf images from Unsplash
export const surfBackgrounds: SurfBackgroundImage[] = [
  // Perfect Waves
  {
    id: 'perfect-wave-1',
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=1080&fit=crop&q=80',
    description: 'Perfect barrel wave',
    category: 'wave',
    photographer: 'Unsplash',
    fallbackColor: '#0284c7'
  },
  {
    id: 'ocean-waves-1',
    url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&h=1080&fit=crop&q=80',
    description: 'Deep blue ocean waves',
    category: 'wave',
    photographer: 'Unsplash',
    fallbackColor: '#0369a1'
  },
  
  // Sunset/Tropical
  {
    id: 'sunset-surf-1',
    url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&h=1080&fit=crop&q=80',
    description: 'Golden hour surf session',
    category: 'sunset',
    photographer: 'Unsplash',
    fallbackColor: '#ea580c'
  },
  {
    id: 'tropical-waves-1',
    url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1920&h=1080&fit=crop&q=80',
    description: 'Crystal clear tropical waves',
    category: 'tropical',
    photographer: 'Unsplash',
    fallbackColor: '#0891b2'
  },
  
  // Aerial Views
  {
    id: 'aerial-waves-1',
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1920&h=1080&fit=crop&q=80',
    description: 'Aerial view of breaking waves',
    category: 'aerial',
    photographer: 'Unsplash',
    fallbackColor: '#0284c7'
  },
  {
    id: 'deep-blue-1',
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop&q=80',
    description: 'Deep blue ocean from above',
    category: 'aerial',
    photographer: 'Unsplash',
    fallbackColor: '#1e40af'
  },
  
  // Underwater/Unique
  {
    id: 'underwater-1',
    url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1920&h=1080&fit=crop&q=80',
    description: 'Underwater wave view',
    category: 'underwater',
    photographer: 'Unsplash',
    fallbackColor: '#0c4a6e'
  }
];

// Get random background from all categories
export const getRandomSurfBackground = (): SurfBackgroundImage => {
  return surfBackgrounds[Math.floor(Math.random() * surfBackgrounds.length)];
};

// Get background by category
export const getSurfBackgroundByCategory = (category: SurfBackgroundImage['category']): SurfBackgroundImage => {
  const categoryImages = surfBackgrounds.filter(img => img.category === category);
  return categoryImages[Math.floor(Math.random() * categoryImages.length)] || surfBackgrounds[0];
};

// Get background based on time of day
export const getTimeBasedSurfBackground = (): SurfBackgroundImage => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour <= 9) {
    // Morning - fresh waves
    return getSurfBackgroundByCategory('wave');
  } else if (hour >= 17 && hour <= 20) {
    // Evening - sunset vibes
    return getSurfBackgroundByCategory('sunset');
  } else if (hour >= 10 && hour <= 16) {
    // Midday - tropical/aerial
    const categories: SurfBackgroundImage['category'][] = ['tropical', 'aerial'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    return getSurfBackgroundByCategory(randomCategory);
  } else {
    // Night/early morning - deep/underwater
    return getSurfBackgroundByCategory('underwater');
  }
};

// Create fallback gradient based on image
export const createFallbackGradient = (image: SurfBackgroundImage): string => {
  const baseColor = image.fallbackColor;
  
  switch (image.category) {
    case 'sunset':
      return `linear-gradient(135deg, ${baseColor} 0%, #f59e0b 25%, #dc2626 50%, #7c2d12 75%, #431407 100%)`;
    case 'tropical':
      return `linear-gradient(135deg, #06b6d4 0%, ${baseColor} 25%, #0891b2 50%, #0e7490 75%, #164e63 100%)`;
    case 'underwater':
      return `linear-gradient(135deg, ${baseColor} 0%, #1e3a8a 25%, #1e40af 50%, #1d4ed8 75%, #2563eb 100%)`;
    case 'aerial':
      return `linear-gradient(135deg, #0ea5e9 0%, ${baseColor} 25%, #0284c7 50%, #0369a1 75%, #075985 100%)`;
    default: // wave
      return `linear-gradient(135deg, #0ea5e9 0%, ${baseColor} 25%, #0369a1 50%, #075985 75%, #0c4a6e 100%)`;
  }
}; 