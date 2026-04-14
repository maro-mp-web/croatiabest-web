
"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MapPin, 
  CreditCard, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  XCircle,
  Clock,
  Plus
} from 'lucide-react';
import { CATEGORIES } from '@/app/lib/constants';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending');

  const stats = [
    { label: 'Na čekanju', value: '12', icon: Clock, color: 'text-orange-600' },
    { label: 'Ukupno Objekata', value: '1,284', icon: MapPin, color: 'text-blue-600' },
    { label: 'Novi Članci', value: '18', icon: FileText, color: 'text-purple-600' },
    { label: 'Korisnici', value: '842', icon: Users, color: 'text-green-600' },
  ];

  // Mock podaci za prijave
  const pendingListings = [
    { id: 'l1', name: 'Restoran Riva', categoryId: 'restaurants', type: 'paid', status: 'pending', city: 'Split' },
    { id: 'l2', name: 'Apartmani Sunce', categoryId: 'apartments', type: 'paid', status: 'pending', city: 'Zadar' },
    { id: 'l3', name: 'Javna Plaža Grad', categoryId: 'beaches', type: 'free', status: 'pending', city: 'Pula' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-headline font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground text-lg">Samo Superadmin ima pristup odobravanju listinga.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/ai-writer">
              <Button variant="outline">
                <Sparkles className="size-4 mr-2" /> AI Pisač
              </Button>
            </Link>
            <Link href="/submit">
              <Button className="bg-primary">
                <Plus className="size-4 mr-2" /> Novi Unos
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-4 rounded-2xl bg-secondary/10 ${stat.color}`}>
                    <stat.icon className="size-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Management Section */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
                <div>
                  <CardTitle>Nove Prijave</CardTitle>
                  <CardDescription>Objekti koji čekaju tvoje odobrenje</CardDescription>
                </div>
                <Badge variant="outline" className="text-orange-600 bg-orange-50 border-orange-200">
                  {pendingListings.length} ČEKAJU
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
                      <div className="flex items-center gap-3">
                        <Badge variant={listing.type === 'paid' ? 'default' : 'secondary'} className="mr-4">
                          {listing.type === 'paid' ? 'PLAĆENO' : 'FREE'}
                        </Badge>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                          <XCircle className="size-6" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-green-500 hover:bg-green-50 hover:text-green-600">
                          <CheckCircle2 className="size-6" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {pendingListings.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground">
                    Nema novih prijava na čekanju.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <CreditCard className="size-32 rotate-12" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">Financije</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Očekivana naplata</span>
                  <span className="font-bold">1,420€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Ovaj mjesec</span>
                  <span className="font-bold">4,120€</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full mt-4">
                  <div className="h-full bg-white w-2/3 rounded-full" />
                </div>
                <p className="text-xs text-white/60">65% cilja za veljaču ostvareno.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
