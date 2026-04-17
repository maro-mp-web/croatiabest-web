
"use client"

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CATEGORIES, CITIES, ISLANDS } from '@/app/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ui/image-upload';
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
  Compass,
  ShoppingBag
} from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { aiContentAssistant } from '@/ai/flows/ai-content-assistant';

export default function AdminNewListingPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const isAdmin = user?.email?.includes('admin') || user?.email === 'vlasnik@croatiabest.hr';

  const [formData, setFormData] = useState({
    name: '',
    locationCategoryId: '',
    address: '',
    city: '', // This can be a City or an Island name
    region: '',
    latitude: '',
    longitude: '',
    description: '',
    contactPhone: '',
    contactEmail: '',
    webAddress: '',
    photoUrls: [] as string[],
    products: [] as {name: string, price: string}[],
    status: 'active'
  });

  const [newProduct, setNewProduct] = useState({ name: '', price: '' });

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    setFormData(prev => ({ ...prev, products: [...prev.products, newProduct] }));
    setNewProduct({ name: '', price: '' });
  };

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({
      ...prev,
      photoUrls: [...prev.photoUrls, url]
    }));
  };

  const generateWithAi = async () => {
    if (!formData.name || !formData.locationCategoryId) {
      toast({ title: "Nedostaju podaci", description: "Unesite naziv i kategoriju za AI.", variant: "destructive" });
      return;
    }
    setIsAiGenerating(true);
    try {
      const category = CATEGORIES.find(c => c.id === formData.locationCategoryId);
      const result = await aiContentAssistant({
        contentType: 'listing',
        category: category?.name,
        promptInstruction: `Napiši luksuzan i privlačan opis za objekt "${formData.name}" u gradu/na otoku ${formData.city}.`
      });
      setFormData({ ...formData, description: result.generatedContent });
    } catch (error) {
      toast({ title: "Greška", description: "AI asistent nije uspio.", variant: "destructive" });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!firestore || !user) return;
    if (!formData.name || !formData.locationCategoryId || !formData.city) {
      toast({ title: "Obavezna polja", description: "Naziv, kategorija i lokacija su obavezni.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    const selectedCategory = CATEGORIES.find(c => c.id === formData.locationCategoryId);
    
    // Auto-determine region if it's a known city or island
    const knownLoc = [...CITIES, ...ISLANDS].find(l => l.name === formData.city);
    const region = knownLoc?.region || formData.region;

    const listingData = {
      ...formData,
      region,
      latitude: parseFloat(formData.latitude) || (knownLoc?.lat || 45.8150),
      longitude: parseFloat(formData.longitude) || (knownLoc?.lng || 15.9819),
      locationCategoryType: selectedCategory?.type === 'paid' ? 'Paid' : 'Free',
      paymentStatus: selectedCategory?.type === 'paid' ? 'paid' : 'not_applicable',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId: user.uid
    };

    const listingsRef = collection(firestore, 'listings');
    addDoc(listingsRef, listingData)
      .then(() => {
        toast({ title: "Uspjeh", description: "Objekt spremljen u bazu." });
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

  if (isUserLoading) return <div className="p-20 text-center">Učitavanje...</div>;
  if (!isAdmin) return <div className="p-20 text-center font-black">PRISTUP ODBIJEN</div>;

  const allLocations = [...CITIES, ...ISLANDS].sort((a,b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full"><ArrowLeft /></Button>
            <h1 className="text-4xl font-black">Novi Unos</h1>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="h-14 px-10 rounded-2xl font-black bg-primary shadow-xl">
            {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />} SPREMI
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-[2.5rem] shadow-xl overflow-hidden border-none">
              <CardHeader className="bg-secondary/5 border-b"><CardTitle>Osnovni podaci</CardTitle></CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label>Naziv</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Kategorija</Label>
                    <Select onValueChange={v => setFormData({...formData, locationCategoryId: v})} value={formData.locationCategoryId}>
                      <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select onValueChange={v => setFormData({...formData, status: v})} value={formData.status}>
                      <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between mb-1"><Label>Opis</Label><Button variant="outline" size="sm" onClick={generateWithAi} disabled={isAiGenerating} className="text-[10px] font-black"><Sparkles className="size-3 mr-1" /> AI WRITER</Button></div>
                  <Textarea className="min-h-[200px] rounded-2xl" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] shadow-xl overflow-hidden border-none">
              <CardHeader className="bg-secondary/5 border-b"><CardTitle>Ponuda & Proizvodi</CardTitle></CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Naziv proizvoda" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="rounded-xl" />
                  <div className="flex gap-2">
                    <Input placeholder="Cijena (npr. 15€)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="rounded-xl" />
                    <Button onClick={addProduct} variant="secondary" className="rounded-xl"><ShoppingBag className="size-4" /></Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {formData.products.map((p, i) => (
                    <div key={i} className="flex justify-between p-3 bg-muted/30 rounded-lg text-sm font-medium">
                      <span>{p.name}</span>
                      <span className="text-primary font-black">{p.price}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] shadow-xl overflow-hidden border-none">
              <CardHeader className="bg-secondary/5 border-b"><CardTitle>Učitavanje fotografija</CardTitle></CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ImageUpload onUploadComplete={handleImageUploaded} />
                  <div className="grid grid-cols-2 gap-2">
                    {formData.photoUrls.map((url, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border">
                        <img src={url} className="object-cover w-full h-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="rounded-[2.5rem] shadow-xl border-none">
              <CardHeader className="bg-secondary/5 border-b"><CardTitle>Lokacija</CardTitle></CardHeader>
              <CardContent className="p-6 space-y-4">
                <Select onValueChange={v => setFormData({...formData, city: v})} value={formData.city}>
                  <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Grad ili Otok" /></SelectTrigger>
                  <SelectContent>{allLocations.map(l => <SelectItem key={l.slug} value={l.name}>{l.name}</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="Adresa" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="rounded-xl" />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Lat (Opcionalno)" type="number" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} className="rounded-xl" />
                  <Input placeholder="Lng (Opcionalno)" type="number" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} className="rounded-xl" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] shadow-xl border-none">
              <CardHeader className="bg-secondary/5 border-b"><CardTitle>Kontakt</CardTitle></CardHeader>
              <CardContent className="p-6 space-y-4">
                <Input placeholder="Telefon" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} className="rounded-xl" />
                <Input placeholder="Email (Neće biti javan)" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="rounded-xl" />
                <Input placeholder="Web stranica" value={formData.webAddress} onChange={e => setFormData({...formData, webAddress: e.target.value})} className="rounded-xl" />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
