
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
  Navigation,
  Loader2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';

const MAP_CENTER = { lat: 44.5, lng: 16.5 };

export default function Home() {
  const { t } = useLanguage();
  const firestore = useFirestore();
  const [selectedListingId, setSelectedListingId] = React.useState<string | null>(null);

  // Premium listings
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

  // All listings for categories and map
  const allListingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'listings'), where('status', '==', 'active'));
  }, [firestore]);

  const { data: allListings } = useCollection(allListingsQuery);
  const selectedListing = allListings?.find(l => l.id === selectedListingId);

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
        {/* HERO SECTION - Optimiziran padding i visina */}
        <section className="relative min-h-screen w-full overflow-hidden flex items-center pt-32 pb-32">
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
            <div className="max-w-4xl space-y-10 animate-fade-in">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-full text-white text-[12px] font-black tracking-[0.4em] uppercase">
                <Sparkles className="size-4 text-primary fill-primary animate-pulse" /> {t.heroBadge}
              </div>
              <h1 className="text-6xl md:text-[8rem] font-black text-white leading-[0.9] tracking-tighter font-headline italic drop-shadow-2xl">
                {t.heroVideoTitle}
              </h1>
              <p className="text-xl md:text-3xl text-white/80 font-body italic max-w-2xl leading-relaxed">
                {t.heroVideoSub}
              </p>
              <div className="flex flex-wrap gap-6 pt-4">
                <Link href="/explore">
                  <Button className="h-20 px-12 text-xl font-black bg-primary hover:bg-primary/90 rounded-[2rem] shadow-2xl shadow-primary/40 group transition-all">
                    {t.heroVideoCTA} <ArrowRight className="ml-4 size-6 group-hover:translate-x-3 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES SECTION - Ispod Hero sekcije bez preklapanja */}
        <section className="py-24 bg-white relative z-30 shadow-2xl rounded-t-[4rem] -mt-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
              {mainCategories.map((cat) => (
                <Link key={cat.id} href={`/explore?category=${cat.id}`}>
                  <Card className="group hover:scale-105 transition-all duration-500 rounded-[3rem] border-none shadow-xl overflow-hidden bg-white cursor-pointer hover:shadow-primary/10">
                    <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                      <div className="size-16 rounded-[1.2rem] bg-primary/5 text-primary flex items-center justify-center shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        {React.cloneElement(cat.icon as React.ReactElement, { className: 'size-8' })}
                      </div>
                      <p className="font-black text-sm uppercase tracking-[0.2em]">{cat.name}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Highlights po kategorijama */}
            <div className="space-y-32">
              {mainCategories.map((cat) => {
                const listings = (allListings || []).filter(l => (l.locationCategoryId || l.categoryId) === cat.id).slice(0, 5);
                if (listings.length === 0) return null;

                return (
                  <div key={cat.id} className="space-y-12">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="size-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl rotate-3">
                          {cat.icon}
                        </div>
                        <div>
                          <h3 className="text-4xl font-headline font-black italic tracking-tight">{cat.name}</h3>
                          <p className="text-muted-foreground font-body italic">Najbolje preporuke</p>
                        </div>
                      </div>
                      <Link href={`/explore?category=${cat.id}`}>
                        <Button variant="ghost" className="text-primary font-black uppercase tracking-widest group">
                          VIDI SVE <ChevronRight className="ml-2 size-4 group-hover:translate-x-2 transition-transform" />
                        </Button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                      {listings.map((l) => (
                        <Link key={l.id} href={`/listing/${l.id}`}>
                          <Card className="group border-none shadow-lg hover:shadow-2xl transition-all duration-500 rounded-[2rem] overflow-hidden bg-secondary/5 h-full flex flex-col">
                            <div className="relative aspect-[4/5] overflow-hidden">
                              <Image 
                                src={l.photoUrls?.[0] || 'https://picsum.photos/seed/placeholder/400/500'} 
                                alt={l.name} 
                                fill 
                                className="object-cover group-hover:scale-110 transition-transform duration-700" 
                              />
                              <Badge className="absolute top-4 right-4 bg-white/95 text-primary border-none shadow-md font-black text-[9px] px-3 py-1">
                                {l.city}
                              </Badge>
                            </div>
                            <CardContent className="p-6 flex-1 flex flex-col justify-center">
                              <h4 className="font-black text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">{l.name}</h4>
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

        {/* INTERACTIVE MAP SECTION - Integrirani layout */}
        <section className="py-32 bg-secondary/5">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-4 space-y-8">
                <Badge variant="outline" className="border-primary text-primary font-black px-6 py-2 uppercase tracking-[0.3em] text-[10px]">Interaktivni vodič</Badge>
                <h2 className="text-6xl font-headline font-black italic tracking-tighter leading-none">Istraži Hrvatsku<br/>uživo na karti</h2>
                <p className="text-xl text-muted-foreground font-body italic leading-relaxed">
                  Pronađite skrivene ljekarne, najbolje plaže i ekskluzivne restorane izravno na karti.
                </p>
                <div className="space-y-4 pt-6">
                  {CATEGORIES.slice(0, 5).map(cat => (
                    <div key={cat.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-black/5 shadow-sm">
                      <div className="size-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm font-black uppercase tracking-widest">{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="h-[600px] w-full rounded-[4rem] overflow-hidden shadow-2xl relative border-[12px] border-white bg-muted/20">
                  <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                    <Map
                      defaultCenter={MAP_CENTER}
                      defaultZoom={7}
                      disableDefaultUI={true}
                      gestureHandling={'greedy'}
                      className="w-full h-full"
                    >
                      {allListings?.map((l) => {
                        const lat = typeof l.latitude === 'string' ? parseFloat(l.latitude) : l.latitude;
                        const lng = typeof l.longitude === 'string' ? parseFloat(l.longitude) : l.longitude;
                        if (isNaN(lat) || isNaN(lng)) return null;
                        return (
                          <Marker
                            key={l.id}
                            position={{ lat, lng }}
                            onClick={() => setSelectedListingId(l.id)}
                          />
                        );
                      })}

                      {selectedListing && (
                        <InfoWindow
                          position={{ 
                            lat: typeof selectedListing.latitude === 'string' ? parseFloat(selectedListing.latitude) : selectedListing.latitude, 
                            lng: typeof selectedListing.longitude === 'string' ? parseFloat(selectedListing.longitude) : selectedListing.longitude 
                          }}
                          onCloseClick={() => setSelectedListingId(null)}
                        >
                          <div className="p-4 max-w-[240px] space-y-4">
                            <h4 className="font-black text-lg leading-tight">{selectedListing.name}</h4>
                            <Link href={`/listing/${selectedListing.id}`} className="block">
                              <Button size="sm" className="w-full h-10 text-[10px] font-black rounded-xl bg-primary">
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

        {/* PUBLIC GEMS SECTION - Popravljeni gumbi i tekst */}
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
                    <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white">
                      <p className="text-[12px] font-black uppercase tracking-[0.4em] text-primary mb-3">{city.region}</p>
                      <h4 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-6">{city.name}</h4>
                      <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-white hover:text-primary text-white border-none font-black text-sm uppercase tracking-normal transition-all">
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
