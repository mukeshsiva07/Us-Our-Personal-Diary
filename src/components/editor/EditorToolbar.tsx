import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  Heading2,
  Table as TableIcon,
  PenTool,
  Image as ImageIcon,
} from 'lucide-react';
import { TableEditor } from './TableEditor';

interface EditorToolbarProps {
  editor: Editor | null;
  isDrawMode: boolean;
  onToggleDraw: () => void;
  onOpenMediaModal: () => void;
  accentColor?: string;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  isDrawMode,
  onToggleDraw,
  onOpenMediaModal,
}) => {
  if (!editor) return null;

  const getBtnClass = (isActive: boolean) =>
    `p-2 rounded-xl text-sm transition-all duration-150 flex items-center justify-center ${
      isActive
        ? 'bg-parchment-300 text-ink-900 font-semibold shadow-inner'
        : 'text-ink-600 hover:text-ink-900 hover:bg-parchment-200/80'
    }`;

  const handleInsertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="sticky top-0 z-20 bg-parchment-50/95 backdrop-blur-md border-b border-parchment-300 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
      {/* Primary Rich Text Formats */}
      <div className="flex items-center flex-wrap gap-1">
        {/* Heading 2 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={getBtnClass(editor.isActive('heading', { level: 2 }))}
          title="Heading"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-parchment-300 mx-1" />

        {/* Inline Marks */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={getBtnClass(editor.isActive('bold'))}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={getBtnClass(editor.isActive('italic'))}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={getBtnClass(editor.isActive('underline'))}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-parchment-300 mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={getBtnClass(editor.isActive({ textAlign: 'left' }))}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={getBtnClass(editor.isActive({ textAlign: 'center' }))}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-parchment-300 mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={getBtnClass(editor.isActive('bulletList'))}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={getBtnClass(editor.isActive('orderedList'))}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={getBtnClass(editor.isActive('blockquote'))}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-parchment-300 mx-1" />

        {/* Insert Table */}
        <button
          type="button"
          onClick={handleInsertTable}
          className={getBtnClass(editor.isActive('table'))}
          title="Insert 3x3 Table"
        >
          <TableIcon className="w-4 h-4" />
        </button>

        {/* Insert Media */}
        <button
          type="button"
          onClick={onOpenMediaModal}
          className="p-2 rounded-xl text-sm text-ink-600 hover:text-ink-900 hover:bg-parchment-200/80 transition-all flex items-center gap-1.5"
          title="Insert Image or Video"
        >
          <ImageIcon className="w-4 h-4" />
          <span className="text-xs hidden sm:inline">Media</span>
        </button>
      </div>

      {/* Special Tools: Freehand Draw Mode & Contextual Table Bar */}
      <div className="flex items-center gap-2">
        <TableEditor editor={editor} />

        <button
          type="button"
          onClick={onToggleDraw}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm ${
            isDrawMode
              ? 'bg-soul text-white shadow-md'
              : 'bg-white hover:bg-parchment-200 text-ink-700 border border-parchment-300'
          }`}
          title="Sketch directly over your journal writing"
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>{isDrawMode ? 'Drawing On' : 'Freehand Draw'}</span>
        </button>
      </div>
    </div>
  );
};

