'use client';

interface SurfBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const SurfBackground: React.FC<SurfBackgroundProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Ocean Wave Gradient Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 113, 255, 0.8) 0%, rgba(255, 255, 255, 0) 50%),
            radial-gradient(circle at 80% 20%, rgba(120, 200, 255, 0.8) 0%, rgba(255, 255, 255, 0) 50%),
            radial-gradient(circle at 40% 40%, rgba(17, 153, 255, 0.7) 0%, rgba(255, 255, 255, 0) 50%),
            linear-gradient(135deg, 
              #0ea5e9 0%, 
              #0284c7 25%, 
              #0369a1 50%, 
              #075985 75%, 
              #0c4a6e 100%
            )
          `,
        }}
      />
      
      {/* Wave Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 8px,
              rgba(255, 255, 255, 0.1) 8px,
              rgba(255, 255, 255, 0.1) 12px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 15px,
              rgba(255, 255, 255, 0.05) 15px,
              rgba(255, 255, 255, 0.05) 20px
            )
          `,
        }}
      />
      
      {/* Frosted Glass Overlay Effect */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/20" />
      
      {/* Additional glass texture with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-white/10 to-white/20" />
      
      {/* Soft edge vignette for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/10" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default SurfBackground; 