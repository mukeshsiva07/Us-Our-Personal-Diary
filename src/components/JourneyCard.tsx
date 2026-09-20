import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionType } from '../types/diary';
import { MukeshLogo } from './logos/MukeshLogo';
import { AnneLogo } from './logos/AnneLogo';
import { CopikoMiloLogo } from './logos/CopikoMiloLogo';
import { ArrowRight, BookOpen } from 'lucide-react';

interface JourneyCardProps {
  section: SectionType;
  title: string;
  subtitle: string;
  tagline: string;
  entryCount?: number;
  isMiddle?: boolean;
}

const SECTION_CONFIG = {
  // Mukesh's Journey: Shades of green (mainly cyan, turquoise & teal)
  mukesh: {
    accent: '#0D9488',
    borderHover: 'hover:border-mukesh hover:shadow-[0_16px_36px_-8px_rgba(13,148,136,0.28)]',
    bgBadge: 'bg-mukesh-subtle text-mukesh border-mukesh-border',
    colorText: 'text-mukesh',
    path: '/journey/mukesh',
    Logo: MukeshLogo,
  },
  // Copiko & Milo's Soul: Shades of orange
  combined: {
    accent: '#F97316',
    borderHover: 'hover:border-soul hover:shadow-[0_16px_36px_-8px_rgba(249,115,22,0.28)]',
    bgBadge: 'bg-soul-subtle text-soul-dark border-soul-border',
    colorText: 'text-soul-dark',
    path: '/journey/combined',
    Logo: CopikoMiloLogo,
  },
  // Anne's Journey: Shades of blue, purple & pink
  anne: {
    accent: '#8B5CF6',
    borderHover: 'hover:border-anne hover:shadow-[0_16px_36px_-8px_rgba(139,92,246,0.28)]',
    bgBadge: 'bg-anne-subtle text-anne-dark border-anne-border',
    colorText: 'text-anne-dark',
    path: '/journey/anne',
    Logo: AnneLogo,
  },
};

export const JourneyCard: React.FC<JourneyCardProps> = ({
  section,
  title,
  subtitle,
  tagline,
  entryCount = 0,
  isMiddle = false,
}) => {
  const navigate = useNavigate();
  const config = SECTION_CONFIG[section];
  const Logo = config.Logo;

  return (
    <div
      onClick={() => navigate(config.path)}
      className={`group relative cursor-pointer select-none rounded-3xl bg-white/95 backdrop-blur-sm border border-parchment-300 p-8 sm:p-9 transition-all duration-300 ease-out flex flex-col justify-between hover:-translate-y-2 shadow-sm ${config.borderHover} ${
        isMiddle ? 'md:scale-[1.03] ring-2 ring-soul/25 z-10' : ''
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(config.path);
        }
      }}
    >
      {/* Top subtle badge and icon */}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${config.bgBadge}`}>
          <BookOpen className="w-3.5 h-3.5" />
          <span>{entryCount} {entryCount === 1 ? 'entry' : 'entries'}</span>
        </span>
        <span className="text-[11px] uppercase tracking-wider text-ink-400 font-semibold">
          {subtitle}
        </span>
      </div>

      {/* Center artwork mark with colored background aura */}
      <div className="my-8 sm:my-10 flex flex-col items-center justify-center">
        <div className="p-4 rounded-full bg-parchment-50/80 border border-parchment-200 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
          <Logo size={84} color={config.accent} />
        </div>
      </div>

      {/* Bottom information */}
      <div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900 mb-2 group-hover:text-ink-950 transition-colors">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-ink-600 leading-relaxed mb-6 font-sans">
          {tagline}
        </p>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold pt-4 border-t border-parchment-200 group-hover:border-parchment-300 transition-colors">
          <span className={config.colorText}>Open Sanctuary</span>
          <ArrowRight className={`w-4 h-4 ${config.colorText} group-hover:translate-x-1.5 transition-transform`} />
        </div>
      </div>
    </div>
  );
};
