
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
import { MapPin, ArrowRight, Star, Navigation, Play, MousePointer2, Loader2 } from 'lucide-react';
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

  // Dohvaćanje izdvojenih plaćenih objekata iz baze
  const featuredQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'listings'),
      where('status', '==', 'active'),
      where('type', '==', 'paid'),
      limit(6)
    );
  }, [firestore]);

  const { data: featuredListings, isLoading } = useCollection(featuredQuery);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
      <Navbar />
      
      <main className="flex-1">
        {/* HERO SECTION - VIDEO BACKGROUND */}
        <section className="relative h-[90vh] w-full overflow-hidden flex items-center">
          <div className="absolute inset-0 z-0">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover brightness-[0.7]"
              poster="https://picsum.photos/seed/croatia-hero/1920/1080"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-shoreline-with-clear-water-4422-large.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
          </div>

          <div className="container mx-auto px-6 relative z-20">
            <div className="max-w-2xl animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-primary-foreground text-xs font-bold tracking-[0.2em] uppercase">
                <Play className="size-3 fill-primary text-primary" /> Live from the Adriatic
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8 font-headline italic">
                {t.heroVideoTitle}
              </h1>
              <p className="text-xl md:text-2xl text-white/80 font-body mb-10 leading-relaxed max-w-lg">
                {t.heroVideoSub}
              </p>
              <div className="flex flex-wrap gap-6">
                <Link href="/explore">
                  <Button className="h-16 px-10 text-lg font-black bg-primary hover:bg-primary/90 rounded-2xl shadow-2xl shadow-primary/40 group transition-all">
                    {t.heroVideoCTA} <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <div className="flex items-center gap-4 text-white/60">
                  <div className="size-12 rounded-full border border-white/20 flex items-center justify-center animate-bounce">
                    <MousePointer2 className="size-5" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest">{t.heroSubCTA}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-20" />
        </section>

        {/* EXPLORE SECTION */}
        <section className="relative py-24 overflow-hidden -mt-10 z-30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              <div className="relative group animate-fade-in">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary via-secondary to-primary rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur-2xl transition duration-1000"></div>
                
                <div className="relative bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-3 border border-white/60 flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between p-4 mb-2">
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-wider uppercase">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                      {t.heroDesc2}
                    </div>
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none px-4 py-1 font-bold">
                      🇭🇷 Hrvatska
                    </Badge>
                  </div>
                  
                  <div className="relative flex-1 min-h-[400px] sm:min-h-[500px] rounded-[2rem] overflow-hidden border border-black/5 shadow-inner group/slider">
                    <Carousel className="w-full h-full" opts={{ loop: true }}>
                      <CarouselContent className="h-full">
                        {HERO_SLIDES.map((slide) => (
                          <CarouselItem key={slide.id} className="relative h-full">
                            <Image 
                              src={slide.img} 
                              alt={slide.title} 
                              fill 
                              className="object-cover transition-transform duration-10000 group-hover/slider:scale-110"
                              data-ai-hint={slide.hint}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-10 text-white">
                              <Badge className="w-fit mb-3 bg-primary hover:bg-primary border-none text-[10px] font-black uppercase tracking-[0.2em]">{slide.tag}</Badge>
                              <h3 className="text-5xl font-headline font-bold mb-2">{slide.title}</h3>
                              <p className="text-white/70 text-sm flex items-center gap-2 font-medium">
                                <Navigation className="size-4" /> Pogledaj na interaktivnoj karti
                              </p>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <div className="absolute bottom-8 right-8 flex gap-3">
                        <CarouselPrevious className="static translate-y-0 h-12 w-12 bg-white/20 hover:bg-white/40 border-none text-white backdrop-blur-md rounded-xl" />
                        <CarouselNext className="static translate-y-0 h-12 w-12 bg-white/20 hover:bg-white/40 border-none text-white backdrop-blur-md rounded-xl" />
                      </div>
                    </Carousel>
                  </div>

                  <div className="p-6 flex items-center justify-between border-t border-black/5 bg-secondary/5 mt-2">
                    <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-primary animate-pulse" /> Popularno
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-secondary" /> Novo
                      </div>
                    </div>
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="size-10 rounded-full border-4 border-white bg-secondary/20 overflow-hidden shadow-sm">
                          <Image src={`https://picsum.photos/seed/user${i}/80/80`} alt="User" width={40} height={40} />
                        </div>
                      ))}
                      <div className="size-10 rounded-full border-4 border-white bg-primary text-white flex items-center justify-center text-[10px] font-black shadow-sm">+9k</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-12 animate-fade-in">
                <div className="space-y-8">
                  <div className="inline-flex">
                    <span className="bg-primary/10 text-primary text-sm font-black px-6 py-2.5 rounded-full border border-primary/20 shadow-sm tracking-[0.2em] uppercase">
                      {t.heroBadge}
                    </span>
                  </div>

                  <h2 className="text-6xl sm:text-7xl font-black leading-[0.85] tracking-tighter text-foreground">
                    <span className="text-gradient block">{t.heroTitlePart1}</span>
                    <span className="block">{t.heroTitlePart2}</span>
                    <span className="text-secondary relative inline-block italic font-headline font-normal mt-2">
                      {t.heroTitlePart3}
                      <svg className="absolute -bottom-4 left-0 w-full h-4 text-accent/40" viewBox="0 0 200 8" preserveAspectRatio="none">
                        <path d="M0,5 Q30,0 60,5 T120,5 T180,5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"></path>
                      </svg>
                    </span>
                  </h2>

                  <div className="space-y-6 max-w-xl">
                    <p className="text-foreground/80 text-xl leading-relaxed font-body italic">
                      "<span className="font-bold text-primary">From Istria to Dubrovnik</span> — {t.heroDesc1}"
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-8 pt-4">
                  <Link href="/explore" className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-black text-white transition-all duration-300 ease-out rounded-2xl shadow-xl hover:shadow-primary/40 active:scale-95 overflow-hidden">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary to-secondary"></span>
                    <span className="relative flex items-center gap-3 uppercase tracking-widest">
                      <Navigation className="size-6" />
                      <span>{t.heroCTA}</span>
                    </span>
                  </Link>
                  <Link href="/explore" className="text-lg font-black text-foreground underline decoration-primary decoration-4 underline-offset-8 hover:text-primary transition-colors">
                    {t.heroSubCTA}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="py-24 container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.3em] text-xs">
                <Star className="size-4 fill-primary" />
                {t.featuredBadge}
              </div>
              <h2 className="text-5xl md:text-6xl font-headline font-black tracking-tight">{t.featuredTitle}</h2>
            </div>
            <Link href="/explore">
              <Button variant="outline" className="rounded-2xl px-8 py-6 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all text-lg font-bold">
                {t.viewAll} <ArrowRight className="ml-2 size-5" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-12 animate-spin text-primary opacity-20" />
            </div>
          ) : featuredListings && featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {featuredListings.map((listing) => (
                <Card key={listing.id} className="group overflow-hidden border-none shadow-2xl hover:shadow-primary/20 transition-all duration-700 rounded-[2.5rem] bg-white/60 backdrop-blur-md">
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={listing.photoUrls?.[0] || 'https://picsum.photos/seed/placeholder/800/600'}
                      alt={listing.name || listing.objectName}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <Badge className="absolute top-8 left-8 bg-white/95 text-primary border-none shadow-xl backdrop-blur font-black px-5 py-2 rounded-xl text-xs tracking-widest uppercase">
                      {CATEGORIES.find(c => c.id === listing.locationCategoryId)?.name}
                    </Badge>
                  </div>
                  <CardContent className="p-10 space-y-6">
                    <h3 className="text-3xl font-bold leading-none tracking-tight group-hover:text-primary transition-colors">{listing.name || listing.objectName}</h3>
                    <div className="flex items-center text-muted-foreground text-sm font-medium">
                      <MapPin className="size-5 mr-3 text-secondary" /> {listing.address}, {listing.city}
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-black/5">
                      <Link href={`/listing/${listing.id}`} className="w-full">
                        <Button className="w-full rounded-2xl h-14 bg-foreground hover:bg-primary transition-all duration-300 font-bold text-lg">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-[3rem] text-muted-foreground italic">
              Trenutno nema izdvojenih mjesta. Dodajte ih putem Admin Panela!
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="space-y-8">
            <Logo className="mb-4" />
            <p className="text-white/40 font-body text-xl leading-relaxed italic pr-8">
              {t.footerDesc}
            </p>
          </div>
          <div>
            <h4 className="font-black mb-10 text-2xl tracking-tight text-white uppercase">{t.navExplore}</h4>
            <ul className="space-y-6 text-white/50 font-bold">
              <li><Link href="/explore" className="hover:text-primary transition-all">Interactive Map</Link></li>
              <li><Link href="/explore" className="hover:text-primary transition-all">Beaches & Islands</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-10 text-2xl tracking-tight text-white uppercase">Resources</h4>
            <ul className="space-y-6 text-white/50 font-bold">
              <li><Link href="/blog" className="hover:text-primary transition-all">{t.navBlog}</Link></li>
              <li><Link href="/info" className="hover:text-primary transition-all">{t.navInfo}</Link></li>
            </ul>
          </div>
          <div className="space-y-10">
            <h4 className="font-black mb-10 text-2xl tracking-tight text-white uppercase">Join the Journey</h4>
            <div className="relative group">
              <Input placeholder="Your Email" className="bg-white/5 border-white/10 h-14 text-white placeholder:text-white/20 rounded-2xl pl-6" />
              <Button className="absolute right-2 top-2 h-10 bg-primary hover:bg-primary/90 rounded-xl px-6 font-bold">Join</Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-24 pt-12 border-t border-white/5">
          <p className="text-white/20 text-xs font-black tracking-[0.5em] uppercase text-center md:text-left">
            &copy; {new Date().getFullYear()} CroatiaBest. Developed with 💙
          </p>
        </div>
      </footer>
    </div>
  );
}
