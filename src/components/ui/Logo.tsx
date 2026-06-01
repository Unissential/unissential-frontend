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
    sm: { w: 150, h: 40 },
    md: { w: 300, h: 80 },
    lg: { w: 600, h: 160 },
  };

  const dims = sizeMap[size];

  return (
    <svg
      width={dims.w}
      height={dims.h}
      viewBox="0 0 2300 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Left U Gradient */}
        <linearGradient
          id="uGradient"
          x1="40"
          y1="40"
          x2="260"
          y2="300"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#8B7CF6" />
          <stop offset="50%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#0037B8" />
        </linearGradient>

        {/* Text Gradient */}
        <linearGradient
          id="textGradient"
          x1="320"
          y1="120"
          x2="2200"
          y2="220"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#C96B2C" />
          <stop offset="100%" stopColor="#C6002B" />
        </linearGradient>
      </defs>

      {/* U ICON */}
      <g
        stroke="url(#uGradient)"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* Outer U */}
        <path d="M80 60V185C80 265 130 320 210 320C290 320 340 265 340 185V60" />

        {/* Inner Left */}
        <path d="M130 60V205" />

        {/* Inner Right */}
        <path d="M290 205V90" />
      </g>

      {/* TEXT */}
      <g
        stroke="url(#textGradient)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* n */}
        <path d="M470 250V150C470 105 500 80 540 80C580 80 610 105 610 150V250" />

        {/* i */}
        <path d="M700 105V250" />

        {/* s */}
        <path d="M820 110C790 85 735 95 735 140C735 170 765 180 800 190C840 200 865 215 865 250C865 290 825 310 780 300" />

        {/* second s */}
        <path d="M1030 110C1000 85 945 95 945 140C945 170 975 180 1010 190C1050 200 1075 215 1075 250C1075 290 1035 310 990 300" />

        {/* e */}
        <circle cx="1220" cy="190" r="70" />
        <path d="M1150 190H1290" />

        {/* n */}
        <path d="M1410 250V150C1410 105 1440 80 1480 80C1520 80 1550 105 1550 150V250" />

        {/* t */}
        <path d="M1700 55V250" />
        <path d="M1645 120H1755" />

        {/* i */}
        <path d="M1835 105V250" />
        <circle cx="1835" cy="55" r="7" fill="#C6002B" stroke="none" />

        {/* a */}
        <path d="M2050 250V150C2050 105 2010 80 1970 80C1930 80 1890 105 1890 150C1890 205 1930 240 1970 240H2050" />

        {/* l */}
        <path d="M2180 60V250" />
      </g>

      {/* Circled e over i */}
      <g transform="translate(620 30)">
        <circle
          cx="40"
          cy="40"
          r="30"
          stroke="#0046B8"
          strokeWidth="7"
          fill="white"
        />

        <text
          x="40"
          y="52"
          textAnchor="middle"
          fontSize="42"
          fontWeight="700"
          fill="#0046B8"
          fontFamily="Arial, sans-serif"
        >
          e
        </text>
      </g>
    </svg>
  );
};


