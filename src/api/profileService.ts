export interface ImportantDates {
  firstSight: string;       // e.g. "2026-03-07"
  firstSightLabel: string;  // e.g. "7 March 2026"
  loveOrigin: string;       // e.g. "2026-04-04"
  loveOriginLabel: string;  // e.g. "4 April 2026"
  birthOfMilo: string;      // e.g. "2007-12-07"
  birthOfMiloLabel: string; // e.g. "7 December 2007"
  birthOfCopiko: string;    // e.g. "2008-07-26"
  birthOfCopikoLabel: string; // e.g. "26 July 2008"
}

export interface CoupleProfile {
  username: string;
  accountCreated: string;
  member1: string;          // "Mukesh @ Milo Williams"
  member2: string;          // "Jovita Anne @ Copiko Hathaway"
  relationshipStatus: string; // "Entwined"
  dates: ImportantDates;
}

const PROFILE_STORAGE_KEY = 'copiko_milo_couple_profile_v1';

const DEFAULT_PROFILE: CoupleProfile = {
  username: 'muke_jovi',
  accountCreated: '14 September 2026',
  member1: 'Mukesh @ Milo Williams',
  member2: 'Jovita Anne @ Copiko Hathaway',
  relationshipStatus: 'Entwined',
  dates: {
    firstSight: '2026-03-07T00:00:00',
    firstSightLabel: '7 March 2026',
    loveOrigin: '2026-04-04T00:00:00',
    loveOriginLabel: '4 April 2026',
    birthOfMilo: '2007-12-07T00:00:00',
    birthOfMiloLabel: '7 December 2007',
    birthOfCopiko: '2008-07-26T00:00:00',
    birthOfCopikoLabel: '26 July 2008',
  },
};

export const profileService = {
  getProfile(): CoupleProfile {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
        return DEFAULT_PROFILE;
      }
      return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(updated: CoupleProfile): CoupleProfile {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
      // Dispatch custom event for real-time reactivity across components
      window.dispatchEvent(new Event('profile_updated'));
    } catch (e) {
      console.error('Failed to save couple profile', e);
    }
    return updated;
  },

  /**
   * Calculates hours and detailed elapsed time from a given date string to now.
   */
  calculateElapsed(dateStr: string): {
    totalHours: number;
    hoursDisplay: string;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  } {
    const target = new Date(dateStr).getTime();
    const now = Date.now();
    const diffMs = now - target;
    const isPast = diffMs >= 0;
    const absDiffMs = Math.abs(diffMs);

    const totalHours = absDiffMs / (1000 * 60 * 60);
    const totalSeconds = Math.floor(absDiffMs / 1000);

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      totalHours: Math.floor(totalHours),
      hoursDisplay: Math.floor(totalHours).toLocaleString(),
      days,
      hours,
      minutes,
      seconds,
      isPast,
    };
  },
};

