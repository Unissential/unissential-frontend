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
  const sizeMap = {
    sm: { w: 40, h: 40 },
    md: { w: 280, h: 80 },
    lg: { w: 560, h: 160 },
  };

  const dims = sizeMap[size];
  // Use U_logo for small sizes, full logo for larger
  const logoSrc = size === 'sm' ? '/U_logo.png' : '/logo.png';

  return (
    <Image
      src={logoSrc}
      alt="Unissential"
      width={dims.w}
      height={dims.h}
      className={`flex-shrink-0 object-contain ${className}`}
      priority
    />
  );
};


