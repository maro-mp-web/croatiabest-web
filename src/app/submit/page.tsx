
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
import { CheckCircle2, User, Building2, LayoutGrid } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function SubmitListingPage() {
  const { user } = useUser();
  const firestore = useFirestore();
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
    if (!firestore) return;
    if (!formData.categoryId) {
      toast({ title: "Odaberite kategoriju", description: "Morate odabrati kategoriju objekta.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    
    const listingData = {
      ...formData,
      status: 'pending',
      type: isPaid ? 'paid' : 'free',
      submittedBy: user?.uid || 'anonymous',
      createdAt: serverTimestamp(),
      paymentStatus: isPaid ? 'waiting' : 'n/a'
    };

    const listingsRef = collection(firestore, 'listings');
    
    addDoc(listingsRef, listingData)
      .then(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        toast({
          title: "Prijava poslana!",
          description: isPaid 
            ? "Vaša prijava je zaprimljena. Provjerite email za upute o plaćanju." 
            : "Vaša prijava je poslana na pregled administratoru.",
        });
      })
      .catch(async (error) => {
        setIsSubmitting(false);
        const permissionError = new FirestorePermissionError({
          path: listingsRef.path,
          operation: 'create',
          requestResourceData: listingData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
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
            Hvala vam, <strong>{formData.firstName}</strong>. Vaša prijava za <strong>{formData.objectName}</strong> je poslana na provjeru.
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
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-secondary/5 border-b p-8">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-secondary text-primary rounded-2xl flex items-center justify-center">
                  <User className="size-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">1. Osobni podaci</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input required placeholder="Ime" className="h-12 rounded-xl" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              <Input required placeholder="Prezime" className="h-12 rounded-xl" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              <Input required type="email" placeholder="Email" className="h-12 rounded-xl" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} />
              <Input required placeholder="Telefon" className="h-12 rounded-xl" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} />
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-secondary/5 border-b p-8">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-secondary text-primary rounded-2xl flex items-center justify-center">
                  <Building2 className="size-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">2. Podaci o objektu</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input required placeholder="Naziv objekta" className="h-12 rounded-xl" value={formData.objectName} onChange={e => setFormData({...formData, objectName: e.target.value})} />
                <Select onValueChange={v => setFormData({...formData, categoryId: v})} required>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Kategorija" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name} {cat.type === 'paid' ? `(${cat.price})` : '(FREE)'}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input required placeholder="Grad" className="h-12 rounded-xl" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                <Input required placeholder="Adresa" className="h-12 rounded-xl" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <Textarea placeholder="Opis objekta..." className="min-h-[120px] rounded-xl" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </CardContent>
          </Card>

          {isPaid && (
            <div className="p-8 bg-primary/5 border-2 border-primary/20 rounded-[2.5rem] flex gap-6">
              <LayoutGrid className="size-12 text-primary" />
              <div>
                <h4 className="text-xl font-black text-primary uppercase">PLAĆENA OBJAVA</h4>
                <p className="text-muted-foreground">Odabrali ste plaćenu kategoriju. Cijena je {selectedCategory?.price}. Instrukcije za uplatu dobit ćete nakon inicijalne provjere administratora.</p>
              </div>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full h-20 text-2xl font-black rounded-[2rem] bg-foreground hover:bg-primary shadow-2xl uppercase tracking-widest">
            {isSubmitting ? "Slanje..." : "Pošalji na provjeru"}
          </Button>
        </form>
      </main>
    </div>
  );
}
