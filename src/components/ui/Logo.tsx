import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className = '', 
}) => {
  // Dimensions based on actual logo aspect ratios
  // logo.png is approximately 3.5:1 aspect ratio
  // U_logo.png is 1:1 aspect ratio
  const sizeMap = {
    sm: { w: 40, h: 40, maxW: 'max-w-10' },      // For footer: 40x40
    md: { w: 200, h: 57, maxW: 'max-w-[200px]' }, // For navbar: responsive, ~200px wide
    lg: { w: 280, h: 80, maxW: 'max-w-sm' },     // For hero: 280x80
  };

  const dims = sizeMap[size];
  // Use U_logo for small sizes, full logo for larger
  const logoSrc = size === 'sm' ? '/U_logo.png' : '/logo.png';

  return (
    <div className={`flex items-center ${dims.maxW}`}>
      <Image
        src={logoSrc}
        alt="Unissential"
        width={dims.w}
        height={dims.h}
        className={`w-full h-auto object-contain ${className}`}
        priority
      />
    </div>
  );
};


