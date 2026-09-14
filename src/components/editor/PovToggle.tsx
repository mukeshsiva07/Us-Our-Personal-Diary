import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface PovToggleProps {
  activePov: 'copiko' | 'milo';
  onChange: (pov: 'copiko' | 'milo') => void;
  copikoWordCount?: number;
  miloWordCount?: number;
  isReadOnly?: boolean;
}

export const PovToggle: React.FC<PovToggleProps> = ({
  activePov,
  onChange,
  copikoWordCount,
  miloWordCount,
  isReadOnly = false,
}) => {
  return (
    <div className="w-full flex items-center justify-between p-2 rounded-2xl bg-soul-subtle/80 border border-soul-border/60 my-4">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-soul animate-pulse" />
        <span className="text-xs font-serif font-semibold text-soul-dark">
          {isReadOnly ? 'Reading Perspective' : 'Dual Narrative Stream'}
        </span>
      </div>

      <div className="flex items-center p-1 bg-white rounded-xl border border-soul-border/50 shadow-sm">
        {/* Copiko Button */}
        <button
          type="button"
          onClick={() => onChange('copiko')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activePov === 'copiko'
              ? 'bg-anne text-white shadow-sm font-semibold'
              : 'text-ink-600 hover:text-ink-900 hover:bg-parchment-100'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${activePov === 'copiko' ? 'fill-white' : 'text-anne'}`} />
          <span>Copiko's POV</span>
          {typeof copikoWordCount === 'number' && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activePov === 'copiko' ? 'bg-white/20 text-white' : 'bg-parchment-200 text-ink-500'
            }`}>
              {copikoWordCount}w
            </span>
          )}
        </button>

        {/* Milo Button */}
        <button
          type="button"
          onClick={() => onChange('milo')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activePov === 'milo'
              ? 'bg-mukesh text-white shadow-sm font-semibold'
              : 'text-ink-600 hover:text-ink-900 hover:bg-parchment-100'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${activePov === 'milo' ? 'fill-white' : 'text-mukesh'}`} />
          <span>Milo's POV</span>
          {typeof miloWordCount === 'number' && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activePov === 'milo' ? 'bg-white/20 text-white' : 'bg-parchment-200 text-ink-500'
            }`}>
              {miloWordCount}w
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

