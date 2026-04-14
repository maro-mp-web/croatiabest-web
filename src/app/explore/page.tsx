"use client"

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CATEGORIES } from '@/app/lib/constants';
import { MOCK_LISTINGS } from '@/app/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Search, Filter, Layers, List, Navigation2, X, Info } from 'lucide-react';
import Image from 'next/image';

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const filteredListings = MOCK_LISTINGS.filter(l => {
    const matchesCategory = selectedCategory ? l.categoryId === selectedCategory : true;
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Kategorije</span>
              {selectedCategory && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)} className="h-6 text-xs text-primary px-2">
                  Poništi
                </Button>
              )}
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              <div className="px-2 py-2 text-xs font-bold text-muted-foreground/60 uppercase">Plaćene (Izdvojeno)</div>
              {CATEGORIES.filter(c => c.type === 'paid').map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat.id ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-secondary'
                  }`}
                >
                  <div className="size-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                  {cat.price && <Badge variant="outline" className="ml-auto text-[10px] scale-90">{cat.price}</Badge>}
                </button>
              ))}
              
              <div className="px-2 py-4 text-xs font-bold text-muted-foreground/60 uppercase">Besplatne (Javne)</div>
              {CATEGORIES.filter(c => c.type === 'free').map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat.id ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-secondary'
                  }`}
                >
                  <div className="size-3 rounded-full opacity-60" style={{ backgroundColor: cat.color }} />
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
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg border p-1">
                <TabsList className="bg-transparent border-none p-0">
                  <TabsTrigger value="map" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    <Navigation2 className="size-4 mr-2" /> Karta
                  </TabsTrigger>
                  <TabsTrigger value="list" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    <List className="size-4 mr-2" /> Lista
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex gap-2 pointer-events-auto">
              <Button variant="secondary" className="bg-white/80 backdrop-blur-md shadow-lg border">
                <Layers className="size-4 mr-2" /> Slojevi
              </Button>
              <Button className="bg-primary text-white shadow-lg">
                <MapPin className="size-4 mr-2" /> Moja Lokacija
              </Button>
            </div>
          </div>

          {/* Map Simulation */}
          <div className={`flex-1 bg-[#E5E3DF] relative overflow-hidden transition-opacity duration-300 ${viewMode === 'map' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <Image 
              src="https://picsum.photos/seed/map/1920/1080" 
              alt="Map Background" 
              fill 
              className="object-cover opacity-50 contrast-75 grayscale-[0.2]"
            />
            
            {/* Simulated Markers */}
            {filteredListings.map((listing) => {
              const category = CATEGORIES.find(c => c.id === listing.categoryId);
              return (
                <div 
                  key={listing.id}
                  className="absolute cursor-pointer group animate-fade-in"
                  style={{ top: `${Math.random() * 60 + 20}%`, left: `${Math.random() * 60 + 20}%` }}
                >
                  <div className="relative flex flex-col items-center">
                    <div className="bg-white px-2 py-1 rounded shadow-lg text-[10px] font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {listing.name}
                    </div>
                    <div 
                      className="size-8 rounded-full border-2 border-white shadow-xl flex items-center justify-center map-marker-glow transition-transform"
                      style={{ backgroundColor: category?.color || '#333' }}
                    >
                      <MapPin className="size-4 text-white fill-white/20" />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Simulated Cluster */}
            <div className="absolute top-[40%] left-[30%] cursor-pointer group">
              <div className="size-12 rounded-full border-4 border-primary/20 bg-primary/80 flex items-center justify-center text-white font-bold shadow-2xl animate-pulse">
                12
              </div>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Zadar Cluster
              </div>
            </div>
          </div>

          {/* List View */}
          {viewMode === 'list' && (
            <ScrollArea className="absolute inset-0 z-20 bg-background/50 backdrop-blur-sm p-8">
              <div className="container mx-auto max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map((listing) => (
                    <Card key={listing.id} className="overflow-hidden group hover:shadow-xl transition-shadow">
                      <div className="relative h-48">
                        <Image src={listing.images[0]} alt={listing.name} fill className="object-cover" />
                        <Badge className="absolute top-2 left-2">{CATEGORIES.find(c => c.id === listing.categoryId)?.name}</Badge>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">{listing.name}</h4>
                        <p className="text-xs text-muted-foreground flex items-center mb-3">
                          <MapPin className="size-3 mr-1" /> {listing.address}
                        </p>
                        <Button size="sm" className="w-full">Detalji</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}

          {/* Quick Info Bar for mobile/small view */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            <div className="bg-white/90 backdrop-blur p-1 rounded-full shadow-2xl border flex items-center">
              <div className="flex -space-x-2 px-4 py-2 border-r mr-2">
                <div className="size-6 rounded-full bg-red-500 border border-white" />
                <div className="size-6 rounded-full bg-blue-500 border border-white" />
                <div className="size-6 rounded-full bg-green-500 border border-white" />
                <div className="px-3 text-xs font-bold text-muted-foreground flex items-center">+ {CATEGORIES.length} tipova</div>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full px-4 text-xs font-bold">
                <Info className="size-4 mr-2" /> O Karti
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}