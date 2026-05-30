
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
import { 
  CheckCircle2, 
  User, 
  Building2, 
  CreditCard, 
  Lock, 
  Loader2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useUser, usePB } from '@/pocketbase';
import { useRouter } from 'next/navigation';

export default function SubmitListingPage() {
  const { user } = useUser();
  const pb = usePB();
  const router = useRouter();
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

  const selectedCategory = CATEGORIES.find(c => c.id === formData.categoryId);
  const isPaid = selectedCategory?.type === 'paid';

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, photoUrls: [...prev.photoUrls, url] }));
  };

  const handleNextStep = () => {
    if (step === 1 && (!formData.firstName || !formData.lastName || !formData.contactEmail)) {
      toast({ title: "Nedostaju podaci", description: "Ispunite osnovna polja za kontakt.", variant: "destructive" });
      return;
    }
    if (step === 2 && (!formData.objectName || !formData.categoryId || !formData.city)) {
      toast({ title: "Nedostaju podaci", description: "Naziv, kategorija i grad su obavezni.", variant: "destructive" });
      return;
    }
    setStep(step + 1);
  };

  const saveListing = async (paymentStatus: string) => {
    if (!user || !pb) {
      toast({ title: "Prijava potrebna", description: "Prijavite se kako biste poslali prijavu.", variant: "destructive" });
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
      ownerId: user.id,
      locationCategoryType: isPaid ? 'Paid' : 'Free',
      paymentStatus: paymentStatus,
    };

    try {
      await pb.collection('listings').create(listingData);
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({ title: "Prijava poslana!", description: "Naš tim će pregledati vaš objekt u najkraćem roku." });
    } catch (error) {
      setIsSubmitting(false);
      toast({ title: "Greška", description: "Slanje nije uspjelo.", variant: "destructive" });
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="size-32 bg-primary/10 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-primary/20">
            <CheckCircle2 className="size-16 text-primary" />
          </div>
          <h1 className="text-6xl font-black mb-4 tracking-tighter">Hvala na povjerenju!</h1>
          <p className="text-xl text-muted-foreground max-w-lg mb-12 font-body italic">
            Vaša prijava za <strong>{formData.objectName}</strong> je uspješno zaprimljena. 
            Trenutno je u procesu moderacije.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => router.push('/dashboard')} className="h-16 px-10 rounded-2xl font-black bg-primary shadow-xl">
              MOJ DASHBOARD
            </Button>
            <Button variant="outline" onClick={() => router.push('/')} className="h-16 px-10 rounded-2xl font-black">
              POČETNA
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-primary/10 text-primary border-none text-xs font-black tracking-widest uppercase px-6 py-2">
            CroatiaBest Partner Program
          </Badge>
          <h1 className="text-6xl font-headline font-black tracking-tight">Postanite dio najbolje priče</h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-body italic">
            Pridružite se elitnom krugu hrvatskih ugostitelja i iznajmljivača na vodećem portalu za luksuzna putovanja.
          </p>
          
          <div className="flex justify-center items-center gap-3 mt-12">
            {[1, 2, isPaid ? 3 : null].filter(Boolean).map((s, i) => (
              <React.Fragment key={i}>
                <div className={`h-3 w-12 rounded-full transition-all duration-500 ${step >= (s as number) ? 'bg-primary' : 'bg-muted'}`} />
                {i < (isPaid ? 2 : 1) && <div className="size-1 bg-muted rounded-full" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {step === 1 && (
            <Card className="rounded-[3rem] shadow-2xl border-none overflow-hidden bg-white/80 backdrop-blur-xl">
              <CardHeader className="p-12 border-b bg-secondary/5 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-3xl">1. Vaši podaci</CardTitle>
                  <CardDescription>Osobni podaci za komunikaciju i ugovore</CardDescription>
                </div>
                <User className="size-10 text-primary opacity-20" />
              </CardHeader>
              <CardContent className="p-12 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase tracking-widest">Ime</Label>
                    <Input placeholder="npr. Ivan" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="h-14 rounded-2xl border-none bg-secondary/10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase tracking-widest">Prezime</Label>
                    <Input placeholder="npr. Horvat" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="h-14 rounded-2xl border-none bg-secondary/10" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase tracking-widest">Email</Label>
                    <Input placeholder="ivan.horvat@email.com" type="email" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="h-14 rounded-2xl border-none bg-secondary/10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase tracking-widest">Telefon</Label>
                    <Input placeholder="+385 9x xxx xxxx" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} className="h-14 rounded-2xl border-none bg-secondary/10" />
                  </div>
                </div>
                <Button onClick={handleNextStep} className="w-full h-16 rounded-[1.5rem] font-black bg-primary shadow-xl shadow-primary/20 text-lg uppercase tracking-widest group">
                  Nastavi na detalje <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="rounded-[3rem] shadow-2xl border-none overflow-hidden bg-white/80 backdrop-blur-xl">
              <CardHeader className="p-12 border-b bg-secondary/5 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-3xl">2. Detalji objekta</CardTitle>
                  <CardDescription>Predstavite se svijetu u najboljem svjetlu</CardDescription>
                </div>
                <Building2 className="size-10 text-primary opacity-20" />
              </CardHeader>
              <CardContent className="p-12 space-y-8">
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase tracking-widest">Naziv objekta</Label>
                  <Input placeholder="npr. Vila Dalmatia Luxury Resort" value={formData.objectName} onChange={e => setFormData({...formData, objectName: e.target.value})} className="h-14 rounded-2xl border-none bg-secondary/10 text-lg font-bold" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase tracking-widest">Kategorija</Label>
                    <Select onValueChange={v => setFormData({...formData, categoryId: v})} value={formData.categoryId}>
                      <SelectTrigger className="h-14 rounded-2xl border-none bg-secondary/10">
                        <SelectValue placeholder="Odaberite vrstu" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(c => (
                          <SelectItem key={c.id} value={c.id} className="flex justify-between items-center">
                            {c.name} {c.type === 'paid' && '⭐'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase tracking-widest">Grad</Label>
                    <Input placeholder="npr. Split" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="h-14 rounded-2xl border-none bg-secondary/10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase tracking-widest">Opis i vizija</Label>
                  <Textarea 
                    placeholder="Recite nam nešto o svom objektu, povijesti, ponudi..." 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    className="min-h-[150px] rounded-2xl border-none bg-secondary/10 text-lg"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <Label className="font-black uppercase tracking-widest text-xs flex items-center gap-2">
                      <Sparkles className="size-4 text-primary" /> Fotografije (do 5)
                    </Label>
                    <Badge variant="outline" className="text-[10px] opacity-40">{formData.photoUrls.length}/5</Badge>
                  </div>
                  <ImageUpload onUploadComplete={handleImageUploaded} />
                  <div className="flex gap-4 flex-wrap">
                    {formData.photoUrls.map((url, i) => (
                      <div key={i} className="size-20 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-md">
                        <img src={url} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="ghost" onClick={() => setStep(1)} className="h-16 px-8 rounded-2xl font-bold flex items-center gap-2">
                    <ArrowLeft className="size-4" /> NATRAG
                  </Button>
                  <Button onClick={isPaid ? handleNextStep : () => saveListing('not_applicable')} className="flex-1 h-16 rounded-[1.5rem] font-black bg-primary shadow-xl shadow-primary/20 text-lg uppercase tracking-widest">
                    {isPaid ? 'NASTAVI NA PLAĆANJE' : 'POŠALJI BESPLATNU PRIJAVU'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && isPaid && (
            <Card className="rounded-[3rem] shadow-2xl border-none overflow-hidden bg-white">
              <CardHeader className="bg-foreground p-12 text-white flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-4xl italic font-headline">Stripe Secure Checkout</CardTitle>
                  <CardDescription className="text-white/60">Iznos za plaćanje: <span className="text-primary font-black text-2xl ml-2">{selectedCategory?.price}</span></CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="size-8 rounded bg-white/10 flex items-center justify-center"><CreditCard className="size-4" /></div>
                  <div className="size-8 rounded bg-white/10 flex items-center justify-center font-black text-[10px]">PAY</div>
                </div>
              </CardHeader>
              <CardContent className="p-12 space-y-10">
                <div className="space-y-6">
                  <div className="p-6 bg-secondary/5 rounded-[2rem] border border-black/5 flex items-start gap-6">
                    <ShieldCheck className="size-12 text-primary mt-1" />
                    <div className="space-y-2">
                      <p className="font-black text-xl">Premium Partner Godišnja Članarina</p>
                      <ul className="text-sm text-muted-foreground space-y-1 italic">
                        <li>• Prioritetni prikaz na interaktivnoj karti</li>
                        <li>• Označeni "Premium" status u pretrazi</li>
                        <li>• Video prezentacija i linkovi na društvene mreže</li>
                        <li>• AI asistent za pisanje opisa</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-bold text-xs uppercase tracking-widest">Broj kartice</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                        <Input placeholder="4242 4242 4242 4242" disabled className="pl-12 h-14 rounded-2xl border bg-secondary/5 font-mono" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-bold text-xs uppercase tracking-widest">MM/YY</Label>
                        <Input placeholder="12/26" disabled className="h-14 rounded-2xl border bg-secondary/5 text-center font-mono" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-xs uppercase tracking-widest">CVC</Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input placeholder="***" disabled className="pl-10 h-14 rounded-2xl border bg-secondary/5 text-center font-mono" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="h-16 px-8 rounded-2xl font-bold">NATRAG</Button>
                  <Button onClick={() => saveListing('paid')} disabled={isSubmitting} className="flex-1 h-16 rounded-[1.5rem] font-black bg-primary shadow-2xl shadow-primary/30 text-xl uppercase tracking-widest">
                    {isSubmitting ? <Loader2 className="size-6 animate-spin" /> : `PLATI ${selectedCategory?.price}`}
                  </Button>
                </div>
                <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-40">
                  Sigurna SSL enkripcija omogućena od strane Stripe-a
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
