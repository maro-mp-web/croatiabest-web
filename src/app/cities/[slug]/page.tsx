
"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { CITIES, CATEGORIES } from '@/app/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowLeft, ShieldAlert, HeartPulse, Flame, Pill, Loader2, Users, Landmark, Compass, Info } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

export default function CityPage() {
  const params = useParams();
  const { t } = useLanguage();
  const [wikiData, setWikiData] = useState<{extract: string, thumbnail?: string}>({ extract: '' });
  const city = CITIES.find(c => c.slug === params.slug);
  const firestore = useFirestore();

  useEffect(() => {
    if (city) {
      document.title = `${city.name} - Vodič i informacije | CroatiaBest`;
      
      const encodedCity = encodeURIComponent(city.name);
      fetch(`https://hr.wikipedia.org/api/rest_v1/page/summary/${encodedCity}`)
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
  }, [city]);

  const emergencyQuery = useMemoFirebase(() => {
    if (!firestore || !city) return null;
    return query(
      collection(firestore, 'listings'),
      where('city', '==', city.name),
      where('status', '==', 'active')
    );
  }, [firestore, city]);

  const { data: cityListings, isLoading } = useCollection(emergencyQuery);

  const cityEmergency = cityListings?.filter(l => 
    ['pharmacy', 'emergency', 'police', 'firefighters'].includes(l.locationCategoryId || l.categoryId)
  ) || [];

  if (!city) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Grad nije pronađen</h1>
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
            src={city.image} 
            alt={`Panorama grada ${city.name}`} 
            fill 
            className="object-cover brightness-[0.65] scale-105" 
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <Badge className="bg-primary/20 backdrop-blur-md text-white border-white/20 px-6 py-2 rounded-full font-black text-xs uppercase tracking-[0.3em]">
              {city.region}
            </Badge>
            <h1 className="text-7xl md:text-[10rem] font-black text-white font-headline drop-shadow-2xl italic tracking-tighter leading-none">
              {city.name}
            </h1>
          </div>
        </section>

        <div className="container mx-auto px-6 -mt-32 relative z-20 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-16">
              <div className="bg-white/90 backdrop-blur-3xl border border-white/60 shadow-2xl rounded-[3.5rem] p-10 md:p-16 overflow-hidden">
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Landmark className="text-primary size-6" />
                      </div>
                      <h2 className="text-4xl font-headline font-black leading-none">Povijest i značaj</h2>
                    </div>
                    <div className="prose prose-xl max-w-none text-muted-foreground font-body italic leading-relaxed mb-12">
                      {wikiData.extract || city.description}
                    </div>
                  </div>
                  
                  <div className="w-full md:w-72 space-y-8 bg-secondary/5 rounded-3xl p-8 border border-black/5">
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6">Info iskaznica</h3>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Users className="size-5 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase">Stanovništvo</p>
                          <p className="font-bold">{city.population}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Compass className="size-5 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase">Regija</p>
                          <p className="font-bold">{city.region}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <MapPin className="size-5 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase">Država</p>
                          <p className="font-bold">Hrvatska</p>
                        </div>
                      </div>
                    </div>
                    {wikiData.thumbnail && (
                      <div className="relative aspect-square rounded-2xl overflow-hidden mt-8 shadow-inner border border-black/5">
                        <Image src={wikiData.thumbnail} alt={`Grb ili simbol grada ${city.name}`} fill className="object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="text-4xl font-headline font-black flex items-center gap-4">
                    <ShieldAlert className="text-primary size-10" /> HITNE INFORMACIJE (0-24)
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Provjereno: Danas</span>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="size-10 animate-spin text-primary opacity-20" />
                  </div>
                ) : cityEmergency.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cityEmergency.map(service => {
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
                              <a href={`tel:${service.contactPhone || service.phone}`} className="inline-flex items-center gap-2 text-primary font-black text-sm hover:underline tracking-widest bg-primary/5 px-4 py-2 rounded-xl transition-colors hover:bg-primary hover:text-white">
                                <PhoneIcon className="size-3" /> {service.contactPhone || service.phone}
                              </a>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-16 border-2 border-dashed rounded-[3.5rem] text-center text-muted-foreground italic bg-secondary/5">
                    <Info className="size-12 mx-auto mb-4 opacity-10" />
                    Trenutno nema unesenih hitnih službi za {city.name}.<br/>Uvijek možete nazvati 112 za hitne slučajeve.
                  </div>
                )}
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-8">
              <div className="bg-primary p-12 rounded-[3.5rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 size-48 bg-white/10 rounded-full -mr-24 -mt-24 transition-transform group-hover:scale-150 duration-700"></div>
                <div className="relative z-10">
                  <h3 className="text-4xl font-black mb-6 italic leading-none">Istražite {city.name}</h3>
                  <p className="text-white/80 mb-10 text-lg font-body leading-relaxed">Pronađite najbolje lokacije, restorane i plaže u gradu na našoj interaktivnoj karti.</p>
                  <Link href="/explore">
                    <Button className="w-full h-16 bg-white text-primary hover:bg-white/90 rounded-[1.5rem] font-black text-lg shadow-xl uppercase tracking-widest">
                      OTVORI KARTU GRADA
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="p-12 border-2 border-dashed rounded-[3.5rem] text-center space-y-4 bg-white/40">
                <p className="text-[10px] font-black text-muted-foreground tracking-[0.3em] uppercase">Partnerstvo</p>
                <div className="h-48 flex items-center justify-center text-muted-foreground/30 italic text-sm px-6">
                  Vaš hotel ili restoran u gradu {city.name}? Postanite dio najbrže rastućeg portala.
                </div>
                <Link href="/submit">
                  <Button variant="outline" className="w-full rounded-2xl border-primary/20 text-primary hover:bg-primary/5 font-black uppercase tracking-widest">PRIJAVI OBJEKT</Button>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <footer className="bg-foreground text-white py-16">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">&copy; 2024 CroatiaBest Luxury Guide</p>
          <Link href="/"><Button variant="ghost" className="text-white/60 hover:text-white uppercase font-black text-xs tracking-widest"><ArrowLeft className="mr-3 size-4" /> POČETNA</Button></Link>
        </div>
      </footer>
    </div>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
