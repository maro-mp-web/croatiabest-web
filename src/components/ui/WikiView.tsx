"use client"

import React, { useState, useEffect } from 'react';

export interface WikiSection {
  id: string;
  title: string;
  content: string;
}

interface WikiViewProps {
  sections?: WikiSection[];
}

export default function WikiView({ sections }: WikiViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!sections || sections.length === 0) return;

    const handleScroll = () => {
      let currentActiveId = sections[0].id;
      for (const section of sections) {
        const element = document.getElementById(`wiki-${section.id}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            currentActiveId = section.id;
          }
        }
      }
      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  if (!sections || sections.length === 0) {
    return null;
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(`wiki-${id}`);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full relative z-30 my-8">
      <div className="flex flex-col lg:flex-row gap-12 items-start relative">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 lg:sticky lg:top-32 space-y-2 bg-slate-50 p-6 rounded-3xl border border-black/5">
          <h3 className="font-black text-lg mb-4 uppercase tracking-wider border-b border-black/5 pb-4 text-foreground/80">Sadržaj</h3>
          <ul className="space-y-1">
            {sections.map(section => (
              <li key={section.id}>
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={`
                    w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all
                    ${activeId === section.id 
                      ? 'bg-primary text-white shadow-md shadow-primary/25' 
                      : 'text-muted-foreground hover:bg-black/5 hover:text-foreground'
                    }
                  `}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div className="w-full lg:w-3/4 space-y-16 bg-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-black/5 border border-black/5">
          {sections.map((section, idx) => (
            <div key={section.id} id={`wiki-${section.id}`} className="scroll-mt-32">
              <h2 className="text-3xl md:text-4xl font-headline font-black italic tracking-tighter mb-8 text-foreground">{section.title}</h2>
              <div 
                className="prose prose-lg max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-3xl prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
              {idx < sections.length - 1 && <hr className="my-12 border-black/5" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
