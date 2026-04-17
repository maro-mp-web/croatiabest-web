
"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { CATEGORIES } from '@/app/lib/constants';
import { MapPin, ArrowRight, Star, Navigation, Play, MousePointer2, Loader2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Logo } from '@/components/brand/Logo';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';

const HERO_SLIDES = [
  { id: 1, title: 'Dubrovnik', tag: 'Biser Jadrana', img: 'https://picsum.photos/seed/dubrovnik/1200/800', hint: 'dubrovnik old town' },
  { id: 2, title: 'Hvar', tag: 'Najsunčaniji otok', img: 'https://picsum.photos/seed/hvar/1200/800', hint: 'hvar harbor' },
  { id: 3, title: 'Plitvice', tag: 'Prirodna čarolija', img: 'https://picsum.photos/seed/plitvice/1200/800', hint: 'plitvice lakes' },
  { id: 4, title: 'Rovinj', tag: 'Istarska romantika', img: 'https://picsum.photos/seed/rovinj/1200/800', hint: 'rovinj istria' },
];

export default function Home() {
  const { t } = useLanguage();
  const firestore = useFirestore();

  const featuredQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'listings'),
      where('status', '==', 'active'),
      where('locationCategoryType', '==', 'Paid'),
      limit(6)
    );
  }, [firestore]);

  const { data: featuredListings, isLoading } = useCollection(featuredQuery);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative h-[90vh] w-full overflow-hidden flex items-center">
          <div className="absolute inset-0 z-0">
            <video autoPlay muted loop playsInline className="w-full h-full object-cover brightness-[0.7]" poster="https://picsum.photos/seed/croatia-hero/1920/1080">
              <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-shoreline-with-clear-water-4422-large.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
          </div>

          <div className="container mx-auto px-6 relative z-20">
            <div className="max-w-2xl animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-primary-foreground text-xs font-bold tracking-[0.2em] uppercase">
                <Play className="size-3 fill-primary text-primary" /> Live from the Adriatic
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8 font-headline italic">{t.heroVideoTitle}</h1>
              <p className="text-xl md:text-2xl text-white/80 font-body mb-10 leading-relaxed max-w-lg">{t.heroVideoSub}</p>
              <div className="flex flex-wrap gap-6">
                <Link href="/explore">
                  <Button className="h-16 px-10 text-lg font-black bg-primary hover:bg-primary/90 rounded-2xl shadow-2xl shadow-primary/40 group transition-all">
                    {t.heroVideoCTA} <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <div className="flex items-center gap-4 text-white/60">
                  <div className="size-12 rounded-full border border-white/20 flex items-center justify-center animate-bounce"><MousePointer2 className="size-5" /></div>
                  <span className="text-sm font-bold uppercase tracking-widest">{t.heroSubCTA}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="py-24 container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.3em] text-xs"><Star className="size-4 fill-primary" /> {t.featuredBadge}</div>
              <h2 className="text-5xl md:text-6xl font-headline font-black tracking-tight">{t.featuredTitle}</h2>
            </div>
            <Link href="/explore">
              <Button variant="outline" className="rounded-2xl px-8 py-6 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all text-lg font-bold">
                {t.viewAll} <ArrowRight className="ml-2 size-5" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="size-12 animate-spin text-primary opacity-20" /></div>
          ) : featuredListings && featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {featuredListings.map((listing) => (
                <Card key={listing.id} className="group overflow-hidden border-none shadow-2xl hover:shadow-primary/20 transition-all duration-700 rounded-[2.5rem] bg-white/60 backdrop-blur-md">
                  <div className="relative h-80 overflow-hidden">
                    <Image src={listing.photoUrls?.[0] || 'https://picsum.photos/seed/placeholder/800/600'} alt={listing.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <Badge className="absolute top-8 left-8 bg-white/95 text-primary border-none shadow-xl backdrop-blur font-black px-5 py-2 rounded-xl text-xs tracking-widest uppercase">
                      {CATEGORIES.find(c => c.id === listing.locationCategoryId)?.name}
                    </Badge>
                  </div>
                  <CardContent className="p-10 space-y-6">
                    <h3 className="text-3xl font-bold leading-none tracking-tight group-hover:text-primary transition-colors">{listing.name}</h3>
                    <div className="flex items-center text-muted-foreground text-sm font-medium"><MapPin className="size-5 mr-3 text-secondary" /> {listing.address}, {listing.city}</div>
                    <Link href={`/listing/${listing.id}`} className="w-full inline-block">
                      <Button className="w-full rounded-2xl h-14 bg-foreground hover:bg-primary transition-all duration-300 font-bold text-lg">Detalji</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-[3rem] text-muted-foreground italic">Trenutno nema izdvojenih partnera.</div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-white py-24">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="space-y-8"><Logo /><p className="text-white/40 font-body text-xl leading-relaxed italic pr-8">{t.footerDesc}</p></div>
          <div>
            <h4 className="font-black mb-10 text-2xl uppercase">{t.navExplore}</h4>
            <ul className="space-y-6 text-white/50 font-bold">
              <li><Link href="/explore" className="hover:text-primary transition-all">Interactive Map</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-all">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-all">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-10 text-2xl uppercase">Resursi</h4>
            <ul className="space-y-6 text-white/50 font-bold">
              <li><Link href="/blog" className="hover:text-primary transition-all">{t.navBlog}</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition-all">Admin Panel</Link></li>
            </ul>
          </div>
          <div className="space-y-10">
            <h4 className="font-black mb-10 text-2xl uppercase">Pretplatite se</h4>
            <div className="relative group">
              <Input placeholder="Email" className="bg-white/5 border-white/10 h-14 text-white rounded-2xl pl-6" />
              <Button className="absolute right-2 top-2 h-10 bg-primary rounded-xl px-6 font-bold">OK</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
