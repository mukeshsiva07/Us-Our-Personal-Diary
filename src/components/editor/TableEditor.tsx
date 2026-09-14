import React from 'react';
import { Editor } from '@tiptap/react';
import { Plus, Trash2, Columns, Rows } from 'lucide-react';

interface TableEditorProps {
  editor: Editor | null;
}

export const TableEditor: React.FC<TableEditorProps> = ({ editor }) => {
  if (!editor || !editor.isActive('table')) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-parchment-300 shadow-md text-xs text-ink-700 animate-in fade-in zoom-in-95">
      <span className="px-2 font-serif text-[11px] text-ink-400 font-semibold border-r border-parchment-200">
        Table
      </span>

      <button
        type="button"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        className="p-1.5 hover:bg-parchment-100 rounded-lg flex items-center gap-1"
        title="Add Column"
      >
        <Columns className="w-3.5 h-3.5 text-ink-600" />
        <Plus className="w-2.5 h-2.5 -ml-1 text-ink-500" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().deleteColumn().run()}
        className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-1"
        title="Delete Column"
      >
        <Columns className="w-3.5 h-3.5" />
        <span className="text-[10px] -ml-0.5">✕</span>
      </button>

      <div className="w-[1px] h-4 bg-parchment-200 mx-0.5" />

      <button
        type="button"
        onClick={() => editor.chain().focus().addRowAfter().run()}
        className="p-1.5 hover:bg-parchment-100 rounded-lg flex items-center gap-1"
        title="Add Row"
      >
        <Rows className="w-3.5 h-3.5 text-ink-600" />
        <Plus className="w-2.5 h-2.5 -ml-1 text-ink-500" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().deleteRow().run()}
        className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-1"
        title="Delete Row"
      >
        <Rows className="w-3.5 h-3.5" />
        <span className="text-[10px] -ml-0.5">✕</span>
      </button>

      <div className="w-[1px] h-4 bg-parchment-200 mx-0.5" />

      <button
        type="button"
        onClick={() => editor.chain().focus().deleteTable().run()}
        className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-1"
        title="Delete Whole Table"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

