import dynamic from 'next/dynamic';

// Disable SSR for SurfBackground to avoid hydration mismatch
const SurfBackground = dynamic(() => import('./SurfBackground'), {
  ssr: false,
  loading: () => (
    <div className="relative min-h-screen">
      {/* Loading fallback that matches the expected structure */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, #0ea5e9 0%, #0284c7 25%, #0369a1 50%, #075985 75%, #0c4a6e 100%)`,
        }}
      />
      <div className="absolute inset-0 bg-blue-900/30" />
      <div className="absolute inset-0 backdrop-blur-sm bg-white/15" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-white/15" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
    </div>
  )
});

export default SurfBackground; 