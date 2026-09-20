import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService, CoupleProfile } from '../api/profileService';
import { AmbientBackground } from '../components/AmbientBackground';
import {
  ArrowLeft,
  Edit3,
  Check,
  Heart,
  Clock,
  Calendar,
  Sparkles,
  Users,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  // Profile state
  const [profile, setProfile] = useState<CoupleProfile>(profileService.getProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<CoupleProfile>(profile);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Live timer tick state (updates every second)
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync when profile updates
  useEffect(() => {
    setFormState(profile);
  }, [profile]);

  // Calculations for live hours
  // Left: Love Sight (Love Origin)
  const loveOriginElapsed = profileService.calculateElapsed(profile.dates.loveOrigin);
  // Right: First Sight
  const firstSightElapsed = profileService.calculateElapsed(profile.dates.firstSight);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = profileService.saveProfile(formState);
    setProfile(updated);
    setIsEditing(false);
    setSaveMessage('Profile changes saved successfully.');
    setTimeout(() => setSaveMessage(null), 3500);
  };

  const handleCancel = () => {
    setFormState(profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-parchment-100 text-ink-900 pb-20 relative overflow-hidden">
      <AmbientBackground />

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-parchment-100/90 backdrop-blur-md border-b border-parchment-300 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-parchment-300 hover:bg-parchment-200 text-xs font-semibold text-ink-700 transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home Deck</span>
        </button>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3.5 py-1.5 rounded-xl bg-parchment-200 hover:bg-parchment-300 text-ink-700 text-xs font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-ink-900 hover:bg-ink-800 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white border border-parchment-300 hover:border-soul/50 text-ink-800 text-xs font-semibold shadow-sm hover:shadow transition-all group active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5 text-soul group-hover:rotate-12 transition-transform" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 relative z-10">
        {/* Success toast message */}
        {saveMessage && (
          <div className="mb-6 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{saveMessage}</span>
            </div>
            <button onClick={() => setSaveMessage(null)} className="text-emerald-500 hover:text-emerald-800">✕</button>
          </div>
        )}

        {/* Top Summary Banner */}
        <div className="bg-white/95 backdrop-blur-sm border border-parchment-300 rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              {/* Couple Emblem Monogram */}
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-mukesh/15 via-soul/20 to-anne-pink/15 border-2 border-parchment-300 flex items-center justify-center text-2xl font-serif font-bold text-ink-900 shadow-inner">
                <span className="text-mukesh">M</span>
                <span className="text-soul font-normal text-sm mx-0.5">&</span>
                <span className="text-anne">A</span>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-soul-subtle border border-soul-border text-soul-dark text-xs font-semibold mb-2">
                  <Heart className="w-3 h-3 fill-soul text-soul animate-pulse" />
                  <span>{profile.relationshipStatus}</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight">
                  {profile.username}
                </h1>
                <p className="text-xs text-ink-500 mt-1 flex items-center justify-center sm:justify-start gap-1.5 font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Account created: <strong className="text-ink-700">{profile.accountCreated}</strong></span>
                </p>
              </div>
            </div>

            {/* Quick action or edit indicator */}
            {!isEditing && (
              <div className="text-right hidden sm:block">
                <span className="text-[11px] text-ink-400 font-serif italic">
                  Private Sanctuary of Mukesh & Anne
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LIVE HOURS MILESTONE COUNTERS (LOVE SIGHT ON LEFT, FIRST SIGHT ON RIGHT)   */}
        {/* ========================================================================= */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-serif text-xl font-bold text-ink-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-soul" />
              <span>Live Milestone Hours</span>
            </h2>
            <span className="text-[11px] text-ink-400 italic">
              Live ticker · updates continuously
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* LEFT CARD: LOVE SIGHT / LOVE ORIGIN */}
            <div className="bg-gradient-to-br from-white to-soul-subtle/40 border border-soul-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-soul/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-soul-subtle text-soul-dark border border-soul-border text-xs font-semibold">
                  <Heart className="w-3 h-3 fill-soul text-soul" />
                  <span>Love Sight (Love Origin)</span>
                </span>
                <span className="text-xs text-ink-500 font-medium">
                  {profile.dates.loveOriginLabel}
                </span>
              </div>

              {/* Huge Live Number */}
              <div className="my-2">
                <div className="font-serif text-4xl sm:text-5xl font-extrabold text-soul-dark tracking-tight">
                  {loveOriginElapsed.hoursDisplay}
                  <span className="text-lg font-sans font-medium text-soul ml-2">hours</span>
                </div>
              </div>

              {/* Detailed Live Breakdown Ticker */}
              <div className="mt-4 pt-4 border-t border-soul-border/60 flex items-center justify-between text-xs text-ink-700 font-sans">
                <div className="flex items-center gap-3 font-mono">
                  <span><strong>{loveOriginElapsed.days}</strong>d</span>
                  <span><strong>{loveOriginElapsed.hours}</strong>h</span>
                  <span><strong>{loveOriginElapsed.minutes}</strong>m</span>
                  <span className="text-soul font-bold"><strong>{loveOriginElapsed.seconds}</strong>s</span>
                </div>
                <span className="text-[11px] text-ink-400 italic font-serif">since love blossomed</span>
              </div>
            </div>

            {/* RIGHT CARD: FIRST SIGHT */}
            <div className="bg-gradient-to-br from-white to-mukesh-subtle/50 border border-mukesh-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-mukesh-cyan/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mukesh-subtle text-mukesh border border-mukesh-border text-xs font-semibold">
                  <Sparkles className="w-3 h-3 text-mukesh" />
                  <span>First Sight</span>
                </span>
                <span className="text-xs text-ink-500 font-medium">
                  {profile.dates.firstSightLabel}
                </span>
              </div>

              {/* Huge Live Number */}
              <div className="my-2">
                <div className="font-serif text-4xl sm:text-5xl font-extrabold text-mukesh-dark tracking-tight">
                  {firstSightElapsed.hoursDisplay}
                  <span className="text-lg font-sans font-medium text-mukesh ml-2">hours</span>
                </div>
              </div>

              {/* Detailed Live Breakdown Ticker */}
              <div className="mt-4 pt-4 border-t border-mukesh-border/60 flex items-center justify-between text-xs text-ink-700 font-sans">
                <div className="flex items-center gap-3 font-mono">
                  <span><strong>{firstSightElapsed.days}</strong>d</span>
                  <span><strong>{firstSightElapsed.hours}</strong>h</span>
                  <span><strong>{firstSightElapsed.minutes}</strong>m</span>
                  <span className="text-mukesh font-bold"><strong>{firstSightElapsed.seconds}</strong>s</span>
                </div>
                <span className="text-[11px] text-ink-400 italic font-serif">since our paths crossed</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* EDIT FORM (WHEN USER CLICKS "EDIT PROFILE")                                */}
        {/* ========================================================================= */}
        {isEditing ? (
          <form onSubmit={handleSave} className="bg-white border border-parchment-300 rounded-3xl p-6 sm:p-8 shadow-md mb-8 space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-parchment-200">
              <h3 className="font-serif text-xl font-bold text-ink-900">
                Edit Profile & Milestone Dates
              </h3>
              <span className="text-xs text-ink-400">All fields are editable</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Username</label>
                <input
                  type="text"
                  value={formState.username}
                  onChange={(e) => setFormState({ ...formState, username: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-parchment-50 border border-parchment-300 text-xs text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-soul/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Relationship Status</label>
                <input
                  type="text"
                  value={formState.relationshipStatus}
                  onChange={(e) => setFormState({ ...formState, relationshipStatus: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-parchment-50 border border-parchment-300 text-xs text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-soul/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Account Created Date</label>
                <input
                  type="text"
                  value={formState.accountCreated}
                  onChange={(e) => setFormState({ ...formState, accountCreated: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-parchment-50 border border-parchment-300 text-xs text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-soul/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Member 1 (Mukesh)</label>
                <input
                  type="text"
                  value={formState.member1}
                  onChange={(e) => setFormState({ ...formState, member1: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-parchment-50 border border-parchment-300 text-xs text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-mukesh/30"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-ink-700 mb-1">Member 2 (Anne)</label>
                <input
                  type="text"
                  value={formState.member2}
                  onChange={(e) => setFormState({ ...formState, member2: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-parchment-50 border border-parchment-300 text-xs text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-anne/30"
                  required
                />
              </div>
            </div>

            {/* Important Dates Edit Subsection */}
            <div className="pt-4 border-t border-parchment-200">
              <h4 className="text-xs uppercase tracking-wider text-ink-500 font-bold mb-3">
                Pivotal Milestone Dates & Labels
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Sight */}
                <div className="p-3 bg-parchment-50 rounded-2xl border border-parchment-200 space-y-2">
                  <label className="text-xs font-bold text-ink-800">First Sight</label>
                  <input
                    type="date"
                    value={formState.dates.firstSight.slice(0, 10)}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        dates: {
                          ...formState.dates,
                          firstSight: `${e.target.value}T00:00:00`,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-parchment-300 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Display label, e.g. 7 March 2026"
                    value={formState.dates.firstSightLabel}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        dates: {
                          ...formState.dates,
                          firstSightLabel: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-parchment-300 text-xs"
                  />
                </div>

                {/* Love Origin */}
                <div className="p-3 bg-parchment-50 rounded-2xl border border-parchment-200 space-y-2">
                  <label className="text-xs font-bold text-ink-800">Love Origin</label>
                  <input
                    type="date"
                    value={formState.dates.loveOrigin.slice(0, 10)}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        dates: {
                          ...formState.dates,
                          loveOrigin: `${e.target.value}T00:00:00`,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-parchment-300 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Display label, e.g. 4 April 2026"
                    value={formState.dates.loveOriginLabel}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        dates: {
                          ...formState.dates,
                          loveOriginLabel: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-parchment-300 text-xs"
                  />
                </div>

                {/* Birth of Milo */}
                <div className="p-3 bg-parchment-50 rounded-2xl border border-parchment-200 space-y-2">
                  <label className="text-xs font-bold text-ink-800">The Birth of Milo</label>
                  <input
                    type="date"
                    value={formState.dates.birthOfMilo.slice(0, 10)}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        dates: {
                          ...formState.dates,
                          birthOfMilo: `${e.target.value}T00:00:00`,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-parchment-300 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Display label, e.g. 7 December 2007"
                    value={formState.dates.birthOfMiloLabel}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        dates: {
                          ...formState.dates,
                          birthOfMiloLabel: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-parchment-300 text-xs"
                  />
                </div>

                {/* Birth of Copiko */}
                <div className="p-3 bg-parchment-50 rounded-2xl border border-parchment-200 space-y-2">
                  <label className="text-xs font-bold text-ink-800">The Birth of Copiko</label>
                  <input
                    type="date"
                    value={formState.dates.birthOfCopiko.slice(0, 10)}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        dates: {
                          ...formState.dates,
                          birthOfCopiko: `${e.target.value}T00:00:00`,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-parchment-300 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Display label, e.g. 26 July 2008"
                    value={formState.dates.birthOfCopikoLabel}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        dates: {
                          ...formState.dates,
                          birthOfCopikoLabel: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-parchment-300 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl bg-parchment-100 hover:bg-parchment-200 text-ink-700 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-ink-900 hover:bg-ink-800 text-white text-xs font-semibold shadow-md transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : null}

        {/* ========================================================================= */}
        {/* FOUNDING MEMBERS SECTION                                                  */}
        {/* ========================================================================= */}
        <div className="bg-white border border-parchment-300 rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-4 h-4 text-mukesh" />
            <h2 className="font-serif text-xl font-bold text-ink-900">Founding Members</h2>
            <span className="px-2 py-0.5 rounded-full bg-parchment-100 border border-parchment-300 text-[10px] text-ink-500 font-medium ml-1">
              2 people
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Member 1: Mukesh @ Milo Williams */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-parchment-50 to-mukesh-subtle/40 border border-mukesh-border/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-mukesh-border flex items-center justify-center text-lg font-serif font-bold text-mukesh shadow-sm">
                M
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-mukesh font-bold">Milo</div>
                <div className="text-sm font-serif font-bold text-ink-900">{profile.member1}</div>
                <div className="text-[11px] text-ink-500">Visuals, Cameras & Quiet Thought</div>
              </div>
            </div>

            {/* Member 2: Jovita Anne @ Copiko Hathaway */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-parchment-50 to-anne-subtle/40 border border-anne-border/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-anne-border flex items-center justify-center text-lg font-serif font-bold text-anne shadow-sm">
                A
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-anne font-bold">Copiko</div>
                <div className="text-sm font-serif font-bold text-ink-900">{profile.member2}</div>
                <div className="text-[11px] text-ink-500">Wanderlust, Postcards & Heart</div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* IMPORTANT DATES SECTION (PIVOTAL MOMENTS OF OUR LIFE)                      */}
        {/* ========================================================================= */}
        <div className="bg-white border border-parchment-300 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-soul" />
            <h2 className="font-serif text-xl font-bold text-ink-900">Important Dates</h2>
          </div>
          <p className="text-xs text-ink-500 mb-6 font-sans">
            The pivotal moments of our life etched into time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Entry 1: First Sight */}
            <div className="p-4 rounded-2xl bg-parchment-50 border border-parchment-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-serif font-bold text-ink-900">First Sight</div>
                <div className="text-[11px] text-ink-500 mt-0.5">The instant the world shifted</div>
              </div>
              <div className="px-3 py-1 rounded-xl bg-white border border-parchment-300 text-xs font-semibold text-mukesh shadow-sm">
                {profile.dates.firstSightLabel}
              </div>
            </div>

            {/* Entry 2: Love Origin */}
            <div className="p-4 rounded-2xl bg-parchment-50 border border-parchment-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-serif font-bold text-ink-900">Love Origin</div>
                <div className="text-[11px] text-ink-500 mt-0.5">Where our hearts intertwined</div>
              </div>
              <div className="px-3 py-1 rounded-xl bg-white border border-parchment-300 text-xs font-semibold text-soul-dark shadow-sm">
                {profile.dates.loveOriginLabel}
              </div>
            </div>

            {/* Entry 3: The Birth of Milo */}
            <div className="p-4 rounded-2xl bg-parchment-50 border border-parchment-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-serif font-bold text-ink-900">The Birth of Milo</div>
                <div className="text-[11px] text-ink-500 mt-0.5">Milo's journey into the light</div>
              </div>
              <div className="px-3 py-1 rounded-xl bg-white border border-parchment-300 text-xs font-semibold text-ink-700 shadow-sm">
                {profile.dates.birthOfMiloLabel}
              </div>
            </div>

            {/* Entry 4: The Birth of Copiko */}
            <div className="p-4 rounded-2xl bg-parchment-50 border border-parchment-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-serif font-bold text-ink-900">The Birth of Copiko</div>
                <div className="text-[11px] text-ink-500 mt-0.5">Copiko's wanderer soul born</div>
              </div>
              <div className="px-3 py-1 rounded-xl bg-white border border-parchment-300 text-xs font-semibold text-anne shadow-sm">
                {profile.dates.birthOfCopikoLabel}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

