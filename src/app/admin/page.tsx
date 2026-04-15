
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
  Loader2
} from 'lucide-react';
import { CATEGORIES } from '@/app/lib/constants';
import Link from 'next/link';
import { useFirestore, useUser, useCollection } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AdminDashboard() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  
  // Zaštita: Samo određeni email može biti admin (ovdje postavi svoj email)
  const isAdmin = user?.email === 'superadmin@croatiabest.hr' || user?.email?.includes('admin');

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
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: { status: 'approved' },
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleReject = async (id: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'listings', id);
    updateDoc(docRef, { status: 'rejected' })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: { status: 'rejected' },
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  if (userLoading || listingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
          <p className="text-muted-foreground text-lg max-w-md">Nažalost, nemate ovlasti za pristup Superadmin panelu. Molimo prijavite se s ispravnim računom.</p>
          <Link href="/">
            <Button className="mt-8 rounded-xl h-12 px-8 font-bold">Povratak na portal</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-headline font-bold mb-2 text-gradient">Superadmin Dashboard</h1>
            <p className="text-muted-foreground text-lg">Prijavljen kao: <span className="font-bold text-foreground">{user?.email}</span></p>
          </div>
          <Link href="/admin/ai-writer">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-xl">
              <Sparkles className="size-4 mr-2" /> AI Content Assistant
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-none shadow-lg bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-orange-600 uppercase tracking-widest">Čeka provjeru</p>
                  <p className="text-4xl font-black mt-1 text-orange-700">{listings?.filter(l => l.status === 'pending').length || 0}</p>
                </div>
                <Clock className="size-10 text-orange-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">Odobreno</p>
                  <p className="text-4xl font-black mt-1 text-blue-700">{listings?.filter(l => l.status === 'approved').length || 0}</p>
                </div>
                <MapPin className="size-10 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-green-600 uppercase tracking-widest">Ukupno prijava</p>
                  <p className="text-4xl font-black mt-1 text-green-700">{listings?.length || 0}</p>
                </div>
                <Users className="size-10 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Listings Table */}
        <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-6 bg-secondary/5">
            <div>
              <CardTitle>Sve Prijave</CardTitle>
              <CardDescription>Upravljajte objektima na portalu.</CardDescription>
            </div>
            <Badge variant="outline" className="text-primary border-primary px-4 py-1 uppercase">
              LIVE DATA
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {listings?.length === 0 ? (
                <div className="p-20 text-center text-muted-foreground italic">Nema novih prijava u sustavu.</div>
              ) : (
                listings?.map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between p-6 hover:bg-secondary/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`size-12 rounded-xl flex items-center justify-center font-bold text-lg ${listing.type === 'paid' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {listing.objectName?.charAt(0) || 'O'}
                      </div>
                      <div>
                        <p className="font-bold text-lg">{listing.objectName}</p>
                        <p className="text-sm text-muted-foreground">
                          {CATEGORIES.find(c => c.id === listing.categoryId)?.name} • {listing.city}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden md:block">
                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Prijavio</p>
                        <p className="text-sm font-medium">{listing.firstName} {listing.lastName}</p>
                      </div>
                      
                      <Badge className={listing.type === 'paid' ? 'bg-primary' : 'bg-muted text-muted-foreground border-none'}>
                        {listing.type === 'paid' ? 'PAID' : 'FREE'}
                      </Badge>

                      <Badge variant="outline" className={`
                        ${listing.status === 'pending' ? 'border-orange-500 text-orange-500' : ''}
                        ${listing.status === 'approved' ? 'border-green-500 text-green-500' : ''}
                        ${listing.status === 'rejected' ? 'border-red-500 text-red-500' : ''}
                        uppercase font-black text-[10px]
                      `}>
                        {listing.status}
                      </Badge>
                      
                      <div className="flex gap-2">
                        {listing.status === 'pending' && (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => handleReject(listing.id)} className="text-red-500 hover:bg-red-50 rounded-full">
                              <XCircle className="size-6" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleApprove(listing.id)} className="text-green-500 hover:bg-green-50 rounded-full">
                              <CheckCircle2 className="size-6" />
                            </Button>
                          </>
                        )}
                        {listing.status !== 'pending' && (
                          <Button variant="ghost" size="sm" onClick={() => handleReject(listing.id)} className="text-muted-foreground text-xs">Resetiraj</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
