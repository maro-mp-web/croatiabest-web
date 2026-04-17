
"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { ISLANDS, CATEGORIES } from '@/app/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowLeft, ShieldAlert, HeartPulse, Flame, Pill, Loader2, Users, Landmark, Compass, Info, Anchor, Navigation } from 'lucide-react';
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
            setWikiData({
              extract: data.extract,
              thumbnail: data.thumbnail?.source
            });
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

  const islandEmergency = listings?.filter(l => 
    ['pharmacy', 'emergency', 'police', 'firefighters'].includes(l.locationCategoryId || l.categoryId)
  ) || [];

  if (!island) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Otok nije pronađen</h1>
        <Link href="/">
          <Button variant="link" className="mt-4">{t.backToHome}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pb-24">
        <section className="relative h-[65vh] w-full overflow-hidden">
          <Image 
            src={island.image} 
            alt={`Obala otoka ${island.name}`} 
            fill 
            className="object-cover brightness-[0.6] scale-105" 
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-6 pb-20">
            <div className="size-16 rounded-full border border-white/40 flex items-center justify-center backdrop-blur-md mb-2">
              <Anchor className="text-white size-8" />
            </div>
            <h1 className="text-7xl md:text-[10rem] font-black text-white font-headline drop-shadow-2xl italic tracking-tighter leading-none">
              Otok {island.name}
            </h1>
          </div>
        </section>

        <div className="container mx-auto px-6 -mt-16 relative z-20 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-16">
              <div className="bg-white/95 backdrop-blur-3xl border border-white/60 shadow-2xl rounded-[3.5rem] p-10 md:p-16 overflow-hidden">
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-10">
                      <Badge className="bg-secondary/10 text-secondary border-none px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest">Digitalna putovnica</Badge>
                    </div>
                    <h2 className="text-5xl font-headline font-black mb-10 leading-none">Upoznajte {island.name}</h2>
                    <div className="prose prose-xl max-w-none text-muted-foreground font-body italic leading-relaxed mb-12">
                      {wikiData.extract || island.description}
                    </div>
                  </div>
                  
                  <div className="w-full md:w-72 space-y-8 bg-foreground/5 rounded-3xl p-8 border border-black/5 h-fit">
                    {wikiData.thumbnail && (
                      <div className="relative aspect-square rounded-2xl overflow-hidden mb-8 shadow-inner border border-black/5 bg-white p-4">
                        <p className="text-[10px] font-black text-center text-muted-foreground uppercase mb-2">Simbol otoka</p>
                        <div className="relative h-full w-full">
                          <Image src={wikiData.thumbnail} alt={`Logo otoka ${island.name}`} fill className="object-contain" />
                        </div>
                      </div>
                    )}
                    <h3 className="text-sm font-black uppercase tracking-widest text-secondary mb-6">Otočni podaci</h3>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Users className="size-5 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase">Stanovnici</p>
                          <p className="font-bold">{island.population}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Compass className="size-5 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase">Regija</p>
                          <p className="font-bold">{island.region}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Landmark className="size-5 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase">Karakter</p>
                          <p className="font-bold">Mediteranski</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-4xl font-headline font-black flex items-center gap-4 uppercase tracking-tighter">
                    <ShieldAlert className="text-primary size-10" /> Dežurne službe na otoku
                  </h3>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="size-10 animate-spin text-primary opacity-20" />
                  </div>
                ) : islandEmergency.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {islandEmergency.map(service => {
                      const catId = service.locationCategoryId || service.categoryId;
                      return (
                        <Card key={service.id} className="border-none shadow-xl bg-white/50 backdrop-blur-md overflow-hidden rounded-[2.5rem] hover:shadow-2xl transition-all group border border-white/40">
                          <CardContent className="p-8 flex items-start gap-6">
                            <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                              {catId === 'pharmacy' && <Pill className="text-green-600 size-6" />}
                              {catId === 'emergency' && <HeartPulse className="text-red-600 size-6" />}
                              {catId === 'police' && <ShieldAlert className="text-blue-600 size-6" />}
                              {catId === 'firefighters' && <Flame className="text-orange-600 size-6" />}
                            </div>
                            <div className="flex-1">
                              <p className="font-black text-xl leading-tight mb-1">{service.name}</p>
                              <p className="text-sm text-muted-foreground mb-4 font-medium">{service.address}</p>
                              <a href={`tel:${service.contactPhone || service.phone}`} className="inline-flex items-center gap-2 text-primary font-black text-sm tracking-widest bg-white px-4 py-2 rounded-xl shadow-sm border border-black/5 transition-all hover:shadow-md">
                                KONTAKT: {service.contactPhone || service.phone}
                              </a>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-16 border-2 border-dashed rounded-[3.5rem] text-center text-muted-foreground italic bg-foreground/5">
                    <Info className="size-12 mx-auto mb-4 opacity-5" />
                    Pronađite dežurne službe i važne lokacije za otok {island.name} na našoj interaktivnoj karti Hrvatske.
                  </div>
                )}
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-8">
              <Card className="rounded-[3.5rem] shadow-2xl border-none overflow-hidden bg-white">
                <div className="p-8 border-b bg-foreground/5">
                  <h3 className="text-2xl font-black italic">Mini Karta Otoka</h3>
                  <p className="text-xs text-muted-foreground font-medium">Sve lokacije na otoku {island.name}</p>
                </div>
                <div className="h-[400px] w-full relative">
                  <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                    <Map
                      defaultCenter={{ lat: island.lat, lng: island.lng }}
                      defaultZoom={11}
                      disableDefaultUI={true}
                      gestureHandling={'greedy'}
                      className="w-full h-full"
                    >
                      {listings?.map((listing) => {
                        if (listing.latitude === undefined || listing.longitude === undefined) return null;
                        const cat = CATEGORIES.find(c => c.id === listing.locationCategoryId);
                        return (
                          <AdvancedMarker
                            key={listing.id}
                            position={{ lat: listing.latitude, lng: listing.longitude }}
                          >
                            <Pin background={cat?.color || '#333'} glyphColor={'#fff'} borderColor={'#fff'} />
                          </AdvancedMarker>
                        );
                      })}
                    </Map>
                  </APIProvider>
                </div>
                <div className="p-8 space-y-4">
                  <p className="text-sm text-muted-foreground font-body italic">Istražite obalu, plaže i restorane na otoku {island.name}.</p>
                  <Link href="/explore">
                    <Button className="w-full h-14 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-secondary/20">
                      OTVORI VELIKU KARTU
                    </Button>
                  </Link>
                </div>
              </Card>

              <div className="p-12 border-2 border-dashed rounded-[3.5rem] text-center space-y-6 bg-white shadow-xl">
                <p className="text-[10px] font-black text-muted-foreground tracking-[0.3em] uppercase">Oglasni prostor</p>
                <div className="h-48 flex items-center justify-center text-muted-foreground/30 italic text-sm px-6">
                  Imate li ponudu na otoku {island.name}? Pridružite se CroatiaBest zajednici i povećajte vidljivost.
                </div>
                <Link href="/submit">
                  <Button className="w-full rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-black uppercase tracking-widest">POSTANITE PARTNER</Button>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <footer className="bg-foreground text-white py-16">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">&copy; 2024 CroatiaBest Luxury Islands</p>
          <Link href="/"><Button variant="ghost" className="text-white/60 hover:text-white uppercase font-black text-xs tracking-widest"><ArrowLeft className="mr-3 size-4" /> POČETNA</Button></Link>
        </div>
      </footer>
    </div>
  );
}
