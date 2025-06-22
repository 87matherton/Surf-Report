'use client';

import BottomNavigation from '../../src/components/BottomNavigation';
import SurfBackground from '../../src/components/SurfBackground';
import { useAuth } from '../../src/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, isSignedIn, signOut } = useAuth();
  const router = useRouter();

  const handleAuthAction = () => {
    if (isSignedIn) {
      signOut();
    } else {
      router.push('/signin');
    }
  };

  return (
    <SurfBackground imageUrl="/ProfileBackground.png" className="relative overflow-hidden">
      {/* Background Ocean Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 to-blue-700/20"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <button 
            onClick={handleAuthAction}
            className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors border border-white/30"
          >
            <div className="flex items-center gap-2">
              {isSignedIn ? (
                <>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-white font-medium">Sign Out</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-white font-medium">Sign In</span>
                </>
              )}
            </div>
          </button>
        </div>
      </header>

      {/* Profile Content */}
      <main className="relative z-10 px-6 pb-24">
        {/* User Info */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-300 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white font-bold">🏄‍♂️</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">
                {isSignedIn ? user?.name || 'Surf Explorer' : 'Guest User'}
              </h2>
              <p className="text-white/70">
                {isSignedIn ? user?.email || 'Beginner Surfer' : 'Sign in to track your sessions'}
              </p>
            </div>
            {!isSignedIn && (
              <button 
                onClick={() => router.push('/signin')}
                className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 transition-colors rounded-full text-white font-medium"
              >
                Sign In
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-white/70 text-sm">Sessions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-white/70 text-sm">Favorites</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">5</div>
              <div className="text-white/70 text-sm">Spots Visited</div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Temperature Unit</span>
              <div className="flex bg-white/10 rounded-lg p-1">
                <button className="px-3 py-1 bg-white/20 rounded text-white text-sm">°F</button>
                <button className="px-3 py-1 text-white/70 text-sm">°C</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Wave Height Unit</span>
              <div className="flex bg-white/10 rounded-lg p-1">
                <button className="px-3 py-1 bg-white/20 rounded text-white text-sm">ft</button>
                <button className="px-3 py-1 text-white/70 text-sm">m</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Notifications</span>
              <button className="w-12 h-6 bg-blue-500 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Skill Level */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Skill Level</h3>
          <div className="space-y-3">
            {[
              { level: 'Beginner', active: true, description: 'Learning basics, small waves' },
              { level: 'Intermediate', active: false, description: 'Comfortable in 3-6ft waves' },
              { level: 'Advanced', active: false, description: 'Surfing overhead waves' },
              { level: 'Expert', active: false, description: 'Big wave surfing' },
            ].map((skill) => (
              <button
                key={skill.level}
                className={`w-full p-3 rounded-xl border text-left transition-colors ${
                  skill.active
                    ? 'bg-white/20 border-white/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="text-white font-medium">{skill.level}</div>
                <div className="text-white/70 text-sm">{skill.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'Added Malibu to favorites', time: '2 hours ago', icon: '⭐' },
              { action: 'Checked Trestles forecast', time: '1 day ago', icon: '📊' },
              { action: 'Viewed Steamer Lane details', time: '3 days ago', icon: '🌊' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xl">{activity.icon}</span>
                <div className="flex-1">
                  <div className="text-white text-sm">{activity.action}</div>
                  <div className="text-white/60 text-xs">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </SurfBackground>
  );
} 