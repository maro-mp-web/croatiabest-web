
"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CATEGORIES } from '@/app/lib/constants';
import { MapPin, Phone, Mail, Globe, Facebook, Twitter, Youtube, Calendar, Users, List, Info, Loader2, Share2, Instagram } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function ListingDetailPage() {
  const params = useParams();
  const firestore = useFirestore();
  const docRef = React.useMemo(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, 'listings', params.id as string);
  }, [firestore, params.id]);

  const { data: listing, isLoading } = useDoc(docRef);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="size-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-black">Objekt nije pronađen</h1>
        <Link href="/explore">
          <Button className="rounded-xl h-12 px-8 font-bold">Natrag na kartu</Button>
        </Link>
      </div>
    );
  }

  const category = CATEGORIES.find(c => c.id === listing.locationCategoryId);
  const photos = listing.photoUrls && listing.photoUrls.length > 0 ? listing.photoUrls : ['https://picsum.photos/seed/placeholder/1200/800'];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pb-24">
        {/* Gallery / Hero */}
        <section className="h-[60vh] relative grid grid-cols-1 md:grid-cols-4 gap-2 p-2">
          <div className="md:col-span-2 relative h-full rounded-l-[2rem] overflow-hidden group">
            <Image src={photos[0]} alt="Hero" fill className="object-cover hover:scale-105 transition-transform duration-700" priority />
          </div>
          <div className="hidden md:grid grid-cols-1 grid-rows-2 gap-2">
            <div className="relative h-full overflow-hidden">
              <Image src={photos[1] || photos[0]} alt="Img 1" fill className="object-cover" />
            </div>
            <div className="relative h-full overflow-hidden">
              <Image src={photos[2] || photos[0]} alt="Img 2" fill className="object-cover" />
            </div>
          </div>
          <div className="hidden md:grid grid-cols-1 grid-rows-2 gap-2">
            <div className="relative h-full rounded-tr-[2rem] overflow-hidden">
              <Image src={photos[3] || photos[0]} alt="Img 3" fill className="object-cover" />
            </div>
            <div className="relative h-full rounded-br-[2rem] overflow-hidden group">
              <Image src={photos[4] || photos[0]} alt="Img 4" fill className="object-cover" />
              {photos.length > 5 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-black text-xl group-hover:bg-black/60 transition-all cursor-pointer backdrop-blur-sm">
                  + {photos.length - 5} fotografija
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 mt-12 flex flex-col lg:flex-row gap-12">
          {/* Main Info */}
          <div className="flex-1 space-y-10">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-primary/10 text-primary border-none text-xs font-black px-6 py-2 uppercase tracking-widest rounded-full">{category?.name}</Badge>
                {listing.type === 'paid' && <Badge variant="outline" className="text-secondary border-secondary px-6 py-2 rounded-full font-black uppercase text-[10px]">Verified Partner</Badge>}
                <Badge className="bg-secondary/10 text-secondary border-none px-6 py-2 rounded-full font-black uppercase text-[10px]">{listing.city}</Badge>
              </div>
              <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tight">{listing.name || listing.objectName}</h1>
              <div className="flex items-center text-muted-foreground text-xl font-medium">
                <MapPin className="size-6 mr-3 text-primary" /> {listing.address}, {listing.city}
              </div>
            </div>

            <Tabs defaultValue="info" className="w-full">
              <TabsList className="bg-secondary/10 p-1.5 rounded-2xl h-14 border border-secondary/5">
                <TabsTrigger value="info" className="px-10 h-full rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg font-black uppercase text-xs tracking-widest">
                  <Info className="size-4 mr-2" /> O Nama
                </TabsTrigger>
                {listing.menuDescription && (
                  <TabsTrigger value="menu" className="px-10 h-full rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg font-black uppercase text-xs tracking-widest">
                    <List className="size-4 mr-2" /> Ponuda
                  </TabsTrigger>
                )}
                {(listing.roomCount || listing.bedCount) && (
                  <TabsTrigger value="rooms" className="px-10 h-full rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg font-black uppercase text-xs tracking-widest">
                    <Calendar className="size-4 mr-2" /> Kapacitet
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="info" className="pt-10 space-y-10">
                <div className="prose prose-2xl max-w-none font-body leading-relaxed whitespace-pre-wrap text-foreground/80">
                  {listing.description}
                </div>
                
                {listing.type === 'paid' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-black/5 bg-secondary/5 rounded-[3rem] px-8">
                    <div className="text-center">
                      <p className="text-4xl font-black text-primary">15+</p>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">Godina tradicije</p>
                    </div>
                    <div className="text-center">
                      <Globe className="size-8 mx-auto text-primary opacity-30 mb-2" />
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Globalno priznato</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-black text-primary">P</p>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">Parking osiguran</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-black text-primary">4.9</p>
                      <div className="flex justify-center text-primary mt-1">★★★★★</div>
                    </div>
                  </div>
                )}
              </TabsContent>

              {listing.menuDescription && (
                <TabsContent value="menu" className="pt-10">
                  <div className="bg-secondary/5 rounded-[3rem] p-12 border border-black/5">
                    <h3 className="text-3xl font-headline font-black mb-8">Specijaliteti i Ponuda</h3>
                    <p className="text-2xl font-body leading-relaxed italic text-muted-foreground">
                      {listing.menuDescription}
                    </p>
                  </div>
                </TabsContent>
              )}

              {(listing.roomCount || listing.bedCount) && (
                <TabsContent value="rooms" className="pt-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="border-none shadow-xl rounded-[2.5rem] bg-white">
                      <CardContent className="p-10 flex items-center gap-6">
                        <div className="size-20 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary">
                          <Users className="size-10" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Ukupno kreveta</p>
                          <p className="text-5xl font-black leading-none">{listing.bedCount || 'N/A'}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-none shadow-xl rounded-[2.5rem] bg-white">
                      <CardContent className="p-10 flex items-center gap-6">
                        <div className="size-20 rounded-[1.5rem] bg-secondary/10 flex items-center justify-center text-secondary">
                          <Calendar className="size-10" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Broj soba</p>
                          <p className="text-5xl font-black leading-none">{listing.roomCount || 'N/A'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              )}
            </Tabs>

            {/* Video Section */}
            {listing.videoEmbedUrls && listing.videoEmbedUrls.length > 0 && listing.videoEmbedUrls[0] && (
              <div className="pt-12">
                <h3 className="text-3xl font-headline font-black mb-8 flex items-center gap-3">
                  <Youtube className="size-8 text-primary" /> Video Prezentacija
                </h3>
                <div className="aspect-video relative rounded-[3rem] overflow-hidden shadow-2xl bg-black">
                  <iframe 
                    className="absolute inset-0 w-full h-full"
                    src={listing.videoEmbedUrls[0].replace('watch?v=', 'embed/')} 
                    title="Video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* Contact / Sidebar */}
          <aside className="w-full lg:w-96 space-y-8">
            <Card className="shadow-2xl border-none rounded-[3rem] overflow-hidden">
              <div className="bg-foreground p-8 text-white flex justify-between items-center">
                <h3 className="text-2xl font-black italic">Kontaktiraj</h3>
                <Share2 className="size-6 text-white/30 cursor-pointer hover:text-white transition-colors" />
              </div>
              <CardContent className="p-10 space-y-8">
                <div className="space-y-6">
                  {listing.contactPhone && (
                    <div className="flex items-center gap-5 group cursor-pointer">
                      <div className="size-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                        <Phone className="size-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nazovi odmah</p>
                        <p className="text-lg font-bold group-hover:text-secondary transition-colors">{listing.contactPhone}</p>
                      </div>
                    </div>
                  )}

                  {listing.contactEmail && (
                    <div className="flex items-center gap-5 group cursor-pointer">
                      <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <Mail className="size-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Email adresa</p>
                        <p className="text-lg font-bold group-hover:text-primary transition-colors truncate max-w-[180px]">{listing.contactEmail}</p>
                      </div>
                    </div>
                  )}

                  {listing.webAddress && (
                    <div className="flex items-center gap-5 group cursor-pointer">
                      <div className="size-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                        <Globe className="size-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Web stranica</p>
                        <a href={listing.webAddress.startsWith('http') ? listing.webAddress : `https://${listing.webAddress}`} target="_blank" className="text-lg font-bold group-hover:text-secondary transition-colors underline decoration-secondary/30">
                          {listing.webAddress.replace(/https?:\/\//, '').split('/')[0]}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-8 border-t border-black/5 flex justify-center gap-5">
                  {listing.facebookLink && (
                    <Link href={listing.facebookLink} target="_blank" className="size-12 bg-secondary/5 rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                      <Facebook className="size-6" />
                    </Link>
                  )}
                  {listing.instagramLink && (
                    <Link href={listing.instagramLink} target="_blank" className="size-12 bg-secondary/5 rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                      <Instagram className="size-6" />
                    </Link>
                  )}
                  {listing.youtubeLink && (
                    <Link href={listing.youtubeLink} target="_blank" className="size-12 bg-secondary/5 rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                      <Youtube className="size-6" />
                    </Link>
                  )}
                </div>

                <Button className="w-full h-16 text-lg font-black bg-primary rounded-2xl shadow-2xl shadow-primary/30 uppercase tracking-widest">
                  Pošalji upit
                </Button>
              </CardContent>
            </Card>

            <div className="w-full h-80 bg-secondary/5 rounded-[3rem] flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-black/5">
              <p className="text-[10px] font-black text-muted-foreground tracking-[0.3em] uppercase mb-4 opacity-40">Oglasni Prostor</p>
              <p className="text-muted-foreground font-body italic">Ovdje može biti vaša reklama.<br/>Kontaktirajte nas za ponudu.</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
