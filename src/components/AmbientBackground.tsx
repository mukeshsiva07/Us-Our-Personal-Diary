import React from 'react';

/**
 * AmbientBackground:
 * Minimalist pleasing ambient animation of softly drifting, glowing
 * color orbs (Cyan/Teal, Purple/Pink, and Orange) with gentle breathing
 * and subtle shimmer. Completely non-intrusive and lightweight.
 */
export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Soft Teal / Cyan Orb (Mukesh's spirit) */}
      <div
        className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-mukesh-cyan/20 via-mukesh-turquoise/15 to-transparent blur-3xl animate-float-slow opacity-70"
      />

      {/* Soft Purple / Pink Orb (Anne's spirit) */}
      <div
        className="absolute top-1/3 -right-28 w-[520px] h-[520px] rounded-full bg-gradient-to-bl from-anne-pink/20 via-anne/15 to-transparent blur-3xl animate-float-delayed opacity-65"
      />

      {/* Soft Warm Orange Orb (Copiko & Milo's shared warmth) */}
      <div
        className="absolute -bottom-32 left-1/4 w-[560px] h-[560px] rounded-full bg-gradient-to-tr from-soul/20 via-soul-light/15 to-transparent blur-3xl animate-float-slow opacity-60"
        style={{ animationDelay: '8s' }}
      />

      {/* Subtle fine ambient grid dots */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#1A1817 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
    </div>
  );
};

