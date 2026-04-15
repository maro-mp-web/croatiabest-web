
"use client"

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CATEGORIES, CITIES } from '@/app/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  Loader2
} from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AdminNewListingPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Zaštita: Samo ti si superadmin
  const isAdmin = user?.email?.includes('admin') || user?.email === 'vlasnik@croatiabest.hr';

  const [formData, setFormData] = useState({
    objectName: '',
    categoryId: '',
    address: '',
    city: '',
    description: '',
    contactPhone: '',
    contactEmail: '',
    webAddress: '',
    facebookLink: '',
    instagramLink: '',
    youtubeLink: '',
    tiktokLink: '',
    videoEmbedUrl: '',
    photoUrls: ['', ''], // Početna polja za slike
    menuDescription: '',
    roomCount: '',
    bedCount: '',
    status: 'approved'
  });

  const handleSave = async () => {
    if (!firestore) return;
    if (!formData.objectName || !formData.categoryId || !formData.city) {
      toast({ title: "Nedostaju podaci", description: "Naziv, kategorija i grad su obavezni.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    
    const selectedCategory = CATEGORIES.find(c => c.id === formData.categoryId);
    
    const listingData = {
      ...formData,
      type: selectedCategory?.type || 'free',
      ownerId: user?.uid || 'admin',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      paymentStatus: selectedCategory?.type === 'paid' ? 'paid' : 'n/a',
      locationCategoryType: selectedCategory?.type === 'paid' ? 'Paid' : 'Free',
      // Čišćenje praznih URL-ova slika
      photoUrls: formData.photoUrls.filter(url => url.trim() !== ''),
      // Pretvaranje brojeva
      roomCount: formData.roomCount ? parseInt(formData.roomCount) : 0,
      bedCount: formData.bedCount ? parseInt(formData.bedCount) : 0,
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

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="size-6" />
            </Button>
            <div>
              <h1 className="text-4xl font-headline font-bold">Novi Objekt (Admin)</h1>
              <p className="text-muted-foreground">Dodajte sadržaj izravno u bazu podataka.</p>
            </div>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 rounded-xl h-12 px-8 font-bold shadow-lg shadow-primary/20"
          >
            {isSaving ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
            SPREMI OBJEKT
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Osnovne informacije */}
            <Card className="border-none shadow-xl rounded-[2rem]">
              <CardHeader className="bg-secondary/5 rounded-t-[2rem] border-b">
                <div className="flex items-center gap-3">
                  <Building2 className="text-primary size-5" />
                  <CardTitle className="text-xl">Osnovne informacije</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label>Naziv objekta</Label>
                  <Input 
                    placeholder="npr. Restoran Biser Jadrana" 
                    value={formData.objectName}
                    onChange={e => setFormData({...formData, objectName: e.target.value})}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Kategorija</Label>
                    <Select onValueChange={v => setFormData({...formData, categoryId: v})} value={formData.categoryId}>
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
                        <SelectItem value="approved">Aktivno (Approved)</SelectItem>
                        <SelectItem value="pending">Na čekanju (Pending)</SelectItem>
                        <SelectItem value="draft">Skica (Draft)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Opis (Cijeli sadržaj)</Label>
                  <Textarea 
                    placeholder="Unesite bogat opis objekta..." 
                    className="min-h-[200px] rounded-xl"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lokacija */}
            <Card className="border-none shadow-xl rounded-[2rem]">
              <CardHeader className="bg-secondary/5 rounded-t-[2rem] border-b">
                <div className="flex items-center gap-3">
                  <MapPin className="text-primary size-5" />
                  <CardTitle className="text-xl">Lokacija</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Grad</Label>
                    <Select onValueChange={v => setFormData({...formData, city: v})} value={formData.city}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Odaberite grad" />
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
                      placeholder="npr. Obala kralja Tomislava 5" 
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vizualni sadržaj */}
            <Card className="border-none shadow-xl rounded-[2rem]">
              <CardHeader className="bg-secondary/5 rounded-t-[2rem] border-b">
                <div className="flex items-center gap-3">
                  <ImageIcon className="text-primary size-5" />
                  <CardTitle className="text-xl">Slike i Video</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <Label>URL-ovi fotografija (jedan po polju)</Label>
                  {formData.photoUrls.map((url, index) => (
                    <Input 
                      key={index}
                      placeholder={`https://putanja-do-slike-${index+1}.jpg`}
                      value={url}
                      onChange={e => {
                        const newUrls = [...formData.photoUrls];
                        newUrls[index] = e.target.value;
                        setFormData({...formData, photoUrls: newUrls});
                      }}
                      className="h-10 rounded-lg"
                    />
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setFormData({...formData, photoUrls: [...formData.photoUrls, '']})}
                    className="w-full border-dashed"
                  >
                    + Dodaj još slika
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Video Embed URL (YouTube/Vimeo)</Label>
                  <div className="relative">
                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                      placeholder="npr. https://www.youtube.com/embed/..." 
                      className="pl-10 h-12 rounded-xl"
                      value={formData.videoEmbedUrl}
                      onChange={e => setFormData({...formData, videoEmbedUrl: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            
            {/* Kontakt */}
            <Card className="border-none shadow-xl rounded-[2rem]">
              <CardHeader className="bg-secondary/5 rounded-t-[2rem] border-b">
                <div className="flex items-center gap-3">
                  <Phone className="text-primary size-5" />
                  <CardTitle className="text-xl">Kontakt</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1">
                  <Label className="text-xs">Telefon</Label>
                  <Input value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} className="rounded-lg" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Email</Label>
                  <Input value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="rounded-lg" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Web stranica</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                    <Input value={formData.webAddress} onChange={e => setFormData({...formData, webAddress: e.target.value})} className="pl-9 rounded-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Društvene mreže */}
            <Card className="border-none shadow-xl rounded-[2rem]">
              <CardHeader className="bg-secondary/5 rounded-t-[2rem] border-b">
                <div className="flex items-center gap-3">
                  <Share2 className="text-primary size-5" />
                  <CardTitle className="text-xl">Social Media</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1">
                  <Label className="text-xs">Facebook</Label>
                  <Input value={formData.facebookLink} onChange={e => setFormData({...formData, facebookLink: e.target.value})} className="rounded-lg" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Instagram</Label>
                  <Input value={formData.instagramLink} onChange={e => setFormData({...formData, instagramLink: e.target.value})} className="rounded-lg" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">YouTube</Label>
                  <Input value={formData.youtubeLink} onChange={e => setFormData({...formData, youtubeLink: e.target.value})} className="rounded-lg" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">TikTok</Label>
                  <Input value={formData.tiktokLink} onChange={e => setFormData({...formData, tiktokLink: e.target.value})} className="rounded-lg" />
                </div>
              </CardContent>
            </Card>

            {/* Specifično za restorane/hotele */}
            <Card className="border-none shadow-xl rounded-[2rem] bg-primary/5 border border-primary/10">
              <CardHeader className="border-b border-primary/10">
                <CardTitle className="text-lg text-primary">Specifični podaci</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1">
                  <Label className="text-xs flex items-center gap-2"><Utensils className="size-3" /> Meni Opis / Link</Label>
                  <Textarea value={formData.menuDescription} onChange={e => setFormData({...formData, menuDescription: e.target.value})} className="rounded-lg text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs flex items-center gap-2"><Bed className="size-3" /> Soba</Label>
                    <Input type="number" value={formData.roomCount} onChange={e => setFormData({...formData, roomCount: e.target.value})} className="rounded-lg" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs flex items-center gap-2"><Bed className="size-3" /> Kreveti</Label>
                    <Input type="number" value={formData.bedCount} onChange={e => setFormData({...formData, bedCount: e.target.value})} className="rounded-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}
