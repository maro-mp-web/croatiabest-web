
"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';

import Image from 'next/image';
import { 
  Anchor, 
  ShieldAlert, 
  Users, 
  Landmark, 
  Phone as PhoneIcon, 
  Globe, 
  Home as HomeIcon, 
  Map as MapIcon,
  Binoculars,
  Utensils,
  Umbrella
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { generateListingUrl } from '@/app/lib/utils/slug';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollection } from '@/pocketbase';
import Map from '@/components/map/Map';
import WikiView from '@/components/ui/WikiView';
import { useLanguage } from '@/contexts/LanguageContext';

export default function IslandClient({ island, listings }: { island: any, listings: any[] }) {
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [wikiData, setWikiData] = useState<{extract: string, thumbnail?: string}>({ extract: '' });

  useEffect(() => {
    if (island) {
      const encodedIsland = encodeURIComponent(island.name);
      fetch(`https://hr.wikipedia.org/api/rest_v1/page/summary/${encodedIsland}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.extract) {
            setWikiData({ extract: data.extract, thumbnail: data.thumbnail?.source });
          }
        })
        .catch(err => console.error('Wiki error', err));
    }
  }, [island]);

  if (!island) return null;

  const emergency = listings?.filter(l => ['pharmacy', 'emergency', 'police', 'firefighters'].includes(l.locationCategoryId || l.categoryId)) || [];
  const popular = listings?.filter(l => ['beaches', 'opgs', 'wineries'].includes(l.locationCategoryId || l.categoryId)) || [];
  const viewpoints = listings?.filter(l => ['viewpoints', 'landmarks'].includes(l.locationCategoryId || l.categoryId)) || [];
  const gastro = listings?.filter(l => ['restaurants'].includes(l.locationCategoryId || l.categoryId)) || [];

  const getDirectionsUrl = (lat: number, lng: number) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pb-24">
        <section className="relative h-[60vh] w-full overflow-hidden">
          <Image src={island.image} alt={island.name} fill className="object-cover brightness-[0.4]" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pb-24">
            <div className="size-16 rounded-full border border-white/40 flex items-center justify-center backdrop-blur-md mb-6">
              <Anchor className="text-white size-8" />
            </div>
            <h1 className="text-6xl md:text-[8rem] font-black text-white font-headline drop-shadow-2xl italic tracking-tighter leading-none">
              Otok {island.name} <span className="block text-2xl md:text-4xl not-italic tracking-widest mt-4 opacity-80 uppercase">Vodič i Plaže</span>
            </h1>
          </div>
        </section>

        <div className="container mx-auto px-6 -mt-16 relative z-20 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-16">
              <Card className="bg-white/95 backdrop-blur-3xl border border-white/60 shadow-2xl rounded-[3rem] p-8 md:p-12 overflow-hidden">
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex-1">
                    <h2 className="text-4xl font-headline font-black mb-8 leading-none">Upoznajte {island.name}</h2>
                    <div className="prose prose-xl max-w-none text-muted-foreground font-body italic leading-relaxed mb-12 whitespace-pre-wrap">
                      {island.description || wikiData.extract}
                    </div>
                  </div>
                  
                  <div className="w-full md:w-80 space-y-8 bg-foreground/5 rounded-[2.5rem] p-8 border border-black/5 h-fit">
                    {wikiData.thumbnail && (
                      <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-8 shadow-inner border border-black/5 bg-white p-6 text-center">
                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-4 tracking-widest">Otočni simbol</p>
                        <div className="relative h-full w-full">
                          <Image src={wikiData.thumbnail} alt="Simbol" fill className="object-contain" />
                        </div>
                      </div>
                    )}
                    <div className="space-y-4">
                      {[
                        { icon: <Users className="size-4" />, label: 'Stanovnika', value: island.population },
                        { icon: <Landmark className="size-4" />, label: 'Općina', value: island.mayor },
                        { icon: <PhoneIcon className="size-4" />, label: 'Pozivni broj', value: island.areaCode },
                        { icon: <HomeIcon className="size-4" />, label: 'Regija', value: island.region },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="p-2 bg-white rounded-lg shadow-sm">{item.icon}</div>
                          <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</p>
                            <p className="font-bold text-base">{item.value || 'N/A'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-6">
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] text-red-600 flex items-center gap-2"><ShieldAlert className="size-4" /> Dežurstvo</h4>
                  {emergency.map(l => (
                    <Card key={l.id} className="border-none shadow-lg rounded-2xl bg-red-50/50 p-4">
                      <p className="font-black text-sm mb-1">{l.name}</p>
                      <a href={`tel:${l.contactPhone}`} className="text-xs font-black text-red-600 flex items-center gap-1"><PhoneIcon className="size-3" /> {l.contactPhone}</a>
                    </Card>
                  ))}
                </div>
                <div className="space-y-6">
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] text-secondary flex items-center gap-2"><Umbrella className="size-4" /> Plaže & OPG</h4>
                  {popular.map(l => (
                    <Link key={l.id} href={generateListingUrl(l.locationCategoryId || l.categoryId, l.name, l.id)}>
                      <Card className="border-none shadow-lg rounded-2xl bg-blue-50/50 p-4 hover:scale-[1.02] transition-transform cursor-pointer">
                        <p className="font-black text-sm">{l.name}</p>
                      </Card>
                    </Link>
                  ))}
                </div>
                <div className="space-y-6">
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] text-purple-600 flex items-center gap-2"><Binoculars className="size-4" /> Vidikovci</h4>
                  {viewpoints.map(l => (
                    <Link key={l.id} href={generateListingUrl(l.locationCategoryId || l.categoryId, l.name, l.id)}>
                      <Card className="border-none shadow-lg rounded-2xl bg-purple-50/50 p-4 hover:scale-[1.02] transition-transform cursor-pointer">
                        <p className="font-black text-sm">{l.name}</p>
                      </Card>
                    </Link>
                  ))}
                </div>
                <div className="space-y-6">
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary flex items-center gap-2"><Utensils className="size-4" /> Gastro</h4>
                  {gastro.map(l => (
                    <Link key={l.id} href={generateListingUrl(l.locationCategoryId || l.categoryId, l.name, l.id)}>
                      <Card className="border-none shadow-lg rounded-2xl bg-primary/5 p-4 hover:scale-[1.02] transition-transform cursor-pointer">
                        <p className="font-black text-sm">{l.name}</p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-12">
              <Card className="rounded-[3.5rem] shadow-2xl border-none overflow-hidden bg-white">
                <div className="p-8 border-b bg-foreground/5">
                  <h3 className="text-2xl font-black italic">Lokacija</h3>
                </div>
                <div className="relative aspect-square w-full rounded-b-[3.5rem] overflow-hidden">
                  <Map 
                    center={{ lat: island.lat, lng: island.lng }}
                    zoom={11}
                    listings={listings || []}
                    selectedListingId={selectedListingId}
                    onSelectListing={setSelectedListingId}
                    getDirectionsUrl={getDirectionsUrl}
                    showCenterMarker={true}
                    centerMarkerName={`Centar - ${island.name}`}
                  />
                </div>
              </Card>
            </aside>
          </div>
          
          {/* WIKIPEDIA SECTIONS */}
          {island?.wikiSections?.length > 0 && (
            <WikiView sections={island.wikiSections} />
          )}

        </div>
      </main>
    </div>
  );
}
