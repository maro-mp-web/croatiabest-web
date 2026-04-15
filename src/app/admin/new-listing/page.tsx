
"use client"

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CATEGORIES, CITIES } from '@/app/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { 
  Save, 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  Image as ImageIcon, 
  Video, 
  Share2, 
  Utensils, 
  Bed, 
  ShieldCheck,
  Loader2,
  Sparkles,
  Compass
} from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { aiContentAssistant } from '@/ai/flows/ai-content-assistant';

export default function AdminNewListingPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Zaštita: Samo superadmin
  const isAdmin = user?.email?.includes('admin') || user?.email === 'vlasnik@croatiabest.hr';

  const [formData, setFormData] = useState({
    name: '',
    locationCategoryId: '',
    address: '',
    city: '',
    latitude: '',
    longitude: '',
    description: '',
    contactPhone: '',
    contactEmail: '',
    webAddress: '',
    facebookLink: '',
    instagramLink: '',
    youtubeLink: '',
    tiktokLink: '',
    videoEmbedUrls: [''],
    photoUrls: ['', '', ''],
    menuDescription: '',
    roomCount: '',
    bedCount: '',
    status: 'active',
    isWebAddressIndexed: false
  });

  const generateWithAi = async () => {
    if (!formData.name || !formData.locationCategoryId) {
      toast({ 
        title: "Nedostaju podaci", 
        description: "Unesite naziv i kategoriju kako bi AI znao o čemu pisati.", 
        variant: "destructive" 
      });
      return;
    }

    setIsAiGenerating(true);
    try {
      const category = CATEGORIES.find(c => c.id === formData.locationCategoryId);
      const result = await aiContentAssistant({
        contentType: 'listing',
        category: category?.name,
        promptInstruction: `Napiši luksuzan i privlačan opis za objekt pod nazivom "${formData.name}". Objekt se nalazi u gradu ${formData.city}. Naglasi vrhunsku uslugu i autentičnost.`
      });
      setFormData({ ...formData, description: result.generatedContent });
      toast({ title: "Opis generiran!", description: "AI je uspješno kreirao sadržaj." });
    } catch (error) {
      toast({ title: "Greška", description: "AI asistent nije uspio generirati tekst.", variant: "destructive" });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!firestore) return;
    if (!formData.name || !formData.locationCategoryId || !formData.city) {
      toast({ title: "Nedostaju podaci", description: "Naziv, kategorija i grad su obavezni.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    
    const selectedCategory = CATEGORIES.find(c => c.id === formData.locationCategoryId);
    
    const listingData = {
      ...formData,
      latitude: parseFloat(formData.latitude) || 45.8150, // Default Zagreb ako je prazno
      longitude: parseFloat(formData.longitude) || 15.9819,
      roomCount: parseInt(formData.roomCount) || 0,
      bedCount: parseInt(formData.bedCount) || 0,
      isWebAddressIndexed: selectedCategory?.type === 'paid',
      paymentStatus: selectedCategory?.type === 'paid' ? 'paid' : 'not_applicable',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId: user?.uid || 'admin'
    };

    const listingsRef = collection(firestore, 'listings');
    
    addDoc(listingsRef, listingData)
      .then(() => {
        toast({ title: "Spremljeno!", description: "Novi objekt je uspješno dodan u bazu." });
        router.push('/admin');
      })
      .catch(async (error) => {
        setIsSaving(false);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: listingsRef.path,
          operation: 'create',
          requestResourceData: listingData,
        }));
      });
  };

  if (userLoading) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <ShieldCheck className="size-24 text-destructive mb-6" />
        <h1 className="text-4xl font-black mb-4 uppercase">Pristup Odbijen</h1>
        <Button onClick={() => router.push('/')}>Povratak</Button>
      </div>
    );
  }

  const isAccommodation = ['hotels', 'apartments'].includes(formData.locationCategoryId);
  const isRestaurant = ['restaurants', 'cafes'].includes(formData.locationCategoryId);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="size-6" />
            </Button>
            <div>
              <h1 className="text-4xl font-headline font-bold">Administracija Objekta</h1>
              <p className="text-muted-foreground">Upravljanje punim setom podataka u bazi.</p>
            </div>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 rounded-2xl h-14 px-10 font-black shadow-lg shadow-primary/20 uppercase tracking-widest"
          >
            {isSaving ? <Loader2 className="size-5 animate-spin mr-2" /> : <Save className="size-5 mr-2" />}
            Spremi u Bazu
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Osnovno */}
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-secondary/5 p-8 border-b">
                <div className="flex items-center gap-3">
                  <Building2 className="text-primary size-6" />
                  <CardTitle className="text-2xl">Identitet i Kategorija</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label>Službeni naziv objekta</Label>
                  <Input 
                    placeholder="npr. Hotel Palace Dubrovnik" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Kategorija</Label>
                    <Select onValueChange={v => setFormData({...formData, locationCategoryId: v})} value={formData.locationCategoryId}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Odaberite" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status Objave</Label>
                    <Select onValueChange={v => setFormData({...formData, status: v})} value={formData.status}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Aktivno (Javno)</SelectItem>
                        <SelectItem value="draft">Skica (Draft)</SelectItem>
                        <SelectItem value="archived">Arhivirano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <Label>Opis (Rich Text)</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={generateWithAi}
                      disabled={isAiGenerating}
                      className="text-xs font-bold border-primary/20 text-primary hover:bg-primary/5"
                    >
                      {isAiGenerating ? <Loader2 className="size-3 animate-spin mr-2" /> : <Sparkles className="size-3 mr-2" />}
                      GENERIRAJ S AI
                    </Button>
                  </div>
                  <Textarea 
                    placeholder="Unesite detaljan opis..." 
                    className="min-h-[250px] rounded-2xl leading-relaxed"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Geo Lokacija */}
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-secondary/5 p-8 border-b">
                <div className="flex items-center gap-3">
                  <Compass className="text-primary size-6" />
                  <CardTitle className="text-2xl">Geografski podaci</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Grad</Label>
                    <Select onValueChange={v => setFormData({...formData, city: v})} value={formData.city}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Odaberite" />
                      </SelectTrigger>
                      <SelectContent>
                        {CITIES.map(city => (
                          <SelectItem key={city.slug} value={city.name}>{city.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Adresa</Label>
                    <Input 
                      placeholder="Ulica i kućni broj" 
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">Latitude (Širina) <span className="text-[10px] text-muted-foreground">(npr. 45.8150)</span></Label>
                    <Input 
                      type="number"
                      step="0.000001"
                      placeholder="45.8150" 
                      value={formData.latitude}
                      onChange={e => setFormData({...formData, latitude: e.target.value})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">Longitude (Dužina) <span className="text-[10px] text-muted-foreground">(npr. 15.9819)</span></Label>
                    <Input 
                      type="number"
                      step="0.000001"
                      placeholder="15.9819" 
                      value={formData.longitude}
                      onChange={e => setFormData({...formData, longitude: e.target.value})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Kontakt */}
            <Card className="border-none shadow-xl rounded-[2.5rem]">
              <CardHeader className="bg-secondary/5 p-6 border-b">
                <div className="flex items-center gap-3">
                  <Phone className="text-primary size-5" />
                  <CardTitle className="text-xl">Kontakt</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1">
                  <Label className="text-xs">Telefon</Label>
                  <Input value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} className="rounded-lg h-10" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Email</Label>
                  <Input value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="rounded-lg h-10" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Web stranica</Label>
                  <Input value={formData.webAddress} onChange={e => setFormData({...formData, webAddress: e.target.value})} className="rounded-lg h-10" />
                </div>
              </CardContent>
            </Card>

            {/* Društvene mreže */}
            <Card className="border-none shadow-xl rounded-[2.5rem]">
              <CardHeader className="bg-secondary/5 p-6 border-b">
                <div className="flex items-center gap-3">
                  <Share2 className="text-primary size-5" />
                  <CardTitle className="text-xl">Social Media</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Input placeholder="Facebook URL" value={formData.facebookLink} onChange={e => setFormData({...formData, facebookLink: e.target.value})} className="rounded-lg" />
                <Input placeholder="Instagram URL" value={formData.instagramLink} onChange={e => setFormData({...formData, instagramLink: e.target.value})} className="rounded-lg" />
                <Input placeholder="TikTok URL" value={formData.tiktokLink} onChange={e => setFormData({...formData, tiktokLink: e.target.value})} className="rounded-lg" />
              </CardContent>
            </Card>

            {/* Specifični podaci - Dinamički */}
            {(isAccommodation || isRestaurant) && (
              <Card className="border-none shadow-2xl rounded-[2.5rem] bg-primary/5 border border-primary/10">
                <CardHeader className="p-6 border-b border-primary/10">
                  <CardTitle className="text-xl text-primary flex items-center gap-2">
                    {isAccommodation ? <Bed className="size-5" /> : <Utensils className="size-5" />}
                    Kategorijski podaci
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {isRestaurant && (
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-black">Opis Menija / Specijaliteti</Label>
                      <Textarea 
                        placeholder="npr. Specijaliteti od tartufa, dnevni ulov ribe..." 
                        value={formData.menuDescription} 
                        onChange={e => setFormData({...formData, menuDescription: e.target.value})} 
                        className="rounded-xl text-sm min-h-[100px]" 
                      />
                    </div>
                  )}
                  {isAccommodation && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-black">Broj Soba</Label>
                        <Input 
                          type="number" 
                          placeholder="0"
                          value={formData.roomCount} 
                          onChange={e => setFormData({...formData, roomCount: e.target.value})} 
                          className="rounded-xl h-12" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-black">Broj Kreveta</Label>
                        <Input 
                          type="number" 
                          placeholder="0"
                          value={formData.bedCount} 
                          onChange={e => setFormData({...formData, bedCount: e.target.value})} 
                          className="rounded-xl h-12" 
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Slike */}
            <Card className="border-none shadow-xl rounded-[2.5rem]">
              <CardHeader className="bg-secondary/5 p-6 border-b">
                <div className="flex items-center gap-3">
                  <ImageIcon className="text-primary size-5" />
                  <CardTitle className="text-xl">Galerija (URL-ovi)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {formData.photoUrls.map((url, i) => (
                  <Input 
                    key={i}
                    placeholder={`URL slike ${i+1}`} 
                    value={url} 
                    onChange={e => {
                      const newUrls = [...formData.photoUrls];
                      newUrls[i] = e.target.value;
                      setFormData({...formData, photoUrls: newUrls});
                    }} 
                    className="rounded-lg h-10 text-xs" 
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
