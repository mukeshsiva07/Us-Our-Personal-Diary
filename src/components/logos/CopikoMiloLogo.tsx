import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Copiko & Milo's Soul Emblem:
 * Hand-crafted 2D stylized line-art mark depicting two hands gently
 * and warmly interlocking in an intimate, symbolic gesture of shared devotion.
 * Carries the muted gold / amber accent color.
 */
export const CopikoMiloLogo: React.FC<LogoProps> = ({
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
      aria-label="Copiko & Milo's Soul Emblem"
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

      {/* Gentle radiant arc / sunrise glow behind hands */}
      <path
        d="M32 38 C43 28, 57 28, 68 38"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="3 3"
        opacity="0.5"
      />

      {/* Hand A (from left wrist upward into clasp) */}
      {/* Wrist & Palm */}
      <path
        d="M20 62 C26 62, 34 58, 40 52"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M23 72 C31 72, 38 67, 44 60"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Hand A Fingers curving over Hand B */}
      <path
        d="M40 52 C45 46, 52 46, 56 50 C60 54, 56 61, 50 63"
        stroke={color}
        strokeWidth="2.3"
        strokeLinecap="round"
        fill="#FAF7F2"
      />
      {/* Hand A second finger line */}
      <path
        d="M44 55 C48 51, 54 52, 57 56 C59 60, 56 65, 49 67"
        stroke={color}
        strokeWidth="2.1"
        strokeLinecap="round"
      />

      {/* Hand B (from right wrist upward into clasp) */}
      {/* Wrist */}
      <path
        d="M80 62 C74 62, 66 58, 60 52"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M77 72 C69 72, 62 67, 56 60"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Hand B Fingers wrapping around Hand A */}
      <path
        d="M60 52 C55 45, 48 45, 44 49 C40 53, 44 60, 50 62"
        stroke={color}
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <path
        d="M56 55 C52 50, 46 51, 43 55 C41 59, 44 64, 51 66"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Symbolic small spark / heartbeat above the clasp */}
      <path
        d="M50 30 C50 25, 45 23, 43 26 C40 30, 50 38, 50 38 C50 38, 60 30, 57 26 C55 23, 50 25, 50 30 Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={color}
        fillOpacity="0.2"
      />
    </svg>
  );
};

