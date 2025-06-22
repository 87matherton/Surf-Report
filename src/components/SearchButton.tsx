'use client';

interface SearchButtonProps {
  onClick: () => void;
  className?: string;
  variant?: 'floating' | 'inline';
}

const SearchButton: React.FC<SearchButtonProps> = ({ 
  onClick, 
  className = '', 
  variant = 'floating' 
}) => {
  const baseClasses = "flex items-center justify-center transition-all duration-200 hover:scale-105";
  
  const variantClasses = {
    floating: "w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full shadow-lg border border-white/30",
    inline: "px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg border border-white/30"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label="Search surf spots"
    >
      <svg 
        className="w-5 h-5 text-white" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      {variant === 'inline' && (
        <span className="ml-2 text-white font-medium">Search</span>
      )}
    </button>
  );
};

export default SearchButton; 