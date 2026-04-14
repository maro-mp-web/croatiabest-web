
"use client"

import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { CATEGORIES } from '@/app/lib/constants';
import Link from 'next/link';

export default function AdminDashboard() {
  // Mock podaci za prijave koje čekaju
  const pendingListings = [
    { id: 'l1', name: 'Restoran Riva', categoryId: 'restaurants', type: 'paid', status: 'pending', city: 'Split' },
    { id: 'l2', name: 'Apartmani Sunce', categoryId: 'apartments', type: 'paid', status: 'pending', city: 'Zadar' },
    { id: 'l3', name: 'Javna Plaža Grad', categoryId: 'beaches', type: 'free', status: 'pending', city: 'Pula' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-headline font-bold mb-2">Superadmin Dashboard</h1>
            <p className="text-muted-foreground text-lg">Samo ti možeš odobravati objekte na CroatiaBest.</p>
          </div>
          <Link href="/admin/ai-writer">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
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
                  <p className="text-sm font-bold text-orange-600 uppercase tracking-widest">Na čekanju</p>
                  <p className="text-4xl font-black mt-1 text-orange-700">{pendingListings.length}</p>
                </div>
                <Clock className="size-10 text-orange-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">Ukupno Objekata</p>
                  <p className="text-4xl font-black mt-1 text-blue-700">1,284</p>
                </div>
                <MapPin className="size-10 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-green-600 uppercase tracking-widest">Korisnici</p>
                  <p className="text-4xl font-black mt-1 text-green-700">842</p>
                </div>
                <Users className="size-10 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals Table */}
        <Card className="border-none shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
            <div>
              <CardTitle>Nove Prijave Objekata</CardTitle>
              <CardDescription>Pregledaj podatke i odobri objavu na portalu.</CardDescription>
            </div>
            <Badge variant="outline" className="text-orange-600 bg-orange-100 border-orange-200 px-4 py-1">
              ČEKAJU ODOBRENJE
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {pendingListings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between p-6 hover:bg-secondary/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`size-12 rounded-xl flex items-center justify-center font-bold text-lg ${listing.type === 'paid' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {listing.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{listing.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {CATEGORIES.find(c => c.id === listing.categoryId)?.name} • {listing.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={listing.type === 'paid' ? 'default' : 'secondary'} className={listing.type === 'paid' ? 'bg-primary' : ''}>
                      {listing.type === 'paid' ? 'PLAĆENO (PAY)' : 'BESPLATNO (FREE)'}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
                        <XCircle className="size-6" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-green-500 hover:bg-green-50">
                        <CheckCircle2 className="size-6" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
