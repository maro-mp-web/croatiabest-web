
"use client"

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  CheckCircle2, 
  XCircle,
  Clock,
  Sparkles,
  ShieldAlert,
  Loader2,
  CreditCard,
  DollarSign,
  PlusCircle,
  RotateCcw
} from 'lucide-react';
import { CATEGORIES } from '@/app/lib/constants';
import Link from 'next/link';
import { useUser, useCollection, usePB } from '@/pocketbase';

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const pb = usePB();
  
  // Stroga provjera administratora - isključivo maro.webdeveloper@gmail.com
  const isAdmin = user?.email === 'maro.webdeveloper@gmail.com';

  const { data: listings, isLoading: listingsLoading } = useCollection('listings', {
    sort: '-created',
  });

  const handleApprove = async (id: string) => {
    if (!pb) return;
    try {
      await pb.collection('listings').update(id, { status: 'active' });
    } catch (error) {
      console.error('Approve error:', error);
    }
  };

  const handleReject = async (id: string) => {
    if (!pb) return;
    try {
      await pb.collection('listings').update(id, { status: 'rejected' });
    } catch (error) {
      console.error('Reject error:', error);
    }
  };

  const handleReset = async (id: string) => {
    if (!pb) return;
    try {
      await pb.collection('listings').update(id, { status: 'pending' });
    } catch (error) {
      console.error('Reset error:', error);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="size-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="size-24 text-destructive mb-6" />
        <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter">Pristup Odbijen</h1>
        <p className="text-muted-foreground text-lg max-w-md mb-10">Ova stranica rezervirana je isključivo za administratora maro.webdeveloper@gmail.com.</p>
        <Link href="/">
          <Button className="rounded-2xl h-16 px-12 font-black bg-primary shadow-xl shadow-primary/20 text-lg">POVRATAK NA PORTAL</Button>
        </Link>
      </div>
    );
  }

  const totalRevenue = listings?.filter(l => l.paymentStatus === 'paid').reduce((acc, curr) => {
    const categoryId = curr.locationCategoryId || curr.categoryId;
    const category = CATEGORIES.find(c => c.id === categoryId);
    const priceStr = category?.price?.replace('€', '') || '0';
    return acc + parseInt(priceStr);
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-4 py-1">Superadmin Console</Badge>
            </div>
            <h1 className="text-6xl font-headline font-black tracking-tight">Upravljačka ploča</h1>
            <p className="text-muted-foreground mt-2">Prijavljen kao: <span className="font-bold text-foreground">{user?.email}</span></p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/admin/new-listing">
              <Button className="bg-foreground text-white hover:bg-foreground/90 rounded-2xl font-black h-16 px-10 shadow-xl">
                <PlusCircle className="size-5 mr-3" /> Dodaj Objekt
              </Button>
            </Link>
            <Link href="/admin/ai-writer">
              <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5 rounded-2xl font-black h-16 px-10">
                <Sparkles className="size-5 mr-3" /> AI Assistant
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-orange-50/50">
            <CardContent className="p-8">
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">U obradi</p>
              <div className="flex items-center justify-between">
                <p className="text-6xl font-black text-orange-700">{listings?.filter(l => l.status === 'pending').length || 0}</p>
                <Clock className="size-12 text-orange-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-blue-50/50">
            <CardContent className="p-8">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Aktivno</p>
              <div className="flex items-center justify-between">
                <p className="text-6xl font-black text-blue-700">{listings?.filter(l => l.status === 'active').length || 0}</p>
                <MapPin className="size-12 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-green-50/50">
            <CardContent className="p-8">
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-4">Prihod (bruto)</p>
              <div className="flex items-center justify-between">
                <p className="text-6xl font-black text-green-700">{totalRevenue}€</p>
                <DollarSign className="size-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-primary/5">
            <CardContent className="p-8">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Premium</p>
              <div className="flex items-center justify-between">
                <p className="text-6xl font-black text-primary">{listings?.filter(l => l.locationCategoryType === 'Paid').length || 0}</p>
                <CreditCard className="size-12 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between border-b p-10 bg-secondary/5">
            <div>
              <CardTitle className="text-3xl">Upravljanje Prijavama</CardTitle>
              <CardDescription className="text-lg">Odobrite nove objekte i provjerite status naplate.</CardDescription>
            </div>
            <Badge variant="outline" className="text-primary border-primary px-6 py-2 uppercase font-black text-xs tracking-widest">
              Live Database
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            {listingsLoading ? (
              <div className="p-32 flex justify-center"><Loader2 className="animate-spin size-8 text-primary" /></div>
            ) : (
              <div className="divide-y divide-black/5">
                {!listings || listings.length === 0 ? (
                  <div className="p-32 text-center text-muted-foreground italic text-xl">Nema prijava u sustavu.</div>
                ) : (
                  listings.map((listing) => {
                    const categoryId = listing.locationCategoryId || listing.categoryId;
                    const category = CATEGORIES.find(c => c.id === categoryId);
                    const name = listing.name || listing.objectName || 'Bez naziva';
                    
                    return (
                      <div key={listing.id} className="flex flex-col md:flex-row items-center justify-between p-10 hover:bg-secondary/5 transition-colors gap-8">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                          <div className={`size-20 rounded-[2rem] flex items-center justify-center font-black text-3xl shadow-inner ${listing.locationCategoryType === 'Paid' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-2xl mb-1">{name}</p>
                            <p className="text-muted-foreground flex items-center gap-3 font-medium">
                              {category?.name} <span className="opacity-30">•</span> {listing.city}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-end gap-12 w-full md:w-auto">
                          <div className="flex flex-col items-end">
                            <p className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest mb-2">Plaćanje</p>
                            {listing.paymentStatus === 'paid' ? (
                              <Badge className="bg-green-500 hover:bg-green-600 text-[10px] font-black h-6 px-4">PROKNJIŽENO</Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] h-6 px-4 font-black opacity-30">NIJE PLAĆENO</Badge>
                            )}
                          </div>
                          
                          <div className="flex flex-col items-end">
                            <p className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest mb-2">Sustav</p>
                            <Badge variant="outline" className={`
                              ${listing.status === 'pending' ? 'border-orange-500 text-orange-500 bg-orange-50' : ''}
                              ${listing.status === 'active' || listing.status === 'approved' ? 'border-blue-500 text-blue-500 bg-blue-50' : ''}
                              ${listing.status === 'rejected' ? 'border-red-500 text-red-500 bg-red-50' : ''}
                              uppercase font-black text-[10px] px-4 h-6 rounded-lg
                            `}>
                              {listing.status}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-4">
                            {listing.status === 'pending' && (
                              <>
                                <Button variant="ghost" size="icon" onClick={() => handleReject(listing.id)} className="text-red-500 hover:bg-red-50 rounded-2xl size-14 transition-transform active:scale-90 border border-black/5">
                                  <XCircle className="size-8" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleApprove(listing.id)} className="text-blue-500 hover:bg-blue-50 rounded-2xl size-14 transition-transform active:scale-90 border border-black/5">
                                  <CheckCircle2 className="size-8" />
                                </Button>
                              </>
                            )}
                            {(listing.status === 'active' || listing.status === 'approved' || listing.status === 'rejected') && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleReset(listing.id)} 
                                className="text-muted-foreground text-[10px] font-black uppercase tracking-widest hover:text-primary rounded-xl h-12 px-6"
                              >
                                <RotateCcw className="size-3 mr-2" /> Resetiraj
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
