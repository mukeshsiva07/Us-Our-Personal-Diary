import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { diaryService } from '../api/diaryService';
import { profileService, CoupleProfile } from '../api/profileService';
import { User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';

interface ProfileMenuProps {
  onLogout?: () => void;
}

/**
 * ProfileMenu Component:
 * Placed in the top-right corner.
 * Dropdown contains:
 * 1. "View Profile" (colored cyan/teal contextual style) -> /profile
 * 2. "Dashboard" (colored orange/amber contextual style) -> /dashboard
 * 3. "Log out" (colored rose/red contextual style) -> log out
 */
export const ProfileMenu: React.FC<ProfileMenuProps> = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<CoupleProfile>(profileService.getProfile());
  const navigate = useNavigate();

  useEffect(() => {
    const handleUpdate = () => setProfile(profileService.getProfile());
    window.addEventListener('profile_updated', handleUpdate);
    return () => window.removeEventListener('profile_updated', handleUpdate);
  }, []);

  const handleLogout = () => {
    diaryService.logout();
    if (onLogout) {
      onLogout();
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="relative inline-block text-right z-30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-parchment-300 hover:border-soul/50 shadow-sm hover:shadow-md transition-all duration-200 text-ink-800 focus:outline-none focus:ring-2 focus:ring-soul/30 backdrop-blur-sm"
        title="Couple Profile & Menu"
      >
        {/* Couple Initials with gradient ring */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-mukesh-cyan/20 via-soul/20 to-anne-pink/20 border border-parchment-300 flex items-center justify-center text-xs font-serif font-bold text-ink-800 group-hover:scale-105 transition-transform">
          <span className="text-mukesh">M</span>
          <span className="text-soul font-normal text-[10px] mx-[1px]">&</span>
          <span className="text-anne">A</span>
        </div>

        <div className="text-left hidden sm:block">
          <div className="text-xs font-semibold text-ink-800 leading-tight flex items-center gap-1.5">
            <span>{profile.username}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" title="Entwined" />
          </div>
          <div className="text-[10px] text-soul-dark font-serif font-medium italic">
            {profile.relationshipStatus}
          </div>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-ink-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-md border border-parchment-300 shadow-2xl py-2 z-30 animate-in fade-in zoom-in-95 duration-150 text-left">
            {/* Header info */}
            <div className="px-4 py-2.5 border-b border-parchment-200 bg-parchment-50/60 rounded-t-2xl">
              <p className="text-[10px] uppercase tracking-wider text-ink-400 font-semibold">
                Sanctuary Account
              </p>
              <p className="text-sm font-serif font-bold text-ink-900 mt-0.5">
                {profile.username}
              </p>
              <p className="text-[11px] text-ink-500 truncate">
                Created: {profile.accountCreated}
              </p>
            </div>

            {/* Dropdown Options Contextually Colored */}
            <div className="py-1.5 space-y-0.5 px-1.5">
              {/* Option 1: View Profile (Teal/Cyan themed) */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/profile');
                }}
                className="w-full px-3 py-2 rounded-xl flex items-center gap-3 text-xs font-semibold text-mukesh-dark hover:bg-mukesh-subtle hover:text-mukesh transition-all group"
              >
                <div className="p-1.5 rounded-lg bg-mukesh-subtle text-mukesh border border-mukesh-border group-hover:scale-105 transition-transform">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-ink-800 group-hover:text-mukesh">View Profile</div>
                  <div className="text-[10px] text-ink-400 font-normal">Founding members & live timeline</div>
                </div>
              </button>

              {/* Option 2: Dashboard (Orange/Amber themed) */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/dashboard');
                }}
                className="w-full px-3 py-2 rounded-xl flex items-center gap-3 text-xs font-semibold text-soul-dark hover:bg-soul-subtle hover:text-soul transition-all group"
              >
                <div className="p-1.5 rounded-lg bg-soul-subtle text-soul border border-soul-border group-hover:scale-105 transition-transform">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-ink-800 group-hover:text-soul">Dashboard</div>
                  <div className="text-[10px] text-ink-400 font-normal">Memories analytics & counters</div>
                </div>
              </button>
            </div>

            {/* Option 3: Log Out (Rose/Red themed) */}
            <div className="pt-1.5 border-t border-parchment-200 px-1.5">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-3 py-2 rounded-xl flex items-center gap-3 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all group"
              >
                <div className="p-1.5 rounded-lg bg-red-50 text-red-500 border border-red-200 group-hover:scale-105 transition-transform">
                  <LogOut className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-red-600">Log out</div>
                  <div className="text-[10px] text-red-400 font-normal">Lock private diary session</div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
