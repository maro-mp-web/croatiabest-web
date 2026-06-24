
"use client"

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CATEGORIES } from '@/app/lib/constants';
import { CATEGORY_FIELDS } from '@/app/lib/category-fields';
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
import { useUser, usePB, useCollection } from '@/pocketbase';
import { useRouter, useParams } from 'next/navigation';
import { aiContentAssistant } from '@/ai/flows/ai-content-assistant';
import LocationPicker from '@/components/map/LocationPicker';

export default function AdminEditListingPage() {
  const { user, isUserLoading } = useUser();
  const pb = usePB();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [isSaving, setIsSaving] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingCoords, setIsFetchingCoords] = useState(false);

  const { data: citiesData } = useCollection('cities', { requestKey: null });
  const { data: islandsData } = useCollection('islands', { requestKey: null });

  const cities = citiesData || [];
  const islands = islandsData || [];


  // Stroga provjera administratora
  const isAdmin = user?.email === 'maro.webdeveloper@gmail.com';

  const [formData, setFormData] = useState({
    name: '',
    locationCategoryId: '',
    address: '',
    city: '', 
    region: '',
    latitude: '',
    longitude: '',
    description: '',
    contactPhone: '',
    contactEmail: '',
    webAddress: '',
    photoUrls: [] as string[],
    products: [] as {name: string, price: string}[],
    faq: [] as {question: string, answer: string}[],
    status: 'active',
    metadata: {} as Record<string, any>
  });

  useEffect(() => {
    if (!id || !pb) return;
    pb.collection('listings').getOne(id).then(record => {
      setFormData({
        name: record.name || '',
        locationCategoryId: record.locationCategoryId || '',
        address: record.address || '',
        city: record.city || '',
        region: record.region || '',
        latitude: record.latitude?.toString() || '',
        longitude: record.longitude?.toString() || '',
        description: record.description || '',
        contactPhone: record.contactPhone || '',
        contactEmail: record.contactEmail || '',
        webAddress: record.webAddress || '',
        photoUrls: record.photoUrls || [],
        products: record.products || [],
        faq: record.faq || [],
        status: record.status || 'pending',
        metadata: record.metadata || {}
      });
      setIsLoading(false);
    }).catch(err => {
      if (err.isAbort) return;
      toast({ title: 'Greška', description: `Ne mogu učitati oglas: ${err.message}`, variant: 'destructive' });
      console.error("GET ONE ERROR:", err);
      setIsLoading(false);
    });
  }, [id, pb]);

  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    setFormData(prev => ({ ...prev, products: [...prev.products, newProduct] }));
    setNewProduct({ name: '', price: '' });
  };

  const addFaq = () => {
    if (!newFaq.question || !newFaq.answer) return;
    setFormData(prev => ({ ...prev, faq: [...prev.faq, newFaq] }));
    setNewFaq({ question: '', answer: '' });
  };

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({
      ...prev,
      photoUrls: [...prev.photoUrls, url]
    }));
  };

  const fetchCoordinates = async () => {
    if (!formData.address || !formData.city) {
      toast({ title: "Nedostaju podaci", description: "Unesite adresu i grad za dohvat koordinata.", variant: "destructive" });
      return;
    }
    setIsFetchingCoords(true);
    try {
      const query = encodeURIComponent(`${formData.address}, ${formData.city}, Croatia`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        setFormData(prev => ({
          ...prev,
          latitude: data[0].lat,
          longitude: data[0].lon
        }));
        toast({ title: "Uspjeh", description: "Koordinate uspješno pronađene!" });
      } else {
        toast({ title: "Nije pronađeno", description: "Ne mogu točno locirati tu adresu. Probajte upisati detaljnije ili ručno unesite Lat/Lng.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Greška", description: "Greška kod spajanja na server za mape.", variant: "destructive" });
    } finally {
      setIsFetchingCoords(false);
    }
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
    if (!user || !pb) return;
    if (!formData.name || !formData.locationCategoryId || !formData.city) {
      toast({ title: "Obavezna polja", description: "Naziv, kategorija i lokacija su obavezni.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    const selectedCategory = CATEGORIES.find(c => c.id === formData.locationCategoryId);
    
    const knownLoc = [...cities, ...islands].find(l => l.name === formData.city);
    const region = knownLoc?.region || formData.region;

    try {
      await pb.collection('listings').update(id, {
        ...formData,
        region,
        latitude: parseFloat(formData.latitude) || (knownLoc?.lat || 45.8150),
        longitude: parseFloat(formData.longitude) || (knownLoc?.lng || 15.9819),
        locationCategoryType: selectedCategory?.type === 'paid' ? 'Paid' : 'Free',
        paymentStatus: selectedCategory?.type === 'paid' ? 'paid' : 'not_applicable',
        ownerId: user.id,
        status: formData.status,
        photoUrls: formData.photoUrls,
        products: formData.products,
        faq: formData.faq,
        metadata: formData.metadata
      });
      toast({ title: "Uspjeh", description: "Objekt uspješno ažuriran." });
      router.refresh();
      router.push('/admin');
    } catch (error) {
      setIsSaving(false);
      toast({ title: "Greška", description: "Spremanje nije uspjelo.", variant: "destructive" });
    }
  };

  if (isUserLoading || isLoading) return <div className="p-20 text-center"><Loader2 className="animate-spin size-8 mx-auto text-primary" /></div>;
  if (!isAdmin) return <div className="p-20 text-center font-black">PRISTUP ODBIJEN</div>;

  const allLocations = [...cities, ...islands].sort((a,b) => a.name.localeCompare(b.name));
  const isFreeCategory = CATEGORIES.find(c => c.id === formData.locationCategoryId)?.type === 'free';

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full"><ArrowLeft /></Button>
            <h1 className="text-4xl font-black">Uredi Unos</h1>
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

            {CATEGORY_FIELDS[formData.locationCategoryId] && (
              <Card className="rounded-[2.5rem] shadow-xl overflow-hidden border-none">
                <CardHeader className="bg-secondary/5 border-b"><CardTitle>Specifičnosti kategorije</CardTitle></CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {CATEGORY_FIELDS[formData.locationCategoryId].map(field => (
                      <div key={field.id} className="space-y-2">
                        <Label>{field.label}</Label>
                        {field.type === 'text' || field.type === 'number' ? (
                          <Input 
                            type={field.type}
                            value={formData.metadata[field.id] || ''} 
                            onChange={e => setFormData({...formData, metadata: {...formData.metadata, [field.id]: e.target.value}})} 
                            className="h-12 rounded-xl" 
                          />
                        ) : field.type === 'select' ? (
                          <Select 
                            value={formData.metadata[field.id] || ''}
                            onValueChange={v => setFormData({...formData, metadata: {...formData.metadata, [field.id]: v}})}
                          >
                            <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Odaberi..." /></SelectTrigger>
                            <SelectContent>
                              {field.options?.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        ) : field.type === 'checkbox' ? (
                          <div className="flex items-center space-x-2 h-12 bg-secondary/5 px-4 rounded-xl">
                            <input 
                              type="checkbox" 
                              id={field.id}
                              checked={!!formData.metadata[field.id]}
                              onChange={e => setFormData({...formData, metadata: {...formData.metadata, [field.id]: e.target.checked}})}
                              className="size-5 rounded border-gray-300 accent-primary focus:ring-primary cursor-pointer"
                            />
                            <Label htmlFor={field.id} className="font-bold cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{field.label}</Label>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {!isFreeCategory && (
              <div className="space-y-8">
                <Card className="rounded-[2.5rem] shadow-xl overflow-hidden border-none mt-8">
                  <CardHeader className="bg-secondary/5 border-b"><CardTitle>Ponuda & Proizvodi</CardTitle></CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Naziv proizvoda</Label>
                        <Input placeholder="npr. Pizza Margarita" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Cijena</Label>
                        <div className="flex gap-2">
                          <Input placeholder="npr. 15€" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="rounded-xl" />
                          <Button onClick={addProduct} variant="secondary" className="rounded-xl"><ShoppingBag className="size-4" /></Button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {formData.products.map((p, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg text-sm font-medium">
                          <span>{p.name}</span>
                          <div className="flex items-center gap-4">
                              <span className="text-primary font-black">{p.price}</span>
                              <Button type="button" variant="ghost" size="sm" onClick={() => setFormData(prev => ({...prev, products: prev.products.filter((_, idx) => idx !== i)}))}>Ukloni</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] shadow-xl overflow-hidden border-none mt-8">
                  <CardHeader className="bg-secondary/5 border-b"><CardTitle>Česta Pitanja (FAQ)</CardTitle></CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Pitanje</Label>
                        <Input placeholder="npr. Imate li parking?" value={newFaq.question} onChange={e => setNewFaq({...newFaq, question: e.target.value})} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Odgovor</Label>
                        <div className="flex gap-2">
                          <Input placeholder="npr. Da, parking je besplatan." value={newFaq.answer} onChange={e => setNewFaq({...newFaq, answer: e.target.value})} className="rounded-xl" />
                          <Button type="button" onClick={addFaq} variant="secondary" className="rounded-xl">Dodaj</Button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {formData.faq.map((f, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg text-sm font-medium">
                          <div className="flex flex-col">
                              <span className="font-bold">{f.question}</span>
                              <span className="text-muted-foreground">{f.answer}</span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => setFormData(prev => ({...prev, faq: prev.faq.filter((_, idx) => idx !== i)}))}>Ukloni</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

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
                <div className="flex gap-2">
                  <Input placeholder="Adresa" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="rounded-xl flex-1" />
                  <Button variant="secondary" onClick={fetchCoordinates} disabled={isFetchingCoords} className="rounded-xl px-4 font-black">
                    {isFetchingCoords ? <Loader2 className="animate-spin size-4 mr-2" /> : <MapPin className="size-4 mr-2" />}
                    Dohvati
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Lat (Opcionalno)" type="number" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} className="rounded-xl" />
                  <Input placeholder="Lng (Opcionalno)" type="number" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} className="rounded-xl" />
                </div>
                <div className="pt-2">
                  <LocationPicker 
                    lat={formData.latitude ? parseFloat(formData.latitude) : null}
                    lng={formData.longitude ? parseFloat(formData.longitude) : null}
                    cityCenter={formData.city ? allLocations.find(l => l.name === formData.city) : null}
                    onChange={(lat, lng) => setFormData({...formData, latitude: lat.toString(), longitude: lng.toString()})}
                  />
                  <p className="text-xs text-slate-500 mt-2 font-medium">Kliknite na kartu ili povucite marker za točan odabir lokacije.</p>
                </div>
              </CardContent>
            </Card>

            {!isFreeCategory && (
              <Card className="rounded-[2.5rem] shadow-xl border-none">
                <CardHeader className="bg-secondary/5 border-b"><CardTitle>Kontakt</CardTitle></CardHeader>
                <CardContent className="p-6 space-y-4">
                  <Input placeholder="Telefon" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} className="rounded-xl" />
                  <Input placeholder="Email" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="rounded-xl" />
                  <Input placeholder="Web stranica" value={formData.webAddress} onChange={e => setFormData({...formData, webAddress: e.target.value})} className="rounded-xl" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
