
"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { CITIES, CATEGORIES } from '@/app/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowLeft, ShieldAlert, HeartPulse, Flame, Pill, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

export default function CityPage() {
  const params = useParams();
  const { t } = useLanguage();
  const [wikiData, setWikiData] = useState<string>('');
  const city = CITIES.find(c => c.slug === params.slug);
  const firestore = useFirestore();

  // Wikipedia API (hr)
  useEffect(() => {
    if (city) {
      fetch(`https://hr.wikipedia.org/api/rest_v1/page/summary/${city.name}`)
        .then(res => res.json())
        .then(data => {
          if (data.extract) setWikiData(data.extract);
        })
        .catch(err => console.error('Wiki error', err));
    }
  }, [city]);

  // Dohvaćanje hitnih službi za ovaj grad iz Firestore baze
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
        {/* City Hero */}
        <div className="relative h-[60vh] w-full overflow-hidden">
          <Image src={city.image} alt={city.name} fill className="object-cover brightness-75" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center text-center p-6">
            <h1 className="text-7xl md:text-9xl font-black text-white font-headline drop-shadow-2xl italic tracking-tighter">{city.name}</h1>
          </div>
        </div>

        <div className="container mx-auto px-6 -mt-24 relative z-20 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-16">
              <div className="bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] rounded-[3rem] p-10 md:p-16">
                <div className="flex items-center gap-4 mb-8">
                  <Badge className="bg-primary/10 text-primary border-none px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest">Gradska iskaznica</Badge>
                  <div className="h-px flex-1 bg-black/5"></div>
                </div>
                <h2 className="text-5xl font-headline font-black mb-8 leading-none">O gradu {city.name}</h2>
                <div className="prose prose-2xl max-w-none text-muted-foreground font-body italic leading-relaxed mb-12">
                  {wikiData || city.description}
                </div>
                <div className="grid grid-cols-2 gap-12 pt-12 border-t border-black/5">
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-3">Stanovništvo</p>
                    <p className="text-4xl font-black tracking-tighter">{city.population}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-3">Regija</p>
                    <p className="text-4xl font-black tracking-tighter">{city.region}</p>
                  </div>
                </div>
              </div>

              {/* Emergency Services Section */}
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-4xl font-headline font-black flex items-center gap-4">
                    <ShieldAlert className="text-primary size-10" /> HITNE INFORMACIJE (0-24)
                  </h3>
                  <Badge className="bg-red-600 text-white border-none animate-pulse px-4 py-1 rounded-lg font-black text-[10px] tracking-widest">LIVE STATUS</Badge>
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
                        <Card key={service.id} className="border-none shadow-xl bg-white/50 backdrop-blur-md overflow-hidden rounded-[2rem] hover:shadow-2xl transition-all group">
                          <CardContent className="p-8 flex items-start gap-6">
                            <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                              {catId === 'pharmacy' && <Pill className="text-green-600 size-6" />}
                              {catId === 'emergency' && <HeartPulse className="text-red-600 size-6" />}
                              {catId === 'police' && <ShieldAlert className="text-blue-600 size-6" />}
                              {catId === 'firefighters' && <Flame className="text-orange-600 size-6" />}
                            </div>
                            <div className="flex-1">
                              <p className="font-black text-xl leading-tight mb-1">{service.name || service.objectName}</p>
                              <p className="text-sm text-muted-foreground mb-4 font-medium">{service.address}</p>
                              {(service.contactPhone || service.phone) && (
                                <a href={`tel:${service.contactPhone || service.phone}`} className="inline-flex items-center gap-2 text-primary font-black text-sm hover:underline tracking-widest">
                                  NAZOVI: {service.contactPhone || service.phone}
                                </a>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 border-2 border-dashed rounded-[3rem] text-center text-muted-foreground italic">
                    Trenutno nema unesenih hitnih službi za {city.name} u bazi podataka.
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              <div className="bg-primary p-12 rounded-[3rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 size-48 bg-white/10 rounded-full -mr-24 -mt-24 transition-transform group-hover:scale-150 duration-700"></div>
                <h3 className="text-4xl font-black mb-6 italic leading-none">Planiraj posjet</h3>
                <p className="text-white/80 mb-10 text-lg font-body leading-relaxed">Pronađite najbolje lokacije, restorane i plaže u gradu {city.name} na našoj interaktivnoj karti.</p>
                <Link href="/explore">
                  <Button className="w-full h-16 bg-white text-primary hover:bg-white/90 rounded-[1.5rem] font-black text-lg shadow-xl uppercase tracking-widest">
                    OTVORI KARTU
                  </Button>
                </Link>
              </div>

              <div className="p-12 border-2 border-dashed rounded-[3rem] text-center space-y-4">
                <p className="text-[10px] font-black text-muted-foreground tracking-[0.3em] uppercase">Oglasni prostor</p>
                <div className="h-48 flex items-center justify-center text-muted-foreground/30 italic text-sm">Vaš objekt ovdje? Postanite partner CroatiaBest portala.</div>
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

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </div>
  )
}
