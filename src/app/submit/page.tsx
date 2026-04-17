
"use client"

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CATEGORIES } from '@/app/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import { toast } from '@/hooks/use-toast';
import { CheckCircle2, User, Building2, CreditCard, Lock, Loader2, Image as ImageIcon } from 'lucide-react';
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
    photoUrls: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const selectedCategory = CATEGORIES.find(c => c.id === formData.categoryId);
  const isPaid = selectedCategory?.type === 'paid';

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, photoUrls: [...prev.photoUrls, url] }));
  };

  const handleNextStep = () => {
    if (step === 1 && (!formData.firstName || !formData.lastName || !formData.contactEmail)) {
      toast({ title: "Nedostaju podaci", description: "Ispunite sva polja.", variant: "destructive" });
      return;
    }
    if (step === 2 && (!formData.objectName || !formData.categoryId || !formData.city)) {
      toast({ title: "Nedostaju podaci", description: "Ispunite podatke o objektu.", variant: "destructive" });
      return;
    }
    setStep(step + 1);
  };

  const saveListing = async (paymentStatus: string) => {
    if (!firestore || !user) {
      toast({ title: "Prijava potrebna", description: "Prijavite se za nastavak.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    
    const listingData = {
      name: formData.objectName,
      locationCategoryId: formData.categoryId,
      address: formData.address,
      city: formData.city,
      description: formData.description,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      photoUrls: formData.photoUrls,
      status: 'pending',
      ownerId: user.uid,
      locationCategoryType: isPaid ? 'Paid' : 'Free',
      paymentStatus: paymentStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const listingsRef = collection(firestore, 'listings');
    addDoc(listingsRef, listingData)
      .then(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      })
      .catch(async (error) => {
        setIsSubmitting(false);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: listingsRef.path,
          operation: 'create',
          requestResourceData: listingData,
        }));
      });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar /><main className="container mx-auto px-4 py-24 text-center">
          <CheckCircle2 className="size-24 text-primary mx-auto mb-8 shadow-xl shadow-primary/20 rounded-full" />
          <h1 className="text-5xl font-black mb-4">Uspješno poslano!</h1>
          <p className="text-muted-foreground mb-12">Vaš oglas za <strong>{formData.objectName}</strong> je u obradi.</p>
          <Button onClick={() => window.location.href = '/dashboard'} className="h-14 px-10 rounded-2xl font-black bg-primary">MOJ DASHBOARD</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="text-center mb-12 space-y-4">
          <Badge className="bg-primary/10 text-primary uppercase font-black px-6 py-2 tracking-widest">Partner Program</Badge>
          <h1 className="text-5xl font-black tracking-tighter">Prijavite svoj objekt</h1>
          <div className="flex justify-center gap-2 mt-8">
            {[1, 2, isPaid ? 3 : null].filter(Boolean).map((s, i) => (
              <div key={i} className={`h-2 w-12 rounded-full ${step === s ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <Card className="rounded-[2.5rem] shadow-2xl border-none">
            <CardHeader className="bg-secondary/5 border-b"><CardTitle>1. Kontakt podaci</CardTitle></CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Ime" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="h-12 rounded-xl" />
                <Input placeholder="Prezime" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="h-12 rounded-xl" />
              </div>
              <Input placeholder="Email" type="email" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="h-12 rounded-xl" />
              <Button onClick={handleNextStep} className="w-full h-14 rounded-2xl font-black bg-primary uppercase tracking-widest">Dalje</Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="rounded-[2.5rem] shadow-2xl border-none">
            <CardHeader className="bg-secondary/5 border-b"><CardTitle>2. Detalji i fotografije</CardTitle></CardHeader>
            <CardContent className="p-8 space-y-6">
              <Input placeholder="Naziv objekta" value={formData.objectName} onChange={e => setFormData({...formData, objectName: e.target.value})} className="h-12 rounded-xl" />
              <Select onValueChange={v => setFormData({...formData, categoryId: v})} value={formData.categoryId}>
                <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Kategorija" /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Grad" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="h-12 rounded-xl" />
                <Input placeholder="Adresa" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-4 pt-4 border-t">
                <Label className="font-black uppercase tracking-widest text-xs">Učitajte do 5 fotografija</Label>
                <ImageUpload onUploadComplete={handleImageUploaded} />
                <div className="flex gap-2 flex-wrap">
                  {formData.photoUrls.map((url, i) => (
                    <div key={i} className="size-16 rounded-lg overflow-hidden border">
                      <img src={url} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)} className="h-14 px-8 rounded-2xl font-bold">NATRAG</Button>
                <Button onClick={isPaid ? handleNextStep : () => saveListing('not_applicable')} className="flex-1 h-14 rounded-2xl font-black bg-primary">
                  {isPaid ? 'DALJE NA PLAĆANJE' : 'POŠALJI BESPLATNU PRIJAVU'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && isPaid && (
          <Card className="rounded-[2.5rem] shadow-2xl border-none overflow-hidden">
            <CardHeader className="bg-primary p-8 text-white">
              <CardTitle>Sigurna naplata: {selectedCategory?.price}</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6 text-center">
              <CreditCard className="size-20 mx-auto text-primary opacity-20 mb-4" />
              <p className="text-lg">Vaš oglas će postati <strong>Premium Partner</strong> odmah nakon potvrde uplate.</p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(2)} className="h-14 px-8 rounded-2xl font-bold">ODUSTANI</Button>
                <Button onClick={() => saveListing('paid')} className="flex-1 h-14 rounded-2xl font-black bg-primary uppercase tracking-widest">Plati i Objavi</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
