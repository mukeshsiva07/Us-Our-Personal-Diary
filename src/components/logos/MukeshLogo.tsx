import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Mukesh's Journey Emblem:
 * Hand-crafted 2D stylized line-art mark depicting a photographer
 * holding a vintage rangefinder camera up to his eye, with gentle
 * geometric contours and artistic linework.
 */
export const MukeshLogo: React.FC<LogoProps> = ({
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
      aria-label="Mukesh's Journey Emblem"
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

      {/* Stylized Photographer Silhouette & Camera */}
      {/* Head & Hair contours */}
      <path
        d="M34 42 C33 34, 38 24, 48 24 C57 24, 62 31, 62 38 C62 42, 60 46, 56 48"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Hair locks / texture */}
      <path
        d="M40 24 C44 28, 48 27, 52 24 C56 26, 59 28, 62 31"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
      />

      {/* Shoulders & Jacket Silhouette */}
      <path
        d="M26 80 C26 65, 34 56, 44 54"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M58 54 C68 56, 75 66, 75 80"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Right Arm raised holding camera */}
      <path
        d="M72 74 C70 60, 68 50, 60 46"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Left Arm cradle under camera */}
      <path
        d="M28 74 C30 62, 38 52, 46 50"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* The Vintage Rangefinder Camera */}
      {/* Body */}
      <rect
        x="36"
        y="38"
        width="28"
        height="18"
        rx="3"
        stroke={color}
        strokeWidth="2.5"
        fill="#FAF7F2"
      />
      {/* Top plate notch */}
      <path
        d="M40 38 L40 35 L52 35 L52 38"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Shutter button */}
      <line
        x1="57"
        y1="36"
        x2="61"
        y2="36"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Camera Lens with aperture reflections */}
      <circle
        cx="50"
        cy="47"
        r="6.5"
        stroke={color}
        strokeWidth="2.2"
        fill="#FAF7F2"
      />
      <circle
        cx="50"
        cy="47"
        r="3"
        stroke={color}
        strokeWidth="1.5"
        fill={color}
        fillOpacity="0.25"
      />
      {/* Viewfinder window */}
      <rect
        x="56"
        y="41"
        width="5"
        height="3.5"
        rx="1"
        stroke={color}
        strokeWidth="1.2"
        fill={color}
        fillOpacity="0.4"
      />

      {/* Focus sparkle / light ray */}
      <path
        d="M74 32 L78 30 M78 36 L74 38 M80 33 L84 33"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
};

