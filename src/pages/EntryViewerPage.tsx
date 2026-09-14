import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TipTapImage from '@tiptap/extension-image';

import { Entry, SectionType, RichContentJSON } from '../types/diary';
import { diaryService } from '../api/diaryService';
import { EntryEditorPanel } from '../components/editor/EntryEditorPanel';
import { FloatingMediaLayer } from '../components/editor/MediaInsert';
import { PovToggle } from '../components/editor/PovToggle';
import { ArrowLeft, Edit3, Trash2, Calendar, BookOpen } from 'lucide-react';

const SECTION_THEMES: Record<SectionType, { name: string; accent: string; badge: string; backPath: string }> = {
  mukesh: {
    name: "Mukesh's Journey",
    accent: '#2B5B84',
    badge: 'bg-mukesh-subtle text-mukesh border-mukesh-border',
    backPath: '/journey/mukesh',
  },
  anne: {
    name: "Anne's Journey",
    accent: '#B86B77',
    badge: 'bg-anne-subtle text-anne-dark border-anne-border',
    backPath: '/journey/anne',
  },
  combined: {
    name: "Copiko & Milo's Soul",
    accent: '#C29236',
    badge: 'bg-soul-subtle text-soul-dark border-soul-border',
    backPath: '/journey/combined',
  },
};

export const EntryViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activePov, setActivePov] = useState<'copiko' | 'milo'>('copiko');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // TipTap Read-only Editor
  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2] },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: false,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TipTapImage.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: null,
  });

  const loadEntry = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await diaryService.getEntry(id);
      setEntry(data);

      if (editor) {
        if (data.section === 'combined' && data.povContent) {
          editor.commands.setContent(data.povContent[activePov] || data.content);
        } else {
          editor.commands.setContent(data.content);
        }
      }
    } catch (e) {
      console.error('Failed to load entry', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntry();
  }, [id]);

  // Sync editor content when loaded or when POV tab changes
  useEffect(() => {
    if (editor && entry) {
      if (entry.section === 'combined' && entry.povContent) {
        editor.commands.setContent(entry.povContent[activePov] || entry.content);
      } else {
        editor.commands.setContent(entry.content);
      }
    }
  }, [editor, entry, activePov]);

  const handleDelete = async () => {
    if (!entry) return;
    try {
      await diaryService.deleteEntry(entry.id);
      const theme = SECTION_THEMES[entry.section];
      navigate(theme.backPath);
    } catch (e) {
      console.error('Failed to delete entry', e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment-100 flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-soul border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-parchment-100 flex flex-col items-center justify-center px-4">
        <p className="text-lg font-serif text-ink-700 mb-4">Entry not found</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-xl bg-ink-900 text-white text-xs font-medium"
        >
          Return to Sanctuary
        </button>
      </div>
    );
  }

  const theme = SECTION_THEMES[entry.section];

  return (
    <div className="min-h-screen bg-parchment-100 pb-24 text-ink-900 selection:bg-soul-border">
      {/* Top Floating Action Bar */}
      <header className="sticky top-0 z-30 bg-parchment-100/90 backdrop-blur-md border-b border-parchment-300 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(theme.backPath)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-parchment-300 hover:bg-parchment-200 text-xs font-medium text-ink-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {theme.name}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-xl hover:bg-red-50 text-ink-400 hover:text-red-600 transition-colors"
            title="Delete Entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsEditorOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-ink-900 hover:bg-ink-800 text-white text-xs font-medium transition-all shadow-sm active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Entry</span>
          </button>
        </div>
      </header>

      {/* Main Reading Canvas */}
      <main className="max-w-4xl mx-auto mt-6 bg-white border border-parchment-300 rounded-3xl overflow-hidden shadow-sm relative">
        {/* Cover Photo Banner (with custom vertical crop offset) */}
        {entry.coverUrl && (
          <div className="w-full h-64 sm:h-80 overflow-hidden bg-parchment-200 relative">
            <img
              src={entry.coverUrl}
              alt={entry.title}
              style={{ objectPosition: `center ${entry.coverOffsetY ?? 50}%` }}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Icon & Title Header */}
        <div className="px-8 sm:px-14 pt-8 pb-4">
          {entry.icon && (
            <div className="text-4xl sm:text-5xl mb-4 select-none">
              {entry.icon}
            </div>
          )}

          <div className="flex items-center gap-2.5 mb-3">
            <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${theme.badge}`}>
              <BookOpen className="w-3 h-3" />
              <span>{theme.name}</span>
            </span>

            <div className="flex items-center gap-1 text-xs text-ink-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date(entry.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink-900 tracking-tight leading-[1.2]">
            {entry.title}
          </h1>
        </div>

        {/* Dual POV Tabs in Reader Mode (Combined Section) */}
        {entry.section === 'combined' && (
          <div className="px-8 sm:px-14">
            <PovToggle
              activePov={activePov}
              onChange={(pov) => setActivePov(pov)}
              isReadOnly={true}
            />
          </div>
        )}

        {/* Formatted Content Container */}
        <div className="relative px-8 sm:px-14 py-8 min-h-[420px]">
          {/* ProseMirror Content */}
          <div className="relative z-0">
            <EditorContent
              editor={editor}
              className="prose max-w-none text-ink-800 focus:outline-none"
            />
          </div>

          {/* Overlaid Freehand Drawing Layer */}
          {entry.drawingLayer && entry.drawingLayer.length > 50 && (
            <div className="absolute inset-0 pointer-events-none z-10">
              <img
                src={entry.drawingLayer}
                alt="Journal Sketch"
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
          )}

          {/* Floating / Draggable Media Layer */}
          <FloatingMediaLayer
            mediaItems={entry.mediaItems || []}
            isEditable={false}
          />
        </div>

        {/* Quiet footer signoff */}
        <div className="px-8 sm:px-14 py-6 border-t border-parchment-200 flex items-center justify-between text-xs text-ink-400">
          <span>Copiko & Milo Digital Diary</span>
          <span className="italic font-serif">A private memory preserved</span>
        </div>
      </main>

      {/* Edit Entry Modal Panel */}
      <EntryEditorPanel
        isOpen={isEditorOpen}
        section={entry.section}
        initialEntry={entry}
        onClose={() => setIsEditorOpen(false)}
        onSaved={(updated) => {
          setEntry(updated);
        }}
      />

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-parchment-300 shadow-xl text-center">
            <h4 className="font-serif text-lg font-bold text-ink-900 mb-2">Delete this entry?</h4>
            <p className="text-xs text-ink-600 mb-6 leading-relaxed">
              This memory will be permanently removed from your shared journal.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-parchment-100 hover:bg-parchment-200 text-ink-700 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

