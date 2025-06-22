"use client";
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const SimpleNavigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const navigationItems = [
    { key: 'map', label: 'Map', path: '/' },
    { key: 'favorites', label: 'Favorites', path: '/favorites' },
    { key: 'forecast', label: 'Forecast', path: '/forecast' }
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  const isCurrentPage = (path: string) => {
    if (!pathname) return false;
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 w-12 h-12 bg-white rounded-[15px] shadow-lg flex items-center justify-center"
      >
        <div className="flex flex-col justify-center items-center w-5 h-5">
          <span className={`bg-slate-700 block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
          <span className={`bg-slate-700 block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm my-0.5 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`bg-slate-700 block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
        </div>
      </button>

      {/* Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-6 left-6 right-6 lg:left-6 lg:right-auto lg:w-64 bg-white rounded-[15px] shadow-2xl z-40 animate-slide-up max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-100">
              <h1 className="font-semibold text-xl leading-7 tracking-tight text-slate-700">WaveCheck</h1>
              <p className="text-xs font-medium text-slate-400">Surf Report</p>
            </div>

            {/* Navigation */}
            <nav className="p-3">
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                      isCurrentPage(item.path)
                        ? 'bg-slate-100 text-slate-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-5 h-5 text-slate-400">
                      {item.key === 'map' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      )}
                      {item.key === 'favorites' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                      {item.key === 'forecast' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium text-slate-700">{item.label}</span>
                  </button>
                ))}
              </div>
            </nav>

            {/* User Section */}
            <div className="p-3 border-t border-slate-100">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">U</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate">User</p>
                  <p className="text-xs text-slate-400 truncate">user@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SimpleNavigation; 