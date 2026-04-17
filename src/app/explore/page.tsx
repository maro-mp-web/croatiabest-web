
"use client"

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CATEGORIES } from '@/app/lib/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Search, Layers, List, Navigation2, Info, Loader2, Navigation as NavigationIcon, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';

const MAP_CENTER = { lat: 44.5, lng: 16.5 }; // Sredina Hrvatske

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const firestore = useFirestore();

  const listingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'listings'), where('status', '==', 'active'));
  }, [firestore]);

  const { data: listings, isLoading } = useCollection(listingsQuery);

  const filteredListings = listings?.filter(l => {
    const name = l.name || l.objectName || '';
    const address = l.address || '';
    const categoryId = l.locationCategoryId || '';
    
    const matchesCategory = selectedCategory ? categoryId === selectedCategory : true;
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }) || [];

  const selectedListing = filteredListings.find(l => l.id === selectedListingId);

  // Funkcija za generiranje linka za Google Maps navigaciju
  const getDirectionsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Filters */}
        <aside className="w-80 border-r bg-white hidden lg:flex flex-col">
          <div className="p-4 border-b space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Pretraži..." 
                className="pl-10 h-10 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Kategorije</span>
              {selectedCategory && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)} className="h-6 text-[10px] text-primary px-2 font-black uppercase">
                  Poništi
                </Button>
              )}
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              <div className="px-3 py-2 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Premium Partneri</div>
              {CATEGORIES.filter(c => c.type === 'paid').map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
                    selectedCategory === cat.id ? 'bg-primary/10 text-primary font-black shadow-sm' : 'hover:bg-secondary/50 font-bold'
                  }`}
                >
                  <div className="size-2 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </button>
              ))}
              
              <div className="px-3 py-4 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Javne Usluge</div>
              {CATEGORIES.filter(c => c.type === 'free').map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
                    selectedCategory === cat.id ? 'bg-primary/10 text-primary font-black shadow-sm' : 'hover:bg-secondary/50 font-bold'
                  }`}
                >
                  <div className="size-2 rounded-full opacity-60" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 relative flex flex-col">
          {/* Header Controls */}
          <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
            <div className="flex gap-2 pointer-events-auto">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border p-1">
                <TabsList className="bg-transparent border-none p-0 h-10">
                  <TabsTrigger value="map" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold h-8">
                    <Navigation2 className="size-4 mr-2" /> Karta
                  </TabsTrigger>
                  <TabsTrigger value="list" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold h-8">
                    <List className="size-4 mr-2" /> Lista
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center bg-secondary/10">
              <Loader2 className="size-12 animate-spin text-primary opacity-20" />
            </div>
          ) : (
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
              <div className={`flex-1 relative transition-opacity duration-300 ${viewMode === 'map' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <Map
                  defaultCenter={MAP_CENTER}
                  defaultZoom={7}
                  disableDefaultUI={true}
                  gestureHandling={'greedy'}
                  className="w-full h-full"
                >
                  {filteredListings.map((listing) => {
                    if (!listing.latitude || !listing.longitude) return null;
                    const cat = CATEGORIES.find(c => c.id === listing.locationCategoryId);
                    
                    return (
                      <AdvancedMarker
                        key={listing.id}
                        position={{ lat: listing.latitude, lng: listing.longitude }}
                        onClick={() => setSelectedListingId(listing.id)}
                      >
                        <Pin 
                          background={cat?.color || '#333'} 
                          glyphColor={'#fff'} 
                          borderColor={'#fff'} 
                        />
                      </AdvancedMarker>
                    );
                  })}

                  {selectedListing && (
                    <InfoWindow
                      position={{ lat: selectedListing.latitude, lng: selectedListing.longitude }}
                      onCloseClick={() => setSelectedListingId(null)}
                    >
                      <div className="p-3 max-w-[240px] space-y-3">
                        <div className="space-y-1">
                          <h4 className="font-black text-base leading-tight">{selectedListing.name || selectedListing.objectName}</h4>
                          <p className="text-xs text-muted-foreground italic line-clamp-2">{selectedListing.description}</p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="size-3" /> {selectedListing.address}
                          </p>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Link href={`/listing/${selectedListing.id}`} className="w-full">
                            <Button size="sm" className="w-full h-9 text-[10px] font-black rounded-lg bg-primary">
                              <ExternalLink className="size-3 mr-2" /> DETALJI OBJEKTA
                            </Button>
                          </Link>
                          <a 
                            href={getDirectionsUrl(selectedListing.latitude, selectedListing.longitude)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-full"
                          >
                            <Button size="sm" variant="outline" className="w-full h-9 text-[10px] font-black rounded-lg border-secondary text-secondary hover:bg-secondary/5">
                              <NavigationIcon className="size-3 mr-2" /> UPUTE ZA VOŽNJU
                            </Button>
                          </a>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </div>

              {/* List View */}
              {viewMode === 'list' && (
                <ScrollArea className="absolute inset-0 z-20 bg-background/50 backdrop-blur-sm p-8">
                  <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredListings.map((listing) => {
                        const cat = CATEGORIES.find(c => c.id === listing.locationCategoryId);
                        return (
                          <Link key={listing.id} href={`/listing/${listing.id}`}>
                            <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] border-none shadow-xl bg-white/80 h-full flex flex-col">
                              <div className="relative h-56">
                                <Image 
                                  src={listing.photoUrls?.[0] || 'https://picsum.photos/seed/placeholder/800/600'} 
                                  alt={listing.name || listing.objectName} 
                                  fill 
                                  className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                />
                                <Badge className="absolute top-4 left-4 bg-white/95 text-primary border-none shadow-lg font-black">{cat?.name}</Badge>
                              </div>
                              <CardContent className="p-6 flex-1 flex flex-col">
                                <h4 className="text-xl font-black mb-2 leading-tight">{listing.name || listing.objectName}</h4>
                                <p className="text-sm text-muted-foreground flex items-center mb-6 font-medium">
                                  <MapPin className="size-4 mr-2 text-secondary" /> {listing.address}, {listing.city}
                                </p>
                                <Button className="w-full mt-auto rounded-xl h-12 font-bold bg-foreground hover:bg-primary transition-colors">Pogledaj detalje</Button>
                              </CardContent>
                            </Card>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </ScrollArea>
              )}
            </APIProvider>
          )}

          {/* Quick Info Bar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 pointer-events-auto">
            <div className="bg-white/90 backdrop-blur p-1 rounded-full shadow-2xl border border-black/5 flex items-center">
              <div className="flex -space-x-2 px-6 py-2 border-r mr-2">
                <div className="size-6 rounded-full bg-[#E11D48] border-2 border-white shadow-sm" title="Restorani" />
                <div className="size-6 rounded-full bg-[#4338CA] border-2 border-white shadow-sm" title="Hoteli" />
                <div className="size-6 rounded-full bg-[#10B981] border-2 border-white shadow-sm" title="Usluge" />
                <div className="px-4 text-[10px] font-black text-muted-foreground flex items-center uppercase tracking-tighter ml-4">
                  {filteredListings.length} lokacija na vidiku
                </div>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full px-6 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5">
                <Info className="size-4 mr-2" /> Legenda karte
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
