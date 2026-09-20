import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Entry, EntrySummary, SectionType } from '../types/diary';
import { diaryService } from '../api/diaryService';
import { MukeshLogo } from '../components/logos/MukeshLogo';
import { AnneLogo } from '../components/logos/AnneLogo';
import { EntryEditorPanel } from '../components/editor/EntryEditorPanel';
import { AmbientBackground } from '../components/AmbientBackground';
import { ProfileMenu } from '../components/ProfileMenu';
import { ArrowLeft, Plus, Calendar, BookOpen, Sparkles, Feather } from 'lucide-react';

interface SectionTheming {
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  badge: string;
  btnClass: string;
  Logo: React.FC<{ size?: number; color?: string; className?: string }>;
}

const SECTION_MAP: Record<'mukesh' | 'anne', SectionTheming> = {
  mukesh: {
    title: "Mukesh's Journey",
    subtitle: 'Milo · Visuals & Film rolls',
    description: 'Frames of life through the lens, cyan seas, film rolls, and quiet contemplations.',
    accent: '#0D9488', // Teal-600
    badge: 'bg-mukesh-subtle text-mukesh border-mukesh-border',
    btnClass: 'bg-mukesh hover:bg-mukesh-dark text-white shadow-sm',
    Logo: MukeshLogo,
  },
  anne: {
    title: "Anne's Journey",
    subtitle: 'Copiko · Wanderlust & Heart',
    description: 'Wanderlust notes, handwritten memories, windswept horizons, and pink dreams.',
    accent: '#8B5CF6', // Purple-500
    badge: 'bg-anne-subtle text-anne-dark border-anne-border',
    btnClass: 'bg-anne hover:bg-anne-dark text-white shadow-sm',
    Logo: AnneLogo,
  },
};

export const JourneyPage: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();

  const section: 'mukesh' | 'anne' = sectionId === 'anne' ? 'anne' : 'mukesh';
  const config = SECTION_MAP[section];
  const Logo = config.Logo;

  const [entries, setEntries] = useState<EntrySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const data = await diaryService.listEntries(section);
      setEntries(data);
    } catch (e) {
      console.error('Failed to load entries', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, [section]);

  return (
    <div className="min-h-screen bg-parchment-100 pb-20 selection:bg-soul-border relative overflow-hidden">
      <AmbientBackground />

      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-parchment-100/90 backdrop-blur-md border-b border-parchment-300 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-parchment-300 hover:bg-parchment-200 text-xs font-semibold text-ink-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home Deck</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsEditorOpen(true)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 ${config.btnClass}`}
          >
            <Plus className="w-4 h-4" />
            <span>Add an entry</span>
          </button>

          <ProfileMenu onLogout={() => navigate('/login')} />
        </div>
      </header>

      {/* Hero Banner with Section Emblem */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6 border-b border-parchment-300/60 relative z-10">
        <div className="p-4 rounded-3xl bg-white/95 border border-parchment-300 shadow-sm backdrop-blur-sm">
          <Logo size={76} color={config.accent} />
        </div>

        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${config.badge}`}>
              <Sparkles className="w-3 h-3" />
              <span>{config.subtitle}</span>
            </span>
            <span className="text-xs text-ink-400 font-sans">
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'} recorded
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight">
            {config.title}
          </h1>
          <p className="mt-2 text-sm text-ink-600 max-w-xl font-sans leading-relaxed">
            {config.description}
          </p>
        </div>
      </section>

      {/* Main Content Area: Entries Grid or Empty State */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 relative z-10">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-7 h-7 border-2 border-soul border-t-transparent rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          /* Inviting Empty State */
          <div className="py-20 px-6 max-w-md mx-auto text-center bg-white/95 backdrop-blur-sm rounded-3xl border border-parchment-300 p-8 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-parchment-100 border border-parchment-300 flex items-center justify-center text-ink-500">
              <Feather className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-ink-900 mb-2">
              The page is waiting for your words
            </h3>
            <p className="text-xs text-ink-600 mb-6 leading-relaxed font-sans">
              Every great journey begins with a single reflection. Capture a photo, a thought, or a fleeting memory today.
            </p>
            <button
              type="button"
              onClick={() => setIsEditorOpen(true)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 ${config.btnClass}`}
            >
              <Plus className="w-4 h-4" />
              <span>Write First Entry</span>
            </button>
          </div>
        ) : (
          /* Entry Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry) => (
              <article
                key={entry.id}
                onClick={() => navigate(`/entry/${entry.id}`)}
                className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-3xl border border-parchment-300 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Cover Thumbnail */}
                  {entry.coverUrl ? (
                    <div className="h-44 w-full overflow-hidden bg-parchment-200 relative">
                      <img
                        src={entry.coverUrl}
                        alt={entry.title}
                        style={{ objectPosition: `center ${entry.coverOffsetY ?? 50}%` }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {entry.icon && (
                        <div className="absolute bottom-3 left-4 text-2xl drop-shadow">
                          {entry.icon}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-24 w-full bg-parchment-100 border-b border-parchment-200 flex items-center px-5">
                      {entry.icon ? (
                        <span className="text-3xl">{entry.icon}</span>
                      ) : (
                        <BookOpen className="w-6 h-6 text-ink-400" />
                      )}
                    </div>
                  )}

                  {/* Body Info */}
                  <div className="p-6">
                    <div className="flex items-center gap-1.5 text-xs text-ink-400 mb-2 font-sans">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    <h2 className="font-serif text-xl font-bold text-ink-900 group-hover:text-ink-950 mb-2 leading-snug line-clamp-2">
                      {entry.title}
                    </h2>

                    {entry.excerpt && (
                      <p className="text-xs text-ink-600 font-sans line-clamp-3 leading-relaxed">
                        {entry.excerpt}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-6 py-3.5 border-t border-parchment-100 bg-parchment-50/50 flex items-center justify-between text-xs font-semibold text-ink-500 group-hover:text-ink-800 transition-colors">
                  <span>Read memory</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* In-page Entry Editor Modal / Panel */}
      <EntryEditorPanel
        isOpen={isEditorOpen}
        section={section}
        onClose={() => setIsEditorOpen(false)}
        onSaved={(_newEntry) => {
          loadEntries();
        }}
      />
    </div>
  );
};
