import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MOCK_LISTINGS } from '@/app/lib/mock-data';
import { CATEGORIES } from '@/app/lib/constants';
import { MapPin, Phone, Mail, Globe, Facebook, Twitter, Youtube, Calendar, Users, List, Info } from 'lucide-react';

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = MOCK_LISTINGS.find(l => l.id === params.id) || MOCK_LISTINGS[0];
  const category = CATEGORIES.find(c => c.id === listing.categoryId);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pb-24">
        {/* Gallery / Hero */}
        <section className="h-[60vh] relative grid grid-cols-1 md:grid-cols-4 gap-2 p-2">
          <div className="md:col-span-2 relative h-full rounded-l-2xl overflow-hidden group">
            <Image src={listing.images[0]} alt="Hero" fill className="object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="hidden md:grid grid-cols-1 grid-rows-2 gap-2">
            <div className="relative h-full overflow-hidden">
              <Image src={listing.images[1]} alt="Img 1" fill className="object-cover" />
            </div>
            <div className="relative h-full overflow-hidden">
              <Image src={listing.images[2]} alt="Img 2" fill className="object-cover" />
            </div>
          </div>
          <div className="hidden md:grid grid-cols-1 grid-rows-2 gap-2">
            <div className="relative h-full rounded-tr-2xl overflow-hidden">
              <Image src={listing.images[3]} alt="Img 3" fill className="object-cover" />
            </div>
            <div className="relative h-full rounded-br-2xl overflow-hidden group">
              <Image src={listing.images[4]} alt="Img 4" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-xl group-hover:bg-black/60 transition-all cursor-pointer">
                + {listing.images.length - 5} fotografija
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-12">
          {/* Main Info */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/10 text-primary border-none text-sm px-4 py-1">{category?.name}</Badge>
                {category?.type === 'paid' && <Badge variant="outline" className="text-accent border-accent">Verified Partner</Badge>}
              </div>
              <h1 className="text-4xl md:text-5xl font-headline font-bold">{listing.name}</h1>
              <div className="flex items-center text-muted-foreground text-lg">
                <MapPin className="size-5 mr-2 text-primary" /> {listing.address}
              </div>
            </div>

            <Tabs defaultValue="info" className="w-full">
              <TabsList className="bg-secondary/50 p-1 rounded-xl">
                <TabsTrigger value="info" className="px-8 py-2"><Info className="size-4 mr-2" /> O Nama</TabsTrigger>
                {listing.menu && <TabsTrigger value="menu" className="px-8 py-2"><List className="size-4 mr-2" /> Meni</TabsTrigger>}
                {listing.rooms && <TabsTrigger value="rooms" className="px-8 py-2"><Calendar className="size-4 mr-2" /> Smještaj</TabsTrigger>}
                {listing.videos && <TabsTrigger value="videos" className="px-8 py-2"><Youtube className="size-4 mr-2" /> Video</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="info" className="pt-6 space-y-6">
                <p className="text-lg leading-relaxed font-body">
                  Dobrodošli u {listing.name}. Nalazimo se na jednoj od najljepših lokacija u gradu {listing.address.split(',')[1]}. 
                  Naša misija je pružiti nezaboravno iskustvo svim posjetiteljima kroz vrhunsku uslugu i autentičan ambijent. 
                  Bilo da ste ovdje po prvi put ili ste naš stalni gost, trudimo se nadmašiti vaša očekivanja.
                </p>
                
                {/* Specific Paid Fields Mockup */}
                {category?.type === 'paid' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y">
                    <div className="text-center">
                      <p className="text-2xl font-bold">15+</p>
                      <p className="text-xs text-muted-foreground uppercase">Godina tradicije</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">WiFi</p>
                      <p className="text-xs text-muted-foreground uppercase">Besplatan pristup</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">P</p>
                      <p className="text-xs text-muted-foreground uppercase">Osiguran parking</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">4.9</p>
                      <div className="flex justify-center text-accent">★★★★★</div>
                    </div>
                  </div>
                )}
              </TabsContent>

              {listing.menu && (
                <TabsContent value="menu" className="pt-6">
                  <div className="space-y-4">
                    {listing.menu.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-secondary/30 rounded-lg">
                        <span className="font-bold">{item.name}</span>
                        <span className="text-primary font-bold">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}

              {listing.rooms && (
                <TabsContent value="rooms" className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-4 bg-primary/10 rounded-full text-primary">
                          <Users className="size-6" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Broj kreveta</p>
                          <p className="text-2xl font-bold">{listing.beds}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-4 bg-accent/10 rounded-full text-accent">
                          <Calendar className="size-6" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Broj soba</p>
                          <p className="text-2xl font-bold">{listing.rooms}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              )}
              
              {listing.videos && (
                <TabsContent value="videos" className="pt-6">
                  <div className="aspect-video relative rounded-2xl overflow-hidden shadow-2xl">
                    <iframe 
                      className="absolute inset-0 w-full h-full"
                      src={listing.videos[0]} 
                      title="Video player" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Contact / Sidebar */}
          <aside className="w-full lg:w-96 space-y-6">
            <Card className="shadow-2xl border-none">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-2xl font-bold mb-4">Kontakt Informacije</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="size-10 rounded-full bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Phone className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Telefon</p>
                      <p className="font-bold">{listing.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="size-10 rounded-full bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Mail className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Email</p>
                      <p className="font-bold">{listing.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="size-10 rounded-full bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Globe className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Web Stranica</p>
                      <a href={listing.web} className="font-bold text-primary hover:underline">{listing.web?.replace('https://', '')}</a>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t flex justify-center gap-4">
                  {listing.facebook && <Link href="#" className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-white transition-colors"><Facebook className="size-5" /></Link>}
                  {listing.twitter && <Link href="#" className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-white transition-colors"><Twitter className="size-5" /></Link>}
                  {listing.youtube && <Link href="#" className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-white transition-colors"><Youtube className="size-5" /></Link>}
                </div>

                <Button className="w-full h-12 text-lg font-bold bg-primary shadow-lg shadow-primary/20">Rezerviraj Odmah</Button>
              </CardContent>
            </Card>

            <div className="w-full h-64 bg-secondary/50 rounded-2xl flex items-center justify-center text-muted-foreground border-2 border-dashed border-muted">
              <p className="text-xs uppercase tracking-widest">Oglasni Prostor</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}