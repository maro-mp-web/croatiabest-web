"use client"

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Anchor, ArrowRight, Compass, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getLocalizedUrl } from '@/lib/i18n-routes';
import { useLanguage } from '@/contexts/LanguageContext';

export default function IslandsHubClient({ islands }: { islands: any[] }) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIslands = (islands || []).filter(island => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = (island.name || '').toLowerCase();
    const nameEn = (island.nameEn || '').toLowerCase();
    const region = (island.region || '').toLowerCase();
    const desc = (island.description || '').toLowerCase();
    const descEn = (island.descriptionEn || '').toLowerCase();
    return name.includes(q) || nameEn.includes(q) || region.includes(q) || desc.includes(q) || descEn.includes(q);
  });

  // Structured Data Schema (ItemList + BreadcrumbList)
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        '@id': 'https://croatiabest.com.hr/islands#itemlist',
        name: isEn ? 'Islands in Croatia' : 'Hrvatski Otoci',
        description: isEn 
          ? 'Complete guide to the best Adriatic islands in Croatia, featuring pristine beaches, hidden coves, and maritime heritage.'
          : 'Vodič kroz sve jadranske otoke u Hrvatskoj s pregledom najljepših plaža, uvala i otočne gastronomije.',
        numberOfItems: filteredIslands.length,
        itemListElement: filteredIslands.slice(0, 50).map((island, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: isEn && island.nameEn ? island.nameEn : island.name,
          url: `https://croatiabest.com.hr/islands/${island.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://croatiabest.com.hr/islands#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: isEn ? 'Home' : 'Početna',
            item: isEn ? 'https://croatiabest.com.hr/en' : 'https://croatiabest.com.hr',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: isEn ? 'Islands' : 'Otoci',
            item: isEn ? 'https://croatiabest.com.hr/islands' : 'https://croatiabest.com.hr/otoci',
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <Navbar />

      <main className="container mx-auto px-4 md:px-6 py-10 flex-1">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 space-y-3">
          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-black tracking-widest uppercase px-5 py-1.5 text-xs rounded-full flex items-center gap-1.5">
            <Anchor className="size-3.5 text-emerald-600" />
            {isEn ? 'ADRIATIC ISLANDS' : 'JADRANSKI OTOCI'}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-headline font-black tracking-tight text-slate-900">
            {isEn ? 'Islands of ' : 'Otoci u '}<span className="text-primary italic">{isEn ? 'Croatia' : 'Hrvatskoj'}</span>
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl font-body">
            {isEn 
              ? 'Pristine beaches, hidden coves, authentic island life and crystal clear sea across the Adriatic.'
              : 'Netaknute plaže, skrivene uvale, autentičan otočki život i kristalno čisto more diljem Jadrana.'}
          </p>

          {/* Search bar */}
          <div className="relative w-full max-w-md mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input 
              type="text"
              placeholder={isEn ? "Search islands by name or region..." : "Pretraži otoke po imenu ili arhipelagu..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 rounded-full border-slate-200 bg-white shadow-sm focus:border-primary text-sm h-12"
            />
          </div>
        </div>

        {/* Islands Grid in 3 to 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredIslands.map((island) => {
            const islandName = isEn && island.nameEn ? island.nameEn : island.name;
            const islandDescription = isEn && island.descriptionEn
              ? island.descriptionEn.replace(/<[^>]*>/g, '').substring(0, 140)
              : (island.seoDescription || (island.description ? island.description.replace(/<[^>]*>/g, '').substring(0, 140) : (isEn ? 'Explore beaches, coves, gastronomy and island life.' : 'Istražite plaže, uvale, gastronomiju i otočki život.')));
            const islandUrl = getLocalizedUrl(`/islands/${island.slug}`, language);

            return (
              <Card 
                key={island.slug || island.id} 
                className="h-full overflow-hidden rounded-2xl border-slate-200/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white flex flex-col group"
              >
                {/* 1. FOTOGRAFIJA I NASLOV KAO LINK NA OTOK */}
                <Link 
                  href={islandUrl}
                  className="block relative h-48 w-full bg-slate-900 overflow-hidden cursor-pointer"
                >
                  {island.image ? (
                    <Image 
                      src={island.image} 
                      alt={islandName} 
                      fill 
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-slate-950 flex flex-col items-center justify-center p-4">
                      <Anchor className="w-10 h-10 text-emerald-400/30 mb-2" />
                      <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">
                        {isEn ? 'Photo coming soon' : 'Fotografija uskoro'}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {island.region && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-black/50 backdrop-blur-md text-emerald-300 px-2.5 py-1 rounded-full border border-white/10">
                        {island.region}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <h2 className="text-2xl font-black text-white group-hover:text-primary transition-colors leading-tight drop-shadow-md">
                      {islandName}
                    </h2>
                  </div>
                </Link>

                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Kratki opis */}
                    <Link href={islandUrl} className="block group/desc">
                      <p className="text-xs text-slate-600 line-clamp-3 mb-3 font-body leading-relaxed group-hover/desc:text-slate-900 transition-colors">
                        {islandDescription}
                      </p>
                    </Link>

                    {/* 2. ZASEBNI WIKIPEDIJA LINKOVI KOJI VODE DIREKTNO NA TU SEKCIJU */}
                    {island.wikiSections && Array.isArray(island.wikiSections) && island.wikiSections.length > 0 && (
                      <div className="mb-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {island.wikiSections.slice(0, 5).map((sec: any, idx: number) => {
                          const secTitle = (isEn && sec.titleEn) ? sec.titleEn : sec.title;
                          if (!secTitle) return null;
                          const targetAnchor = sec.id || secTitle.toLowerCase();
                          return (
                            <Link
                              key={sec.id || idx}
                              href={`${islandUrl}#wiki-section-${encodeURIComponent(targetAnchor)}`}
                              className="text-[11px] font-bold bg-slate-100 text-slate-700 hover:bg-secondary hover:text-white px-2.5 py-1 rounded-lg transition-all border border-slate-200/80 hover:border-secondary shadow-xs"
                              title={`${isEn ? 'Read section' : 'Pročitaj sekciju'}: ${secTitle}`}
                            >
                              {secTitle}
                            </Link>
                          );
                        })}
                        {island.wikiSections.length > 5 && (
                          <Link
                            href={`${islandUrl}#wiki-view`}
                            className="text-[10px] font-black text-secondary hover:underline self-center px-1"
                            title={isEn ? 'View all sections' : 'Pogledaj sva poglavlja'}
                          >
                            +{island.wikiSections.length - 5}
                          </Link>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 3. DONJA DESNA STRELICA KAO LINK ZA OTOK */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-primary text-xs font-bold mt-2">
                    <Link 
                      href={islandUrl}
                      className="flex items-center justify-between w-full hover:underline group/arrow"
                    >
                      <span className="flex items-center gap-1 font-black">
                        <Compass className="size-3.5" />
                        {isEn ? 'Explore Island' : 'Istraži otok'}
                      </span>
                      <ArrowRight className="size-3.5 transition-transform group-hover/arrow:translate-x-1" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredIslands.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 mt-6">
            <Anchor className="size-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">
              {isEn ? 'No islands found' : 'Nema pronađenih otoka'}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {isEn ? 'Try adjusting your search query.' : 'Pokušajte prilagoditi pojam pretraživanja.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
