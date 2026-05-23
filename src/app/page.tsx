
"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES, CITIES } from '@/app/lib/constants';
import { 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  ChevronRight,
  Utensils,
  Hotel,
  Umbrella,
  GlassWater
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

export default function Home() {
  const { t } = useLanguage();
  const firestore = useFirestore();

  const allListingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'listings'), where('status', '==', 'active'));
  }, [firestore]);

  const { data: allListings } = useCollection(allListingsQuery);

  const mainCategories = [
    { id: 'restaurants', name: 'Gastronomija', icon: <Utensils className="size-5" /> },
    { id: 'hotels', name: 'Smještaj', icon: <Hotel className="size-5" /> },
    { id: 'beaches', name: 'Najljepše Plaže', icon: <Umbrella className="size-5" /> },
    { id: 'wineries', name: 'Vinarije i OPG', icon: <GlassWater className="size-5" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <Navbar />
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] w-full overflow-hidden flex items-center pt-32 pb-20">
          <div className="absolute inset-0 z-0">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover"
              poster="https://picsum.photos/seed/croatia-hero/1920/1080"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-shoreline-with-clear-water-4422-large.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10" />
          </div>

          <div className="container mx-auto px-6 relative z-20">
            <div className="max-w-4xl space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-full text-white text-[12px] font-black tracking-[0.3em] uppercase">
                <Sparkles className="size-4 text-primary fill-primary animate-pulse" /> {t.heroBadge}
              </div>
              <h1 className="text-6xl md:text-[7rem] font-black text-white leading-[0.9] tracking-tighter font-headline italic drop-shadow-2xl">
                {t.heroVideoTitle}
              </h1>
              <p className="text-xl md:text-2xl text-white/80 font-body italic max-w-2xl leading-relaxed">
                {t.heroVideoSub}
              </p>
              <div className="flex flex-wrap gap-6 pt-4">
                <Link href="/explore">
                  <Button className="h-16 md:h-20 px-10 md:px-12 text-lg md:text-xl font-black bg-primary hover:bg-primary/90 rounded-[2rem] shadow-2xl shadow-primary/40 group transition-all">
                    {t.heroVideoCTA} <ArrowRight className="ml-4 size-6 group-hover:translate-x-3 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section className="py-20 bg-white relative z-30 shadow-2xl rounded-t-[3rem] -mt-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
              {mainCategories.map((cat) => (
                <Link key={cat.id} href={`/explore?category=${cat.id}`}>
                  <Card className="group hover:scale-105 transition-all duration-500 rounded-[2.5rem] border-none shadow-lg overflow-hidden bg-white cursor-pointer">
                    <CardContent className="p-6 md:p-8 flex flex-col items-center text-center gap-4">
                      <div className="size-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        {React.cloneElement(cat.icon as React.ReactElement, { className: 'size-6' })}
                      </div>
                      <p className="font-black text-[10px] uppercase tracking-widest">{cat.name}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="space-y-24">
              {mainCategories.map((cat) => {
                const listings = (allListings || []).filter(l => (l.locationCategoryId || l.categoryId) === cat.id).slice(0, 5);
                if (listings.length === 0) return null;

                return (
                  <div key={cat.id} className="space-y-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
                          {cat.icon}
                        </div>
                        <h3 className="text-3xl font-headline font-black italic">{cat.name}</h3>
                      </div>
                      <Link href={`/explore?category=${cat.id}`}>
                        <Button variant="link" className="text-primary font-black uppercase tracking-widest text-[10px]">
                          Prikaži sve <ChevronRight className="ml-1 size-4" />
                        </Button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                      {listings.map((l) => (
                        <Link key={l.id} href={`/listing/${l.id}`}>
                          <Card className="group border-none shadow-md hover:shadow-xl transition-all rounded-3xl overflow-hidden h-full flex flex-col">
                            <div className="relative aspect-[4/5] overflow-hidden">
                              <Image 
                                src={l.photoUrls?.[0] || 'https://picsum.photos/seed/placeholder/400/500'} 
                                alt={l.name} 
                                fill 
                                className="object-cover group-hover:scale-110 transition-transform duration-700" 
                              />
                            </div>
                            <CardContent className="p-5 flex-1 flex flex-col justify-center bg-secondary/5">
                              <h4 className="font-black text-sm leading-tight line-clamp-2">{l.name}</h4>
                              <p className="text-[9px] text-muted-foreground mt-2 font-bold uppercase tracking-tight">{l.city}</p>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CITY GUIDES */}
        <section className="py-24 bg-foreground text-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <Badge variant="outline" className="border-primary text-primary font-black px-6 py-2 rounded-full text-[10px] uppercase tracking-widest">Gradski Vodiči</Badge>
              <h2 className="text-5xl md:text-7xl font-headline font-black italic tracking-tighter">Najljepši gradovi</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {CITIES.slice(0, 4).map((city) => (
                <Link key={city.slug} href={`/cities/${city.slug}`}>
                  <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-xl">
                    <Image src={city.image} alt={city.name} fill className="object-cover transition-all duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <p className="text-[10px] font-black uppercase text-primary mb-2 tracking-widest">{city.region}</p>
                      <h4 className="text-4xl font-black italic mb-6">{city.name}</h4>
                      <Button className="w-full h-12 rounded-xl bg-primary hover:bg-white hover:text-primary text-white font-black text-[10px] tracking-tighter transition-all px-2 uppercase leading-none">
                        VODIČ KROZ GRAD
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-foreground text-white py-24 border-t border-white/5">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-5 space-y-8">
            <p className="text-3xl font-black italic text-primary">CroatiaBest</p>
            <p className="text-white/40 font-body text-xl italic leading-relaxed max-w-md">
              {t.footerDesc}
            </p>
          </div>
          <div className="md:col-span-3">
            <h4 className="font-black mb-8 text-[10px] uppercase tracking-widest text-primary">Navigacija</h4>
            <ul className="space-y-4 text-white/50 font-bold uppercase text-xs">
              <li><Link href="/explore" className="hover:text-primary transition-all">Istraži Kartu</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-all">Magazin</Link></li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <h4 className="font-black mb-8 text-[10px] uppercase tracking-widest text-primary">Pravne informacije</h4>
            <ul className="space-y-4 text-white/50 font-bold uppercase text-xs">
              <li><Link href="/privacy" className="hover:text-primary transition-all">Privatnost</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-all">Uvjeti</Link></li>
            </ul>
            <p className="mt-12 text-[10px] font-black uppercase text-white/20 tracking-widest">&copy; 2024 CroatiaBest Luxury Guide</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
