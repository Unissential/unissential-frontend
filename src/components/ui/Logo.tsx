import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className = '', 
}) => {
  const sizeMap = {
    sm: { w: 32, h: 32 },
    md: { w: 120, h: 40 },
    lg: { w: 180, h: 60 },
  };

  const dims = sizeMap[size];

  // Render SVG logo directly
  return (
    <svg 
      viewBox="0 0 240 80" 
      width={dims.w} 
      height={dims.h}
      className={`flex-shrink-0 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b7fb8" />
          <stop offset="50%" stopColor="#6b7db8" />
          <stop offset="100%" stopColor="#003d99" />
        </linearGradient>
      </defs>
      
      {/* U Icon */}
      <g>
        {/* Outer U */}
        <path
          d="M 10 8 L 10 50 Q 10 68 28 68 Q 46 68 46 50 L 46 8"
          stroke="url(#logoGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Inner U (white) */}
        <path
          d="M 16 14 L 16 50 Q 16 61 28 61 Q 40 61 40 50 L 40 14"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
      
      {/* "nissential" text */}
      <text x="60" y="50" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="500" fill="#333">
        <tspan>nissential</tspan>
      </text>
      
      {/* Small "e" with gradient */}
      <circle cx="48" cy="20" r="5" fill="url(#logoGradient)" />
    </svg>
  );
};


