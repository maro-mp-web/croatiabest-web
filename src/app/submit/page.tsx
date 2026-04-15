
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
import { CheckCircle2, User, Building2, LayoutGrid, CreditCard, Lock, Loader2, Sparkles } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function SubmitListingPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [step, setStep] = useState(1);
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
  const [paymentLoading, setPaymentLoading] = useState(false);

  const selectedCategory = CATEGORIES.find(c => c.id === formData.categoryId);
  const isPaid = selectedCategory?.type === 'paid';

  const handleNextStep = () => {
    if (step === 1 && (!formData.firstName || !formData.lastName || !formData.contactEmail)) {
      toast({ title: "Nedostaju podaci", description: "Molimo ispunite sva obavezna polja.", variant: "destructive" });
      return;
    }
    if (step === 2 && (!formData.objectName || !formData.categoryId || !formData.city)) {
      toast({ title: "Nedostaju podaci", description: "Molimo ispunite podatke o objektu.", variant: "destructive" });
      return;
    }
    setStep(step + 1);
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    // Simulacija Stripe naplate (2 sekunde procesiranja)
    setTimeout(() => {
      setPaymentLoading(false);
      saveListing('paid');
    }, 2500);
  };

  const saveListing = async (paymentStatus: string) => {
    if (!firestore) return;
    setIsSubmitting(true);
    
    const listingData = {
      ...formData,
      status: 'pending',
      type: isPaid ? 'paid' : 'free',
      ownerId: user?.uid || 'anonymous',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      paymentStatus: paymentStatus,
      locationCategoryType: isPaid ? 'Paid' : 'Free'
    };

    const listingsRef = collection(firestore, 'listings');
    
    addDoc(listingsRef, listingData)
      .then(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        toast({
          title: "Uspjeh!",
          description: "Vaša prijava je zaprimljena i poslana na odobrenje.",
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
          <div className="size-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-8 animate-fade-in shadow-xl shadow-primary/20">
            <CheckCircle2 className="size-14" />
          </div>
          <h1 className="text-5xl font-headline font-black mb-4">Hvala vam na povjerenju!</h1>
          <p className="text-muted-foreground text-xl max-w-lg mb-12">
            Vaša prijava za <strong>{formData.objectName}</strong> je uspješno poslana. Naš tim će je pregledati u najkraćem mogućem roku.
          </p>
          <Button size="lg" className="rounded-2xl px-12 h-14 text-lg font-bold bg-primary" onClick={() => window.location.href = '/'}>Povratak na portal</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="text-center mb-12 space-y-4">
          <Badge className="bg-primary/10 text-primary border-none text-xs font-black tracking-widest uppercase px-6 py-2">
            CroatiaBest Partner Program
          </Badge>
          <h1 className="text-5xl font-headline font-black tracking-tight">Postanite dio najbolje priče</h1>
          <div className="flex justify-center gap-2 mt-8">
            {[1, 2, isPaid ? 3 : null].filter(Boolean).map((s, i) => (
              <div key={i} className={`h-2 w-12 rounded-full transition-colors ${step === s ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {step === 1 && (
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-secondary/5 p-8 border-b">
                <div className="flex items-center gap-4">
                  <User className="size-6 text-primary" />
                  <CardTitle>Vaši kontakt podaci</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ime</Label>
                    <Input placeholder="npr. Ivan" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Prezime</Label>
                    <Input placeholder="npr. Horvat" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="h-12 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email adresa</Label>
                  <Input type="email" placeholder="vaš@email.com" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Telefon</Label>
                  <Input placeholder="+385 9x xxx xxxx" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} className="h-12 rounded-xl" />
                </div>
                <Button onClick={handleNextStep} className="w-full h-14 rounded-2xl font-black text-lg bg-primary">DALJE NA PODATKE O OBJEKTU</Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-secondary/5 p-8 border-b">
                <div className="flex items-center gap-4">
                  <Building2 className="size-6 text-primary" />
                  <CardTitle>Informacije o objektu</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label>Naziv objekta</Label>
                  <Input placeholder="Ime vašeg restorana, hotela..." value={formData.objectName} onChange={e => setFormData({...formData, objectName: e.target.value})} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Kategorija</Label>
                  <Select onValueChange={v => setFormData({...formData, categoryId: v})} value={formData.categoryId}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Odaberite kategoriju" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name} {cat.type === 'paid' ? `(Premium - ${cat.price})` : '(Besplatno)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Grad</Label>
                    <Input placeholder="npr. Split" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Adresa</Label>
                    <Input placeholder="Ulica i kućni broj" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="h-12 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Opis (Opcionalno)</Label>
                  <Textarea placeholder="Kratko opišite što nudite..." className="rounded-xl min-h-[100px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="h-14 rounded-2xl font-bold px-8">NATRAG</Button>
                  <Button onClick={isPaid ? handleNextStep : () => saveListing('n/a')} className="flex-1 h-14 rounded-2xl font-black text-lg bg-primary">
                    {isPaid ? 'DALJE NA PLAĆANJE' : 'POŠALJI BESPLATNU PRIJAVU'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && isPaid && (
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden animate-fade-in">
              <CardHeader className="bg-primary p-8 text-white relative">
                <div className="flex items-center gap-4">
                  <CreditCard className="size-8" />
                  <div>
                    <CardTitle className="text-2xl">Sigurno plaćanje</CardTitle>
                    <CardDescription className="text-white/70">Iznos za uplatu: <span className="text-white font-black text-xl">{selectedCategory?.price} / god</span></CardDescription>
                  </div>
                </div>
                <Sparkles className="absolute top-6 right-6 size-12 opacity-20" />
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="bg-secondary/30 p-6 rounded-2xl border-2 border-dashed border-primary/20 space-y-4">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Lock className="size-3" /> Stripe Secure Checkout
                  </p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Broj kartice</Label>
                      <div className="relative">
                        <Input placeholder="xxxx xxxx xxxx xxxx" className="h-12 rounded-xl pl-12" />
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Istječe (MM/GG)</Label>
                        <Input placeholder="MM/YY" className="h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>CVC</Label>
                        <Input placeholder="123" className="h-12 rounded-xl" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-center text-muted-foreground px-8">
                    Klikom na "Plati i objavi" slažete se s uvjetima poslovanja portala CroatiaBest. 
                    Vaša će prijava postati aktivna odmah nakon administrativne provjere.
                  </p>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep(2)} disabled={paymentLoading} className="h-14 rounded-2xl font-bold px-8">ODUSTANI</Button>
                    <Button onClick={handlePayment} disabled={paymentLoading} className="flex-1 h-14 rounded-2xl font-black text-lg bg-primary relative overflow-hidden">
                      {paymentLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Procesiranje...
                        </>
                      ) : (
                        `PLATI ${selectedCategory?.price} I POŠALJI`
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
