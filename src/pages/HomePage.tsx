import React, { useEffect, useState } from 'react';
import { diaryService } from '../api/diaryService';
import { CardDeckReveal } from '../components/CardDeckReveal';
import { ProfileMenu } from '../components/ProfileMenu';
import { SectionType } from '../types/diary';
import { Sparkles, Heart } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [counts, setCounts] = useState<Record<SectionType, number>>({
    mukesh: 0,
    anne: 0,
    combined: 0,
  });

  const loadCounts = async () => {
    try {
      const [m, a, c] = await Promise.all([
        diaryService.listEntries('mukesh'),
        diaryService.listEntries('anne'),
        diaryService.listEntries('combined'),
      ]);
      setCounts({
        mukesh: m.length,
        anne: a.length,
        combined: c.length,
      });
    } catch (e) {
      console.error('Failed to load entry counts', e);
    }
  };

  useEffect(() => {
    loadCounts();
  }, []);

  return (
    <div className="min-h-screen bg-parchment-100 flex flex-col justify-between relative overflow-hidden pb-12">
      {/* Top navigation / profile bar */}
      <header className="w-full px-6 py-5 flex items-center justify-between z-20">
        <ProfileMenu onLogout={() => window.location.reload()} />

        <div className="flex items-center gap-2 text-xs text-ink-500 font-serif italic">
          <Heart className="w-3.5 h-3.5 text-anne fill-anne/30" />
          <span>Together since July 2025</span>
        </div>
      </header>

      {/* Main hero area */}
      <main className="flex-1 flex flex-col items-center justify-center my-6 sm:my-10 z-10">
        {/* Editorial headline */}
        <div className="text-center max-w-2xl mx-auto px-4 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soul-subtle border border-soul-border text-soul-dark text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Shared Digital Chronicle</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-ink-900 tracking-tight leading-[1.15]">
            Copiko <span className="text-soul italic font-serif">&</span> Milo
          </h1>
          <p className="mt-4 text-sm sm:text-base text-ink-600 font-sans max-w-lg mx-auto leading-relaxed">
            Our private sanctuary of unspoken thoughts, shared travels, photography rolls, and everyday devotion.
          </p>
        </div>

        {/* 3-Card Deck Reveal */}
        <CardDeckReveal counts={counts} />
      </main>

      {/* Discreet footer */}
      <footer className="text-center text-xs text-ink-400 font-sans z-10 px-4">
        <span>“Two hearts, two minds, one continuous narrative.”</span>
      </footer>
    </div>
  );
};

