
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
  ShieldCheck,
  Eye,
  EyeOff,
  Mail
} from 'lucide-react';
import { useUser, usePB } from '@/pocketbase';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

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
    password: '',
    passwordConfirm: '',
    objectName: '',
    categoryId: '',
    address: '',
    city: '',
    description: '',
    photoUrls: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const selectedCategory = CATEGORIES.find(c => c.id === formData.categoryId);
  const isPaid = selectedCategory?.type === 'paid';
  const isGuest = !user;

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, photoUrls: [...prev.photoUrls, url] }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.contactEmail) {
        toast({ title: "Nedostaju podaci", description: "Ispunite osnovna polja za kontakt.", variant: "destructive" });
        return;
      }
      // Validate guest registration fields
      if (isGuest) {
        if (!formData.password || !formData.passwordConfirm) {
          toast({ title: "Lozinka je obavezna", description: "Unesite i potvrdite lozinku za registraciju.", variant: "destructive" });
          return;
        }
        if (formData.password.length < 8) {
          toast({ title: "Prekratka lozinka", description: "Lozinka mora imati najmanje 8 znakova.", variant: "destructive" });
          return;
        }
        if (formData.password !== formData.passwordConfirm) {
          toast({ title: "Lozinke se ne podudaraju", description: "Unesite istu lozinku u oba polja.", variant: "destructive" });
          return;
        }
      }
      setAuthError('');
    }
    if (step === 2 && (!formData.objectName || !formData.categoryId || !formData.city)) {
      toast({ title: "Nedostaju podaci", description: "Naziv, kategorija i grad su obavezni.", variant: "destructive" });
      return;
    }
    setStep(step + 1);
  };

  // Register the guest user (or use existing user) and return the userId
  const ensureUser = async (): Promise<string | null> => {
    if (!pb) return null;

    // Already logged in
    if (user) return user.id;

    // Register new user
    try {
      setAuthError('');
      const newUser = await pb.collection('users').create({
        email: formData.contactEmail,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        name: `${formData.firstName} ${formData.lastName}`,
      });
      
      // Log them in
      await pb.collection('users').authWithPassword(formData.contactEmail, formData.password);
      
      return newUser.id;
    } catch (error: any) {
      console.error('Registration error:', error);
      const message = error?.response?.data?.email?.message || error?.message || 'Registracija nije uspjela.';
      
      if (message.includes('already') || message.includes('unique')) {
        setAuthError('Ovaj email je već registriran. Prijavite se na stranici za prijavu.');
        toast({ 
          title: "Email već postoji", 
          description: "Korisnik s ovim emailom već postoji. Prijavite se.", 
          variant: "destructive" 
        });
      } else {
        setAuthError(message);
        toast({ title: "Greška pri registraciji", description: message, variant: "destructive" });
      }
      return null;
    }
  };

  const saveListing = async (paymentStatus: string) => {
    setIsSubmitting(true);
    
    const userId = await ensureUser();
    if (!userId || !pb) {
      setIsSubmitting(false);
      return;
    }

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
      ownerId: userId,
      locationCategoryType: isPaid ? 'Paid' : 'Free',
      paymentStatus: paymentStatus,
    };

    try {
      const listing = await pb.collection('listings').create(listingData);
      
      if (isPaid && paymentStatus !== 'paid') {
        // Redirect to Stripe Checkout
        try {
          const response = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              categoryId: formData.categoryId,
              categoryName: selectedCategory?.name,
              priceAmount: selectedCategory?.price,
              listingId: listing.id,
              userEmail: formData.contactEmail,
            }),
          });
          
          const data = await response.json();
          
          if (data.url) {
            // Redirect to Stripe hosted checkout page
            window.location.href = data.url;
            return;
          } else {
            throw new Error(data.error || 'Stripe sesija nije kreirana.');
          }
        } catch (stripeError: any) {
          console.error('Stripe redirect error:', stripeError);
          toast({ 
            title: "Greška pri plaćanju", 
            description: stripeError.message || "Nije moguće pokrenuti Stripe plaćanje. Pokušajte ponovno.", 
            variant: "destructive" 
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Free listing — show success
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({ title: "Prijava poslana!", description: "Naš tim će pregledati vaš objekt u najkraćem roku." });
    } catch (error: any) {
      setIsSubmitting(false);
      console.error('Listing creation error:', error);
      toast({ title: "Greška", description: "Slanje nije uspjelo. Pokušajte ponovno.", variant: "destructive" });
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
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                      <Input placeholder="ivan.horvat@email.com" type="email" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="pl-12 h-14 rounded-2xl border-none bg-secondary/10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase tracking-widest">Telefon</Label>
                    <Input placeholder="+385 9x xxx xxxx" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} className="h-14 rounded-2xl border-none bg-secondary/10" />
                  </div>
                </div>

                {/* Inline Registration Fields (only shown when not logged in) */}
                {isGuest && (
                  <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-black text-sm">Kreirajte račun</p>
                        <p className="text-xs text-muted-foreground">Vaši podaci su zaštićeni. Račun vam omogućuje upravljanje objektima.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-bold text-xs uppercase tracking-widest">Lozinka</Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                          <Input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Minimalno 8 znakova" 
                            value={formData.password} 
                            onChange={e => setFormData({...formData, password: e.target.value})} 
                            className="pl-12 pr-12 h-14 rounded-2xl border-none bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-xs uppercase tracking-widest">Potvrda lozinke</Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                          <Input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Ponovite lozinku" 
                            value={formData.passwordConfirm} 
                            onChange={e => setFormData({...formData, passwordConfirm: e.target.value})} 
                            className="pl-12 h-14 rounded-2xl border-none bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {authError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-start gap-3">
                        <span className="font-bold shrink-0">⚠️</span>
                        <div>
                          <p>{authError}</p>
                          {authError.includes('Prijavite se') && (
                            <a href="/login" className="text-primary underline font-bold mt-1 block">Idi na stranicu za prijavu →</a>
                          )}
                        </div>
                      </div>
                    )}

                    <p className="text-[10px] text-muted-foreground/60 text-center uppercase tracking-widest font-black">
                      Već imate račun? <a href="/login" className="text-primary hover:underline">Prijavite se ovdje</a>
                    </p>
                  </div>
                )}

                {/* Show badge if already logged in */}
                {!isGuest && (
                  <div className="bg-green-50 p-6 rounded-[2rem] border border-green-200 flex items-center gap-4">
                    <CheckCircle2 className="size-8 text-green-600 shrink-0" />
                    <div>
                      <p className="font-black text-sm text-green-800">Prijavljeni ste kao {user?.email}</p>
                      <p className="text-xs text-green-600">Vaš objekt će biti povezan s vašim računom.</p>
                    </div>
                  </div>
                )}

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
                            {c.name} {c.type === 'paid' && `⭐ ${c.price}`}
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
                  <Label className="font-bold text-xs uppercase tracking-widest">Adresa</Label>
                  <Input placeholder="npr. Riva 10" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="h-14 rounded-2xl border-none bg-secondary/10" />
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

                {/* Category info banner for paid */}
                {isPaid && selectedCategory && (
                  <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-[2rem] border border-primary/10 flex items-center gap-6">
                    <CreditCard className="size-10 text-primary shrink-0" />
                    <div className="flex-1">
                      <p className="font-black text-sm">Kategorija "{selectedCategory.name}" zahtijeva godišnju članarinu</p>
                      <p className="text-xs text-muted-foreground">U sljedećem koraku bit ćete preusmjereni na sigurno Stripe plaćanje.</p>
                    </div>
                    <Badge className="bg-primary text-white font-black text-xl px-4 py-2 rounded-xl shrink-0">{selectedCategory.price}</Badge>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button variant="ghost" onClick={() => setStep(1)} className="h-16 px-8 rounded-2xl font-bold flex items-center gap-2">
                    <ArrowLeft className="size-4" /> NATRAG
                  </Button>
                  <Button 
                    onClick={isPaid ? handleNextStep : () => saveListing('not_applicable')} 
                    disabled={isSubmitting}
                    className="flex-1 h-16 rounded-[1.5rem] font-black bg-primary shadow-xl shadow-primary/20 text-lg uppercase tracking-widest"
                  >
                    {isSubmitting ? <Loader2 className="size-6 animate-spin" /> : (isPaid ? 'NASTAVI NA PLAĆANJE' : 'POŠALJI BESPLATNU PRIJAVU')}
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

                  <div className="bg-blue-50 border border-blue-200 rounded-[2rem] p-8 text-center space-y-4">
                    <div className="flex justify-center gap-4 items-center opacity-70">
                      <svg viewBox="0 0 60 25" className="h-8" fill="none"><text x="0" y="20" fontFamily="sans-serif" fontWeight="900" fontSize="20" fill="#635BFF">stripe</text></svg>
                    </div>
                    <p className="text-sm text-blue-700 font-bold">
                      Klikom na gumb ispod bit ćete preusmjereni na sigurnu Stripe stranicu za plaćanje.
                    </p>
                    <p className="text-xs text-blue-500">
                      Vaši podaci o kartici nikada ne prolaze kroz naš server — sve obrađuje Stripe.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="h-16 px-8 rounded-2xl font-bold">NATRAG</Button>
                  <Button 
                    onClick={() => saveListing('pending_payment')} 
                    disabled={isSubmitting} 
                    className="flex-1 h-16 rounded-[1.5rem] font-black bg-primary shadow-2xl shadow-primary/30 text-xl uppercase tracking-widest group"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-3">
                        <Loader2 className="size-6 animate-spin" /> PREUSMJERAVAM NA STRIPE...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        PLATI {selectedCategory?.price} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                      </span>
                    )}
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
