import React, { useState } from 'react';
import { diaryService } from '../api/diaryService';
import { User, LogOut, Heart, Sparkles, ChevronDown } from 'lucide-react';

interface ProfileMenuProps {
  onLogout?: () => void;
}

/**
 * ProfileMenu Component:
 * Extensible profile section positioned in the top-left corner.
 * Displays avatar initials, current couple session, and quick account actions.
 */
export const ProfileMenu: React.FC<ProfileMenuProps> = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const session = diaryService.getCurrentSession();

  const handleLogout = () => {
    diaryService.logout();
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="relative inline-block text-left z-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white border border-parchment-300 hover:border-parchment-400 shadow-sm transition-all duration-200 text-ink-800 focus:outline-none focus:ring-2 focus:ring-soul/30"
        title="Couple Profile"
      >
        <div className="w-8 h-8 rounded-full bg-parchment-200 border border-parchment-300 flex items-center justify-center text-xs font-serif font-bold text-ink-700 group-hover:scale-105 transition-transform">
          <span>M</span>
          <span className="text-soul font-normal text-[10px] mx-[1px]">&</span>
          <span>A</span>
        </div>

        <div className="text-left hidden sm:block">
          <div className="text-xs font-semibold text-ink-800 leading-tight flex items-center gap-1.5">
            <span>{session?.displayName || 'Mukesh & Anne'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" title="Online" />
          </div>
          <div className="text-[10px] text-ink-500 font-serif italic">Copiko & Milo</div>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-ink-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white border border-parchment-300 shadow-xl py-2 z-20 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-2 border-b border-parchment-200">
              <p className="text-[11px] uppercase tracking-wider text-ink-400 font-medium">Shared Journal</p>
              <p className="text-sm font-serif font-semibold text-ink-800">Mukesh & Anne</p>
              <p className="text-xs text-ink-500 truncate">Private Digital Sanctuary</p>
            </div>

            <div className="py-1">
              <div className="px-4 py-2 flex items-center gap-2.5 text-xs text-ink-700 hover:bg-parchment-50 cursor-pointer">
                <Heart className="w-4 h-4 text-anne" />
                <span>Our Story & Anniversaries</span>
              </div>
              <div className="px-4 py-2 flex items-center gap-2.5 text-xs text-ink-700 hover:bg-parchment-50 cursor-pointer">
                <Sparkles className="w-4 h-4 text-soul" />
                <span>Memories Archive</span>
              </div>
            </div>

            <div className="pt-1 border-t border-parchment-200">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left flex items-center gap-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Lock Diary (Log Out)</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

