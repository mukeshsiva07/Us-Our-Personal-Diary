import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { diaryService } from '../api/diaryService';
import { profileService, CoupleProfile } from '../api/profileService';
import { AmbientBackground } from '../components/AmbientBackground';
import { ProfileMenu } from '../components/ProfileMenu';
import { SectionType, EntrySummary } from '../types/diary';
import {
  ArrowLeft,
  LayoutDashboard,
  Clock,
  BookOpen,
  Heart,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [profile] = useState<CoupleProfile>(profileService.getProfile());
  const [counts, setCounts] = useState<Record<SectionType, number>>({
    mukesh: 0,
    anne: 0,
    combined: 0,
  });
  const [recentEntries, setRecentEntries] = useState<EntrySummary[]>([]);
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadData = async () => {
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
        const combinedList = [...m, ...a, ...c].sort(
          (x, y) => new Date(y.date).getTime() - new Date(x.date).getTime()
        );
        setRecentEntries(combinedList.slice(0, 4));
      } catch (e) {
        console.error('Failed to load dashboard data', e);
      }
    };
    loadData();
  }, []);

  const totalEntries = counts.mukesh + counts.anne + counts.combined;
  const loveOriginElapsed = profileService.calculateElapsed(profile.dates.loveOrigin);
  const firstSightElapsed = profileService.calculateElapsed(profile.dates.firstSight);

  return (
    <div className="min-h-screen bg-parchment-100 text-ink-900 pb-20 relative overflow-hidden">
      <AmbientBackground />

      {/* Header with Back button on left and ProfileMenu on right */}
      <header className="sticky top-0 z-30 bg-parchment-100/90 backdrop-blur-md border-b border-parchment-300 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-parchment-300 hover:bg-parchment-200 text-xs font-semibold text-ink-700 transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home Deck</span>
        </button>

        <ProfileMenu onLogout={() => navigate('/login')} />
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 relative z-10">
        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-soul-subtle border border-soul-border text-soul-dark text-xs font-semibold mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Couple Dashboard & Analytics</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight">
            Our Shared Chronicle in Numbers
          </h1>
          <p className="text-xs sm:text-sm text-ink-600 mt-1 font-sans">
            Every entry, hour, and memory woven together.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {/* Total entries */}
          <div className="bg-white/95 backdrop-blur-sm border border-parchment-300 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between text-xs text-ink-500 mb-2">
              <span className="font-semibold">Preserved Entries</span>
              <BookOpen className="w-4 h-4 text-ink-400" />
            </div>
            <div className="font-serif text-4xl font-bold text-ink-900">
              {totalEntries}
            </div>
            <p className="text-[11px] text-ink-400 mt-1">Across all 3 journey sanctuaries</p>
          </div>

          {/* Hours Since First Sight */}
          <div className="bg-white/95 backdrop-blur-sm border border-mukesh-border rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between text-xs text-mukesh mb-2">
              <span className="font-semibold">First Sight Hours</span>
              <Sparkles className="w-4 h-4 text-mukesh" />
            </div>
            <div className="font-serif text-4xl font-bold text-mukesh-dark">
              {firstSightElapsed.hoursDisplay}
            </div>
            <p className="text-[11px] text-ink-400 mt-1 font-mono">
              {firstSightElapsed.days}d {firstSightElapsed.hours}h {firstSightElapsed.minutes}m
            </p>
          </div>

          {/* Hours Since Love Origin */}
          <div className="bg-white/95 backdrop-blur-sm border border-soul-border rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between text-xs text-soul-dark mb-2">
              <span className="font-semibold">Love Origin Hours</span>
              <Heart className="w-4 h-4 fill-soul text-soul" />
            </div>
            <div className="font-serif text-4xl font-bold text-soul-dark">
              {loveOriginElapsed.hoursDisplay}
            </div>
            <p className="text-[11px] text-ink-400 mt-1 font-mono">
              {loveOriginElapsed.days}d {loveOriginElapsed.hours}h {loveOriginElapsed.minutes}m
            </p>
          </div>
        </div>

        {/* Section Cards Breakdown */}
        <div className="mb-8">
          <h2 className="font-serif text-xl font-bold text-ink-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-soul" />
            <span>Sanctuary Volumes</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Mukesh's Volume (Cyan/Teal) */}
            <div
              onClick={() => navigate('/journey/mukesh')}
              className="group cursor-pointer bg-white border border-mukesh-border hover:border-mukesh rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-mukesh-subtle text-mukesh border border-mukesh-border mb-3">
                  Teal / Cyan Sanctuary
                </span>
                <h3 className="font-serif text-xl font-bold text-ink-900 mb-1">Mukesh's Journey</h3>
                <p className="text-xs text-ink-500 mb-4">Milo · Visuals & Film rolls</p>
                <div className="text-3xl font-serif font-bold text-mukesh">{counts.mukesh} <span className="text-xs font-sans text-ink-400 font-normal">entries</span></div>
              </div>
              <div className="mt-4 pt-3 border-t border-parchment-200 flex items-center justify-between text-xs font-semibold text-mukesh">
                <span>Explore entries</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Copiko & Milo's Volume (Orange) */}
            <div
              onClick={() => navigate('/journey/combined')}
              className="group cursor-pointer bg-white border border-soul-border hover:border-soul rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-soul-subtle text-soul-dark border border-soul-border mb-3">
                  Orange Sanctuary
                </span>
                <h3 className="font-serif text-xl font-bold text-ink-900 mb-1">Copiko & Milo's Soul</h3>
                <p className="text-xs text-ink-500 mb-4">Dual Perspectives & Shared Moments</p>
                <div className="text-3xl font-serif font-bold text-soul-dark">{counts.combined} <span className="text-xs font-sans text-ink-400 font-normal">entries</span></div>
              </div>
              <div className="mt-4 pt-3 border-t border-parchment-200 flex items-center justify-between text-xs font-semibold text-soul-dark">
                <span>Explore entries</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Anne's Volume (Purple/Pink/Blue) */}
            <div
              onClick={() => navigate('/journey/anne')}
              className="group cursor-pointer bg-white border border-anne-border hover:border-anne rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-anne-subtle text-anne-dark border border-anne-border mb-3">
                  Purple / Pink Sanctuary
                </span>
                <h3 className="font-serif text-xl font-bold text-ink-900 mb-1">Anne's Journey</h3>
                <p className="text-xs text-ink-500 mb-4">Copiko · Wanderlust & Heart</p>
                <div className="text-3xl font-serif font-bold text-anne">{counts.anne} <span className="text-xs font-sans text-ink-400 font-normal">entries</span></div>
              </div>
              <div className="mt-4 pt-3 border-t border-parchment-200 flex items-center justify-between text-xs font-semibold text-anne">
                <span>Explore entries</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Entries */}
        {recentEntries.length > 0 && (
          <div className="bg-white border border-parchment-300 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-ink-900 mb-4">Recently Added Memories</h2>
            <div className="divide-y divide-parchment-200">
              {recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => navigate(`/entry/${entry.id}`)}
                  className="py-3.5 flex items-center justify-between group cursor-pointer hover:bg-parchment-50/70 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{entry.icon || '📖'}</span>
                    <div>
                      <div className="text-sm font-serif font-bold text-ink-900 group-hover:text-soul-dark transition-colors">
                        {entry.title}
                      </div>
                      <div className="text-[11px] text-ink-400 font-sans">
                        {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-ink-400 group-hover:translate-x-1 transition-transform group-hover:text-ink-900" />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

