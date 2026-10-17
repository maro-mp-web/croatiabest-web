"use client"

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Anchor, ArrowRight, Compass } from 'lucide-react';
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
    const region = (island.region || '').toLowerCase();
    const desc = (island.description || '').toLowerCase();
    return name.includes(q) || region.includes(q) || desc.includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
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

        {/* Islands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredIslands.map((island) => (
            <Link 
              key={island.slug || island.id} 
              href={getLocalizedUrl(`/islands/${island.slug}`, language)}
              className="group block h-full"
            >
              <Card className="h-full overflow-hidden rounded-2xl border-slate-200/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white flex flex-col">
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                  {island.image ? (
                    <Image 
                      src={island.image} 
                      alt={island.name} 
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
                      {island.name}
                    </h2>
                  </div>
                </div>

                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 font-body leading-relaxed">
                    {island.seoDescription || (island.description ? island.description.replace(/<[^>]*>/g, '').substring(0, 140) : (isEn ? 'Explore beaches, coves, gastronomy and island life.' : 'Istražite plaže, uvale, gastronomiju i otočki život.'))}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-primary text-xs font-bold">
                    <span className="flex items-center gap-1">
                      <Compass className="size-3.5" />
                      {isEn ? 'Explore Island' : 'Istraži otok'}
                    </span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
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
