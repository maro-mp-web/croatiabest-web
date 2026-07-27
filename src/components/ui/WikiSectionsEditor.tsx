"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { Plus, Trash2, ArrowUp, ArrowDown, Book } from 'lucide-react';

export interface WikiSection {
  id: string;
  title: string;
  content: string;
}

interface WikiSectionsEditorProps {
  sections: WikiSection[];
  onChange: (sections: WikiSection[]) => void;
}

export function WikiSectionsEditor({ sections, onChange }: WikiSectionsEditorProps) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(sections?.length > 0 ? sections[0].id : null);

  const handleAddSection = () => {
    const newSection: WikiSection = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Nova Sekcija',
      content: ''
    };
    const newSections = sections ? [...sections, newSection] : [newSection];
    onChange(newSections);
    setActiveSectionId(newSection.id);
  };

  const handleRemoveSection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSections = (sections || []).filter(s => s.id !== id);
    onChange(newSections);
    if (activeSectionId === id) {
      setActiveSectionId(newSections.length > 0 ? newSections[0].id : null);
    }
  };

  const handleMoveUp = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0) return;
    const newSections = [...(sections || [])];
    const temp = newSections[index - 1];
    newSections[index - 1] = newSections[index];
    newSections[index] = temp;
    onChange(newSections);
  };

  const handleMoveDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === (sections || []).length - 1) return;
    const newSections = [...(sections || [])];
    const temp = newSections[index + 1];
    newSections[index + 1] = newSections[index];
    newSections[index] = temp;
    onChange(newSections);
  };

  const updateSection = (id: string, updates: Partial<WikiSection>) => {
    const newSections = (sections || []).map(s => s.id === id ? { ...s, ...updates } : s);
    onChange(newSections);
  };

  const activeSection = (sections || []).find(s => s.id === activeSectionId);
  const currentSections = sections || [];

  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-black/5 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
            <Book className="size-4 text-primary" /> Wikipedia Sekcije
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Dodajte tematske cjeline (npr. Povijest, Kultura) koje će se prikazivati kao wiki-članci.
          </p>
        </div>
        <Button 
          type="button" 
          onClick={handleAddSection} 
          className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors gap-2"
        >
          <Plus className="size-4" /> Dodaj sekciju
        </Button>
      </div>

      {currentSections.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-sm text-slate-400 font-bold">Nema dodanih sekcija.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-1/3 flex flex-col gap-2">
            {currentSections.map((section, index) => (
              <div 
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className={`
                  group flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all
                  ${activeSectionId === section.id 
                    ? 'bg-white border-primary shadow-sm' 
                    : 'bg-transparent border-transparent hover:bg-black/5'
                  }
                `}
              >
                <div className="font-bold text-sm truncate flex-1 pr-2">
                  {section.title || 'Nova Sekcija'}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: activeSectionId === section.id ? 1 : undefined }}>
                  <button type="button" onClick={(e) => handleMoveUp(index, e)} className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent" disabled={index === 0}>
                    <ArrowUp className="size-3" />
                  </button>
                  <button type="button" onClick={(e) => handleMoveDown(index, e)} className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent" disabled={index === currentSections.length - 1}>
                    <ArrowDown className="size-3" />
                  </button>
                  <button type="button" onClick={(e) => handleRemoveSection(section.id, e)} className="p-1 hover:bg-red-50 text-red-500 rounded">
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Editor Area */}
          <div className="w-full lg:w-2/3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            {activeSection && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Naziv sekcije (Taba)</label>
                  <Input 
                    value={activeSection.title}
                    onChange={(e) => updateSection(activeSection.id, { title: e.target.value })}
                    placeholder="npr. Povijest"
                    className="font-bold text-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sadržaj sekcije</label>
                  <RichTextEditor 
                    value={activeSection.content}
                    onChange={(html) => updateSection(activeSection.id, { content: html })}
                    placeholder={`Unesite sadržaj za ${activeSection.title || 'ovu sekciju'}...`}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
