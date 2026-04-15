
"use client"

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MapPin, 
  CheckCircle2, 
  XCircle,
  Clock,
  Sparkles,
  ShieldAlert,
  Loader2,
  CreditCard,
  DollarSign,
  PlusCircle
} from 'lucide-react';
import { CATEGORIES } from '@/app/lib/constants';
import Link from 'next/link';
import { useFirestore, useUser, useCollection } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AdminDashboard() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  
  // Zaštita: Samo ti si superadmin
  const isAdmin = user?.email?.includes('admin') || user?.email === 'vlasnik@croatiabest.hr';

  const listingsQuery = React.useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'listings'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: listings, loading: listingsLoading } = useCollection(listingsQuery);

  const handleApprove = async (id: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'listings', id);
    updateDoc(docRef, { status: 'approved' })
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: { status: 'approved' },
        }));
      });
  };

  const handleReject = async (id: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'listings', id);
    updateDoc(docRef, { status: 'rejected' })
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: { status: 'rejected' },
        }));
      });
  };

  if (userLoading || listingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="size-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <ShieldAlert className="size-24 text-destructive mb-6" />
          <h1 className="text-4xl font-black mb-4 uppercase">Pristup Odbijen</h1>
          <p className="text-muted-foreground text-lg max-w-md">Ova stranica je rezervirana samo za Superadmina portala CroatiaBest.</p>
          <Link href="/">
            <Button className="mt-8 rounded-xl h-12 px-8 font-bold">Povratak na portal</Button>
          </Link>
        </main>
      </div>
    );
  }

  const totalRevenue = listings?.filter(l => l.paymentStatus === 'paid').reduce((acc, curr) => {
    const priceStr = CATEGORIES.find(c => c.id === curr.categoryId)?.price?.replace('€', '') || '0';
    return acc + parseInt(priceStr);
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-headline font-bold mb-2 text-gradient">Superadmin Dashboard</h1>
            <p className="text-muted-foreground text-lg">Prijavljen kao: <span className="font-bold text-foreground">{user?.email}</span></p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/admin/new-listing">
              <Button className="bg-foreground text-white hover:bg-foreground/90 rounded-xl font-bold h-12 px-6">
                <PlusCircle className="size-4 mr-2" /> Dodaj Novi Objekt
              </Button>
            </Link>
            <Link href="/admin/ai-writer">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-bold h-12 px-6">
                <Sparkles className="size-4 mr-2" /> AI Content Assistant
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-none shadow-lg bg-orange-50/50">
            <CardContent className="pt-6">
              <p className="text-sm font-bold text-orange-600 uppercase tracking-widest">Čeka provjeru</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-4xl font-black text-orange-700">{listings?.filter(l => l.status === 'pending').length || 0}</p>
                <Clock className="size-8 text-orange-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-blue-50/50">
            <CardContent className="pt-6">
              <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">Odobreno</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-4xl font-black text-blue-700">{listings?.filter(l => l.status === 'approved').length || 0}</p>
                <MapPin className="size-8 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-green-50/50">
            <CardContent className="pt-6">
              <p className="text-sm font-bold text-green-600 uppercase tracking-widest">Prihodi (Simulirano)</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-4xl font-black text-green-700">{totalRevenue}€</p>
                <DollarSign className="size-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-sm font-bold text-primary uppercase tracking-widest">Plaćene objave</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-4xl font-black text-primary">{listings?.filter(l => l.type === 'paid').length || 0}</p>
                <CreditCard className="size-8 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Listings Table */}
        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-6 bg-secondary/5">
            <div>
              <CardTitle>Upravljanje Prijavama</CardTitle>
              <CardDescription>Pregledajte nove objekte i uplate prije odobrenja.</CardDescription>
            </div>
            <Badge variant="outline" className="text-primary border-primary px-4 py-1 uppercase font-black text-[10px]">
              LIVE DATA
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {listings?.length === 0 ? (
                <div className="p-20 text-center text-muted-foreground italic">Nema prijava u sustavu.</div>
              ) : (
                listings?.map((listing) => {
                  const category = CATEGORIES.find(c => c.id === listing.categoryId);
                  return (
                    <div key={listing.id} className="flex items-center justify-between p-6 hover:bg-secondary/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`size-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${listing.type === 'paid' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {listing.objectName?.charAt(0) || 'O'}
                        </div>
                        <div>
                          <p className="font-bold text-lg">{listing.objectName}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            {category?.name} <span className="opacity-20">•</span> {listing.city}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="hidden lg:flex flex-col items-end">
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Status Plaćanja</p>
                          {listing.paymentStatus === 'paid' ? (
                            <Badge className="bg-green-500 hover:bg-green-600 text-[10px] h-5">UPLAĆENO</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] h-5 opacity-40">N/A</Badge>
                          )}
                        </div>
                        
                        <Badge variant="outline" className={`
                          ${listing.status === 'pending' ? 'border-orange-500 text-orange-500 bg-orange-50' : ''}
                          ${listing.status === 'approved' ? 'border-green-500 text-green-500 bg-green-50' : ''}
                          ${listing.status === 'rejected' ? 'border-red-500 text-red-500 bg-red-50' : ''}
                          uppercase font-black text-[10px] px-3 py-1 rounded-lg
                        `}>
                          {listing.status}
                        </Badge>
                        
                        <div className="flex gap-2">
                          {listing.status === 'pending' && (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => handleReject(listing.id)} className="text-red-500 hover:bg-red-50 rounded-full transition-transform active:scale-90">
                                <XCircle className="size-7" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleApprove(listing.id)} className="text-green-500 hover:bg-green-50 rounded-full transition-transform active:scale-90">
                                <CheckCircle2 className="size-7" />
                              </Button>
                            </>
                          )}
                          {listing.status !== 'pending' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                if (!firestore) return;
                                const docRef = doc(firestore, 'listings', listing.id);
                                updateDoc(docRef, { status: 'pending' });
                              }} 
                              className="text-muted-foreground text-xs font-bold hover:text-primary"
                            >
                              Resetiraj
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
