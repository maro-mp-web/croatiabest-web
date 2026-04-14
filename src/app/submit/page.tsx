
"use client"

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CATEGORIES } from '@/app/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Info, CheckCircle2, User, Building2, LayoutGrid, CheckSquare } from 'lucide-react';

export default function SubmitListingPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactEmail: '',
    contactPhone: '',
    objectName: '',
    categoryId: '',
    address: '',
    city: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedCategory = CATEGORIES.find(c => c.id === formData.categoryId);
  const isPaid = selectedCategory?.type === 'paid';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      toast({ title: "Odaberite kategoriju", description: "Morate odabrati kategoriju objekta.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    
    // Simulacija slanja u bazu podataka
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "Prijava poslana!",
        description: isPaid 
          ? "Vaša prijava je zaprimljena. Očekujte upute za plaćanje na email prije odobrenja." 
          : "Vaša prijava je poslana na pregled administratoru.",
      });
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
          <div className="size-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 animate-bounce">
            <CheckCircle2 className="size-14" />
          </div>
          <h1 className="text-5xl font-headline font-black mb-4">Uspješno poslano!</h1>
          <p className="text-muted-foreground text-xl max-w-lg mb-12">
            Hvala vam, <strong>{formData.firstName}</strong>. Vaša prijava za <strong>{formData.objectName}</strong> je poslana Superadminu na provjeru. Provjerite svoj email za daljnje upute.
          </p>
          <Button size="lg" className="rounded-2xl px-12 h-14 text-lg font-bold" onClick={() => window.location.href = '/'}>Povratak na naslovnicu</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-primary/10 text-primary rounded-full text-xs font-black tracking-widest uppercase">
            Postanite partner
          </div>
          <h1 className="text-5xl md:text-6xl font-headline font-black tracking-tight">Prijavite svoj objekt</h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto italic">
            Vaš prvi korak ka boljoj vidljivosti na vodećem hrvatskom portalu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* STEP 1: PERSONAL INFO */}
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-secondary/5 border-b p-8">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-secondary text-primary rounded-2xl flex items-center justify-center">
                  <User className="size-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">1. Vaše osobne informacije</CardTitle>
                  <CardDescription>Podaci o osobi koja prijavljuje objekt.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label>Ime</Label>
                <Input required placeholder="Vaše ime" className="h-12 rounded-xl" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Prezime</Label>
                <Input required placeholder="Vaše prezime" className="h-12 rounded-xl" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Kontakt Email</Label>
                <Input required type="email" placeholder="vas@email.com" className="h-12 rounded-xl" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Kontakt Telefon</Label>
                <Input required placeholder="+385 9x xxx xxxx" className="h-12 rounded-xl" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} />
              </div>
            </CardContent>
          </Card>

          {/* STEP 2: OBJECT INFO */}
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-secondary/5 border-b p-8">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-secondary text-primary rounded-2xl flex items-center justify-center">
                  <Building2 className="size-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">2. Podaci o objektu</CardTitle>
                  <CardDescription>Informacije koje će biti prikazane na portalu.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label>Naziv objekta</Label>
                  <Input required placeholder="npr. Restoran Riva" className="h-12 rounded-xl" value={formData.objectName} onChange={e => setFormData({...formData, objectName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Kategorija</Label>
                  <Select onValueChange={v => setFormData({...formData, categoryId: v})} required>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Odaberi vrstu objekta" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-2 text-xs font-black text-muted-foreground uppercase opacity-50">Javne / Besplatne</div>
                      {CATEGORIES.filter(c => c.type === 'free').map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                      <div className="px-2 py-2 text-xs font-black text-muted-foreground uppercase opacity-50 border-t mt-2">Komercijalne / Plaćene</div>
                      {CATEGORIES.filter(c => c.type === 'paid').map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name} ({cat.price})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label>Grad</Label>
                  <Input required placeholder="npr. Split" className="h-12 rounded-xl" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Adresa</Label>
                  <Input required placeholder="Ulica i kućni broj" className="h-12 rounded-xl" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Kratki opis</Label>
                <Textarea placeholder="Što vaš objekt nudi posjetiteljima?" className="min-h-[120px] rounded-xl text-lg" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
            </CardContent>
          </Card>

          {/* PAYMENT NOTICE IF PAID */}
          {isPaid && (
            <div className="p-8 bg-primary/5 border-2 border-primary/20 rounded-[2.5rem] flex gap-6 animate-pulse">
              <div className="size-14 bg-primary text-white rounded-2xl flex items-center justify-center shrink-0">
                <LayoutGrid className="size-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black text-primary uppercase">Izdvojena Prijava (PAID)</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Odabrali ste kategoriju <strong>{selectedCategory?.name}</strong>. Cijena objave je <strong>{selectedCategory?.price}</strong>. 
                  Nakon što Superadmin pregleda vašu prijavu, dobit ćete podatke za uplatu na email. 
                  Vaš objekt će postati vidljiv čim uplata bude evidentirana.
                </p>
              </div>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full h-20 text-2xl font-black rounded-[2rem] bg-foreground hover:bg-primary shadow-2xl transition-all uppercase tracking-widest">
            {isSubmitting ? "Slanje prijave..." : "Pošalji Superadminu na provjeru"}
          </Button>
        </form>
      </main>
    </div>
  );
}
