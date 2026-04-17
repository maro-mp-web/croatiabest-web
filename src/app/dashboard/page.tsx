"use client"

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, PlusCircle, MapPin, ExternalLink, Settings, CreditCard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/app/lib/constants';

export default function UserDashboard() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userListingsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'listings'),
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user?.uid]);

  const { data: listings, isLoading: listingsLoading } = useCollection(userListingsQuery);

  if (isUserLoading || listingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="size-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <h1 className="text-4xl font-black mb-4">Pristupite svom Dashboardu</h1>
        <p className="text-muted-foreground mb-8">Prijavite se kako biste upravljali svojim objektima.</p>
        <Link href="/"><Button>Povratak na početnu</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-headline font-black">Moj Dashboard</h1>
            <p className="text-muted-foreground mt-2">Upravljajte svojim objavama i pratite status.</p>
          </div>
          <Link href="/submit">
            <Button className="rounded-2xl h-14 px-8 font-black bg-primary shadow-lg shadow-primary/20">
              <PlusCircle className="size-5 mr-2" /> NOVA PRIJAVA
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info & Stats */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl rounded-[2rem]">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Image 
                      src={user.photoURL || `https://picsum.photos/seed/${user.uid}/200`} 
                      alt="Profile" 
                      width={64} 
                      height={64} 
                      className="rounded-full object-cover" 
                    />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{user.displayName || 'Vlasnik Objekta'}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-secondary/5 rounded-xl border border-secondary/10">
                  <span className="text-sm font-bold">Ukupno objekata</span>
                  <span className="text-2xl font-black text-primary">{listings?.length || 0}</span>
                </div>
                <Button variant="outline" className="w-full rounded-xl"><Settings className="size-4 mr-2" /> Postavke Profila</Button>
                <Button variant="outline" className="w-full rounded-xl"><CreditCard className="size-4 mr-2" /> Povijest Plaćanja</Button>
              </CardContent>
            </Card>

            <div className="p-8 bg-foreground text-white rounded-[2rem] space-y-4">
              <h3 className="text-2xl font-black italic">Trebate pomoć?</h3>
              <p className="text-white/60 text-sm">Naš tim je tu za vas 0-24. Ako imate pitanja o svojoj pretplati ili želite poboljšati vidljivost, kontaktirajte nas.</p>
              <Button className="w-full bg-primary text-white font-black rounded-xl">PODRŠKA</Button>
            </div>
          </div>

          {/* Listings List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <PlusCircle className="size-6 text-primary" /> Moji Objekti
            </h2>
            
            {!listings || listings.length === 0 ? (
              <Card className="border-2 border-dashed rounded-[2rem] p-12 text-center text-muted-foreground italic">
                Još niste dodali niti jedan objekt. Započnite klikom na gumb "Nova prijava".
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {listings.map((item) => {
                  const cat = CATEGORIES.find(c => c.id === item.locationCategoryId || item.categoryId);
                  return (
                    <Card key={item.id} className="border-none shadow-xl rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all">
                      <CardContent className="p-0 flex flex-col md:flex-row">
                        <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden">
                          <Image 
                            src={item.photoUrls?.[0] || 'https://picsum.photos/seed/placeholder/400/300'} 
                            alt={item.name || item.objectName} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-700" 
                          />
                        </div>
                        <div className="flex-1 p-8">
                          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase">{cat?.name}</Badge>
                                <Badge variant="outline" className={`
                                  text-[10px] font-black uppercase
                                  ${item.status === 'active' ? 'border-green-500 text-green-500 bg-green-50' : 'border-orange-500 text-orange-500 bg-orange-50'}
                                `}>
                                  {item.status}
                                </Badge>
                              </div>
                              <h3 className="text-2xl font-black">{item.name || item.objectName}</h3>
                              <p className="text-muted-foreground text-sm flex items-center gap-2">
                                <MapPin className="size-3" /> {item.city}, {item.address}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Link href={`/listing/${item.id}`}>
                                <Button size="icon" variant="ghost" className="rounded-full border border-black/5"><ExternalLink className="size-4" /></Button>
                              </Link>
                              <Button size="icon" variant="ghost" className="rounded-full border border-black/5"><Settings className="size-4" /></Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-6 border-t border-black/5 mt-4">
                            <div className="flex items-center gap-2">
                              {item.paymentStatus === 'paid' ? (
                                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1">
                                  <CreditCard className="size-3" /> Pretplata Aktivna
                                </span>
                              ) : (
                                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                                  Čeka se naplata
                                </span>
                              )}
                            </div>
                            <Button variant="link" className="text-primary font-black text-xs uppercase p-0 h-auto">Uredi detalje</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
