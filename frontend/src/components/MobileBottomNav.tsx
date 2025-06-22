"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MobileBottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50">
      <div className="flex items-center justify-around py-2">
        
        <Link href="/" className="flex flex-col items-center py-2 px-4">
          <svg className={`w-6 h-6 ${pathname === '/' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className={`text-xs mt-1 ${pathname === '/' ? 'text-blue-600' : 'text-gray-400'}`}>
            Map
          </span>
        </Link>

        <Link href="/favorites" className="flex flex-col items-center py-2 px-4">
          <svg className={`w-6 h-6 ${pathname === '/favorites' ? 'text-blue-600' : 'text-gray-400'}`} fill={pathname === '/favorites' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className={`text-xs mt-1 ${pathname === '/favorites' ? 'text-blue-600' : 'text-gray-400'}`}>
            Favorites
          </span>
        </Link>

        <Link href="/forecast" className="flex flex-col items-center py-2 px-4">
          <svg className={`w-6 h-6 ${pathname === '/forecast' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <span className={`text-xs mt-1 ${pathname === '/forecast' ? 'text-blue-600' : 'text-gray-400'}`}>
            Forecast
          </span>
        </Link>

      </div>
    </nav>
  );
};

export default MobileBottomNav; 