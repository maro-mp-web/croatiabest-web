
"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES, CITIES } from '@/app/lib/constants';
import { Logo } from '@/components/brand/Logo';
import { 
  MapPin, 
  ArrowRight, 
  Star, 
  Sparkles, 
  ChevronRight,
  Utensils,
  Hotel,
  Umbrella,
  GlassWater,
  Map as MapIcon,
  Navigation,
  Info
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';

const MAP_CENTER = { lat: 44.5, lng: 16.5 };

export default function Home() {
  const { t } = useLanguage();
  const firestore = useFirestore();
  const [selectedListingId, setSelectedListingId] = React.useState<string | null>(null);

  // Premium listings for featured section
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

  // All active listings for the map
  const allListingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'listings'), where('status', '==', 'active'));
  }, [firestore]);

  const { data: allListings } = useCollection(allListingsQuery);
  const selectedListing = allListings?.find(l => l.id === selectedListingId);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <Navbar />
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] w-full overflow-hidden flex items-center pt-20">
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

          <div className="container mx-auto px-6 relative z-20 pb-12">
            <div className="max-w-4xl animate-fade-in space-y-8">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-full text-white text-[12px] font-black tracking-[0.4em] uppercase">
                <Sparkles className="size-4 text-primary fill-primary animate-pulse" /> {t.heroBadge}
              </div>
              <h1 className="text-6xl md:text-[9rem] font-black text-white leading-[0.85] tracking-tighter font-headline italic drop-shadow-2xl">
                {t.heroVideoTitle}
              </h1>
              <p className="text-xl md:text-3xl text-white/80 font-body italic max-w-2xl leading-relaxed">
                {t.heroVideoSub}
              </p>
              <div className="flex flex-wrap gap-6 pt-8">
                <Link href="/explore">
                  <Button className="h-24 px-16 text-2xl font-black bg-primary hover:bg-primary/90 rounded-[2.5rem] shadow-2xl shadow-primary/40 group transition-all">
                    {t.heroVideoCTA} <ArrowRight className="ml-4 size-8 group-hover:translate-x-3 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section className="py-24 bg-white/50 backdrop-blur-sm relative z-30">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { id: 'restaurants', icon: <Utensils className="size-8" />, name: 'Gastronomija', color: 'bg-primary' },
                { id: 'hotels', icon: <Hotel className="size-8" />, name: 'Smještaj', color: 'bg-secondary' },
                { id: 'beaches', icon: <Umbrella className="size-8" />, name: 'Plaže', color: 'bg-blue-400' },
                { id: 'wineries', icon: <GlassWater className="size-8" />, name: 'Vinarije', color: 'bg-purple-500' },
              ].map((cat) => (
                <Link key={cat.id} href={`/explore?category=${cat.id}`}>
                  <Card className="group hover:scale-110 transition-all duration-500 rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white cursor-pointer hover:shadow-primary/10">
                    <CardContent className="p-10 flex flex-col items-center text-center gap-6">
                      <div className={`size-20 rounded-[1.5rem] ${cat.color} text-white flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform`}>
                        {cat.icon}
                      </div>
                      <p className="font-black text-lg uppercase tracking-[0.2em]">{cat.name}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* INTERACTIVE MAP SECTION */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-4 space-y-8">
                <Badge variant="outline" className="border-primary text-primary font-black px-6 py-2 uppercase tracking-[0.3em] text-[10px]">Interaktivni vodič</Badge>
                <h2 className="text-6xl font-headline font-black italic tracking-tighter leading-none">Istraži Hrvatsku<br/>uživo na karti</h2>
                <p className="text-xl text-muted-foreground font-body italic leading-relaxed">
                  Pronađite skrivene ljekarne, najbolje plaže i ekskluzivne restorane. Svi markeri su provjereni i ažurirani.
                </p>
                <div className="space-y-4 pt-6">
                  {CATEGORIES.slice(0, 5).map(cat => (
                    <div key={cat.id} className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/5 border border-black/5">
                      <div className="size-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm font-black uppercase tracking-widest">{cat.name}</span>
                    </div>
                  ))}
                </div>
                <Link href="/explore" className="block pt-6">
                  <Button variant="outline" className="w-full h-16 rounded-2xl border-primary text-primary font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                    OTVORI CIJELU KARTU <Navigation className="ml-2 size-4" />
                  </Button>
                </Link>
              </div>

              <div className="lg:col-span-8">
                <div className="h-[700px] w-full rounded-[4rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] relative border-[12px] border-white group">
                  <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                    <Map
                      defaultCenter={MAP_CENTER}
                      defaultZoom={7}
                      disableDefaultUI={true}
                      gestureHandling={'greedy'}
                      className="w-full h-full"
                    >
                      {allListings?.map((l) => {
                        if (l.latitude === undefined || l.longitude === undefined) return null;
                        const cat = CATEGORIES.find(c => c.id === (l.locationCategoryId || l.categoryId));
                        return (
                          <AdvancedMarker
                            key={l.id}
                            position={{ lat: l.latitude, lng: l.longitude }}
                            onClick={() => setSelectedListingId(l.id)}
                          >
                            <Pin background={cat?.color || '#333'} glyphColor={'#fff'} borderColor={'#fff'} />
                          </AdvancedMarker>
                        );
                      })}

                      {selectedListing && selectedListing.latitude !== undefined && selectedListing.longitude !== undefined && (
                        <InfoWindow
                          position={{ lat: selectedListing.latitude, lng: selectedListing.longitude }}
                          onCloseClick={() => setSelectedListingId(null)}
                        >
                          <div className="p-4 max-w-[240px] space-y-4">
                            <h4 className="font-black text-lg leading-tight tracking-tight">{selectedListing.name}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 italic">{selectedListing.description}</p>
                            <Link href={`/listing/${selectedListing.id}`} className="block">
                              <Button size="sm" className="w-full h-10 text-[10px] font-black rounded-xl bg-primary shadow-lg shadow-primary/20">
                                POGLEDAJ DETALJE
                              </Button>
                            </Link>
                          </div>
                        </InfoWindow>
                      )}
                    </Map>
                  </APIProvider>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PREMIUM PARTNERS SECTION */}
        <section className="py-32 container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] text-[10px]">
                <Star className="size-6 fill-primary" /> {t.featuredBadge}
              </div>
              <h2 className="text-6xl md:text-[7rem] font-headline font-black tracking-tighter leading-none italic">
                {t.featuredTitle}
              </h2>
            </div>
            <Link href="/explore">
              <Button variant="ghost" className="text-primary font-black text-base uppercase tracking-widest hover:bg-primary/5 px-10 h-20 rounded-3xl group">
                {t.viewAll} <ChevronRight className="ml-3 group-hover:translate-x-3 transition-transform" />
              </Button>
            </Link>
          </div>

          {isPremiumLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[550px] rounded-[3.5rem] bg-muted animate-pulse" />
              ))}
            </div>
          ) : premiumListings && premiumListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {premiumListings.map((listing) => {
                const cat = CATEGORIES.find(c => c.id === (listing.locationCategoryId || listing.categoryId));
                return (
                  <Link key={listing.id} href={`/listing/${listing.id}`}>
                    <Card className="group overflow-hidden border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:shadow-primary/20 transition-all duration-700 rounded-[3.5rem] bg-white h-full flex flex-col">
                      <div className="relative h-[450px] overflow-hidden">
                        <Image 
                          src={listing.photoUrls?.[0] || 'https://picsum.photos/seed/placeholder/800/1000'} 
                          alt={listing.name} 
                          fill 
                          className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                        />
                        <Badge className="absolute top-10 left-10 bg-white/95 text-primary border-none shadow-2xl backdrop-blur font-black px-8 py-3 rounded-2xl text-[11px] tracking-widest uppercase">
                          {cat?.name}
                        </Badge>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <CardContent className="p-12 flex-1 flex flex-col space-y-6">
                        <h3 className="text-5xl font-black leading-none tracking-tighter group-hover:text-primary transition-colors">
                          {listing.name}
                        </h3>
                        <div className="flex items-center text-muted-foreground text-lg font-bold italic">
                          <MapPin className="size-6 mr-3 text-secondary" /> {listing.city}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-32 border-8 border-dashed rounded-[5rem] border-muted bg-muted/5">
              <p className="text-3xl text-muted-foreground font-body italic">Trenutno nema izdvojenih partnera.</p>
            </div>
          )}
        </section>

        {/* PUBLIC GEMS SECTION */}
        <section className="py-32 bg-foreground text-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center text-center mb-24 space-y-8">
              <Badge variant="outline" className="border-primary text-primary font-black px-8 py-3 rounded-full text-[12px] tracking-[0.4em] uppercase">
                Javni Dragulji
              </Badge>
              <h2 className="text-6xl md:text-[8rem] font-headline font-black tracking-tighter italic leading-none">
                Otkrijte skrivenu Hrvatsku
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              {CITIES.slice(0, 4).map((city) => (
                <Link key={city.slug} href={`/cities/${city.slug}`}>
                  <div className="relative h-[550px] rounded-[3.5rem] overflow-hidden group cursor-pointer shadow-2xl">
                    <Image 
                      src={city.image} 
                      alt={city.name} 
                      fill 
                      className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                    <div className="absolute inset-0 p-12 flex flex-col justify-end text-white">
                      <p className="text-[12px] font-black uppercase tracking-[0.4em] text-primary mb-3">{city.region}</p>
                      <h4 className="text-5xl font-black italic tracking-tighter mb-6">{city.name}</h4>
                      <Button variant="outline" className="w-full h-14 rounded-2xl border-white/30 text-white hover:bg-white hover:text-black font-black text-xs uppercase tracking-widest">
                        VODIČ KROZ GRAD
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
          <div className="bg-primary text-white rounded-[5rem] p-16 md:p-32 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-16 shadow-[0_50px_100px_-30px_rgba(255,49,49,0.4)]">
            <Sparkles className="absolute -top-20 -left-20 size-96 text-white/10 rotate-12" />
            <div className="relative z-10 max-w-3xl space-y-10">
              <h2 className="text-6xl md:text-[7rem] font-headline font-black leading-[0.8] italic tracking-tighter">
                Vlasnik ste objekta?<br/>Postanite dio elite.
              </h2>
              <p className="text-2xl font-body italic text-white/80 max-w-xl">
                Pridružite se najbrže rastućem turističkom portalu u regiji i osigurajte svoje mjesto na karti.
              </p>
              <Link href="/submit">
                <Button className="h-24 px-16 bg-white text-primary hover:bg-black hover:text-white font-black rounded-3xl text-2xl uppercase tracking-widest shadow-2xl transition-all">
                  PRIJAVI SVOJ POSAO
                </Button>
              </Link>
            </div>
            <div className="hidden lg:block relative z-10">
               <div className="size-80 rounded-[4rem] border-[12px] border-white/20 flex items-center justify-center rotate-6 overflow-hidden">
                  <Image src="https://picsum.photos/seed/partner-qr/400/400" alt="QR" width={320} height={320} className="opacity-40 grayscale invert" />
               </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-white py-32 border-t border-white/5">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-24">
          <div className="md:col-span-5 space-y-12">
            <Logo className="h-16 w-auto" />
            <p className="text-white/40 font-body text-2xl leading-relaxed italic pr-20">
              {t.footerDesc} Otkrivamo najbolje od Jadrana onima koji traže savršenstvo u svakom detalju putovanja.
            </p>
          </div>
          <div className="md:col-span-3">
            <h4 className="font-black mb-12 text-sm uppercase tracking-[0.4em] text-primary">{t.navExplore}</h4>
            <ul className="space-y-8 text-white/50 font-bold text-base uppercase tracking-[0.2em]">
              <li><Link href="/explore" className="hover:text-primary transition-all">Interaktivna Karta</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-all">{t.navBlog}</Link></li>
              <li><Link href="/submit" className="hover:text-primary transition-all">Prijavi objekt</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-all">Moj Dashboard</Link></li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <h4 className="font-black mb-12 text-sm uppercase tracking-[0.4em] text-primary">Pratite Nas</h4>
            <div className="flex gap-6 mb-12">
               {[1,2,3,4].map(i => (
                 <div key={i} className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                    <div className="size-6 bg-white/20 rounded-sm" />
                 </div>
               ))}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">&copy; 2024 CroatiaBest Luxury Guide</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
