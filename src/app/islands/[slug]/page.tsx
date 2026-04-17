
"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { ISLANDS, CATEGORIES } from '@/app/lib/constants';
import { MOCK_ARTICLES } from '@/app/lib/mock-data';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  ArrowLeft, 
  ShieldAlert, 
  HeartPulse, 
  Flame, 
  Pill, 
  Loader2, 
  Users, 
  Landmark, 
  Compass, 
  Info, 
  Anchor, 
  Navigation,
  Map as MapIcon,
  Phone as PhoneIcon,
  Globe,
  Home as HomeIcon,
  Binoculars,
  Utensils,
  Umbrella,
  Star,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

export default function IslandPage() {
  const params = useParams();
  const { t } = useLanguage();
  const [wikiData, setWikiData] = useState<{extract: string, thumbnail?: string}>({ extract: '' });
  const island = ISLANDS.find(i => i.slug === params.slug);
  const firestore = useFirestore();

  useEffect(() => {
    if (island) {
      document.title = `Otok ${island.name} - Turistički vodič | CroatiaBest`;
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

  const islandQuery = useMemoFirebase(() => {
    if (!firestore || !island) return null;
    return query(
      collection(firestore, 'listings'),
      where('city', '==', island.name),
      where('status', '==', 'active')
    );
  }, [firestore, island]);

  const { data: listings, isLoading } = useCollection(islandQuery);

  // Group listings by columns
  const emergency = listings?.filter(l => ['pharmacy', 'emergency', 'police', 'firefighters'].includes(l.locationCategoryId || l.categoryId)) || [];
  const popular = listings?.filter(l => ['beaches', 'opgs', 'wineries'].includes(l.locationCategoryId || l.categoryId)) || [];
  const viewpoints = listings?.filter(l => ['viewpoints', 'landmarks'].includes(l.locationCategoryId || l.categoryId)) || [];
  const gastro = listings?.filter(l => ['restaurants'].includes(l.locationCategoryId || l.categoryId)) || [];

  // Filter blog posts related to the island
  const relatedArticles = MOCK_ARTICLES.filter(a => 
    a.title.toLowerCase().includes(island?.name.toLowerCase() || '') || 
    a.content.toLowerCase().includes(island?.name.toLowerCase() || '')
  );

  if (!island) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pb-24">
        {/* HERO SECTION */}
        <section className="relative h-[65vh] w-full overflow-hidden">
          <Image src={island.image} alt={island.name} fill className="object-cover brightness-[0.4] scale-105" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pb-24">
            <div className="size-16 rounded-full border border-white/40 flex items-center justify-center backdrop-blur-md mb-6">
              <Anchor className="text-white size-8" />
            </div>
            <h1 className="text-7xl md:text-[10rem] font-black text-white font-headline drop-shadow-2xl italic tracking-tighter leading-none">Otok {island.name}</h1>
          </div>
        </section>

        <div className="container mx-auto px-6 -mt-24 relative z-20 space-y-16">
          {/* INFO CARD & DESCRIPTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-16">
              <Card className="bg-white/95 backdrop-blur-3xl border border-white/60 shadow-2xl rounded-[3.5rem] p-10 md:p-16 overflow-hidden">
                <div className="flex flex-col md:flex-row gap-16">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-10">
                      <Badge className="bg-secondary/10 text-secondary border-none px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest italic">Otočni Vodič</Badge>
                    </div>
                    <h2 className="text-5xl font-headline font-black mb-10 leading-none">Upoznajte {island.name}</h2>
                    <div className="prose prose-2xl max-w-none text-muted-foreground font-body italic leading-relaxed mb-12 whitespace-pre-wrap">
                      {wikiData.extract || island.description}
                    </div>
                  </div>
                  
                  <div className="w-full md:w-80 space-y-8 bg-foreground/5 rounded-[2.5rem] p-10 border border-black/5 h-fit">
                    {wikiData.thumbnail && (
                      <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-8 shadow-inner border border-black/5 bg-white p-6">
                        <p className="text-[10px] font-black text-center text-muted-foreground uppercase mb-4 tracking-widest">Otočni Simbol</p>
                        <div className="relative h-full w-full">
                          <Image src={wikiData.thumbnail} alt={`Simbol otoka ${island.name}`} fill className="object-contain" />
                        </div>
                      </div>
                    )}
                    <h3 className="text-sm font-black uppercase tracking-widest text-secondary mb-6 border-b pb-4">Digitalni Karton</h3>
                    <div className="space-y-6">
                      {[
                        { icon: <Users className="size-5" />, label: 'Stanovnika', value: island.population },
                        { icon: <Compass className="size-5" />, label: 'Regija', value: island.region },
                        { icon: <Landmark className="size-5" />, label: 'Općina', value: island.mayor },
                        { icon: <PhoneIcon className="size-5" />, label: 'Pozivni broj', value: island.areaCode },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                          <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-secondary/5 transition-colors">{item.icon}</div>
                          <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</p>
                            <p className="font-bold text-lg">{item.value || 'N/A'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* 4 COLUMN GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* EMERGENCY */}
                <div className="space-y-6">
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] text-red-600 flex items-center gap-2"><ShieldAlert className="size-4" /> Dežurstvo</h4>
                  {emergency.length > 0 ? emergency.map(l => (
                    <Card key={l.id} className="border-none shadow-lg rounded-2xl bg-red-50/50 p-4">
                      <p className="font-black text-sm mb-1">{l.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{l.address}</p>
                      <a href={`tel:${l.contactPhone}`} className="text-xs font-black text-red-600 flex items-center gap-1"><PhoneIcon className="size-3" /> {l.contactPhone}</a>
                    </Card>
                  )) : <p className="text-xs text-muted-foreground italic">Nema upisanih službi</p>}
                </div>

                {/* POPULAR */}
                <div className="space-y-6">
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] text-secondary flex items-center gap-2"><Umbrella className="size-4" /> Plaže & OPG</h4>
                  {popular.length > 0 ? popular.map(l => (
                    <Link key={l.id} href={`/listing/${l.id}`}>
                      <Card className="border-none shadow-lg rounded-2xl bg-secondary/5 p-4 hover:scale-[1.02] transition-transform cursor-pointer mb-3">
                        <p className="font-black text-sm mb-1">{l.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{l.address}</p>
                      </Card>
                    </Link>
                  )) : <p className="text-xs text-muted-foreground italic">Još nema lokacija</p>}
                </div>

                {/* VIEWPOINTS */}
                <div className="space-y-6">
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] text-purple-600 flex items-center gap-2"><Binoculars className="size-4" /> Vidikovci</h4>
                  {viewpoints.length > 0 ? viewpoints.map(l => (
                    <Link key={l.id} href={`/listing/${l.id}`}>
                      <Card className="border-none shadow-lg rounded-2xl bg-purple-50/50 p-4 hover:scale-[1.02] transition-transform cursor-pointer mb-3">
                        <p className="font-black text-sm mb-1">{l.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{l.address}</p>
                      </Card>
                    </Link>
                  )) : <p className="text-xs text-muted-foreground italic">Još nema lokacija</p>}
                </div>

                {/* GASTRO */}
                <div className="space-y-6">
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary flex items-center gap-2"><Utensils className="size-4" /> Gastro</h4>
                  {gastro.length > 0 ? gastro.map(l => (
                    <Link key={l.id} href={`/listing/${l.id}`}>
                      <Card className="border-none shadow-lg rounded-2xl bg-primary/5 p-4 hover:scale-[1.02] transition-transform cursor-pointer mb-3">
                        <p className="font-black text-sm mb-1">{l.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{l.address}</p>
                      </Card>
                    </Link>
                  )) : <p className="text-xs text-muted-foreground italic">Još nema lokacija</p>}
                </div>
              </div>

              {/* BLOG / ARTICLE SECTION */}
              <div className="space-y-12 pt-16 border-t border-black/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-4xl font-headline font-black uppercase tracking-tighter italic">Povijest i Znamenitosti</h3>
                  <Link href="/blog"><Button variant="ghost" className="font-black text-xs uppercase tracking-widest">CIJELI MAGAZIN <ArrowRight className="size-4 ml-2" /></Button></Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {relatedArticles.length > 0 ? relatedArticles.map(article => (
                    <Link key={article.id} href={`/blog/${article.id}`}>
                      <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden group bg-white">
                        <div className="relative h-56">
                          <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="p-10 space-y-4">
                          <Badge className="bg-secondary/10 text-secondary border-none uppercase font-black text-[10px]">{article.category}</Badge>
                          <h4 className="text-2xl font-black leading-tight group-hover:text-primary transition-colors">{article.title}</h4>
                          <p className="text-base text-muted-foreground line-clamp-2 font-body italic leading-relaxed">{article.excerpt}</p>
                        </div>
                      </Card>
                    </Link>
                  )) : (
                    <div className="col-span-2 p-24 border-2 border-dashed rounded-[3.5rem] text-center text-muted-foreground italic bg-foreground/5">
                      Istražite povijest i tajne otoka {island.name} u našim budućim člancima.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SIDEBAR */}
            <aside className="lg:col-span-4 space-y-12">
              <Card className="rounded-[3.5rem] shadow-2xl border-none overflow-hidden bg-white">
                <div className="p-8 border-b bg-foreground/5">
                  <h3 className="text-2xl font-black italic">Otočna Karta</h3>
                  <p className="text-xs text-muted-foreground font-medium">Sve usluge i lokacije na otoku</p>
                </div>
                <div className="h-[450px] w-full relative">
                  <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                    <Map defaultCenter={{ lat: island.lat, lng: island.lng }} defaultZoom={11} disableDefaultUI={true} gestureHandling={'greedy'} className="w-full h-full">
                      {listings?.map(l => (
                        <AdvancedMarker key={l.id} position={{ lat: l.latitude, lng: l.longitude }}>
                          <Pin background={CATEGORIES.find(c => c.id === (l.locationCategoryId || l.categoryId))?.color || '#333'} />
                        </AdvancedMarker>
                      ))}
                    </Map>
                  </APIProvider>
                </div>
                <div className="p-8">
                  <Link href="/explore"><Button className="w-full h-14 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">ISTRAŽI OTOK</Button></Link>
                </div>
              </Card>

              {/* TRIVIA / ZANIMLJIVOSTI */}
              <div className="bg-foreground text-white p-12 rounded-[3.5rem] space-y-8 shadow-2xl relative overflow-hidden">
                <Anchor className="size-20 text-secondary absolute -top-4 -right-4 opacity-10 rotate-12" />
                <h4 className="text-3xl font-black italic">Zanimljivosti</h4>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <p className="text-xs font-black text-secondary uppercase tracking-[0.3em]">Arhipelag</p>
                    <p className="text-xl font-body italic text-white/80 leading-relaxed">
                      Otok {island.name} pripada {island.region} regiji i poznat je po svojim netaknutim uvalama.
                    </p>
                  </div>
                  <div className="pt-8 border-t border-white/10">
                     <p className="text-xs font-black text-secondary uppercase tracking-[0.3em] mb-4">Brzi Linkovi</p>
                     <div className="space-y-3">
                        <Link href="/blog" className="block text-sm text-white/40 hover:text-white transition-colors underline underline-offset-4">Poznati s ovog otoka</Link>
                        <Link href="/blog" className="block text-sm text-white/40 hover:text-white transition-colors underline underline-offset-4">Povijest i tradicija</Link>
                     </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
