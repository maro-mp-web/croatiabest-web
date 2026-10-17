"use client"

import React, { useState, useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading2, Heading3, Heading4, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Code, 
  LinkIcon, ImageIcon, Minus, RemoveFormatting,
  Table as TableIcon, Trash2, Rows, Columns, Split, Merge,
  Undo, Redo, Maximize2, Minimize2, ChevronDown
} from 'lucide-react';
import { MediaLibraryModal } from '@/components/media/MediaLibraryModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  title,
  disabled
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  children: React.ReactNode; 
  title: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        size-9 rounded-lg flex items-center justify-center transition-all duration-150 shrink-0
        ${disabled ? 'opacity-30 cursor-not-allowed text-slate-300' : ''}
        ${isActive 
          ? 'bg-primary text-white shadow-sm shadow-primary/25 font-bold' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-95'
        }
      `}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange, placeholder = 'Počnite pisati...', className }: RichTextEditorProps) {
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: {
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-primary underline underline-offset-4 hover:text-primary/80 font-medium',
          },
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'tiptap-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full mx-auto shadow-lg my-6',
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
        class: 'tiptap-editor prose prose-lg max-w-none focus:outline-none min-h-[360px] px-6 py-5 font-body leading-relaxed',
      },
    },
  });

  // Update content when value changes externally (e.g., switching edit mode or language tab)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Handle escape key to exit fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const addImage = useCallback(() => {
    setIsMediaModalOpen(true);
  }, []);

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

  const insertTable = useCallback((rows = 3, cols = 3) => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
  }, [editor]);

  if (!editor) return null;

  const plainText = editor.getText();
  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const charCount = plainText.length;
  const isTableActive = editor.isActive('table');

  return (
    <div 
      className={`
        transition-all duration-200
        ${isFullscreen 
          ? 'fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex flex-col p-2 sm:p-6 overflow-y-auto' 
          : 'relative rounded-2xl border border-slate-200 bg-white shadow-sm'
        }
        ${className || ''}
      `}
    >
      <div className={isFullscreen ? 'max-w-5xl w-full mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col my-auto border border-slate-200 overflow-hidden min-h-[85vh]' : 'flex flex-col'}>
        {/* Sticky Toolbar */}
        <div 
          className={`
            sticky z-30 transition-all duration-150
            bg-white/95 backdrop-blur-md border-b border-slate-200/90
            px-3 py-2 rounded-t-2xl shadow-xs
            ${isFullscreen ? 'top-0 !rounded-none shadow-sm px-4 py-2.5' : 'top-20'}
          `}
        >
          <div className="flex flex-wrap items-center gap-1">
            {/* History */}
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Poništi (Ctrl+Z)"
            >
              <Undo className="size-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Ponovi (Ctrl+Y)"
            >
              <Redo className="size-4" />
            </ToolbarButton>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            {/* Basic Typography */}
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

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
              title="Podcrtano (Underline)"
            >
              <UnderlineIcon className="size-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              title="Precrtano (Strikethrough)"
            >
              <Strikethrough className="size-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive('code')}
              title="Inline kôd"
            >
              <Code className="size-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
              title="Očisti formatiranje"
            >
              <RemoveFormatting className="size-4" />
            </ToolbarButton>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            {/* Headings */}
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

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
              isActive={editor.isActive('heading', { level: 4 })}
              title="Manji naslov H4"
            >
              <Heading4 className="size-4" />
            </ToolbarButton>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            {/* Alignments */}
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              isActive={editor.isActive({ textAlign: 'left' })}
              title="Poravnaj lijevo"
            >
              <AlignLeft className="size-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              isActive={editor.isActive({ textAlign: 'center' })}
              title="Poravnaj po sredini"
            >
              <AlignCenter className="size-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              isActive={editor.isActive({ textAlign: 'right' })}
              title="Poravnaj desno"
            >
              <AlignRight className="size-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              isActive={editor.isActive({ textAlign: 'justify' })}
              title="Obostrano poravnanje (Justify)"
            >
              <AlignJustify className="size-4" />
            </ToolbarButton>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            {/* Lists & Quotes */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Nabrajanje (Lista)"
            >
              <List className="size-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numerirani popis"
            >
              <ListOrdered className="size-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Citat (Blockquote)"
            >
              <Quote className="size-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Horizontalna razdjelna linija"
            >
              <Minus className="size-4" />
            </ToolbarButton>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            {/* Media & Links */}
            <ToolbarButton
              onClick={addLink}
              isActive={editor.isActive('link')}
              title="Dodaj ili uredi poveznicu"
            >
              <LinkIcon className="size-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={addImage}
              title="Ubaci sliku (Medijska zbirka)"
            >
              <ImageIcon className="size-4" />
            </ToolbarButton>

            {/* Table Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  title="Upravljanje tablicama"
                  className={`
                    h-9 px-2.5 rounded-lg flex items-center gap-1.5 transition-all duration-150 shrink-0 text-sm font-semibold
                    ${isTableActive 
                      ? 'bg-primary text-white shadow-sm shadow-primary/25' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-95'
                    }
                  `}
                >
                  <TableIcon className="size-4" />
                  <span className="hidden sm:inline">Tablica</span>
                  <ChevronDown className="size-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-1.5 rounded-xl shadow-xl border border-slate-200 bg-white">
                {!isTableActive ? (
                  <>
                    <DropdownMenuItem 
                      onClick={() => insertTable(3, 3)} 
                      className="cursor-pointer py-2 px-3 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center gap-2"
                    >
                      <TableIcon className="size-4 text-primary" />
                      Ubaci tablicu (3x3)
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => insertTable(2, 2)} 
                      className="cursor-pointer py-2 px-3 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center gap-2"
                    >
                      <TableIcon className="size-4 text-slate-500" />
                      Ubaci tablicu (2x2)
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => insertTable(4, 4)} 
                      className="cursor-pointer py-2 px-3 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center gap-2"
                    >
                      <TableIcon className="size-4 text-slate-500" />
                      Ubaci tablicu (4x4)
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem 
                      onClick={() => editor.chain().focus().addRowBefore().run()}
                      className="cursor-pointer py-2 px-3 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center gap-2"
                    >
                      <Rows className="size-4 text-slate-500" />
                      Dodaj redak iznad
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => editor.chain().focus().addRowAfter().run()}
                      className="cursor-pointer py-2 px-3 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center gap-2"
                    >
                      <Rows className="size-4 text-slate-500" />
                      Dodaj redak ispod
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => editor.chain().focus().deleteRow().run()}
                      className="cursor-pointer py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-50 text-red-600 flex items-center gap-2"
                    >
                      <Trash2 className="size-4" />
                      Obriši redak
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator className="my-1 bg-slate-100" />

                    <DropdownMenuItem 
                      onClick={() => editor.chain().focus().addColumnBefore().run()}
                      className="cursor-pointer py-2 px-3 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center gap-2"
                    >
                      <Columns className="size-4 text-slate-500" />
                      Dodaj stupac lijevo
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => editor.chain().focus().addColumnAfter().run()}
                      className="cursor-pointer py-2 px-3 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center gap-2"
                    >
                      <Columns className="size-4 text-slate-500" />
                      Dodaj stupac desno
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => editor.chain().focus().deleteColumn().run()}
                      className="cursor-pointer py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-50 text-red-600 flex items-center gap-2"
                    >
                      <Trash2 className="size-4" />
                      Obriši stupac
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1 bg-slate-100" />

                    <DropdownMenuItem 
                      onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                      className="cursor-pointer py-2 px-3 rounded-lg text-sm font-medium hover:bg-slate-100"
                    >
                      Uključi / isključi zaglavlje
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => editor.chain().focus().mergeCells().run()}
                      className="cursor-pointer py-2 px-3 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center gap-2"
                    >
                      <Merge className="size-4 text-slate-500" />
                      Spoji odabrane ćelije
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => editor.chain().focus().splitCell().run()}
                      className="cursor-pointer py-2 px-3 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center gap-2"
                    >
                      <Split className="size-4 text-slate-500" />
                      Razdvoji ćeliju
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1 bg-slate-100" />

                    <DropdownMenuItem 
                      onClick={() => {
                        if (window.confirm('Želite li sigurno ukloniti cijelu tablicu?')) {
                          editor.chain().focus().deleteTable().run();
                        }
                      }}
                      className="cursor-pointer py-2 px-3 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="size-4 text-red-600" />
                      Obriši cijelu tablicu
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex-1" />

            {/* Fullscreen Toggle */}
            <ToolbarButton
              onClick={() => setIsFullscreen(prev => !prev)}
              isActive={isFullscreen}
              title={isFullscreen ? "Izađi iz punog zaslona (Esc)" : "Puni zaslon za pisanje bez ometanja"}
            >
              {isFullscreen ? <Minimize2 className="size-4 text-primary" /> : <Maximize2 className="size-4" />}
            </ToolbarButton>
          </div>
        </div>

        {/* Dedicated Contextual Sub-bar for Table when active */}
        {isTableActive && (
          <div className={`sticky ${isFullscreen ? 'top-[53px]' : 'top-[128px]'} z-25 flex flex-wrap items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-50 via-slate-50 to-blue-50 border-b border-slate-200 text-xs shadow-xs transition-all`}>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 mr-2">
              <span className="inline-block size-2 rounded-full bg-primary animate-pulse" />
              <span>Tablica:</span>
            </div>

            <button
              type="button"
              onClick={() => editor.chain().focus().addRowBefore().run()}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 hover:text-slate-900 transition shadow-2xs flex items-center gap-1"
              title="Dodaj redak iznad trenutnog"
            >
              <Rows className="size-3 text-slate-500" /> + Redak gore
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 hover:text-slate-900 transition shadow-2xs flex items-center gap-1"
              title="Dodaj redak ispod trenutnog"
            >
              <Rows className="size-3 text-slate-500" /> + Redak dolje
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="px-2.5 py-1 bg-white hover:bg-red-50 border border-red-200 text-red-600 rounded-lg font-medium transition shadow-2xs flex items-center gap-1"
              title="Obriši trenutni redak"
            >
              ✕ Redak
            </button>

            <div className="w-px h-4 bg-slate-300 mx-1" />

            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 hover:text-slate-900 transition shadow-2xs flex items-center gap-1"
              title="Dodaj stupac lijevo"
            >
              <Columns className="size-3 text-slate-500" /> + Stupac lijevo
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 hover:text-slate-900 transition shadow-2xs flex items-center gap-1"
              title="Dodaj stupac desno"
            >
              <Columns className="size-3 text-slate-500" /> + Stupac desno
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="px-2.5 py-1 bg-white hover:bg-red-50 border border-red-200 text-red-600 rounded-lg font-medium transition shadow-2xs flex items-center gap-1"
              title="Obriši trenutni stupac"
            >
              ✕ Stupac
            </button>

            <div className="w-px h-4 bg-slate-300 mx-1" />

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeaderRow().run()}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 hover:text-slate-900 transition shadow-2xs"
              title="Uključi / isključi zaglavlje tablice"
            >
              Zaglavlje
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().mergeCells().run()}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 hover:text-slate-900 transition shadow-2xs flex items-center gap-1"
              title="Spoji odabrane ćelije"
            >
              <Merge className="size-3 text-slate-500" /> Spoji
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().splitCell().run()}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 hover:text-slate-900 transition shadow-2xs flex items-center gap-1"
              title="Razdvoji prethodno spojenu ćeliju"
            >
              <Split className="size-3 text-slate-500" /> Razdvoji
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Želite li sigurno ukloniti cijelu tablicu?')) {
                  editor.chain().focus().deleteTable().run();
                }
              }}
              className="ml-auto px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition flex items-center gap-1 shadow-xs"
              title="Obriši cijelu tablicu"
            >
              <Trash2 className="size-3" /> Obriši tablicu
            </button>
          </div>
        )}

        {/* Editor Content */}
        <div className="flex-1 bg-white overflow-x-auto">
          <EditorContent editor={editor} />
        </div>

        {/* Word & Character Count Footer */}
        <div className="px-5 py-2.5 bg-slate-50/90 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 font-medium rounded-b-2xl">
          <div className="flex items-center gap-4">
            <span>Riječi: <strong className="text-slate-700 font-bold">{wordCount}</strong></span>
            <span>Znakova: <strong className="text-slate-700 font-bold">{charCount}</strong></span>
            <span>Procjena čitanja: <strong className="text-slate-700 font-bold">{Math.max(1, Math.ceil(wordCount / 200))} min</strong></span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            {isTableActive && (
              <span className="text-primary font-semibold flex items-center gap-1">
                <TableIcon className="size-3" /> Uređivanje tablice (Tab za sljedeću ćeliju)
              </span>
            )}
            {isFullscreen && (
              <span className="bg-slate-200/70 text-slate-600 px-2 py-0.5 rounded font-mono">
                Pritisnite Esc za izlaz
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Media Library Selector Modal */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(url) => {
          editor?.chain().focus().setImage({ src: url }).run();
        }}
        title="Odaberi sliku iz medijske zbirke"
      />
    </div>
  );
}
