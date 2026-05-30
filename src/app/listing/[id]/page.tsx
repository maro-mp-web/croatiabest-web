
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
import { MapPin, Phone, Mail, Globe, Calendar, Users, List, Info, Loader2, Send, Tag, ShoppingBag } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useDoc, useUser, usePB } from '@/pocketbase';
import { toast } from '@/hooks/use-toast';

export default function ListingDetailPage() {
  const params = useParams();
  const { user } = useUser();
  const pb = usePB();
  const [inquiryText, setInquiryText] = useState('');
  const [isInquiring, setIsInquiring] = useState(false);

  const { data: listing, isLoading } = useDoc('listings', params.id as string);
  
  const handleSendInquiry = async () => {
    if (!listing || !pb) return;
    if (!inquiryText) {
      toast({ title: "Prazna poruka", description: "Napišite nešto u upitu.", variant: "destructive" });
      return;
    }
    setIsInquiring(true);
    try {
      await pb.collection('inquiries').create({
        listingId: listing.id,
        listingName: listing.name,
        ownerId: listing.ownerId,
        senderId: user?.id || 'anonymous',
        senderEmail: user?.email || 'anonymous@visitor.com',
        message: inquiryText,
      });
      toast({ title: "Upit poslan!", description: "Vlasnik će primiti vašu poruku." });
      setInquiryText('');
    } catch (e) {
      toast({ title: "Greška", description: "Slanje nije uspjelo.", variant: "destructive" });
    } finally {
      setIsInquiring(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!listing) return null;

  const category = CATEGORIES.find(c => c.id === listing.locationCategoryId);
  const photos = listing.photoUrls || ['https://picsum.photos/seed/placeholder/1200/800'];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pb-24">
        <section className="h-[60vh] relative flex gap-2 p-2">
          <div className="flex-1 relative rounded-[2rem] overflow-hidden">
            <Image src={photos[0]} alt="Hero" fill className="object-cover" priority />
          </div>
          {photos.length > 1 && (
            <div className="w-1/4 hidden md:flex flex-col gap-2">
              {photos.slice(1, 3).map((p, i) => (
                <div key={i} className="flex-1 relative rounded-[2rem] overflow-hidden">
                  <Image src={p} alt={`Photo ${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="container mx-auto px-4 mt-12 flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/10 text-primary border-none px-6 py-1.5 uppercase font-black text-[10px] tracking-widest">{category?.name}</Badge>
                <Badge variant="outline" className="text-secondary border-secondary px-6 py-1.5 font-black text-[10px]">{listing.city}</Badge>
              </div>
              <h1 className="text-6xl font-headline font-black tracking-tighter">{listing.name}</h1>
              <p className="text-xl text-muted-foreground flex items-center gap-2"><MapPin className="size-5 text-primary" /> {listing.address}</p>
            </div>

            <Tabs defaultValue="info" className="w-full">
              <TabsList className="bg-secondary/5 p-1 rounded-2xl h-14">
                <TabsTrigger value="info" className="px-10 h-full rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md font-black uppercase text-xs">Informacije</TabsTrigger>
                {(listing.products || listing.menuDescription) && (
                  <TabsTrigger value="offer" className="px-10 h-full rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md font-black uppercase text-xs">Ponuda</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="info" className="pt-10 space-y-8">
                <div className="prose prose-2xl max-w-none font-body italic text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </div>
              </TabsContent>

              <TabsContent value="offer" className="pt-10 space-y-10">
                {listing.menuDescription && <div className="p-10 bg-secondary/5 rounded-[2rem] italic text-2xl font-body">{listing.menuDescription}</div>}
                {listing.products && (
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black italic flex items-center gap-4"><ShoppingBag className="text-primary" /> Katalog Proizvoda</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {listing.products.map((p: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-6 bg-white rounded-2xl border border-black/5 shadow-sm">
                          <span className="font-bold text-lg">{p.name}</span>
                          <Badge variant="secondary" className="text-lg px-4 py-1">{p.price}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <aside className="w-full lg:w-96 space-y-8">
            <Card className="rounded-[3rem] shadow-2xl border-none overflow-hidden">
              <div className="bg-foreground p-8 text-white flex justify-between items-center">
                <h3 className="text-2xl font-black italic">Kontakt Forma</h3>
                <Send className="size-5 opacity-40" />
              </div>
              <CardContent className="p-8 space-y-6">
                <p className="text-xs text-muted-foreground italic">Pošaljite upit izravno vlasniku. Naš sustav štiti vašu privatnost.</p>
                <Textarea placeholder="Vaša poruka..." value={inquiryText} onChange={e => setInquiryText(e.target.value)} className="min-h-[120px] rounded-xl border-none bg-secondary/5" />
                <Button onClick={handleSendInquiry} disabled={isInquiring} className="w-full h-14 font-black bg-primary rounded-xl shadow-lg">
                  {isInquiring ? <Loader2 className="animate-spin" /> : 'POŠALJI UPIT'}
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-[3rem] shadow-2xl border-none p-8 space-y-4">
              <h4 className="text-xl font-black">Detalji</h4>
              <div className="space-y-3">
                {listing.contactPhone && <div className="flex items-center gap-3 font-bold text-sm"><Phone className="size-4 text-primary" /> {listing.contactPhone}</div>}
                {listing.webAddress && <a href={listing.webAddress} target="_blank" className="flex items-center gap-3 font-bold text-sm text-secondary hover:underline"><Globe className="size-4" /> Web stranica</a>}
              </div>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
