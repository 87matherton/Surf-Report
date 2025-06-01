"use client";
import React from "react";
import dynamic from 'next/dynamic';

// Dynamically import the Map component to avoid SSR issues with Leaflet
const Map = dynamic(() => import('../src/components/Map'), {
  ssr: false,
  loading: () => <div style={{ padding: 40, fontSize: 24 }}>Loading surf spots map...</div>
});

export default function HomePage() {
  return <Map />;
} 