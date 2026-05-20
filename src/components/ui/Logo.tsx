import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  src?: string;
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className = '', 
  src = '/logo.png',
  alt = 'Unissential'
}) => {
  const sizeMap = {
    sm: { w: 32, h: 32 },
    md: { w: 120, h: 40 },
    lg: { w: 180, h: 60 },
  };

  const dims = sizeMap[size];

  // Use image-based logo with graceful fallback
  return (
    <div className={`flex items-center justify-center flex-shrink-0 ${className}`} style={{ height: dims.h }}>
      <Image
        src={src}
        alt={alt}
        width={dims.w}
        height={dims.h}
        priority
        quality={100}
        className="object-contain"
        onError={(e) => {
          // Fallback if image doesn't load - show text
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};


