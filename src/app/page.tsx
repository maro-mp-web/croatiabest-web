"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES } from '@/app/lib/constants';
import { MOCK_LISTINGS } from '@/app/lib/mock-data';
import { MapPin, ArrowRight, Star, Map as MapIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Logo } from '@/components/brand/Logo';

export default function Home() {
  const { t } = useLanguage();
  const featuredListings = MOCK_LISTINGS.filter(l => l.categoryId === 'restaurants' || l.categoryId === 'hotels');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              {/* LIJEVA STRANA: Interactive Map Card */}
              <div className="relative group order-2 lg:order-1 animate-fade-in">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-3xl opacity-20 group-hover:opacity-30 blur transition duration-700"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-3 border border-white/50 h-full flex flex-col">
                  
                  <div className="lg:hidden text-center mb-4">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold tracking-wide">
                      🇭🇷 {t.navExplore}
                    </span>
                  </div>
                  
                  <div className="relative bg-gradient-to-b from-sky-50 to-indigo-50 rounded-xl overflow-hidden flex-1 flex items-center justify-center min-h-[400px] border border-black/5">
                    <Image 
                      src="https://picsum.photos/seed/croatia-map/1200/800" 
                      alt="Travel Map" 
                      fill 
                      className="object-cover opacity-60 saturate-150"
                      data-ai-hint="croatia map"
                    />
                    
                    {/* Simulated Markers */}
                    <div className="absolute top-[30%] left-[40%] animate-bounce">
                      <div className="size-8 rounded-full bg-primary border-4 border-white shadow-lg flex items-center justify-center">
                        <MapPin className="size-4 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-[60%] left-[70%] animate-pulse">
                      <div className="size-10 rounded-full bg-secondary/90 border-4 border-white shadow-xl flex items-center justify-center text-white font-bold text-xs">
                        12
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
                    <div className="flex gap-2 items-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                      <span>popular places</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                      <span>hidden beaches</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: Text & CTA */}
              <div className="flex flex-col justify-center order-1 lg:order-2 space-y-8 relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="inline-flex">
                  <span className="bg-primary/10 text-primary text-xs md:text-sm font-semibold px-5 py-2 rounded-full border border-primary/20 shadow-sm uppercase tracking-widest">
                    {t.heroBadge}
                  </span>
                </div>

                <h2 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight tracking-tighter">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{t.heroTitlePart1}</span>
                  <br />
                  <span className="text-foreground">{t.heroTitlePart2}</span>
                  <br />
                  <span className="text-secondary relative">
                    {t.heroTitlePart3}
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" preserveAspectRatio="none">
                      <path d="M0,5 Q30,0 60,5 T120,5 T180,5" stroke="currentColor" className="text-accent" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"></path>
                    </svg>
                  </span>
                </h2>

                <div className="space-y-4 max-w-lg">
                  <p className="text-foreground/80 text-lg md:text-xl leading-relaxed font-body">
                    <span className="font-semibold text-primary">From Istria to Dubrovnik</span> — {t.heroDesc1}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                    {t.heroDesc2}
                    <span className="inline-block w-2 h-2 rounded-full bg-secondary"></span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-4">
                  <Link href="/explore" className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white transition-all duration-300 ease-out rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 overflow-hidden">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-secondary"></span>
                    <span className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></span>
                    <span className="relative flex items-center gap-3">
                      <MapIcon className="size-6" />
                      <span>{t.heroCTA}</span>
                    </span>
                  </Link>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    {t.heroSubCTA.split(' ')[0]} <Link href="/explore" className="underline underline-offset-4 decoration-primary hover:text-primary transition font-bold">{t.heroSubCTA.split(' ').slice(1).join(' ')}</Link>
                  </span>
                </div>

                <div className="flex items-center gap-12 pt-8 border-t border-border">
                  <div>
                    <div className="text-3xl font-black text-primary">15k+</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{t.statsPins}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-secondary">4.9★</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{t.statsRating}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Sections */}
        <section className="py-24 container mx-auto px-4 bg-white/50 rounded-[3rem] my-12 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-xs">
                <Star className="size-4 fill-primary" />
                {t.featuredBadge}
              </div>
              <h2 className="text-4xl md:text-5xl font-headline font-black">{t.featuredTitle}</h2>
            </div>
            <Link href="/explore">
              <Button variant="link" className="text-primary p-0 h-auto group text-lg font-bold">
                {t.viewAll} <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredListings.map((listing) => (
              <Card key={listing.id} className="group overflow-hidden border-none shadow-2xl hover:shadow-primary/10 transition-all duration-500 rounded-3xl">
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={listing.images[0]}
                    alt={listing.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <Badge className="absolute top-6 left-6 bg-white/90 text-primary border-none shadow-lg backdrop-blur font-bold px-4 py-1">
                    {CATEGORIES.find(c => c.id === listing.categoryId)?.name}
                  </Badge>
                </div>
                <CardContent className="p-8 space-y-4">
                  <h3 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">{listing.name}</h3>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin className="size-4 mr-2 text-secondary" /> {listing.address}
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <Link href={`/listing/${listing.id}`}>
                      <Button size="sm" className="rounded-xl px-6 bg-foreground hover:bg-primary transition-colors">
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

      <footer className="bg-foreground text-white py-24">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="space-y-6">
            <Logo />
            <p className="text-white/60 font-body text-lg leading-relaxed pt-2">
              {t.footerDesc}
            </p>
          </div>
          <div>
            <h4 className="font-black mb-8 text-xl tracking-wide">Links</h4>
            <ul className="space-y-5 text-white/50 font-medium">
              <li><Link href="/explore" className="hover:text-primary transition-colors">{t.navExplore}</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">{t.navBlog}</Link></li>
              <li><Link href="/info" className="hover:text-primary transition-colors">{t.navInfo}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-8 text-xl tracking-wide">Help</h4>
            <ul className="space-y-5 text-white/50 font-medium">
              <li><Link href="#" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="font-black mb-8 text-xl tracking-wide">Newsletter</h4>
            <div className="flex gap-2">
              <Input placeholder="Email" className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl" />
              <Button className="bg-primary hover:bg-primary/90 rounded-xl">Join</Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-24 pt-12 border-t border-white/5 text-center text-white/20 text-xs font-bold tracking-[0.5em] uppercase">
          &copy; {new Date().getFullYear()} CroatiaBest. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
