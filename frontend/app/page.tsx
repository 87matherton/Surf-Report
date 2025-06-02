"use client";
import React from "react";
import dynamic from 'next/dynamic';

// Dynamically import the Map component to avoid SSR issues with Leaflet
const Map = dynamic(() => import('../src/components/Map'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      padding: 40, 
      fontSize: 24, 
      backgroundColor: '#2196F3',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: 48, marginBottom: 20 }}>🌊 WaveCheck 🏄‍♂️</h1>
      <p style={{ fontSize: 18 }}>Loading surf spots map...</p>
    </div>
  )
});

export default function HomePage() {
  return <Map />;
} 