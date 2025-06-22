// WaveCheck Service Worker
// Version 1.0

const CACHE_NAME = 'wavecheck-v1';
const STATIC_CACHE_NAME = 'wavecheck-static-v1';
const API_CACHE_NAME = 'wavecheck-api-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add other static assets as needed
];

// API endpoints to cache (with short expiration)
const API_ENDPOINTS = [
  'api.open-meteo.com',
  'marine-api.open-meteo.com',
  'api.tidesandcurrents.noaa.gov',
  'api.spitcast.com'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static files...');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        // Skip waiting to activate immediately
        self.skipWaiting();
      })
      .catch((error) => {
        console.error('Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== API_CACHE_NAME &&
                cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests with network-first strategy
  if (isApiRequest(url)) {
    event.respondWith(handleApiRequest(request));
  }
  // Handle static files with cache-first strategy
  else if (isStaticFile(url)) {
    event.respondWith(handleStaticRequest(request));
  }
  // Handle navigation requests
  else if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
  }
  // Default: network-first for everything else
  else {
    event.respondWith(handleDefaultRequest(request));
  }
});

// Check if request is to an API endpoint
function isApiRequest(url) {
  return API_ENDPOINTS.some(endpoint => url.hostname.includes(endpoint));
}

// Check if request is for a static file
function isStaticFile(url) {
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/);
}

// Handle API requests with network-first, cache as fallback
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses for 10 minutes
      const responseClone = networkResponse.clone();
      const cacheRequest = new Request(request.url);
      
      // Add timestamp for expiration checking
      const cacheResponse = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: {
          ...responseClone.headers,
          'sw-cache-timestamp': Date.now().toString(),
          'sw-cache-duration': (10 * 60 * 1000).toString() // 10 minutes
        }
      });
      
      cache.put(cacheRequest, cacheResponse);
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Network failed, trying cache for:', request.url);
    
    // Try cache as fallback
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      // Check if cache is still valid (within 10 minutes)
      const cacheTimestamp = cachedResponse.headers.get('sw-cache-timestamp');
      const cacheDuration = cachedResponse.headers.get('sw-cache-duration');
      
      if (cacheTimestamp && cacheDuration) {
        const age = Date.now() - parseInt(cacheTimestamp);
        if (age < parseInt(cacheDuration)) {
          return cachedResponse;
        }
      }
    }
    
    // Return offline fallback for API requests
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'No network connection and no cached data available',
      timestamp: Date.now()
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle static files with cache-first strategy
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If not in cache, fetch from network and cache
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Failed to fetch static resource:', request.url);
    throw error;
  }
}

// Handle navigation requests (app shell)
async function handleNavigationRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // Return cached index.html as fallback
    const cachedResponse = await cache.match('/');
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Ultimate fallback
    return new Response('Offline - WaveCheck is not available', {
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Default request handler
async function handleDefaultRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.log('Network request failed:', request.url);
    throw error;
  }
}

// Background sync for favorites and offline data
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-favorites') {
    event.waitUntil(syncFavorites());
  }
  
  if (event.tag === 'background-sync-weather') {
    event.waitUntil(syncWeatherData());
  }
});

// Sync favorites data when online
async function syncFavorites() {
  console.log('Syncing favorites data...');
  // Implementation would sync any pending favorites changes
}

// Sync weather data when online
async function syncWeatherData() {
  console.log('Syncing weather data...');
  // Implementation would refresh critical weather data
}

// Handle push notifications (future feature)
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: 'Check out the latest surf conditions!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Conditions',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-96x96.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('WaveCheck Update', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('WaveCheck Service Worker loaded successfully'); 