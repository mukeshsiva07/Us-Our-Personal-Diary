import React, { useState, useRef } from 'react';
import { MediaItem } from '../../types/diary';
import { diaryService } from '../../api/diaryService';
import {
  Upload,
  Link,
  Layers,
  AlignLeft,
  X,
  Play,
  Trash2,
  Move,
  Film,
  Image as ImageIcon,
} from 'lucide-react';

interface MediaInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertMedia: (item: Omit<MediaItem, 'id'>) => void;
}

export const MediaInsertModal: React.FC<MediaInsertModalProps> = ({
  isOpen,
  onClose,
  onInsertMedia,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [placement, setPlacement] = useState<'inline' | 'overlay'>('inline');
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploaded = await diaryService.uploadMedia(file);
      onInsertMedia({
        url: uploaded.url,
        type: uploaded.type,
        placement,
        caption: caption.trim() || undefined,
        position: placement === 'overlay' ? { x: 40, y: 150 } : undefined,
      });
      onClose();
    } catch (err) {
      console.error('Failed to upload file', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    onInsertMedia({
      url: urlInput.trim(),
      type: mediaType,
      placement,
      caption: caption.trim() || undefined,
      position: placement === 'overlay' ? { x: 40, y: 150 } : undefined,
    });
    setUrlInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl border border-parchment-300 shadow-2xl p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-ink-400 hover:text-ink-800 hover:bg-parchment-100"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <h3 className="font-serif text-xl font-bold text-ink-900">Insert Media</h3>
          <p className="text-xs text-ink-500 mt-1 font-sans">
            Add photography or video memory into your journal entry.
          </p>
        </div>

        {/* Tab Switcher: Upload vs URL */}
        <div className="flex rounded-xl bg-parchment-100 p-1 mb-5 border border-parchment-200">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'upload'
                ? 'bg-white text-ink-900 shadow-sm font-semibold'
                : 'text-ink-500 hover:text-ink-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'url'
                ? 'bg-white text-ink-900 shadow-sm font-semibold'
                : 'text-ink-500 hover:text-ink-900'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Image / Video Link</span>
          </button>
        </div>

        {/* Placement Mode Selection (Word-style layout options) */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-ink-700 mb-2">
            Placement Style (Word Layout)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPlacement('inline')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                placement === 'inline'
                  ? 'border-soul bg-soul-subtle text-ink-900 ring-2 ring-soul/20'
                  : 'border-parchment-300 hover:border-parchment-400 bg-parchment-50 text-ink-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-ink-900">
                <AlignLeft className="w-4 h-4 text-soul" />
                <span>In line with text</span>
              </div>
              <p className="text-[11px] text-ink-500 leading-snug">
                Sits within the text flow alongside your prose.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setPlacement('overlay')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                placement === 'overlay'
                  ? 'border-soul bg-soul-subtle text-ink-900 ring-2 ring-soul/20'
                  : 'border-parchment-300 hover:border-parchment-400 bg-parchment-50 text-ink-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-ink-900">
                <Layers className="w-4 h-4 text-soul" />
                <span>Overlay / Floating</span>
              </div>
              <p className="text-[11px] text-ink-500 leading-snug">
                Freely draggable anywhere over the page.
              </p>
            </button>
          </div>
        </div>

        {/* Caption */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-ink-700 mb-1.5">
            Caption (Optional)
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. Taken on the ridge with the 35mm lens"
            className="w-full px-3.5 py-2 rounded-xl bg-parchment-50 border border-parchment-300 text-xs text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-soul/30"
          />
        </div>

        {/* Content based on Tab */}
        {activeTab === 'upload' ? (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,video/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full py-8 border-2 border-dashed border-parchment-300 hover:border-soul rounded-2xl flex flex-col items-center justify-center gap-2 bg-parchment-50 hover:bg-soul-subtle/30 transition-all text-ink-600 group"
            >
              {isUploading ? (
                <div className="w-6 h-6 border-2 border-soul border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <div className="p-3 rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5 text-soul" />
                  </div>
                  <span className="text-xs font-semibold text-ink-800">
                    Click to browse photo or video
                  </span>
                  <span className="text-[10px] text-ink-400">
                    PNG, JPG, WEBP, MP4, MOV up to 50MB
                  </span>
                </>
              )}
            </button>
          </div>
        ) : (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMediaType('image')}
                className={`flex-1 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 border transition-all ${
                  mediaType === 'image'
                    ? 'border-soul bg-soul-subtle text-ink-900'
                    : 'border-parchment-300 text-ink-500'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Image Link</span>
              </button>
              <button
                type="button"
                onClick={() => setMediaType('video')}
                className={`flex-1 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 border transition-all ${
                  mediaType === 'video'
                    ? 'border-soul bg-soul-subtle text-ink-900'
                    : 'border-parchment-300 text-ink-500'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Video Link</span>
              </button>
            </div>

            <div>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={
                  mediaType === 'image'
                    ? 'https://images.unsplash.com/photo...'
                    : 'https://example.com/video.mp4'
                }
                required
                className="w-full px-3.5 py-2 rounded-xl bg-parchment-50 border border-parchment-300 text-xs text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-soul/30"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-ink-900 hover:bg-ink-800 text-white text-xs font-medium transition-colors"
            >
              Insert Media Item
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

interface FloatingMediaLayerProps {
  mediaItems: MediaItem[];
  isEditable: boolean;
  onUpdatePosition?: (id: string, pos: { x: number; y: number }) => void;
  onTogglePlacement?: (id: string) => void;
  onDeleteMedia?: (id: string) => void;
}

export const FloatingMediaLayer: React.FC<FloatingMediaLayerProps> = ({
  mediaItems,
  isEditable,
  onUpdatePosition,
  onTogglePlacement,
  onDeleteMedia,
}) => {
  const overlayItems = mediaItems.filter((item) => item.placement === 'overlay');

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; initialX: number; initialY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent, item: MediaItem) => {
    if (!isEditable) return;
    setDraggingId(item.id);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: item.position?.x ?? 50,
      initialY: item.position?.y ?? 100,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragStartRef.current) return;
      const deltaX = moveEvent.clientX - dragStartRef.current.mouseX;
      const deltaY = moveEvent.clientY - dragStartRef.current.mouseY;
      const newX = Math.max(0, dragStartRef.current.initialX + deltaX);
      const newY = Math.max(0, dragStartRef.current.initialY + deltaY);

      if (onUpdatePosition) {
        onUpdatePosition(item.id, { x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setDraggingId(null);
      dragStartRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  if (overlayItems.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {overlayItems.map((item) => {
        const posX = item.position?.x ?? 50;
        const posY = item.position?.y ?? 100;

        return (
          <div
            key={item.id}
            style={{
              transform: `translate3d(${posX}px, ${posY}px, 0)`,
            }}
            className={`absolute top-0 left-0 w-64 sm:w-72 bg-white/95 backdrop-blur-sm rounded-2xl border border-parchment-300 shadow-xl overflow-hidden pointer-events-auto transition-shadow ${
              draggingId === item.id ? 'shadow-2xl ring-2 ring-soul cursor-grabbing' : ''
            }`}
          >
            {/* Draggable header bar in edit mode */}
            {isEditable && (
              <div
                onMouseDown={(e) => handleMouseDown(e, item)}
                className="px-3 py-1.5 bg-parchment-100 border-b border-parchment-200 flex items-center justify-between text-[11px] text-ink-600 cursor-grab select-none active:cursor-grabbing"
              >
                <div className="flex items-center gap-1.5 font-medium">
                  <Move className="w-3.5 h-3.5 text-soul" />
                  <span>Floating Media</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onTogglePlacement && onTogglePlacement(item.id)}
                    className="p-1 hover:bg-parchment-200 rounded text-ink-500 hover:text-ink-800"
                    title="Change to In-line"
                  >
                    <AlignLeft className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteMedia && onDeleteMedia(item.id)}
                    className="p-1 hover:bg-red-50 rounded text-red-500"
                    title="Remove item"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Media Content */}
            <div className="relative group">
              {item.type === 'video' ? (
                <video
                  src={item.url}
                  controls
                  className="w-full h-auto max-h-48 object-cover rounded-b-xl"
                />
              ) : (
                <img
                  src={item.url}
                  alt={item.caption || 'Memory item'}
                  className="w-full h-auto max-h-48 object-cover rounded-b-xl"
                />
              )}

              {item.caption && (
                <div className="p-2.5 text-[11px] text-ink-600 font-sans italic border-t border-parchment-100 bg-white">
                  {item.caption}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

