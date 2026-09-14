import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TipTapImage from '@tiptap/extension-image';

import { Entry, EntryDraft, MediaItem, SectionType, RichContentJSON } from '../../types/diary';
import { diaryService } from '../../api/diaryService';
import { CoverEditor } from './CoverEditor';
import { EditorToolbar } from './EditorToolbar';
import { DrawingLayer } from './DrawingLayer';
import { MediaInsertModal, FloatingMediaLayer } from './MediaInsert';
import { PovToggle } from './PovToggle';
import { X, Save, Calendar, Check, AlertCircle } from 'lucide-react';

interface EntryEditorPanelProps {
  isOpen: boolean;
  section: SectionType;
  initialEntry?: Entry | null;
  onClose: () => void;
  onSaved: (entry: Entry) => void;
}

const DEFAULT_EMPTY_DOC: RichContentJSON = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: '' }],
    },
  ],
};

export const EntryEditorPanel: React.FC<EntryEditorPanelProps> = ({
  isOpen,
  section,
  initialEntry,
  onClose,
  onSaved,
}) => {
  if (!isOpen) return null;

  // Metadata states
  const [title, setTitle] = useState(initialEntry?.title || '');
  const [date, setDate] = useState(initialEntry?.date || new Date().toISOString().slice(0, 10));
  const [coverUrl, setCoverUrl] = useState<string | undefined>(initialEntry?.coverUrl);
  const [coverOffsetY, setCoverOffsetY] = useState<number>(initialEntry?.coverOffsetY ?? 50);
  const [icon, setIcon] = useState<string | undefined>(initialEntry?.icon);

  // Drawing layer state
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [drawingDataUrl, setDrawingDataUrl] = useState<string>(initialEntry?.drawingLayer || '');

  // Media items state
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialEntry?.mediaItems || []);
  const [showMediaModal, setShowMediaModal] = useState(false);

  // POV states for combined section
  const [activePov, setActivePov] = useState<'copiko' | 'milo'>('copiko');
  const [copikoContent, setCopikoContent] = useState<RichContentJSON>(
    initialEntry?.povContent?.copiko || initialEntry?.content || DEFAULT_EMPTY_DOC
  );
  const [miloContent, setMiloContent] = useState<RichContentJSON>(
    initialEntry?.povContent?.milo || DEFAULT_EMPTY_DOC
  );

  // Status flags
  const [isSaving, setIsSaving] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // TipTap Editor instance
  const initialContent =
    section === 'combined'
      ? (activePov === 'copiko' ? copikoContent : miloContent)
      : (initialEntry?.content || DEFAULT_EMPTY_DOC);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TipTapImage.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      triggerAutosave(editor.getJSON());
    },
  });

  // Handle switching POV in combined section
  const handlePovChange = (newPov: 'copiko' | 'milo') => {
    if (!editor || newPov === activePov) return;

    // Save current content to active POV
    const currentJson = editor.getJSON();
    if (activePov === 'copiko') {
      setCopikoContent(currentJson);
    } else {
      setMiloContent(currentJson);
    }

    // Load next POV content
    const targetJson = newPov === 'copiko' ? copikoContent : miloContent;
    editor.commands.setContent(targetJson);
    setActivePov(newPov);
  };

  // Autosave mechanism to localStorage draft
  const autosaveTimeoutRef = useRef<number | null>(null);
  const triggerAutosave = (currentJson: RichContentJSON) => {
    setAutosaveStatus('saving');
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = window.setTimeout(() => {
      try {
        const draftKey = `copiko_milo_draft_${initialEntry?.id || 'new'}`;
        const draft = {
          title,
          date,
          coverUrl,
          coverOffsetY,
          icon,
          drawingDataUrl,
          mediaItems,
          section,
          updatedAt: Date.now(),
        };
        localStorage.setItem(draftKey, JSON.stringify(draft));
        setAutosaveStatus('saved');
        setTimeout(() => setAutosaveStatus('idle'), 2000);
      } catch (e) {
        console.error('Autosave failed', e);
      }
    }, 1200);
  };

  // Media Insertion
  const handleInsertMedia = (newItem: Omit<MediaItem, 'id'>) => {
    const item: MediaItem = {
      ...newItem,
      id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    };

    if (item.placement === 'inline' && editor) {
      // Insert inline into TipTap text flow
      if (item.type === 'image') {
        editor.chain().focus().setImage({ src: item.url, alt: item.caption }).run();
      }
    }

    setMediaItems((prev) => [...prev, item]);
  };

  const handleUpdatePosition = (id: string, pos: { x: number; y: number }) => {
    setMediaItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, position: pos } : item))
    );
  };

  const handleTogglePlacement = (id: string) => {
    setMediaItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextPlacement = item.placement === 'overlay' ? 'inline' : 'overlay';
          if (nextPlacement === 'inline' && editor && item.type === 'image') {
            editor.chain().focus().setImage({ src: item.url, alt: item.caption }).run();
          }
          return {
            ...item,
            placement: nextPlacement,
            position: nextPlacement === 'overlay' ? { x: 40, y: 150 } : undefined,
          };
        }
        return item;
      })
    );
  };

  const handleDeleteMedia = (id: string) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Final Save handler
  const handleSave = async () => {
    if (!title.trim()) {
      setErrorMessage('Please give your journal entry a title.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      let finalContent: RichContentJSON = editor ? editor.getJSON() : DEFAULT_EMPTY_DOC;
      let finalPovContent = undefined;

      if (section === 'combined') {
        const currentJson = editor ? editor.getJSON() : DEFAULT_EMPTY_DOC;
        const finalCopiko = activePov === 'copiko' ? currentJson : copikoContent;
        const finalMilo = activePov === 'milo' ? currentJson : miloContent;

        finalPovContent = {
          copiko: finalCopiko,
          milo: finalMilo,
        };
        finalContent = finalCopiko; // primary preview
      }

      const draftPayload: EntryDraft = {
        section,
        title: title.trim(),
        date,
        coverUrl,
        coverOffsetY,
        icon,
        content: finalContent,
        drawingLayer: drawingDataUrl || undefined,
        mediaItems,
        povContent: finalPovContent,
      };

      let result: Entry;
      if (initialEntry) {
        result = await diaryService.updateEntry(initialEntry.id, draftPayload);
      } else {
        result = await diaryService.createEntry(section, draftPayload);
      }

      onSaved(result);
      onClose();
    } catch (e: any) {
      setErrorMessage(e?.message || 'Failed to save entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-parchment-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Top Header / Modal Navigation Bar */}
        <div className="px-6 py-3.5 bg-parchment-50 border-b border-parchment-200 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-serif font-semibold text-ink-700">
              {initialEntry ? 'Editing Entry' : 'Compose New Entry'}
            </span>
            {autosaveStatus === 'saving' && (
              <span className="text-[11px] text-ink-400 italic">Autosaving...</span>
            )}
            {autosaveStatus === 'saved' && (
              <span className="text-[11px] text-emerald-600 flex items-center gap-1">
                <Check className="w-3 h-3" /> Draft saved
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-ink-900 hover:bg-ink-800 active:scale-95 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Entry'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-ink-500 hover:text-ink-900 hover:bg-parchment-200 transition-colors"
              title="Close editor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Editor Body */}
        <div className="flex-1 overflow-y-auto relative bg-white pb-16">
          {/* Notion-style Cover Editor */}
          <CoverEditor
            coverUrl={coverUrl}
            coverOffsetY={coverOffsetY}
            icon={icon}
            onCoverChange={(url, offY) => {
              setCoverUrl(url);
              if (typeof offY === 'number') setCoverOffsetY(offY);
            }}
            onIconChange={(newIcon) => setIcon(newIcon)}
          />

          {/* Title & Date Metadata area */}
          <div className="px-8 sm:px-12 pt-4 pb-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled Entry..."
              className="w-full font-serif text-3xl sm:text-4xl font-bold text-ink-900 placeholder:text-ink-300 focus:outline-none bg-transparent"
            />

            <div className="flex items-center gap-4 mt-3 text-xs text-ink-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-ink-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent border-b border-transparent hover:border-parchment-300 focus:border-soul focus:outline-none text-xs text-ink-600"
                />
              </div>

              {section === 'combined' && (
                <span className="px-2 py-0.5 rounded-md bg-soul-subtle text-soul-dark text-[10px] font-semibold border border-soul-border">
                  Dual POV
                </span>
              )}
            </div>

            {errorMessage && (
              <div className="mt-3 p-2.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* POV Toggle (Combined Section Only) */}
          {section === 'combined' && (
            <div className="px-8 sm:px-12">
              <PovToggle activePov={activePov} onChange={handlePovChange} />
            </div>
          )}

          {/* Rich Text Toolbar */}
          <EditorToolbar
            editor={editor}
            isDrawMode={isDrawMode}
            onToggleDraw={() => setIsDrawMode(!isDrawMode)}
            onOpenMediaModal={() => setShowMediaModal(true)}
          />

          {/* Rich Text & Drawing Overlay Container */}
          <div className="relative px-8 sm:px-12 py-6 min-h-[360px]">
            {/* TipTap Document Area */}
            <div className="relative z-0">
              <EditorContent
                editor={editor}
                className="prose max-w-none text-ink-800 focus:outline-none"
              />
            </div>

            {/* Freehand Canvas Drawing Layer */}
            <DrawingLayer
              isDrawMode={isDrawMode}
              initialDataUrl={drawingDataUrl}
              onChange={(dataUrl) => setDrawingDataUrl(dataUrl)}
              onCloseDrawMode={() => setIsDrawMode(false)}
            />

            {/* Floating / Draggable Media Layer */}
            <FloatingMediaLayer
              mediaItems={mediaItems}
              isEditable={true}
              onUpdatePosition={handleUpdatePosition}
              onTogglePlacement={handleTogglePlacement}
              onDeleteMedia={handleDeleteMedia}
            />
          </div>
        </div>
      </div>

      {/* Insert Media Dialog */}
      <MediaInsertModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        onInsertMedia={handleInsertMedia}
      />
    </div>
  );
};

