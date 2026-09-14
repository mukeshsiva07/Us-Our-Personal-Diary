import React, { useState, useRef } from 'react';
import { Image, MoveVertical, Trash2, Smile, Upload, Check } from 'lucide-react';

interface CoverEditorProps {
  coverUrl?: string;
  coverOffsetY?: number; // 0 to 100 percentage
  icon?: string;
  onCoverChange: (url?: string, offsetY?: number) => void;
  onIconChange: (icon?: string) => void;
}

const PRESET_COVERS = [
  { label: 'Nilgiri Mist', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Kyoto Rain', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Sagres Cliffs', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Vintage Bookshelf', url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Golden Hour Dusk', url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Warm Espresso', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80' },
];

const EMOJI_PRESETS = [
  '📷', '🧭', '🏮', '☕', '🌿', '💫', '🌊', '🌸', '💍', '🎨', '🍂', '🕯️', '💌', '✈️', '✨', '📖'
];

export const CoverEditor: React.FC<CoverEditorProps> = ({
  coverUrl,
  coverOffsetY = 50,
  icon,
  onCoverChange,
  onIconChange,
}) => {
  const [isRepositioning, setIsRepositioning] = useState(false);
  const [offsetY, setOffsetY] = useState(coverOffsetY);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const dragStartRef = useRef<number | null>(null);
  const startOffsetRef = useRef<number>(coverOffsetY);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag logic for vertical repositioning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isRepositioning) return;
    dragStartRef.current = e.clientY;
    startOffsetRef.current = offsetY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (dragStartRef.current === null) return;
      const deltaY = moveEvent.clientY - dragStartRef.current;
      // Convert pixel delta to percentage shift
      const sensitivity = 0.25;
      const newOffset = Math.min(100, Math.max(0, startOffsetRef.current - deltaY * sensitivity));
      setOffsetY(newOffset);
    };

    const handleMouseUp = () => {
      dragStartRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onCoverChange(reader.result, 50);
        setOffsetY(50);
        setShowCoverPicker(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative w-full group">
      {/* Cover Image Banner */}
      {coverUrl ? (
        <div
          className={`relative w-full h-52 sm:h-64 overflow-hidden bg-parchment-200 transition-all ${
            isRepositioning ? 'cursor-grab active:cursor-grabbing select-none' : ''
          }`}
          onMouseDown={handleMouseDown}
        >
          <img
            src={coverUrl}
            alt="Cover"
            style={{ objectPosition: `center ${offsetY}%` }}
            className="w-full h-full object-cover transition-none pointer-events-none"
          />

          {/* Reposition guide hint */}
          {isRepositioning && (
            <div className="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none">
              <div className="px-4 py-1.5 rounded-full bg-black/70 text-white text-xs font-medium flex items-center gap-2 backdrop-blur-sm shadow-md">
                <MoveVertical className="w-4 h-4" />
                <span>Drag up or down to reposition cover</span>
              </div>
            </div>
          )}

          {/* Cover management controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
            {isRepositioning ? (
              <button
                type="button"
                onClick={() => {
                  setIsRepositioning(false);
                  onCoverChange(coverUrl, offsetY);
                }}
                className="px-3 py-1.5 rounded-xl bg-ink-900/90 text-white text-xs font-medium flex items-center gap-1.5 hover:bg-ink-900 shadow-md backdrop-blur-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Position</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsRepositioning(true)}
                  className="px-3 py-1.5 rounded-xl bg-white/85 hover:bg-white text-ink-800 text-xs font-medium flex items-center gap-1.5 shadow-md backdrop-blur-sm transition-all"
                  title="Reposition"
                >
                  <MoveVertical className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reposition</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCoverPicker(!showCoverPicker)}
                  className="px-3 py-1.5 rounded-xl bg-white/85 hover:bg-white text-ink-800 text-xs font-medium flex items-center gap-1.5 shadow-md backdrop-blur-sm transition-all"
                >
                  <Image className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Change Cover</span>
                </button>
                <button
                  type="button"
                  onClick={() => onCoverChange(undefined, undefined)}
                  className="p-1.5 rounded-xl bg-white/85 hover:bg-red-50 text-red-600 shadow-md backdrop-blur-sm transition-all"
                  title="Remove Cover"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Cover placeholder / Add Cover button */
        <div className="pt-6 pb-2 px-8 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowCoverPicker(true)}
            className="inline-flex items-center gap-2 text-xs font-medium text-ink-600 hover:text-ink-900 px-3 py-1.5 rounded-xl bg-parchment-100 hover:bg-parchment-200 border border-parchment-300 transition-all"
          >
            <Image className="w-4 h-4 text-ink-500" />
            <span>Add Cover Image</span>
          </button>
          {!icon && (
            <button
              type="button"
              onClick={() => setShowIconPicker(true)}
              className="inline-flex items-center gap-2 text-xs font-medium text-ink-600 hover:text-ink-900 px-3 py-1.5 rounded-xl bg-parchment-100 hover:bg-parchment-200 border border-parchment-300 transition-all"
            >
              <Smile className="w-4 h-4 text-ink-500" />
              <span>Add Icon</span>
            </button>
          )}
        </div>
      )}

      {/* Entry Icon Badge (Notion-style, sitting over cover edge or title) */}
      {icon && (
        <div className="relative px-8 -mt-6 z-10 flex items-center">
          <div className="group/icon relative">
            <button
              type="button"
              onClick={() => setShowIconPicker(!showIconPicker)}
              className="w-14 h-14 rounded-2xl bg-white border-2 border-parchment-300 shadow-md flex items-center justify-center text-3xl hover:scale-105 transition-transform"
              title="Change icon"
            >
              <span>{icon}</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onIconChange(undefined);
              }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] hidden group-hover/icon:flex items-center justify-center shadow"
              title="Remove icon"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Cover Presets & Upload Dropdown */}
      {showCoverPicker && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setShowCoverPicker(false)} />
          <div className="absolute right-4 top-16 w-80 sm:w-96 rounded-2xl bg-white border border-parchment-300 shadow-2xl p-4 z-40 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-parchment-200">
              <h4 className="text-xs font-serif font-semibold text-ink-800">Select Cover Photo</h4>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-soul font-medium flex items-center gap-1 hover:underline"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload file</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 max-h-56 overflow-y-auto pr-1">
              {PRESET_COVERS.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => {
                    onCoverChange(preset.url, 50);
                    setOffsetY(50);
                    setShowCoverPicker(false);
                  }}
                  className="group relative h-20 rounded-xl overflow-hidden border border-parchment-300 hover:border-soul focus:outline-none"
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute inset-x-0 bottom-0 py-1 px-1.5 bg-black/60 text-[10px] text-white truncate text-left">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Icon Picker Popover */}
      {showIconPicker && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setShowIconPicker(false)} />
          <div className="absolute left-8 top-16 w-64 rounded-2xl bg-white border border-parchment-300 shadow-2xl p-3 z-40 animate-in fade-in zoom-in-95">
            <h4 className="text-xs font-serif font-semibold text-ink-800 pb-2 mb-2 border-b border-parchment-200">
              Select Emblem Icon
            </h4>
            <div className="grid grid-cols-4 gap-2 text-2xl">
              {EMOJI_PRESETS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => {
                    onIconChange(em);
                    setShowIconPicker(false);
                  }}
                  className="w-12 h-12 rounded-xl hover:bg-parchment-100 flex items-center justify-center transition-colors"
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

