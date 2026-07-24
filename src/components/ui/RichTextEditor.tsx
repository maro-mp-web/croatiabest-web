"use client"

import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, Italic, Heading2, Heading3, List, ListOrdered, 
  Quote, LinkIcon, ImageIcon, Undo, Redo, Minus 
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

function ToolbarButton({ 
  onClick, 
  isActive, 
  children, 
  title 
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  children: React.ReactNode; 
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`
        size-9 rounded-lg flex items-center justify-center transition-all duration-200
        ${isActive 
          ? 'bg-primary text-white shadow-md shadow-primary/25' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
        }
      `}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange, placeholder = 'Počnite pisati...', className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full mx-auto shadow-lg my-6',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-4 hover:text-primary/80',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor prose prose-lg max-w-none focus:outline-none min-h-[300px] px-6 py-4 font-body leading-relaxed',
      },
    },
  });

  // Update content when value changes externally (e.g., switching edit mode)
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Unesite URL slike:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Unesite URL linka:', previousUrl);
    
    if (url === null) return;
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className={`rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm ${className || ''}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-slate-100 bg-slate-50/80">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Podebljano (Bold)"
        >
          <Bold className="size-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Kurziv (Italic)"
        >
          <Italic className="size-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Naslov H2"
        >
          <Heading2 className="size-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Podnaslov H3"
        >
          <Heading3 className="size-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Nabrajanje"
        >
          <List className="size-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numerirano"
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Citat"
        >
          <Quote className="size-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        <ToolbarButton
          onClick={addLink}
          isActive={editor.isActive('link')}
          title="Dodaj link"
        >
          <LinkIcon className="size-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={addImage}
          title="Ubaci sliku (URL)"
        >
          <ImageIcon className="size-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontalna linija"
        >
          <Minus className="size-4" />
        </ToolbarButton>

        <div className="flex-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Poništi (Undo)"
        >
          <Undo className="size-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Ponovi (Redo)"
        >
          <Redo className="size-4" />
        </ToolbarButton>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
