
"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CATEGORIES } from '@/app/lib/constants';
import { MapPin, Phone, Mail, Globe, Facebook, Youtube, Calendar, Users, List, Info, Loader2, Share2, Instagram, Send } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useFirestore, useDoc, useUser } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

export default function ListingDetailPage() {
  const params = useParams();
  const { user } = useUser();
  const firestore = useFirestore();
  const [inquiryText, setInquiryText] = useState('');
  const [isInquiring, setIsInquiring] = useState(false);

  const docRef = React.useMemo(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, 'listings', params.id as string);
  }, [firestore, params.id]);

  const { data: listing, isLoading } = useDoc(docRef);
  
  const handleSendInquiry = async () => {
    if (!listing || !firestore) return;
    if (!inquiryText) {
      toast({ title: "Prazna poruka", description: "Napišite nešto u upitu.", variant: "destructive" });
      return;
    }
    
    setIsInquiring(true);
    try {
      await addDoc(collection(firestore, 'inquiries'), {
        listingId: listing.id,
        listingName: listing.name,
        ownerId: listing.ownerId,
        senderId: user?.uid || 'anonymous',
        senderEmail: user?.email || 'anonymous@visitor.com',
        message: inquiryText,
        createdAt: serverTimestamp()
      });
      toast({ title: "Upit poslan!", description: "Vlasnik će primiti vašu poruku." });
      setInquiryText('');
    } catch (e) {
      toast({ title: "Greška", description: "Slanje nije uspjelo.", variant: "destructive" });
    } finally {
      setIsInquiring(false);
    }
  };

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
              <Image src={photos[3] || photos[photos.length - 1]} alt="Img 3" fill className="object-cover" />
            </div>
            <div className="relative h-full rounded-br-[2rem] overflow-hidden group">
              <Image src={photos[4] || photos[photos.length - 1]} alt="Img 4" fill className="object-cover" />
              {photos.length > 5 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-black text-xl group-hover:bg-black/60 transition-all cursor-pointer backdrop-blur-sm">
                  + {photos.length - 5} fotografija
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 mt-12 flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-10">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-primary/10 text-primary border-none text-xs font-black px-6 py-2 uppercase tracking-widest rounded-full">{category?.name}</Badge>
                {listing.locationCategoryType === 'Paid' && <Badge variant="outline" className="text-secondary border-secondary px-6 py-2 rounded-full font-black uppercase text-[10px]">Verified Partner</Badge>}
                <Badge className="bg-secondary/10 text-secondary border-none px-6 py-2 rounded-full font-black uppercase text-[10px]">{listing.city}</Badge>
              </div>
              <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tight">{listing.name}</h1>
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
                {(listing.roomCount > 0 || listing.bedCount > 0) && (
                  <TabsTrigger value="rooms" className="px-10 h-full rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg font-black uppercase text-xs tracking-widest">
                    <Calendar className="size-4 mr-2" /> Kapacitet
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="info" className="pt-10 space-y-10">
                <div className="prose prose-2xl max-w-none font-body leading-relaxed whitespace-pre-wrap text-foreground/80">
                  {listing.description}
                </div>
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

              <TabsContent value="rooms" className="pt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="border-none shadow-xl rounded-[2.5rem] bg-white">
                    <CardContent className="p-10 flex items-center gap-6">
                      <div className="size-20 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary">
                        <Users className="size-10" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Ukupno kreveta</p>
                        <p className="text-5xl font-black leading-none">{listing.bedCount || '0'}</p>
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
                        <p className="text-5xl font-black leading-none">{listing.roomCount || '0'}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <aside className="w-full lg:w-96 space-y-8">
            <Card className="shadow-2xl border-none rounded-[3rem] overflow-hidden">
              <div className="bg-foreground p-8 text-white flex justify-between items-center">
                <h3 className="text-2xl font-black italic">Brzi Upit</h3>
                <Mail className="size-6 text-white/30" />
              </div>
              <CardContent className="p-8 space-y-6">
                <p className="text-sm text-muted-foreground italic">Pošaljite poruku izravno vlasniku objekta.</p>
                <Textarea 
                  placeholder="Pišite ovdje..." 
                  value={inquiryText}
                  onChange={(e) => setInquiryText(e.target.value)}
                  className="rounded-xl bg-secondary/5 border-none min-h-[120px]"
                />
                <Button 
                  onClick={handleSendInquiry} 
                  disabled={isInquiring} 
                  className="w-full h-14 font-black bg-primary rounded-xl shadow-xl shadow-primary/20 uppercase tracking-widest"
                >
                  {isInquiring ? <Loader2 className="animate-spin" /> : <><Send className="size-4 mr-2" /> POŠALJI UPIT</>}
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-2xl border-none rounded-[3rem] overflow-hidden">
              <CardHeader className="p-8 pb-0"><h3 className="text-2xl font-black">Kontakt</h3></CardHeader>
              <CardContent className="p-8 space-y-4">
                {listing.contactPhone && <div className="flex items-center gap-4 text-sm font-bold"><Phone className="size-4 text-primary" /> {listing.contactPhone}</div>}
                {listing.contactEmail && <div className="flex items-center gap-4 text-sm font-bold"><Mail className="size-4 text-primary" /> {listing.contactEmail}</div>}
                {listing.webAddress && <a href={listing.webAddress} target="_blank" className="flex items-center gap-4 text-sm font-bold text-secondary hover:underline"><Globe className="size-4" /> Posjeti web</a>}
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
