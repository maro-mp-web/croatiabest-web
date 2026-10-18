"use client"

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Building2, ArrowRight, Compass, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getLocalizedUrl } from '@/lib/i18n-routes';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CitiesHubClient({ cities }: { cities: any[] }) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCities = (cities || []).filter(city => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = (city.name || '').toLowerCase();
    const nameEn = (city.nameEn || '').toLowerCase();
    const region = (city.region || '').toLowerCase();
    const desc = (city.description || '').toLowerCase();
    const descEn = (city.descriptionEn || '').toLowerCase();
    return name.includes(q) || nameEn.includes(q) || region.includes(q) || desc.includes(q) || descEn.includes(q);
  });

  // Structured Data Schema (ItemList + BreadcrumbList)
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        '@id': 'https://croatiabest.com.hr/cities#itemlist',
        name: isEn ? 'Cities in Croatia' : 'Gradovi u Hrvatskoj',
        description: isEn 
          ? 'Comprehensive guide to cities across Croatia, featuring historic sights, gastronomy, and cultural heritage.'
          : 'Vodič kroz sve gradove u Hrvatskoj s pregledom znamenitosti, gastronomije i kulturne baštine.',
        numberOfItems: filteredCities.length,
        itemListElement: filteredCities.slice(0, 50).map((city, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: isEn && city.nameEn ? city.nameEn : city.name,
          url: `https://croatiabest.com.hr/cities/${city.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://croatiabest.com.hr/cities#breadcrumb',
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
            name: isEn ? 'Cities' : 'Gradovi',
            item: isEn ? 'https://croatiabest.com.hr/cities' : 'https://croatiabest.com.hr/gradovi',
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
          <Badge className="bg-primary/10 text-primary border border-primary/20 font-black tracking-widest uppercase px-5 py-1.5 text-xs rounded-full flex items-center gap-1.5">
            <Building2 className="size-3.5 text-primary" />
            {isEn ? 'URBAN DESTINATIONS' : 'URBANE DESTINACIJE'}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-headline font-black tracking-tight text-slate-900">
            {isEn ? 'Cities of ' : 'Gradovi u '}<span className="text-primary italic">{isEn ? 'Croatia' : 'Hrvatskoj'}</span>
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl font-body">
            {isEn 
              ? 'Discover historic streets, vibrant culture, world-class gastronomy and the best locations in Croatia.'
              : 'Istražite povijesne ulice, bogatu kulturu, vrhunsku gastronomiju i najbolje lokacije u Hrvatskoj.'}
          </p>

          {/* Search bar */}
          <div className="relative w-full max-w-md mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input 
              type="text"
              placeholder={isEn ? "Search cities by name or region..." : "Pretraži gradove po imenu ili regiji..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 rounded-full border-slate-200 bg-white shadow-sm focus:border-primary text-sm h-12"
            />
          </div>
        </div>

        {/* Cities Grid in 3 to 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCities.map((city) => {
            const cityName = isEn && city.nameEn ? city.nameEn : city.name;
            const cityDescription = isEn && city.descriptionEn 
              ? city.descriptionEn.replace(/<[^>]*>/g, '').substring(0, 140)
              : (city.seoDescription || (city.description ? city.description.replace(/<[^>]*>/g, '').substring(0, 140) : (isEn ? 'Explore destinations, restaurants, beaches and attractions.' : 'Istražite odredišta, restorane, plaže i znamenitosti.')));

            return (
              <Link 
                key={city.slug || city.id} 
                href={getLocalizedUrl(`/cities/${city.slug}`, language)}
                className="group block h-full"
              >
                <Card className="h-full overflow-hidden rounded-2xl border-slate-200/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white flex flex-col">
                  <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                    {city.image ? (
                      <Image 
                        src={city.image} 
                        alt={cityName} 
                        fill 
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-indigo-950 flex flex-col items-center justify-center p-4">
                        <Building2 className="w-10 h-10 text-white/20 mb-2" />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">
                          {isEn ? 'Photo coming soon' : 'Fotografija uskoro'}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {city.region && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-black/50 backdrop-blur-md text-amber-300 px-2.5 py-1 rounded-full border border-white/10">
                          {city.region}
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 z-10">
                      <h2 className="text-2xl font-black text-white group-hover:text-primary transition-colors leading-tight drop-shadow-md">
                        {cityName}
                      </h2>
                    </div>
                  </div>

                  <CardContent className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-slate-600 line-clamp-3 mb-3 font-body leading-relaxed">
                        {cityDescription}
                      </p>

                      {/* Popis wiki kategorija / poglavlja (ako grad ima wiki sekcije) */}
                      {city.wikiSections && Array.isArray(city.wikiSections) && city.wikiSections.length > 0 && (
                        <div className="mb-3 pt-2.5 border-t border-slate-100">
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                            <BookOpen className="size-3 text-primary" />
                            {isEn ? 'Wiki Chapters' : 'Wiki poglavlja'}:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {city.wikiSections.slice(0, 4).map((sec: any, idx: number) => {
                              const secTitle = (isEn && sec.titleEn) ? sec.titleEn : sec.title;
                              if (!secTitle) return null;
                              return (
                                <span
                                  key={sec.id || idx}
                                  className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                                >
                                  {secTitle}
                                </span>
                              );
                            })}
                            {city.wikiSections.length > 4 && (
                              <span className="text-[10px] font-black text-primary/70 self-center px-0.5">
                                +{city.wikiSections.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-primary text-xs font-bold mt-2">
                      <span className="flex items-center gap-1">
                        <Compass className="size-3.5" />
                        {isEn ? 'Explore Guide' : 'Istraži vodič'}
                      </span>
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {filteredCities.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 mt-6">
            <Building2 className="size-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">
              {isEn ? 'No cities found' : 'Nema pronađenih gradova'}
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
