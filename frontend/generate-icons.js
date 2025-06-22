const fs = require('fs');
const path = require('path');

// Simple SVG icon generator for WaveCheck
const generateWaveCheckIcon = (size) => {
  const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2196F3;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#21CBF3;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="2" dy="2" stdDeviation="4" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="url(#bg)" filter="url(#shadow)"/>
  
  <!-- Wave patterns -->
  <g transform="translate(${size * 0.1}, ${size * 0.3})">
    <!-- Main wave -->
    <path d="M0 ${size * 0.2} Q${size * 0.2} ${size * 0.1} ${size * 0.4} ${size * 0.2} T${size * 0.8} ${size * 0.2}" 
          stroke="white" stroke-width="${size * 0.04}" fill="none" opacity="0.9"/>
    
    <!-- Second wave -->
    <path d="M0 ${size * 0.35} Q${size * 0.15} ${size * 0.25} ${size * 0.3} ${size * 0.35} T${size * 0.6} ${size * 0.35}" 
          stroke="white" stroke-width="${size * 0.03}" fill="none" opacity="0.7"/>
    
    <!-- Third wave -->
    <path d="M${size * 0.2} ${size * 0.5} Q${size * 0.35} ${size * 0.4} ${size * 0.5} ${size * 0.5} T${size * 0.8} ${size * 0.5}" 
          stroke="white" stroke-width="${size * 0.025}" fill="none" opacity="0.5"/>
  </g>
  
  <!-- Surfboard icon -->
  <g transform="translate(${size * 0.6}, ${size * 0.15}) rotate(45)">
    <ellipse cx="0" cy="0" rx="${size * 0.08}" ry="${size * 0.25}" fill="white" opacity="0.8"/>
    <ellipse cx="0" cy="0" rx="${size * 0.04}" ry="${size * 0.2}" fill="#FF9800" opacity="0.9"/>
  </g>
</svg>`;
  
  return svg;
};

// Icon sizes needed for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Generate SVG icons
iconSizes.forEach(size => {
  const svg = generateWaveCheckIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(__dirname, 'public', 'icons', filename);
  
  fs.writeFileSync(filepath, svg);
  console.log(`Generated ${filename}`);
});

// Generate a simple favicon.ico placeholder
const faviconSvg = generateWaveCheckIcon(32);
fs.writeFileSync(path.join(__dirname, 'public', 'favicon.svg'), faviconSvg);

console.log('All PWA icons generated successfully!');
console.log('Note: For production, consider using a proper icon generator or design tool.');
console.log('SVG icons have been created. For PNG icons, you would need a conversion tool.'); 