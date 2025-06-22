'use client';

import { useState, useEffect } from 'react';

export interface User {
  email: string;
  name: string;
  signedInAt: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is signed in on mount
    const storedUser = localStorage.getItem('surfApp_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('surfApp_user');
      }
    }
    setIsLoading(false);
  }, []);

  const signOut = () => {
    localStorage.removeItem('surfApp_user');
    setUser(null);
  };

  const isSignedIn = !!user;

  return {
    user,
    isSignedIn,
    isLoading,
    signOut
  };
} 