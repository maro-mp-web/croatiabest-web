
"use client"

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { useUser, useCollection } from '@/pocketbase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  MapPin, 
  ExternalLink, 
  Settings, 
  CreditCard,
  TrendingUp,
  Eye,
  MessageSquare,
  ShieldCheck,
  Star,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/app/lib/constants';

export default function UserDashboard() {
  const { user, isUserLoading } = useUser();

  const { data: listings, isLoading: listingsLoading } = useCollection('listings', {
    filter: user?.id ? `ownerId = "${user.id}"` : '',
    sort: '-created',
  });

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
        <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="size-12 text-primary" />
        </div>
        <h1 className="text-4xl font-black mb-4 tracking-tighter">Pristupite svom Dashboardu</h1>
        <p className="text-muted-foreground mb-8 text-lg max-w-sm font-body italic">Prijavite se kako biste upravljali svojim objektima.</p>
        <Link href="/"><Button className="h-14 px-10 rounded-2xl font-black bg-primary">Povratak na početnu</Button></Link>
      </div>
    );
  }

  const activeListings = listings?.filter(l => l.status === 'active') || [];
  const pendingListings = listings?.filter(l => l.status === 'pending') || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="space-y-4">
            <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-6 py-1">Partner Portal</Badge>
            <h1 className="text-6xl font-headline font-black tracking-tighter">Dobrodošli natrag, {user.displayName?.split(' ')[0] || 'Partner'}</h1>
            <p className="text-muted-foreground text-xl font-body italic">Upravljajte svojim prisustvom na CroatiaBest.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Stats & User Info Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-primary to-secondary" />
              <CardContent className="p-8 -mt-12">
                <div className="size-24 rounded-[2rem] border-8 border-white bg-white shadow-lg overflow-hidden mb-6 mx-auto">
                  <Image 
                    src={user.photoURL || `https://picsum.photos/seed/${user.uid}/200`} 
                    alt="Profile" 
                    width={96} 
                    height={96} 
                    className="object-cover" 
                  />
                </div>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-black">{user.displayName || 'Vlasnik Objekta'}</h3>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
                <div className="space-y-3">
                  <Button variant="secondary" className="w-full rounded-xl h-12 font-bold justify-start"><Settings className="size-4 mr-3" /> Postavke Profila</Button>
                  <Button variant="secondary" className="w-full rounded-xl h-12 font-bold justify-start"><CreditCard className="size-4 mr-3" /> Povijest Plaćanja</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Listings Area */}
          <div className="lg:col-span-3 space-y-10">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-none shadow-xl rounded-3xl bg-secondary/5 border border-secondary/10 p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest mb-1">Aktivni Objekti</p>
                    <p className="text-5xl font-black">{activeListings.length}</p>
                  </div>
                  <Eye className="size-10 text-secondary opacity-20" />
                </div>
              </Card>
              <Card className="border-none shadow-xl rounded-3xl bg-orange-50 border border-orange-100 p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase text-orange-600/60 tracking-widest mb-1">U Obradi</p>
                    <p className="text-5xl font-black text-orange-700">{pendingListings.length}</p>
                  </div>
                  <TrendingUp className="size-10 text-orange-600 opacity-20" />
                </div>
              </Card>
              <Card className="border-none shadow-xl rounded-3xl bg-primary/5 border border-primary/10 p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase text-primary/60 tracking-widest mb-1">Ukupno Upita</p>
                    <p className="text-5xl font-black text-primary">0</p>
                  </div>
                  <MessageSquare className="size-10 text-primary opacity-20" />
                </div>
              </Card>
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black flex items-center gap-4 italic">
                  <Star className="size-8 text-primary fill-primary" /> Moji Objekti
                </h2>
                <Badge variant="outline" className="px-4 py-1 text-[10px] font-black uppercase">Live Updates</Badge>
              </div>
              
              {!listings || listings.length === 0 ? (
                <div className="border-4 border-dashed rounded-[3rem] p-24 text-center space-y-6">
                  <p className="text-2xl text-muted-foreground font-body italic">
                    Još niste dodali niti jedan objekt.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8">
                  {listings.map((item) => {
                    const cat = CATEGORIES.find(c => c.id === item.locationCategoryId || item.categoryId);
                    const isPremium = item.locationCategoryType === 'Paid' || item.type === 'paid';
                    
                    return (
                      <Card key={item.id} className="border-none shadow-2xl rounded-[3rem] overflow-hidden group hover:shadow-primary/10 transition-all duration-500 bg-white">
                        <CardContent className="p-0 flex flex-col md:flex-row">
                          <div className="relative w-full md:w-80 h-64 md:h-auto overflow-hidden">
                            <Image 
                              src={item.photoUrls?.[0] || 'https://picsum.photos/seed/placeholder/800/600'} 
                              alt={item.name || item.objectName} 
                              fill 
                              className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                              <Link href={generateListingUrl(item.locationCategoryId || item.categoryId, item.name, item.id)}>
                                <Button className="w-full bg-white text-primary font-black rounded-xl">VIDI JAVNO <ChevronRight className="size-4 ml-1" /></Button>
                              </Link>
                            </div>
                          </div>
                          <div className="flex-1 p-10 flex flex-col justify-between">
                            <div className="space-y-4">
                              <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex gap-2">
                                  <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase px-4 py-1">{cat?.name}</Badge>
                                  <Badge className={`
                                    text-[10px] font-black uppercase px-4 py-1 border-none
                                    ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}
                                  `}>
                                    {item.status}
                                  </Badge>
                                </div>
                                {isPremium && (
                                  <div className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-tighter">
                                    <Star className="size-3 fill-primary" /> PREMIUM PARTNER
                                  </div>
                                )}
                              </div>
                              <h3 className="text-4xl font-black leading-none">{item.name || item.objectName}</h3>
                              <p className="text-muted-foreground text-lg flex items-center gap-2 font-body italic">
                                <MapPin className="size-5 text-secondary" /> {item.city}, {item.address}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between pt-10 mt-8 border-t border-black/5">
                              <div className="flex flex-col">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Status Naplate</p>
                                {item.paymentStatus === 'paid' ? (
                                  <span className="text-sm font-black text-green-600 flex items-center gap-2">
                                    <ShieldCheck className="size-4" /> PROKNJIŽENO
                                  </span>
                                ) : (
                                  <span className="text-sm font-black text-orange-600 uppercase">
                                    ČEKA SE UPLATA
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Link href={generateListingUrl(item.locationCategoryId || item.categoryId, item.name, item.id)}>
                                  <Button size="sm" variant="outline"><Eye className="w-4 h-4 mr-2" /> Pregledaj</Button>
                                </Link>
                                <Button variant="outline" className="rounded-xl px-6 h-12 font-bold border-black/10 hover:bg-black/5">
                                  UREDI
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-xl size-12 border border-black/10 hover:bg-black/5">
                                  <Settings className="size-5" />
                                </Button>
                              </div>
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
        </div>
      </main>
    </div>
  );
}
