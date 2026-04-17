
"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES, CITIES, ISLANDS } from '@/app/lib/constants';
import { 
  MapPin, 
  ArrowRight, 
  Star, 
  Navigation, 
  Play, 
  MousePointer2, 
  Loader2, 
  ShieldCheck,
  Utensils,
  Hotel,
  Umbrella,
  GlassWater,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Logo } from '@/components/brand/Logo';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';

export default function Home() {
  const { t } = useLanguage();
  const firestore = useFirestore();

  // Query za Premium partnere (plaćene kategorije/objekti)
  const premiumQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'listings'),
      where('status', '==', 'active'),
      where('locationCategoryType', '==', 'Paid'),
      limit(6)
    );
  }, [firestore]);

  const { data: premiumListings, isLoading: isPremiumLoading } = useCollection(premiumQuery);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <Navbar />
      
      <main className="flex-1">
        {/* LUXURY HERO SECTION */}
        <section className="relative h-[95vh] w-full overflow-hidden flex items-center">
          <div className="absolute inset-0 z-0">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover scale-105"
              poster="https://picsum.photos/seed/croatia-hero/1920/1080"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-shoreline-with-clear-water-4422-large.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-black/20 z-10" />
          </div>

          <div className="container mx-auto px-6 relative z-20">
            <div className="max-w-3xl animate-fade-in space-y-8">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-full text-white text-[10px] font-black tracking-[0.4em] uppercase">
                <Sparkles className="size-4 text-primary fill-primary animate-pulse" /> {t.heroBadge}
              </div>
              <h1 className="text-7xl md:text-[9rem] font-black text-white leading-[0.85] tracking-tighter font-headline italic drop-shadow-2xl">
                {t.heroVideoTitle}
              </h1>
              <p className="text-xl md:text-3xl text-white/80 font-body italic max-w-xl leading-relaxed">
                {t.heroVideoSub}
              </p>
              <div className="flex flex-wrap gap-6 pt-6">
                <Link href="/explore">
                  <Button className="h-20 px-12 text-xl font-black bg-primary hover:bg-primary/90 rounded-[2rem] shadow-2xl shadow-primary/40 group transition-all">
                    {t.heroVideoCTA} <ArrowRight className="ml-3 size-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <div className="flex items-center gap-4 text-white/60">
                  <div className="size-14 rounded-full border border-white/20 flex items-center justify-center animate-bounce">
                    <MousePointer2 className="size-6" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.2em]">{t.heroSubCTA}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom decorative bar */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
        </section>

        {/* QUICK CATEGORY ACCESS - Focusing on Paid Categories */}
        <section className="py-20 container mx-auto px-6 relative z-30 -mt-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { id: 'restaurants', icon: <Utensils />, name: 'Gastronomija', color: 'bg-primary' },
              { id: 'hotels', icon: <Hotel />, name: 'Smještaj', color: 'bg-secondary' },
              { id: 'beaches', icon: <Umbrella />, name: 'Plaže', color: 'bg-blue-400' },
              { id: 'wineries', icon: <GlassWater />, name: 'Vinarije', color: 'bg-purple-500' },
            ].map((cat) => (
              <Link key={cat.id} href={`/explore?category=${cat.id}`}>
                <Card className="group hover:scale-105 transition-all duration-500 rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white/95 backdrop-blur-xl cursor-pointer">
                  <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                    <div className={`size-16 rounded-2xl ${cat.color} text-white flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform`}>
                      {cat.icon}
                    </div>
                    <p className="font-black text-sm uppercase tracking-widest">{cat.name}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* PREMIUM PARTNERS SECTION - Highlighting Paid Listings */}
        <section className="py-32 container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] text-[10px]">
                <Star className="size-5 fill-primary" /> {t.featuredBadge}
              </div>
              <h2 className="text-6xl md:text-8xl font-headline font-black tracking-tighter leading-none italic">
                {t.featuredTitle}
              </h2>
              <p className="text-muted-foreground text-xl italic font-body max-w-xl">
                Ekskluzivni izbor najboljih restorana, hotela i vinarija koje smo osobno provjerili.
              </p>
            </div>
            <Link href="/explore">
              <Button variant="ghost" className="text-primary font-black text-sm uppercase tracking-widest hover:bg-primary/5 px-8 h-16 rounded-2xl group">
                {t.viewAll} <ChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>

          {isPremiumLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[500px] rounded-[3rem] bg-muted animate-pulse" />
              ))}
            </div>
          ) : premiumListings && premiumListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {premiumListings.map((listing) => {
                const cat = CATEGORIES.find(c => c.id === (listing.locationCategoryId || listing.categoryId));
                return (
                  <Link key={listing.id} href={`/listing/${listing.id}`}>
                    <Card className="group overflow-hidden border-none shadow-2xl hover:shadow-primary/20 transition-all duration-700 rounded-[3rem] bg-white h-full flex flex-col">
                      <div className="relative h-[400px] overflow-hidden">
                        <Image 
                          src={listing.photoUrls?.[0] || 'https://picsum.photos/seed/placeholder/800/1000'} 
                          alt={listing.name} 
                          fill 
                          className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <Badge className="absolute top-8 left-8 bg-white/95 text-primary border-none shadow-2xl backdrop-blur font-black px-6 py-2.5 rounded-2xl text-[10px] tracking-widest uppercase">
                          {cat?.name}
                        </Badge>

                        {listing.locationCategoryType === 'Paid' && (
                          <div className="absolute top-8 right-8 size-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl">
                            <Star className="size-6 fill-white" />
                          </div>
                        )}

                        <div className="absolute bottom-8 left-8 right-8 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                           <Button className="w-full h-14 bg-white text-primary font-black rounded-2xl shadow-2xl">
                             ISTRAŽI OBJEKT
                           </Button>
                        </div>
                      </div>
                      <CardContent className="p-10 flex-1 flex flex-col space-y-6">
                        <div className="space-y-2">
                          <h3 className="text-4xl font-black leading-none tracking-tighter group-hover:text-primary transition-colors">
                            {listing.name}
                          </h3>
                          <div className="flex items-center text-muted-foreground text-base font-bold italic">
                            <MapPin className="size-5 mr-2 text-secondary" /> {listing.city}
                          </div>
                        </div>
                        <p className="text-muted-foreground font-body italic line-clamp-2">
                          {listing.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-32 border-4 border-dashed rounded-[4rem] border-muted">
              <Sparkles className="size-16 text-muted mx-auto mb-6 opacity-20" />
              <p className="text-2xl text-muted-foreground font-body italic">Trenutno nema izdvojenih partnera u sustavu.</p>
            </div>
          )}
        </section>

        {/* PUBLIC GEMS SECTION - Free Listings */}
        <section className="py-32 bg-secondary/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center text-center mb-20 space-y-6">
              <Badge variant="outline" className="border-secondary text-secondary font-black px-6 py-2 rounded-full text-[10px] tracking-[0.3em] uppercase">
                Javni Dragulji
              </Badge>
              <h2 className="text-6xl md:text-7xl font-headline font-black tracking-tight italic">
                Otkrijte skrivenu Hrvatsku
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl font-body italic">
                Najljepše besplatne plaže, povijesne znamenitosti i vidikovci koje ne smijete propustiti.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {CITIES.slice(0, 4).map((city) => (
                <Link key={city.slug} href={`/cities/${city.slug}`}>
                  <div className="relative h-[500px] rounded-[3rem] overflow-hidden group cursor-pointer shadow-2xl">
                    <Image 
                      src={city.image} 
                      alt={city.name} 
                      fill 
                      className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">{city.region}</p>
                      <h4 className="text-4xl font-black italic tracking-tighter mb-4">{city.name}</h4>
                      <Button variant="outline" className="w-fit rounded-xl border-white/20 text-white hover:bg-white hover:text-black font-black text-[10px] uppercase">
                        Vodič kroz grad
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SUBMIT CTA SECTION */}
        <section className="py-32 container mx-auto px-6">
          <div className="bg-foreground text-white rounded-[4rem] p-12 md:p-24 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 right-0 size-[600px] bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10 max-w-2xl space-y-8">
              <h2 className="text-5xl md:text-7xl font-headline font-black leading-[0.9] italic">
                Vlasnik ste objekta?<br/>Postanite dio elite.
              </h2>
              <p className="text-xl text-white/60 font-body italic leading-relaxed">
                Pridružite se vodećem portalu za luksuzna putovanja u Hrvatskoj. Istaknite se, povećajte vidljivost i privucite klijente visoke platežne moći.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/submit">
                  <Button className="h-16 px-10 bg-primary text-white font-black rounded-2xl text-lg uppercase tracking-widest shadow-2xl shadow-primary/40">
                    PRIJAVI SVOJ POSAO
                  </Button>
                </Link>
                <Link href="/blog">
                   <Button variant="outline" className="h-16 px-10 border-white/20 text-white hover:bg-white hover:text-black font-black rounded-2xl text-lg uppercase tracking-widest">
                    ZAŠTO MI?
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative z-10 size-80 md:size-96 hidden lg:block">
              <div className="absolute inset-0 border-8 border-primary/20 rounded-[4rem] rotate-12" />
              <div className="absolute inset-0 border-8 border-white/10 rounded-[4rem] -rotate-12" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Logo className="scale-[2]" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-white py-32 border-t border-white/5">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-20">
          <div className="md:col-span-5 space-y-10">
            <Logo />
            <p className="text-white/40 font-body text-2xl leading-relaxed italic pr-20">
              {t.footerDesc} Otkrivamo najbolje od Jadrana onima koji traže savršenstvo.
            </p>
            <div className="flex gap-4">
               <div className="size-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"><ShieldCheck className="size-6" /></div>
               <div className="size-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"><Star className="size-6" /></div>
               <div className="size-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"><Play className="size-6" /></div>
            </div>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-black mb-10 text-xs uppercase tracking-[0.3em] text-primary">{t.navExplore}</h4>
            <ul className="space-y-6 text-white/50 font-bold text-sm uppercase tracking-widest">
              <li><Link href="/explore" className="hover:text-white transition-all">Interaktivna Karta</Link></li>
              <li><Link href="/cities/zagreb" className="hover:text-white transition-all">Gradovi</Link></li>
              <li><Link href="/islands/hvar" className="hover:text-white transition-all">Otoci</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-all">Privatnost</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-black mb-10 text-xs uppercase tracking-[0.3em] text-primary">Resursi</h4>
            <ul className="space-y-6 text-white/50 font-bold text-sm uppercase tracking-widest">
              <li><Link href="/blog" className="hover:text-white transition-all">{t.navBlog}</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-all">Admin</Link></li>
              <li><Link href="/submit" className="hover:text-white transition-all">Prijava</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-all">Uvjeti</Link></li>
            </ul>
          </div>
          <div className="md:col-span-3 space-y-10">
            <h4 className="font-black mb-10 text-xs uppercase tracking-[0.3em] text-primary">Partner Newsletter</h4>
            <p className="text-white/40 text-sm italic font-body">Pratite trendove u hrvatskom luksuznom turizmu.</p>
            <div className="relative group">
              <Input placeholder="Email adresa" className="bg-white/5 border-white/10 h-16 text-white rounded-2xl pl-6 focus:ring-primary" />
              <Button className="absolute right-2 top-2 h-12 bg-primary rounded-xl px-8 font-black">OK</Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6">
           <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">&copy; 2024 CroatiaBest Luxury Guide</p>
           <div className="flex gap-8 text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
             <span className="cursor-pointer hover:text-white">Facebook</span>
             <span className="cursor-pointer hover:text-white">Instagram</span>
             <span className="cursor-pointer hover:text-white">LinkedIn</span>
           </div>
        </div>
      </footer>
    </div>
  );
}

    