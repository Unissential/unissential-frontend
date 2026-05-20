import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: { w: 32, h: 32 },
    md: { w: 40, h: 40 },
    lg: { w: 56, h: 56 },
  };

  const dims = sizeMap[size];

  return (
    <svg
      width={dims.w}
      height={dims.h}
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 ${className}`}
    >
      <defs>
        {/* Gradient from purple/lavender to deep blue */}
        <linearGradient id="uGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b7fb8" />
          <stop offset="50%" stopColor="#6b7db8" />
          <stop offset="100%" stopColor="#003d99" />
        </linearGradient>
      </defs>

      {/* Outer U shape - main stroke */}
      <path
        d="M 15 10 L 15 80 Q 15 115 60 115 Q 105 115 105 80 L 105 10"
        stroke="url(#uGradient)"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Inner U shape - creating hollow effect */}
      <path
        d="M 30 28 L 30 80 Q 30 102 60 102 Q 90 102 90 80 L 90 28"
        stroke="white"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};


