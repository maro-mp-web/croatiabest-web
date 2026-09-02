"use client"

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CATEGORIES } from '@/app/lib/constants';
import { CATEGORY_FIELDS } from '@/app/lib/category-fields';
import { generateSlug, CATEGORY_SLUG_MAP } from '@/app/lib/utils/slug';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ui/image-upload';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { 
  Save, 
  ArrowLeft, 
  MapPin, 
  ShoppingBag,
  X,
  ExternalLink,
  Search,
  Languages,
  Loader2
} from 'lucide-react';
import { useUser, usePB, useCollection } from '@/pocketbase';
import { useRouter, useParams } from 'next/navigation';
import LocationPicker from '@/components/map/LocationPicker';

export default function AdminEditListingPage() {
  const { user, isUserLoading } = useUser();
  const pb = usePB();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingCoords, setIsFetchingCoords] = useState(false);
  const [langTab, setLangTab] = useState<'hr' | 'en'>('hr');
  const [errorDebugInfo, setErrorDebugInfo] = useState<string | null>(null);

  const [cities, setCities] = useState<any[]>([]);
  const [islands, setIslands] = useState<any[]>([]);

  useEffect(() => {
    if (!pb) return;
    pb.collection('cities').getFullList({ sort: 'name' })
      .then(data => setCities(data))
      .catch(e => console.error('Cities fetch error:', e));
    pb.collection('islands').getFullList({ sort: 'name' })
      .then(data => setIslands(data))
      .catch(e => console.error('Islands fetch error:', e));
  }, [pb]);

  // Stroga provjera administratora
  const isAdmin = user?.email === 'maro.webdeveloper@gmail.com';

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    locationCategoryId: '',
    address: '',
    city: '', 
    region: '',
    latitude: '',
    longitude: '',
    description: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    
    // English fields
    nameEn: '',
    descriptionEn: '',
    seoTitleEn: '',
    seoDescriptionEn: '',
    seoKeywordsEn: '',

    contactPhone: '',
    contactEmail: '',
    webAddress: '',
    photoUrls: [] as string[],
    products: [] as {name: string, price: string}[],
    faq: [] as {question: string, answer: string}[],
    status: 'active',
    ownerId: '',
    metadata: {} as Record<string, any>
  });

  const parseJsonArray = (val: any) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string' && val.trim().startsWith('[')) {
      try { return JSON.parse(val); } catch (e) {}
    }
    return val ? [val] : [];
  };

  useEffect(() => {
    if (!id || !pb) return;
    pb.collection('listings').getOne(id).then(record => {
      const meta = record.metadata || {};
      setFormData({
        name: record.name || '',
        slug: meta.slug || record.slug || generateSlug(record.name || ''),
        locationCategoryId: record.locationCategoryId || '',
        address: record.address || '',
        city: record.city || '',
        region: record.region || '',
        latitude: record.latitude?.toString() || '',
        longitude: record.longitude?.toString() || '',
        description: record.description || '',
        seoTitle: meta.seoTitle || record.seoTitle || '',
        seoDescription: meta.seoDescription || record.seoDescription || '',
        seoKeywords: meta.seoKeywords || record.seoKeywords || '',
        
        nameEn: meta.nameEn || '',
        descriptionEn: meta.descriptionEn || '',
        seoTitleEn: meta.seoTitleEn || '',
        seoDescriptionEn: meta.seoDescriptionEn || '',
        seoKeywordsEn: meta.seoKeywordsEn || '',

        contactPhone: record.contactPhone || '',
        contactEmail: record.contactEmail || '',
        webAddress: record.webAddress || '',
        photoUrls: parseJsonArray(record.photoUrls),
        products: parseJsonArray(record.products),
        faq: parseJsonArray(meta.faq || []),
        status: record.status || 'pending',
        ownerId: record.ownerId || '',
        metadata: meta
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => {
      const prevAutoSlug = generateSlug(prev.name);
      const shouldUpdateSlug = !prev.slug || prev.slug === prevAutoSlug;
      return {
        ...prev,
        name: val,
        slug: shouldUpdateSlug ? generateSlug(val) : prev.slug
      };
    });
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
    const finalSlug = formData.slug ? generateSlug(formData.slug) : generateSlug(formData.name);

    // Merge SEO & translation fields into metadata
    const updatedMetadata = {
      ...formData.metadata,
      slug: finalSlug,
      seoTitle: formData.seoTitle || `${formData.name} - CroatiaBest`,
      seoDescription: formData.seoDescription,
      seoKeywords: formData.seoKeywords,
      nameEn: formData.nameEn,
      descriptionEn: formData.descriptionEn,
      seoTitleEn: formData.seoTitleEn,
      seoDescriptionEn: formData.seoDescriptionEn,
      seoKeywordsEn: formData.seoKeywordsEn
    };

    const payloadData = {
        name: formData.name,
        locationCategoryId: formData.locationCategoryId,
        address: formData.address,
        city: formData.city,
        region,
        latitude: parseFloat(formData.latitude) || (knownLoc?.lat || 45.8150),
        longitude: parseFloat(formData.longitude) || (knownLoc?.lng || 15.9819),
        description: formData.description,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail || null,
        webAddress: formData.webAddress || null,
        locationCategoryType: selectedCategory?.type === 'paid' ? 'Paid' : 'Free',
        paymentStatus: selectedCategory?.type === 'paid' ? 'paid' : 'not_applicable',
        ownerId: formData.ownerId || user.id,
        status: formData.status,
        photoUrls: formData.photoUrls,
        products: formData.products,
        seoTitle: updatedMetadata.seoTitle,
        seoDescription: updatedMetadata.seoDescription,
        seoKeywords: updatedMetadata.seoKeywords,
        seoTitleEn: updatedMetadata.seoTitleEn,
        seoDescriptionEn: updatedMetadata.seoDescriptionEn,
        seoKeywordsEn: updatedMetadata.seoKeywordsEn,
        metadata: {
          ...updatedMetadata,
          faq: formData.faq
        }
    };

    try {
      await pb.collection('listings').update(id, payloadData);
      toast({ title: "Uspjeh", description: "Objekt i SEO podaci uspješno ažurirani." });
      router.refresh();
      router.push('/admin');
    } catch (error: any) {
      setIsSaving(false);
      console.error("Save error:", error);
      
      let errorMsg = error?.message || 'Nepoznata greška';
      if (error?.response?.data) {
        errorMsg += " | " + JSON.stringify(error.response.data);
      }
      
      toast({ title: "Greška", description: `Spremanje nije uspjelo: ${errorMsg}`, variant: "destructive" });
      
      setErrorDebugInfo(JSON.stringify({
        msg: error?.message,
        name: error?.name,
        stack: error?.stack,
        status: error?.status,
        data: error?.response?.data || error?.data
      }, null, 2));
    }
  };

  if (isUserLoading || isLoading) return <div className="p-20 text-center"><Loader2 className="animate-spin size-8 mx-auto text-primary" /></div>;
  if (!isAdmin) return <div className="p-20 text-center font-black">PRISTUP ODBIJEN</div>;

  const allLocations = [
    ...cities.map(c => ({ ...c, displayName: c.name, uniqueSlug: `grad-${c.slug}` })),
    ...islands.map(i => ({ ...i, displayName: `${i.name} (Otok)`, uniqueSlug: `otok-${i.slug}` }))
  ].sort((a,b) => a.displayName.localeCompare(b.displayName));
  const isFreeCategory = CATEGORIES.find(c => c.id === formData.locationCategoryId)?.type === 'free';
  const categorySlug = CATEGORY_SLUG_MAP[formData.locationCategoryId] || formData.locationCategoryId || 'objekt';
  const currentSlug = formData.slug || generateSlug(formData.name);
  const liveUrl = `/objekt/${categorySlug}/${currentSlug}`;

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full"><ArrowLeft /></Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-black">Uredi Objekt & SEO</h1>
              <p className="text-xs text-muted-foreground font-medium mt-1">
                Uređivanje sadržaja, ključnih riječi, meta opisa i engleskih prijevoda.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {currentSlug && (
              <a href={liveUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" className="h-12 px-5 rounded-2xl font-bold border-black/10 hover:bg-secondary/10 text-xs">
                  <ExternalLink className="size-4 mr-2 text-primary" /> Pregledaj link
                </Button>
              </a>
            )}
            <Button onClick={handleSave} disabled={isSaving} className="h-12 px-8 rounded-2xl font-black bg-primary shadow-xl">
              {isSaving ? <Loader2 className="animate-spin mr-2 size-4" /> : <Save className="mr-2 size-4" />} SPREMI PROMJENE
            </Button>
          </div>
        </div>

        {/* Google SERP Preview Card */}
        <Card className="rounded-[2.5rem] shadow-sm border border-black/5 bg-white mb-8 overflow-hidden">
          <CardHeader className="bg-secondary/5 border-b py-4 px-8 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="size-4 text-blue-600" />
              <CardTitle className="text-sm font-black uppercase tracking-wider">Google SERP & SEO Pregled</CardTitle>
            </div>
            <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold">Live URL Preview</span>
          </CardHeader>
          <CardContent className="p-8 space-y-2">
            <div className="text-xs text-emerald-700 font-mono flex items-center gap-1.5 break-all">
              <span>https://croatiabest.com.hr/objekt/{categorySlug}/<strong className="text-emerald-900">{currentSlug || 'vas-slug'}</strong></span>
            </div>
            <h3 className="text-xl font-bold text-blue-700 hover:underline cursor-pointer">
              {formData.seoTitle || (formData.name ? `${formData.name} - CroatiaBest` : 'Naziv vašeg objekta - CroatiaBest')}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {formData.seoDescription || (formData.description ? formData.description.replace(/<[^>]*>/g, '').substring(0, 160) : 'Dodajte meta opis kako bi privukli posjetitelje s Google tražilice...')}
            </p>
          </CardContent>
        </Card>

        {/* Language Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-secondary/10 p-1.5 rounded-2xl flex gap-2">
            <button
              type="button"
              onClick={() => setLangTab('hr')}
              className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                langTab === 'hr' ? 'bg-white shadow-md text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="text-base">🇭🇷</span> Hrvatski Sadržaj & SEO
            </button>
            <button
              type="button"
              onClick={() => setLangTab('en')}
              className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                langTab === 'en' ? 'bg-white shadow-md text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="text-base">🇬🇧</span> English Translation & SEO
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* HRVATSKI SADRŽAJ */}
            {langTab === 'hr' && (
              <>
                <Card className="rounded-[2.5rem] shadow-xl overflow-hidden border-none bg-white">
                  <CardHeader className="bg-secondary/5 border-b"><CardTitle>Osnovni podaci (Hrvatski)</CardTitle></CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2">
                      <Label className="font-bold">Naziv objekta (Hrvatski)</Label>
                      <Input 
                        value={formData.name} 
                        onChange={handleNameChange} 
                        placeholder="npr. Konoba Dubrava" 
                        className="h-12 rounded-xl text-base font-semibold" 
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="font-bold">Prilagođeni SEO Link (Slug)</Label>
                        <span className="text-[10px] text-muted-foreground font-mono">Automatski generirano iz naziva</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground bg-secondary/5 px-3 py-3 rounded-xl border border-black/5">/objekt/{categorySlug}/</span>
                        <Input 
                          value={formData.slug} 
                          onChange={e => setFormData({...formData, slug: generateSlug(e.target.value)})} 
                          placeholder="konoba-dubrava" 
                          className="h-12 rounded-xl font-mono text-sm" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-bold">Kategorija</Label>
                        <Select onValueChange={v => setFormData({...formData, locationCategoryId: v})} value={formData.locationCategoryId || undefined}>
                          <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">Status</Label>
                        <Select onValueChange={v => setFormData({...formData, status: v})} value={formData.status || undefined}>
                          <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active (Objavljeno)</SelectItem>
                            <SelectItem value="draft">Draft (Skica)</SelectItem>
                            <SelectItem value="pending">Pending (Na čekanju)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-bold">Opis objekta (Hrvatski)</Label>
                      <RichTextEditor 
                        value={formData.description} 
                        onChange={v => setFormData({...formData, description: v})} 
                        placeholder="Napišite detaljan opis ponude, ambijenta, povijesti ili specijaliteta..."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* HRVATSKI SEO BLOK */}
                <Card className="rounded-[2.5rem] shadow-xl overflow-hidden border-none bg-white">
                  <CardHeader className="bg-secondary/5 border-b flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-black flex items-center gap-2">
                        <Search className="size-5 text-primary" /> SEO Postavke (Hrvatski)
                      </CardTitle>
                      <CardDescription className="text-xs">Optimizirajte prikaz objekta za Google tražilicu.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="font-bold">SEO Naslov (Title Tag)</Label>
                        <span className="text-[10px] text-muted-foreground">{formData.seoTitle.length}/60 znakova</span>
                      </div>
                      <Input 
                        value={formData.seoTitle} 
                        onChange={e => setFormData({...formData, seoTitle: e.target.value})} 
                        placeholder={formData.name ? `${formData.name} - Najbolji restorani | CroatiaBest` : 'Naslov za Google...'} 
                        className="h-12 rounded-xl text-sm" 
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="font-bold">Meta Opis (Meta Description)</Label>
                        <span className={`text-[10px] font-mono ${formData.seoDescription.length > 160 ? 'text-red-500 font-bold' : 'text-muted-foreground'}`}>
                          {formData.seoDescription.length}/160 znakova
                        </span>
                      </div>
                      <Textarea 
                        rows={3}
                        value={formData.seoDescription} 
                        onChange={e => setFormData({...formData, seoDescription: e.target.value})} 
                        placeholder="Privlačan kratki sažetak za Google tražilicu (do 160 znakova)..." 
                        className="rounded-xl text-sm leading-relaxed" 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-bold">Ključne riječi (Keywords)</Label>
                      <Input 
                        value={formData.seoKeywords} 
                        onChange={e => setFormData({...formData, seoKeywords: e.target.value})} 
                        placeholder="npr. restoran dubrovnik, dalmatinska spiza, svježa riba, večera" 
                        className="h-12 rounded-xl text-sm" 
                      />
                      <p className="text-[11px] text-muted-foreground">Unosite ključne riječi odvojene zarezom.</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* ENGLESKI SADRŽAJ */}
            {langTab === 'en' && (
              <>
                <Card className="rounded-[2.5rem] shadow-xl overflow-hidden border-none bg-white">
                  <CardHeader className="bg-blue-500/5 border-b flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-black flex items-center gap-2">
                        <Languages className="size-5 text-blue-600" /> English Content (Engleski)
                      </CardTitle>
                      <CardDescription className="text-xs">Unesite engleski prijevod naziva i opisa.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2">
                      <Label className="font-bold">Naziv na engleskom (Name EN)</Label>
                      <Input 
                        value={formData.nameEn} 
                        onChange={e => setFormData({...formData, nameEn: e.target.value})} 
                        placeholder={formData.name || 'e.g. Dubrava Tavern'} 
                        className="h-12 rounded-xl text-base font-semibold" 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-bold">Opis na engleskom (Description EN)</Label>
                      <RichTextEditor 
                        value={formData.descriptionEn} 
                        onChange={v => setFormData({...formData, descriptionEn: v})} 
                        placeholder="Write a detailed description in English for foreign visitors..."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* ENGLESKI SEO BLOK */}
                <Card className="rounded-[2.5rem] shadow-xl overflow-hidden border-none bg-white">
                  <CardHeader className="bg-blue-500/5 border-b">
                    <CardTitle className="text-xl font-black flex items-center gap-2">
                      <Search className="size-5 text-blue-600" /> SEO Settings (English)
                    </CardTitle>
                    <CardDescription className="text-xs">Optimizirajte prikaz objekta za strane posjetitelje na Googleu.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="font-bold">SEO Title (EN)</Label>
                        <span className="text-[10px] text-muted-foreground">{formData.seoTitleEn.length}/60 characters</span>
                      </div>
                      <Input 
                        value={formData.seoTitleEn} 
                        onChange={e => setFormData({...formData, seoTitleEn: e.target.value})} 
                        placeholder="e.g. Dubrava Tavern - Best Dining in Dubrovnik | CroatiaBest" 
                        className="h-12 rounded-xl text-sm" 
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="font-bold">Meta Description (EN)</Label>
                        <span className={`text-[10px] font-mono ${formData.seoDescriptionEn.length > 160 ? 'text-red-500 font-bold' : 'text-muted-foreground'}`}>
                          {formData.seoDescriptionEn.length}/160 characters
                        </span>
                      </div>
                      <Textarea 
                        rows={3}
                        value={formData.seoDescriptionEn} 
                        onChange={e => setFormData({...formData, seoDescriptionEn: e.target.value})} 
                        placeholder="Catchy English snippet for search engines (up to 160 chars)..." 
                        className="rounded-xl text-sm leading-relaxed" 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-bold">Keywords (EN)</Label>
                      <Input 
                        value={formData.seoKeywordsEn} 
                        onChange={e => setFormData({...formData, seoKeywordsEn: e.target.value})} 
                        placeholder="e.g. dubrovnik restaurant, traditional croatian food, seafood, best dinner" 
                        className="h-12 rounded-xl text-sm" 
                      />
                      <p className="text-[11px] text-muted-foreground">Separate keywords with commas.</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Specifičnosti kategorije */}
            {CATEGORY_FIELDS[formData.locationCategoryId] && (
              <Card className="rounded-[2.5rem] shadow-xl overflow-hidden border-none bg-white">
                <CardHeader className="bg-secondary/5 border-b"><CardTitle>Specifičnosti kategorije</CardTitle></CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {CATEGORY_FIELDS[formData.locationCategoryId].map(field => (
                      <div key={field.id} className="space-y-2">
                        <Label className="font-bold">{field.label}</Label>
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
                            <Label htmlFor={field.id} className="font-bold cursor-pointer leading-none">{field.label}</Label>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ponuda & Proizvodi i FAQ */}
            {!isFreeCategory && (
              <div className="space-y-8">
                <Card className="rounded-[2.5rem] shadow-xl overflow-hidden border-none bg-white">
                  <CardHeader className="bg-secondary/5 border-b"><CardTitle>Ponuda & Proizvodi</CardTitle></CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Naziv proizvoda / usluge</Label>
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

                <Card className="rounded-[2.5rem] shadow-xl overflow-hidden border-none bg-white">
                  <CardHeader className="bg-secondary/5 border-b"><CardTitle>Česta Pitanja (FAQ)</CardTitle></CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Pitanje</Label>
                        <Input placeholder="npr. Imate li osiguran parking?" value={newFaq.question} onChange={e => setNewFaq({...newFaq, question: e.target.value})} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Odgovor</Label>
                        <div className="flex gap-2">
                          <Input placeholder="npr. Da, besplatan parking za goste." value={newFaq.answer} onChange={e => setNewFaq({...newFaq, answer: e.target.value})} className="rounded-xl" />
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

            {/* Fotografije */}
            <Card className="rounded-[2.5rem] shadow-xl overflow-hidden border-none bg-white">
              <CardHeader className="bg-secondary/5 border-b"><CardTitle>Fotografije objekta</CardTitle></CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ImageUpload onUploadComplete={handleImageUploaded} />
                  <div className="grid grid-cols-2 gap-2">
                    {formData.photoUrls.map((url, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border group">
                        <img src={url} className="object-cover w-full h-full" alt="Upload" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button type="button" variant="destructive" size="icon" onClick={() => setFormData(prev => ({...prev, photoUrls: prev.photoUrls.filter((_, idx) => idx !== i)}))}><X className="size-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Desni stupac - Lokacija & Kontakt */}
          <div className="space-y-8">
            <Card className="rounded-[2.5rem] shadow-xl border-none bg-white">
              <CardHeader className="bg-secondary/5 border-b"><CardTitle>Lokacija</CardTitle></CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-bold">Grad ili Otok</Label>
                  <select
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">-- Odaberi grad ili otok --</option>
                    <optgroup label="Gradovi">
                      {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </optgroup>
                    <optgroup label="Otoci">
                      {islands.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                    </optgroup>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <Label className="font-bold">Adresa</Label>
                  <div className="flex gap-2">
                    <Input placeholder="npr. Ilica 10" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="rounded-xl flex-1" />
                    <Button variant="secondary" onClick={fetchCoordinates} disabled={isFetchingCoords} className="rounded-xl px-4 font-black">
                      {isFetchingCoords ? <Loader2 className="animate-spin size-4 mr-2" /> : <MapPin className="size-4 mr-2" />}
                      Dohvati
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Lat" type="number" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} className="rounded-xl" />
                  <Input placeholder="Lng" type="number" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} className="rounded-xl" />
                </div>
                
                <div className="pt-2">
                  <LocationPicker 
                    lat={formData.latitude ? parseFloat(formData.latitude) : null}
                    lng={formData.longitude ? parseFloat(formData.longitude) : null}
                    cityCenter={formData.city ? (allLocations.find(l => l.name === formData.city) as any) : null}
                    onChange={(lat, lng) => setFormData({...formData, latitude: lat.toString(), longitude: lng.toString()})}
                  />
                  <p className="text-xs text-slate-500 mt-2 font-medium">Kliknite na kartu ili povucite marker za točan odabir lokacije.</p>
                </div>
              </CardContent>
            </Card>

            {!isFreeCategory && (
              <Card className="rounded-[2.5rem] shadow-xl border-none bg-white">
                <CardHeader className="bg-secondary/5 border-b"><CardTitle>Kontakt podaci</CardTitle></CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="font-bold">Telefon</Label>
                    <Input placeholder="+385 91 ..." value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} className="rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-bold">Email</Label>
                    <Input placeholder="info@objekt.hr" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-bold">Web stranica</Label>
                    <Input placeholder="https://www.objekt.hr" value={formData.webAddress} onChange={e => setFormData({...formData, webAddress: e.target.value})} className="rounded-xl" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {errorDebugInfo && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl overflow-auto text-xs font-mono text-red-900">
            <h3 className="font-bold text-red-700 mb-2">DEBUG INFORMACIJE (Molimo kopirajte ovo):</h3>
            <pre>{errorDebugInfo}</pre>
          </div>
        )}
      </main>
    </div>
  );
}
