'use client';

import { useState, useEffect, useCallback } from 'react';
import { SurfSpot } from '../data/spots';
import { weatherService, LiveSurfConditions } from '../services/weatherService';

export interface LiveDataState {
  isLoading: boolean;
  lastUpdated: Date | null;
  error: string | null;
}

export function useLiveData() {
  const [liveDataState, setLiveDataState] = useState<LiveDataState>({
    isLoading: false,
    lastUpdated: null,
    error: null
  });

  const [updatedSpots, setUpdatedSpots] = useState<Map<string, SurfSpot>>(new Map());

  // Update a single spot with live data
  const updateSpot = useCallback(async (spot: SurfSpot): Promise<SurfSpot> => {
    try {
      const updatedSpot = await weatherService.updateSpotWithLiveData(spot);
      setUpdatedSpots(prev => new Map(prev).set(spot.id, updatedSpot));
      return updatedSpot;
    } catch (error) {
      console.error(`Failed to update spot ${spot.name}:`, error);
      return spot;
    }
  }, []);

  // Update multiple spots with live data
  const updateSpots = useCallback(async (spots: SurfSpot[]): Promise<SurfSpot[]> => {
    setLiveDataState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Update spots in batches to avoid overwhelming the API
      const batchSize = 3;
      const updatedSpotsArray: SurfSpot[] = [];

      for (let i = 0; i < spots.length; i += batchSize) {
        const batch = spots.slice(i, i + batchSize);
        const batchPromises = batch.map(spot => weatherService.updateSpotWithLiveData(spot));
        
        const batchResults = await Promise.allSettled(batchPromises);
        
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            const updatedSpot = result.value;
            updatedSpotsArray.push(updatedSpot);
            setUpdatedSpots(prev => new Map(prev).set(updatedSpot.id, updatedSpot));
          } else {
            console.error(`Failed to update spot ${batch[index].name}:`, result.reason);
            updatedSpotsArray.push(batch[index]); // Keep original spot
          }
        });

        // Small delay between batches to be nice to the API
        if (i + batchSize < spots.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      setLiveDataState({
        isLoading: false,
        lastUpdated: new Date(),
        error: null
      });

      return updatedSpotsArray;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update surf data';
      setLiveDataState({
        isLoading: false,
        lastUpdated: null,
        error: errorMessage
      });
      return spots; // Return original spots on error
    }
  }, []);

  // Get live conditions for a specific location
  const getLiveConditions = useCallback(async (lat: number, lng: number): Promise<LiveSurfConditions | null> => {
    try {
      return await weatherService.fetchLiveConditions(lat, lng);
    } catch (error) {
      console.error('Failed to fetch live conditions:', error);
      return null;
    }
  }, []);

  // Get updated spot from cache or original
  const getSpot = useCallback((originalSpot: SurfSpot): SurfSpot => {
    return updatedSpots.get(originalSpot.id) || originalSpot;
  }, [updatedSpots]);

  // Check if a spot has been updated with live data
  const isSpotUpdated = useCallback((spotId: string): boolean => {
    return updatedSpots.has(spotId);
  }, [updatedSpots]);

  // Refresh all cached data
  const refreshAll = useCallback(() => {
    setUpdatedSpots(new Map());
    setLiveDataState({
      isLoading: false,
      lastUpdated: null,
      error: null
    });
  }, []);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (updatedSpots.size > 0) {
        console.log('Auto-refreshing live data cache...');
        refreshAll();
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [updatedSpots.size, refreshAll]);

  return {
    liveDataState,
    updateSpot,
    updateSpots,
    getLiveConditions,
    getSpot,
    isSpotUpdated,
    refreshAll,
    hasUpdatedSpots: updatedSpots.size > 0
  };
}

// Utility hook for formatting live data
export function useLiveDataFormatters() {
  const formatLastUpdated = useCallback((date: Date | null): string => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }, []);

  const getConditionsBadgeColor = useCallback((rating: SurfSpot['conditionsRating']): string => {
    switch (rating) {
      case 'Excellent': return 'bg-green-500';
      case 'Good': return 'bg-blue-500';
      case 'Fair': return 'bg-yellow-500';
      case 'Poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }, []);

  const getConditionsEmoji = useCallback((rating: SurfSpot['conditionsRating']): string => {
    switch (rating) {
      case 'Excellent': return '🔥';
      case 'Good': return '👍';
      case 'Fair': return '👌';
      case 'Poor': return '😐';
      default: return '❓';
    }
  }, []);

  return {
    formatLastUpdated,
    getConditionsBadgeColor,
    getConditionsEmoji
  };
} 