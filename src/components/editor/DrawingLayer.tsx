import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Pen,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  Circle,
  X,
} from 'lucide-react';

interface DrawingLayerProps {
  isDrawMode: boolean;
  initialDataUrl?: string;
  onChange: (dataUrl: string) => void;
  onCloseDrawMode?: () => void;
}

const PEN_COLORS = [
  { name: 'Ink Charcoal', value: '#2A2624' },
  { name: 'Warm Indigo', value: '#2B5B84' },
  { name: 'Dusty Rose', value: '#B86B77' },
  { name: 'Muted Gold', value: '#C29236' },
  { name: 'White Chalk', value: '#FFFFFF' },
];

const STROKE_WIDTHS = [
  { label: 'Fine', size: 2 },
  { label: 'Medium', size: 4 },
  { label: 'Broad', size: 8 },
];

export const DrawingLayer: React.FC<DrawingLayerProps> = ({
  isDrawMode,
  initialDataUrl,
  onChange,
  onCloseDrawMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeTool, setActiveTool] = useState<'pen' | 'eraser'>('pen');
  const [selectedColor, setSelectedColor] = useState<string>('#C29236');
  const [strokeWidth, setStrokeWidth] = useState<number>(3);

  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Undo / Redo stacks
  const historyStackRef = useRef<string[]>([]);
  const historyStepRef = useRef<number>(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Update undo/redo button states
  const updateHistoryControls = useCallback(() => {
    setCanUndo(historyStepRef.current > 0);
    setCanRedo(historyStepRef.current < historyStackRef.current.length - 1);
  }, []);

  const pushHistorySnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');

    // Discard any redos beyond current step
    const nextStack = historyStackRef.current.slice(0, historyStepRef.current + 1);
    nextStack.push(dataUrl);
    historyStackRef.current = nextStack;
    historyStepRef.current = nextStack.length - 1;
    updateHistoryControls();
    onChange(dataUrl);
  }, [onChange, updateHistoryControls]);

  // Resize canvas to match container dimensions and high-DPI
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(rect.width, 300);
    const height = Math.max(rect.height, 400);

    // Save current content before resize
    const currentData = canvas.toDataURL('image/png');

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Restore content
      if (currentData && currentData.length > 50) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
        };
        img.src = currentData;
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Load initialDataUrl when provided
  useEffect(() => {
    if (initialDataUrl && initialDataUrl.length > 50) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.drawImage(img, 0, 0, rect.width, rect.height);

        // Seed history
        historyStackRef.current = [initialDataUrl];
        historyStepRef.current = 0;
        updateHistoryControls();
      };
      img.src = initialDataUrl;
    } else {
      // Empty canvas initial history state
      const canvas = canvasRef.current;
      if (canvas) {
        const emptyUrl = canvas.toDataURL('image/png');
        historyStackRef.current = [emptyUrl];
        historyStepRef.current = 0;
        updateHistoryControls();
      }
    }
  }, [initialDataUrl, updateHistoryControls]);

  // Coordinates helper
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawMode) return;
    const { x, y } = getCoordinates(e);
    isDrawingRef.current = true;
    lastPointRef.current = { x, y };

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);

    if (activeTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = strokeWidth * 3;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = strokeWidth;
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !isDrawMode) return;
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !lastPointRef.current) return;

    // Smooth quadratic curve interpolation
    const midX = (lastPointRef.current.x + x) / 2;
    const midY = (lastPointRef.current.y + y) / 2;
    ctx.quadraticCurveTo(lastPointRef.current.x, lastPointRef.current.y, midX, midY);
    ctx.stroke();

    lastPointRef.current = { x, y };
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    pushHistorySnapshot();
  };

  // Undo action
  const handleUndo = () => {
    if (historyStepRef.current > 0) {
      historyStepRef.current -= 1;
      const prevData = historyStackRef.current[historyStepRef.current];
      loadFromDataUrl(prevData);
      updateHistoryControls();
      onChange(prevData);
    }
  };

  // Redo action
  const handleRedo = () => {
    if (historyStepRef.current < historyStackRef.current.length - 1) {
      historyStepRef.current += 1;
      const nextData = historyStackRef.current[historyStepRef.current];
      loadFromDataUrl(nextData);
      updateHistoryControls();
      onChange(nextData);
    }
  };

  // Clear canvas
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    pushHistorySnapshot();
  };

  const loadFromDataUrl = (dataUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
    };
    img.src = dataUrl;
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-10 w-full h-full ${
        isDrawMode ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Floating Drawing Palette (visible only when draw mode is active) */}
      {isDrawMode && (
        <div className="sticky top-14 right-4 ml-auto w-fit z-30 flex items-center gap-2 p-2 bg-white/95 backdrop-blur-md rounded-2xl border border-parchment-300 shadow-xl pointer-events-auto animate-in fade-in slide-in-from-top-2">
          {/* Tool selector: Pen vs Eraser */}
          <div className="flex items-center gap-1 p-0.5 bg-parchment-100 rounded-xl border border-parchment-200">
            <button
              type="button"
              onClick={() => setActiveTool('pen')}
              className={`p-1.5 rounded-lg transition-colors ${
                activeTool === 'pen'
                  ? 'bg-white text-ink-900 shadow-sm font-semibold'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
              title="Pen Tool"
            >
              <Pen className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveTool('eraser')}
              className={`p-1.5 rounded-lg transition-colors ${
                activeTool === 'eraser'
                  ? 'bg-white text-ink-900 shadow-sm font-semibold'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
              title="Eraser Tool"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </div>

          {/* Color Palette (disabled in eraser mode) */}
          {activeTool === 'pen' && (
            <div className="flex items-center gap-1 pl-1 border-l border-parchment-200">
              {PEN_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSelectedColor(c.value)}
                  className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center ${
                    selectedColor === c.value
                      ? 'ring-2 ring-soul scale-110 border-white'
                      : 'border-parchment-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                >
                  {selectedColor === c.value && (
                    <Circle className="w-2 h-2 fill-white text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Stroke Widths */}
          <div className="flex items-center gap-1 pl-1 border-l border-parchment-200">
            {STROKE_WIDTHS.map((w) => (
              <button
                key={w.size}
                type="button"
                onClick={() => setStrokeWidth(w.size)}
                className={`px-2 py-1 text-[11px] rounded-lg transition-all ${
                  strokeWidth === w.size
                    ? 'bg-parchment-200 text-ink-900 font-bold'
                    : 'text-ink-500 hover:text-ink-900'
                }`}
                title={`${w.label} Stroke`}
              >
                {w.label}
              </button>
            ))}
          </div>

          {/* History: Undo / Redo / Clear */}
          <div className="flex items-center gap-1 pl-1 border-l border-parchment-200">
            <button
              type="button"
              onClick={handleUndo}
              disabled={!canUndo}
              className="p-1.5 rounded-lg text-ink-600 hover:text-ink-900 hover:bg-parchment-100 disabled:opacity-30"
              title="Undo Stroke"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={!canRedo}
              className="p-1.5 rounded-lg text-ink-600 hover:text-ink-900 hover:bg-parchment-100 disabled:opacity-30"
              title="Redo Stroke"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
              title="Clear Drawing Layer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Close draw mode button */}
          {onCloseDrawMode && (
            <button
              type="button"
              onClick={onCloseDrawMode}
              className="p-1.5 rounded-lg text-ink-400 hover:text-ink-800 hover:bg-parchment-100 ml-1 border-l border-parchment-200"
              title="Done Drawing"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Freehand Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className={`absolute inset-0 w-full h-full ${
          isDrawMode ? 'cursor-crosshair' : 'pointer-events-none'
        }`}
      />
    </div>
  );
};

