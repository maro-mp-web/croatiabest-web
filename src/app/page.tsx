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
import { MOCK_LISTINGS } from '@/app/lib/mock-data';
import { MapPin, ArrowRight, Star, Map as MapIcon, Sparkles, Navigation } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const HERO_SLIDES = [
  { id: 1, title: 'Dubrovnik', tag: 'Biser Jadrana', img: 'https://picsum.photos/seed/dubrovnik/1200/800', hint: 'dubrovnik old town' },
  { id: 2, title: 'Hvar', tag: 'Najsunčaniji otok', img: 'https://picsum.photos/seed/hvar/1200/800', hint: 'hvar harbor' },
  { id: 3, title: 'Plitvice', tag: 'Prirodna čarolija', img: 'https://picsum.photos/seed/plitvice/1200/800', hint: 'plitvice lakes' },
  { id: 4, title: 'Rovinj', tag: 'Istarska romantika', img: 'https://picsum.photos/seed/rovinj/1200/800', hint: 'rovinj istria' },
];

export default function Home() {
  const { t } = useLanguage();
  const featuredListings = MOCK_LISTINGS.filter(l => l.categoryId === 'restaurants' || l.categoryId === 'hotels');

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
      <Navbar />
      
      <main className="flex-1">
        {/* HERO SECTION - NAPREDNI UX/UI */}
        <section className="relative pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden">
          {/* Pozadinski ambijent */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent -z-10 blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-secondary/5 to-transparent -z-10 blur-3xl opacity-30" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
              
              {/* LIJEVA STRANA: Interaktivna karta / Slider destinacija */}
              <div className="relative group order-2 lg:order-1 animate-fade-in">
                {/* Okvir s efektima (Sjaj oko kartice) */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-primary via-secondary to-primary rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur-2xl transition duration-1000"></div>
                
                <div className="relative bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl p-4 sm:p-6 border border-white/60 h-full flex flex-col overflow-hidden">
                  
                  {/* Gornji dio kartice: Live Status */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-wider uppercase">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                      {t.heroDesc2}
                    </div>
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none px-3 font-bold">
                      🇭🇷 Hrvatska
                    </Badge>
                  </div>
                  
                  {/* Slider Destinacija umjesto statične slike */}
                  <div className="relative flex-1 min-h-[400px] sm:min-h-[500px] rounded-2xl overflow-hidden border border-black/5 shadow-inner group/slider">
                    <Carousel className="w-full h-full">
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                              <Badge className="w-fit mb-2 bg-primary hover:bg-primary border-none text-[10px] font-bold uppercase tracking-widest">{slide.tag}</Badge>
                              <h3 className="text-4xl font-headline font-bold">{slide.title}</h3>
                              <p className="text-white/60 text-xs mt-1 flex items-center gap-2">
                                <Navigation className="size-3" /> Pogledaj na karti
                              </p>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <div className="absolute bottom-6 right-6 flex gap-2">
                        <CarouselPrevious className="static translate-y-0 h-10 w-10 bg-white/20 hover:bg-white/40 border-none text-white backdrop-blur-md" />
                        <CarouselNext className="static translate-y-0 h-10 w-10 bg-white/20 hover:bg-white/40 border-none text-white backdrop-blur-md" />
                      </div>
                    </Carousel>

                    {/* Plutajući markeri na vrhu slidera (UX vizualni detalj) */}
                    <div className="absolute top-[20%] left-[30%] pointer-events-none animate-bounce" style={{ animationDuration: '3s' }}>
                      <div className="size-8 rounded-full bg-primary border-4 border-white shadow-xl flex items-center justify-center">
                        <MapPin className="size-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Legenda i Kategorije */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="size-10 rounded-full border-4 border-white bg-secondary/20 flex items-center justify-center text-[10px] font-bold text-secondary backdrop-blur shadow-sm">
                          <Image src={`https://picsum.photos/seed/${i}/100/100`} alt="User" width={40} height={40} className="rounded-full" />
                        </div>
                      ))}
                      <div className="size-10 rounded-full border-4 border-white bg-primary text-white flex items-center justify-center text-[10px] font-bold shadow-sm">+9k</div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Istraženo ovaj tjedan</p>
                      <p className="text-lg font-black text-primary leading-none">1,248 mjesta</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* DESNA STRANA: Tipografija i Akcija */}
              <div className="flex flex-col justify-center order-1 lg:order-2 space-y-10 relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
                
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2">
                    <span className="bg-primary/10 text-primary text-xs font-black px-4 py-2 rounded-full border border-primary/20 shadow-sm tracking-widest uppercase">
                      {t.heroBadge}
                    </span>
                    <Sparkles className="size-4 text-secondary animate-pulse" />
                  </div>

                  <h1 className="text-5xl sm:text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter text-foreground">
                    <span className="text-gradient block">{t.heroTitlePart1}</span>
                    <span className="block">{t.heroTitlePart2}</span>
                    <span className="text-secondary relative inline-block italic font-headline font-normal">
                      {t.heroTitlePart3}
                      <svg className="absolute -bottom-4 left-0 w-full h-4 text-accent" viewBox="0 0 200 8" preserveAspectRatio="none">
                        <path d="M0,5 Q30,0 60,5 T120,5 T180,5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4"></path>
                      </svg>
                    </span>
                  </h1>

                  <div className="space-y-6 max-w-lg">
                    <p className="text-foreground/80 text-xl md:text-2xl leading-relaxed font-body italic">
                      "<span className="font-bold text-primary">From Istria to Dubrovnik</span> — {t.heroDesc1}"
                    </p>
                    <div className="flex items-center gap-4 py-4 px-6 bg-secondary/5 rounded-2xl border border-secondary/10 backdrop-blur-sm">
                      <div className="size-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                        <MapIcon className="size-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Interaktivni vodič</p>
                        <p className="text-xs text-muted-foreground">Pronađite skrivena mjesta u sekundi</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glavne Akcije */}
                <div className="flex flex-wrap items-center gap-6 pt-4">
                  <Link href="/explore" className="group relative inline-flex items-center justify-center px-12 py-6 text-xl font-black text-white transition-all duration-300 ease-out rounded-[2rem] shadow-2xl hover:shadow-primary/40 active:scale-95 overflow-hidden">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary via-primary to-secondary"></span>
                    <span className="absolute -inset-1.5 bg-gradient-to-r from-primary via-secondary to-primary rounded-[2rem] blur opacity-40 group-hover:opacity-80 transition duration-500"></span>
                    <span className="relative flex items-center gap-4">
                      <MapIcon className="size-7" />
                      <span>{t.heroCTA}</span>
                    </span>
                  </Link>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground font-medium uppercase tracking-widest">{t.heroSubCTA.split(' ')[0]}</span>
                    <Link href="/explore" className="text-lg font-black text-foreground underline decoration-primary decoration-4 underline-offset-8 hover:text-primary transition-colors">
                      {t.heroSubCTA.split(' ').slice(1).join(' ')}
                    </Link>
                  </div>
                </div>

                {/* Social Proof / Stats */}
                <div className="flex items-center gap-12 pt-10 border-t border-border/60">
                  <div className="group cursor-default">
                    <div className="text-4xl font-black text-primary transition-transform group-hover:scale-110">15k+</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t.statsPins}</div>
                  </div>
                  <div className="group cursor-default">
                    <div className="text-4xl font-black text-secondary transition-transform group-hover:scale-110">4.9★</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t.statsRating}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Sections */}
        <section className="py-24 container mx-auto px-4 bg-white/40 backdrop-blur-sm rounded-[4rem] my-12 shadow-2xl border border-white/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.3em] text-xs">
                <Star className="size-4 fill-primary" />
                {t.featuredBadge}
              </div>
              <h2 className="text-5xl md:text-6xl font-headline font-black tracking-tight">{t.featuredTitle}</h2>
            </div>
            <Link href="/explore">
              <Button variant="outline" className="rounded-2xl px-8 py-6 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all text-lg font-bold group">
                {t.viewAll} <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredListings.map((listing) => (
              <Card key={listing.id} className="group overflow-hidden border-none shadow-2xl hover:shadow-primary/20 transition-all duration-700 rounded-[2.5rem] bg-white/60 backdrop-blur-md">
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={listing.images[0]}
                    alt={listing.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Badge className="absolute top-8 left-8 bg-white/95 text-primary border-none shadow-xl backdrop-blur font-black px-5 py-2 rounded-xl text-xs tracking-widest uppercase">
                    {CATEGORIES.find(c => c.id === listing.categoryId)?.name}
                  </Badge>
                </div>
                <CardContent className="p-10 space-y-6">
                  <h3 className="text-3xl font-bold leading-none tracking-tight group-hover:text-primary transition-colors">{listing.name}</h3>
                  <div className="flex items-center text-muted-foreground text-sm font-medium">
                    <MapPin className="size-5 mr-3 text-secondary" /> {listing.address}
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-black/5">
                    <Link href={`/listing/${listing.id}`} className="w-full">
                      <Button className="w-full rounded-2xl h-14 bg-foreground hover:bg-primary transition-all duration-300 font-bold text-lg group-hover:shadow-lg group-hover:shadow-primary/30">
                        Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER - MODERN RESTYLE */}
      <footer className="bg-foreground text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Image src="/logo.png" alt="CroatiaBest" width={200} height={60} className="h-12 w-auto brightness-0 invert" />
            </div>
            <p className="text-white/40 font-body text-xl leading-relaxed italic pr-8">
              {t.footerDesc}
            </p>
          </div>
          <div>
            <h4 className="font-black mb-10 text-2xl tracking-tight text-white uppercase">{t.navExplore}</h4>
            <ul className="space-y-6 text-white/50 font-bold">
              <li><Link href="/explore" className="hover:text-primary transition-all hover:translate-x-2 inline-block">Interactive Map</Link></li>
              <li><Link href="/explore" className="hover:text-primary transition-all hover:translate-x-2 inline-block">Beaches & Islands</Link></li>
              <li><Link href="/explore" className="hover:text-primary transition-all hover:translate-x-2 inline-block">Hidden Gems</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-10 text-2xl tracking-tight text-white uppercase">Resources</h4>
            <ul className="space-y-6 text-white/50 font-bold">
              <li><Link href="/blog" className="hover:text-primary transition-all hover:translate-x-2 inline-block">{t.navBlog}</Link></li>
              <li><Link href="/info" className="hover:text-primary transition-all hover:translate-x-2 inline-block">{t.navInfo}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-all hover:translate-x-2 inline-block">Contact Support</Link></li>
            </ul>
          </div>
          <div className="space-y-10">
            <h4 className="font-black mb-10 text-2xl tracking-tight text-white uppercase">Join the Journey</h4>
            <div className="flex flex-col gap-4">
              <div className="relative group">
                <Input placeholder="Your Email" className="bg-white/5 border-white/10 h-14 text-white placeholder:text-white/20 rounded-2xl pl-6 focus:ring-primary focus:border-primary transition-all" />
                <Button className="absolute right-2 top-2 h-10 bg-primary hover:bg-primary/90 rounded-xl px-6 font-bold">Join</Button>
              </div>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold text-center">No spam, only magic.</p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-xs font-black tracking-[0.5em] uppercase">
            &copy; {new Date().getFullYear()} CroatiaBest. Developed with 💙
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-white/20">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
