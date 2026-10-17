"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export interface WikiSection {
  id: string;
  title: string;
  content: string;
  titleEn?: string;
  contentEn?: string;
}

interface WikiViewProps {
  sections?: WikiSection[];
}

export default function WikiView({ sections }: WikiViewProps) {
  const [activeId, setActiveId] = useState<string | null>(
    sections && sections.length > 0 ? sections[0].id : null
  );
  const { language } = useLanguage();
  const isEn = language === 'en';
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sections && sections.length > 0) {
      if (!activeId || !sections.some(s => s.id === activeId)) {
        setActiveId(sections[0].id);
      }
    }
  }, [sections, activeId]);

  if (!sections || sections.length === 0) {
    return null;
  }

  const activeSection = sections.find(s => s.id === activeId) || sections[0];
  const activeIndex = sections.findIndex(s => s.id === activeSection.id);

  const handleSelectSection = (id: string) => {
    setActiveId(id);

    // Instant switch without dizzying smooth scroll
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.top < 100) {
        window.scrollTo({
          top: window.scrollY + rect.top - 110,
          behavior: 'instant' as ScrollBehavior,
        });
      }
    }
  };

  const getTitle = (section: WikiSection) => {
    return (isEn && section.titleEn) ? section.titleEn : section.title;
  };

  const getContent = (section: WikiSection) => {
    return (isEn && section.contentEn) ? section.contentEn : section.content;
  };

  return (
    <div ref={containerRef} className="w-full relative z-30 my-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start relative">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 lg:sticky lg:top-32 space-y-2 bg-slate-50 p-6 rounded-3xl border border-black/5">
          <h3 className="font-black text-lg mb-4 uppercase tracking-wider border-b border-black/5 pb-4 text-foreground/80">
            {isEn ? 'Contents' : 'Sadržaj'}
          </h3>
          <ul className="space-y-1.5">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => handleSelectSection(section.id)}
                  className={`
                    w-full text-left px-4 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-between
                    ${activeId === section.id 
                      ? 'bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]' 
                      : 'text-muted-foreground hover:bg-black/5 hover:text-foreground'
                    }
                  `}
                >
                  <span className="truncate pr-2">{getTitle(section)}</span>
                  {activeId === section.id && (
                    <span className="size-2 rounded-full bg-white shrink-0" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Box (Instant switch) */}
        <div className="w-full lg:w-3/4 bg-white p-8 md:p-14 rounded-[3rem] shadow-xl shadow-black/5 border border-black/5 min-h-[500px] flex flex-col justify-between">
          <div>
            <div className="border-b border-black/5 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-primary">
                  {isEn ? `Section ${activeIndex + 1} of ${sections.length}` : `Poglavlje ${activeIndex + 1} od ${sections.length}`}
                </span>
                <h2 className="text-3xl md:text-5xl font-headline font-black italic tracking-tighter text-foreground mt-1">
                  {getTitle(activeSection)}
                </h2>
              </div>
            </div>

            <div 
              className="prose prose-lg max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-3xl prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: getContent(activeSection) }}
            />
          </div>

          {/* Next / Previous Navigation Footer */}
          {sections.length > 1 && (
            <div className="flex items-center justify-between pt-8 mt-12 border-t border-black/5 gap-4">
              {activeIndex > 0 ? (
                <button
                  type="button"
                  onClick={() => handleSelectSection(sections[activeIndex - 1].id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-foreground font-bold text-sm transition cursor-pointer"
                >
                  <ArrowLeft className="size-4" />
                  <span className="truncate max-w-[140px] sm:max-w-xs">{getTitle(sections[activeIndex - 1])}</span>
                </button>
              ) : <div />}

              {activeIndex < sections.length - 1 ? (
                <button
                  type="button"
                  onClick={() => handleSelectSection(sections[activeIndex + 1].id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-sm transition ml-auto shadow-md shadow-primary/20 cursor-pointer"
                >
                  <span className="truncate max-w-[140px] sm:max-w-xs">{getTitle(sections[activeIndex + 1])}</span>
                  <ArrowRight className="size-4" />
                </button>
              ) : <div />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
