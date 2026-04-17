
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
        <section className="relative h-[85vh] w-full overflow-hidden flex items-center">
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
            <div className="max-w-3xl animate-fade-in space-y-8">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-full text-white text-[10px] font-black tracking-[0.4em] uppercase">
                <Sparkles className="size-4 text-primary fill-primary animate-pulse" /> {t.heroBadge}
              </div>
              <h1 className="text-6xl md:text-[8rem] font-black text-white leading-[0.9] tracking-tighter font-headline italic drop-shadow-2xl">
                {t.heroVideoTitle}
              </h1>
              <p className="text-xl md:text-2xl text-white/80 font-body italic max-w-xl leading-relaxed">
                {t.heroVideoSub}
              </p>
              <div className="flex flex-wrap gap-6 pt-6">
                <Link href="/explore">
                  <Button className="h-20 px-12 text-xl font-black bg-primary hover:bg-primary/90 rounded-[2rem] shadow-2xl shadow-primary/40 group transition-all">
                    {t.heroVideoCTA} <ArrowRight className="ml-3 size-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES SECTION - Now correctly below hero without overlap */}
        <section className="py-20 container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { id: 'restaurants', icon: <Utensils />, name: 'Gastronomija', color: 'bg-primary' },
              { id: 'hotels', icon: <Hotel />, name: 'Smještaj', color: 'bg-secondary' },
              { id: 'beaches', icon: <Umbrella />, name: 'Plaže', color: 'bg-blue-400' },
              { id: 'wineries', icon: <GlassWater />, name: 'Vinarije', color: 'bg-purple-500' },
            ].map((cat) => (
              <Link key={cat.id} href={`/explore?category=${cat.id}`}>
                <Card className="group hover:scale-105 transition-all duration-500 rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-white cursor-pointer">
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

        {/* INTERACTIVE MAP SECTION - RESTORED */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 mb-12 flex justify-between items-end">
            <div className="space-y-4">
              <Badge variant="outline" className="border-primary text-primary font-black px-6 py-2 uppercase tracking-widest text-[10px]">Interaktivni vodič</Badge>
              <h2 className="text-5xl font-headline font-black italic">Istraži Hrvatsku uživo</h2>
            </div>
            <Link href="/explore">
              <Button variant="ghost" className="font-black text-xs uppercase tracking-widest group">
                CIJELA KARTA <ChevronRight className="ml-2 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <div className="container mx-auto px-6">
            <div className="h-[600px] w-full rounded-[3.5rem] overflow-hidden shadow-2xl relative border-8 border-white">
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
                    const cat = CATEGORIES.find(c => c.id === l.locationCategoryId);
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
                      <div className="p-3 max-w-[200px] space-y-3">
                        <h4 className="font-black text-sm">{selectedListing.name}</h4>
                        <p className="text-[10px] text-muted-foreground line-clamp-2">{selectedListing.description}</p>
                        <Link href={`/listing/${selectedListing.id}`} className="block">
                          <Button size="sm" className="w-full h-8 text-[10px] font-black rounded-lg">POGLEDAJ DETALJE</Button>
                        </Link>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </APIProvider>
              
              {/* Legend overlay */}
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur p-6 rounded-[2rem] shadow-2xl hidden md:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Legenda karte</p>
                <div className="space-y-2">
                  {CATEGORIES.slice(0, 5).map(cat => (
                    <div key={cat.id} className="flex items-center gap-2">
                      <div className="size-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-[10px] font-bold uppercase">{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PREMIUM PARTNERS SECTION */}
        <section className="py-32 container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] text-[10px]">
                <Star className="size-5 fill-primary" /> {t.featuredBadge}
              </div>
              <h2 className="text-6xl md:text-8xl font-headline font-black tracking-tighter leading-none italic">
                {t.featuredTitle}
              </h2>
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
                        <Badge className="absolute top-8 left-8 bg-white/95 text-primary border-none shadow-2xl backdrop-blur font-black px-6 py-2.5 rounded-2xl text-[10px] tracking-widest uppercase">
                          {cat?.name}
                        </Badge>
                      </div>
                      <CardContent className="p-10 flex-1 flex flex-col space-y-4">
                        <h3 className="text-4xl font-black leading-none tracking-tighter group-hover:text-primary transition-colors">
                          {listing.name}
                        </h3>
                        <div className="flex items-center text-muted-foreground text-base font-bold italic">
                          <MapPin className="size-5 mr-2 text-secondary" /> {listing.city}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-32 border-4 border-dashed rounded-[4rem] border-muted">
              <p className="text-2xl text-muted-foreground font-body italic">Trenutno nema izdvojenih partnera.</p>
            </div>
          )}
        </section>

        {/* PUBLIC GEMS SECTION */}
        <section className="py-32 bg-secondary/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center text-center mb-20 space-y-6">
              <Badge variant="outline" className="border-secondary text-secondary font-black px-6 py-2 rounded-full text-[10px] tracking-[0.3em] uppercase">
                Javni Dragulji
              </Badge>
              <h2 className="text-6xl md:text-7xl font-headline font-black tracking-tight italic">
                Otkrijte skrivenu Hrvatsku
              </h2>
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
          <div className="bg-foreground text-white rounded-[4rem] p-12 md:p-24 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl">
            <div className="relative z-10 max-w-2xl space-y-8">
              <h2 className="text-5xl md:text-7xl font-headline font-black leading-[0.9] italic">
                Vlasnik ste objekta?<br/>Postanite dio elite.
              </h2>
              <Link href="/submit">
                <Button className="h-16 px-10 bg-primary text-white font-black rounded-2xl text-lg uppercase tracking-widest shadow-2xl">
                  PRIJAVI SVOJ POSAO
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-white py-32 border-t border-white/5">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-20">
          <div className="md:col-span-5 space-y-10">
            <p className="text-white/40 font-body text-2xl leading-relaxed italic pr-20">
              {t.footerDesc} Otkrivamo najbolje od Jadrana onima koji traže savršenstvo.
            </p>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-black mb-10 text-xs uppercase tracking-[0.3em] text-primary">{t.navExplore}</h4>
            <ul className="space-y-6 text-white/50 font-bold text-sm uppercase tracking-widest">
              <li><Link href="/explore" className="hover:text-white transition-all">Interaktivna Karta</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-all">{t.navBlog}</Link></li>
              <li><Link href="/submit" className="hover:text-white transition-all">Prijavi objekt</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
