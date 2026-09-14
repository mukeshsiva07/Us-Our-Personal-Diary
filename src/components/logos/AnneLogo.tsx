import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Anne's Journey Emblem:
 * Hand-crafted 2D stylized line-art mark of a traveler girl
 * with a windswept wide-brim hat, flowing hair, backpack silhouette,
 * and a small wanderlust compass star. Matched artistic style to MukeshLogo.
 */
export const AnneLogo: React.FC<LogoProps> = ({
  className = '',
  size = 72,
  color = 'currentColor',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all duration-300 ${className}`}
      aria-label="Anne's Journey Emblem"
    >
      {/* Subtle outer aura circle */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="2 3"
        opacity="0.35"
      />

      {/* Windswept Traveler Hat */}
      {/* Hat Crown */}
      <path
        d="M40 32 C41 23, 58 22, 60 32"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="#FAF7F2"
      />
      {/* Hat Ribbon */}
      <path
        d="M39 31 C46 33, 54 33, 61 31"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Hat Brim (undulating windswept curve) */}
      <path
        d="M26 36 C34 33, 44 33, 53 32 C64 31, 74 34, 76 38"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Face & Windswept Hair Profile */}
      <path
        d="M49 35 C52 40, 53 45, 51 49 C50 51, 48 53, 46 54"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Flowing hair strands catching the sea breeze */}
      <path
        d="M38 36 C32 44, 28 54, 27 63"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M42 38 C37 46, 33 55, 34 65"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M46 42 C40 50, 39 58, 41 68"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Shoulders & Traveler Silhouette */}
      <path
        d="M44 58 C41 65, 34 72, 28 80"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M51 58 C57 63, 67 69, 74 80"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Wanderer's Rucksack / Backpack Strap */}
      <path
        d="M56 62 L63 80"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M60 63 C67 62, 73 68, 71 77"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Buckle on strap */}
      <rect
        x="58"
        y="68"
        width="4"
        height="3"
        rx="0.5"
        stroke={color}
        strokeWidth="1.2"
        fill="#FAF7F2"
      />

      {/* Delicate Horizon & Compass Star */}
      <path
        d="M74 24 L74 30 M71 27 L77 27"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <circle
        cx="74"
        cy="27"
        r="1"
        fill={color}
      />
    </svg>
  );
};

