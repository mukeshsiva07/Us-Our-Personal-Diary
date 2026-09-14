import { JSONContent } from '@tiptap/react';

export type SectionType = 'mukesh' | 'anne' | 'combined';

export type RichContentJSON = JSONContent;

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  placement: 'inline' | 'overlay';
  position?: { x: number; y: number };
  caption?: string;
}

export interface EntrySummary {
  id: string;
  section: SectionType;
  title: string;
  date: string;
  coverUrl?: string;
  coverOffsetY?: number; // 0 to 100 vertical crop offset
  icon?: string;
  excerpt?: string;
}

export interface Entry {
  id: string;
  section: SectionType;
  title: string;
  date: string;
  coverUrl?: string;
  coverOffsetY?: number; // 0 to 100 vertical crop offset
  icon?: string;
  content: RichContentJSON; // ProseMirror/TipTap JSON doc
  drawingLayer?: string; // SVG or PNG data URL
  mediaItems: MediaItem[];
  povContent?: {
    copiko: RichContentJSON;
    milo: RichContentJSON;
  }; // combined entries only
  activePov?: 'copiko' | 'milo';
}

export type EntryDraft = Omit<Entry, 'id'>;

export interface UserSession {
  username: string;
  displayName: string;
  token?: string;
  justLoggedIn?: boolean;
}

