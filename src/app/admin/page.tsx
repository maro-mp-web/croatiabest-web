"use client"

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { 
  MapPin, 
  CheckCircle2, 
  XCircle,
  Clock,
  Sparkles,
  ShieldAlert,
  Shield,
  Loader2,
  CreditCard,
  DollarSign,
  PlusCircle,
  RotateCcw,
  Trash2,
  Edit2,
  Building2,
  Anchor,
  Trees,
  BookOpen,
  Settings,
  X
} from 'lucide-react';
import { CATEGORIES } from '@/app/lib/constants';
import Link from 'next/link';
import { useUser, useCollection, usePB } from '@/pocketbase';

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const pb = usePB();

  const getFirstPhoto = (urls: any) => {
    try {
      if (Array.isArray(urls)) return urls[0] || '';
      if (typeof urls === 'string') {
        if (urls.trim().startsWith('[')) {
          const parsed = JSON.parse(urls);
          return parsed[0] || '';
        }
        return urls || '';
      }
    } catch (e) {}
    return '';
  };
  
  // Stroga provjera administratora - isključivo maro.webdeveloper@gmail.com
  const isAdmin = user?.email === 'maro.webdeveloper@gmail.com';

  const { data: listings, isLoading: listingsLoading } = useCollection('listings', {
    sort: '-created',
  });

  const { data: blogs, isLoading: blogsLoading } = useCollection('blogs', {
    sort: '-created',
  });

  const { data: cities, isLoading: citiesLoading } = useCollection('cities', {
    sort: 'name',
  });

  const { data: islands, isLoading: islandsLoading } = useCollection('islands', {
    sort: 'name',
  });

  // Tab State: "listings" | "blogs" | "cities" | "islands" | "parks"
  const [activeTab, setActiveTab] = useState<'listings' | 'blogs' | 'cities' | 'islands' | 'parks'>('listings');

  // Edit Panel State
  const [isEditing, setIsEditing] = useState(false);
  const [editType, setEditType] = useState<'city' | 'island' | 'park' | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    name: '',
    slug: '',
    description: '',
    descriptionEn: '',
    population: '',
    mayor: '',
    officialWeb: '',
    areaCode: '',
    zipCode: '',
    region: '',
    image: '',
    lat: 45.0,
    lng: 16.0,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  const handleApprove = async (id: string) => {
    if (!pb) return;
    try {
      await pb.collection('listings').update(id, { status: 'active' });
      window.location.reload();
    } catch (error) {
      console.error('Approve error:', error);
    }
  };

  const handleReject = async (id: string) => {
    if (!pb) return;
    try {
      await pb.collection('listings').update(id, { status: 'rejected' });
      window.location.reload();
    } catch (error) {
      console.error('Reject error:', error);
    }
  };

  const handleReset = async (id: string) => {
    if (!pb) return;
    try {
      await pb.collection('listings').update(id, { status: 'pending' });
      window.location.reload();
    } catch (error) {
      console.error('Reset error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!pb) return;
    if (confirm('Jeste li sigurni da želite obrisati ovaj objekt?')) {
      try {
        await pb.collection('listings').delete(id);
        window.location.reload();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!pb) return;
    if (confirm('Jeste li sigurni da želite obrisati ovaj članak?')) {
      try {
        await pb.collection('blogs').delete(id);
        window.location.reload();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleDeleteCity = async (id: string) => {
    if (!pb) return;
    if (confirm('Jeste li sigurni da želite obrisati ovaj grad?')) {
      try {
        await pb.collection('cities').delete(id);
        window.location.reload();
      } catch (error) {
        console.error('City delete error:', error);
      }
    }
  };

  const handleDeleteIsland = async (id: string) => {
    if (!pb) return;
    if (confirm('Jeste li sigurni da želite obrisati ovaj otok?')) {
      try {
        await pb.collection('islands').delete(id);
        window.location.reload();
      } catch (error) {
        console.error('Island delete error:', error);
      }
    }
  };

  // Edit action triggers
  const startEditCity = (cityItem?: any) => {
    setEditType('city');
    if (cityItem) {
      setEditId(cityItem.id);
      setFormData({
        name: cityItem.name || '',
        slug: cityItem.slug || '',
        description: cityItem.description || '',
        descriptionEn: cityItem.descriptionEn || '',
        population: cityItem.population || '',
        mayor: cityItem.mayor || '',
        officialWeb: cityItem.officialWeb || '',
        areaCode: cityItem.areaCode || '',
        zipCode: cityItem.zipCode || '',
        region: cityItem.region || '',
        image: cityItem.image || '',
        lat: cityItem.lat || 45.0,
        lng: cityItem.lng || 16.0,
        seoTitle: cityItem.seoTitle || '',
        seoDescription: cityItem.seoDescription || '',
        seoKeywords: cityItem.seoKeywords || '',
      });
    } else {
      setEditId(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        descriptionEn: '',
        population: '',
        mayor: '',
        officialWeb: '',
        areaCode: '',
        zipCode: '',
        region: 'Središnja Hrvatska',
        image: '',
        lat: 45.815,
        lng: 15.981,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
      });
    }
    setIsEditing(true);
  };

  const startEditIsland = (islandItem?: any) => {
    setEditType('island');
    if (islandItem) {
      setEditId(islandItem.id);
      setFormData({
        name: islandItem.name || '',
        slug: islandItem.slug || '',
        description: islandItem.description || '',
        descriptionEn: islandItem.descriptionEn || '',
        population: islandItem.population || '',
        mayor: islandItem.mayor || '',
        officialWeb: islandItem.officialWeb || '',
        areaCode: islandItem.areaCode || '',
        region: islandItem.region || '',
        image: islandItem.image || '',
        lat: islandItem.lat || 43.0,
        lng: islandItem.lng || 16.0,
        seoTitle: islandItem.seoTitle || '',
        seoDescription: islandItem.seoDescription || '',
        seoKeywords: islandItem.seoKeywords || '',
      });
    } else {
      setEditId(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        descriptionEn: '',
        population: '',
        mayor: '',
        officialWeb: '',
        areaCode: '',
        region: 'Dalmacija',
        image: '',
        lat: 43.508,
        lng: 16.439,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
      });
    }
    setIsEditing(true);
  };

  const startEditPark = (parkItem?: any) => {
    setEditType('park');
    if (parkItem) {
      setEditId(parkItem.id);
      setFormData({
        name: parkItem.name || '',
        city: parkItem.city || '',
        address: parkItem.address || '',
        description: parkItem.description || '',
        descriptionEn: parkItem.metadata?.descriptionEn || '',
        image: getFirstPhoto(parkItem.photoUrls),
        lat: parkItem.latitude || 44.8,
        lng: parkItem.longitude || 15.6,
        region: parkItem.region || '',
        seoTitle: parkItem.metadata?.seoTitle || '',
        seoDescription: parkItem.metadata?.seoDescription || '',
        seoKeywords: parkItem.metadata?.seoKeywords || '',
      });
    } else {
      setEditId(null);
      setFormData({
        name: '',
        city: '',
        address: '',
        description: '',
        descriptionEn: '',
        image: '',
        lat: 44.88,
        lng: 15.62,
        region: 'Dalmacija',
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
      });
    }
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pb) return;

    try {
      if (editType === 'city') {
        const data = {
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          descriptionEn: formData.descriptionEn,
          population: formData.population,
          mayor: formData.mayor,
          officialWeb: formData.officialWeb,
          areaCode: formData.areaCode,
          zipCode: formData.zipCode,
          region: formData.region,
          image: formData.image,
          lat: formData.lat,
          lng: formData.lng,
        };
        if (editId) {
          await pb.collection('cities').update(editId, data);
        } else {
          await pb.collection('cities').create(data);
        }
      } else if (editType === 'island') {
        const data = {
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          descriptionEn: formData.descriptionEn,
          population: formData.population,
          region: formData.region,
          image: formData.image,
          lat: formData.lat,
          lng: formData.lng,
        };
        if (editId) {
          await pb.collection('islands').update(editId, data);
        } else {
          await pb.collection('islands').create(data);
        }
      } else if (editType === 'park') {
        const metadata = {
          nameEn: formData.name,
          descriptionEn: formData.descriptionEn,
          seoTitle: formData.seoTitle,
          seoDescription: formData.seoDescription,
          seoKeywords: formData.seoKeywords
        };
        const recordData: any = {
          name: formData.name,
          city: formData.city,
          address: formData.address || formData.city,
          description: formData.description,
          latitude: parseFloat(formData.lat as any) || 0,
          longitude: parseFloat(formData.lng as any) || 0,
          region: formData.region,
          photoUrls: formData.image ? JSON.stringify([formData.image]) : JSON.stringify([]),
          locationCategoryId: 'national_parks',
          locationCategoryType: 'free',
          status: 'active',
          metadata: metadata
        };
        
        if (!editId) {
          recordData.ownerId = user?.id || '';
        }

        if (editId) {
          await pb.collection('listings').update(editId, recordData);
        } else {
          await pb.collection('listings').create(recordData);
        }
      }
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.error('Save error:', err);
      alert('Spremanje nije uspjelo. Provjerite konzolu za detalje.');
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="size-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="size-24 text-destructive mb-6" />
        <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter">Pristup Odbijen</h1>
        <p className="text-muted-foreground text-lg max-w-md mb-10">Ova stranica rezervirana je isključivo za ovlaštene administratore sustava.</p>
        <Link href="/">
          <Button className="rounded-2xl h-16 px-12 font-black bg-primary shadow-xl shadow-primary/20 text-lg">POVRATAK NA PORTAL</Button>
        </Link>
      </div>
    );
  }

  // Filter national parks from listings
  const nationalParks = listings?.filter(l => (l.locationCategoryId || l.categoryId) === 'national_parks') || [];

  const totalRevenue = listings?.filter(l => l.paymentStatus === 'paid').reduce((acc, curr) => {
    const categoryId = curr.locationCategoryId || curr.categoryId;
    const category = CATEGORIES.find(c => c.id === categoryId);
    const priceStr = category?.price?.replace('€', '') || '0';
    return acc + parseInt(priceStr);
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-12 pt-28">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-4 py-1">Superadmin Console</Badge>
            </div>
            <h1 className="text-5xl font-headline font-black tracking-tight">Upravljačka ploča</h1>
            <p className="text-muted-foreground mt-2">Prijavljen kao: <span className="font-bold text-foreground">{user?.email}</span></p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/new-listing">
              <Button className="bg-foreground text-white hover:bg-foreground/90 rounded-2xl font-black h-14 px-8 shadow-md">
                <PlusCircle className="size-5 mr-2" /> Dodaj Objekt
              </Button>
            </Link>
            <Link href="/admin/new-blog">
              <Button className="bg-primary text-white hover:bg-primary/90 rounded-2xl font-black h-14 px-8 shadow-md">
                <PlusCircle className="size-5 mr-2" /> Dodaj Članak
              </Button>
            </Link>
            <Button onClick={() => startEditCity()} className="bg-blue-600 text-white hover:bg-blue-700 rounded-2xl font-black h-14 px-8 shadow-md">
              <PlusCircle className="size-5 mr-2" /> Novi Grad
            </Button>
            <Button onClick={() => startEditIsland()} className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-2xl font-black h-14 px-8 shadow-md">
              <PlusCircle className="size-5 mr-2" /> Novi Otok
            </Button>
          </div>
           {/* Stats Grid */}
        <div className="space-y-8 mb-12">
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Statistika Objekata</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-none shadow-xl rounded-3xl bg-orange-50/50">
                <CardContent className="p-6">
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-3">U obradi</p>
                  <div className="flex items-center justify-between">
                    <p className="text-5xl font-black text-orange-700">{listings?.filter(l => l.status === 'pending').length || 0}</p>
                    <Clock className="size-10 text-orange-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-xl rounded-3xl bg-blue-50/50">
                <CardContent className="p-6">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">Aktivno</p>
                  <div className="flex items-center justify-between">
                    <p className="text-5xl font-black text-blue-700">{listings?.filter(l => (l.status === 'active' || l.status === 'approved') && (l.locationCategoryId || l.categoryId) !== 'national_parks').length || 0}</p>
                    <MapPin className="size-10 text-blue-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-xl rounded-3xl bg-green-50/50">
                <CardContent className="p-6">
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-3">Prihod (bruto)</p>
                  <div className="flex items-center justify-between">
                    <p className="text-5xl font-black text-green-700">{totalRevenue}€</p>
                    <DollarSign className="size-10 text-green-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-xl rounded-3xl bg-primary/5">
                <CardContent className="p-6">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Premium</p>
                  <div className="flex items-center justify-between">
                    <p className="text-5xl font-black text-primary">{listings?.filter(l => l.locationCategoryType === 'Paid' || l.locationCategoryType === 'paid').length || 0}</p>
                    <CreditCard className="size-10 text-primary opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Statistika Lokacija i Atrakcija</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-none shadow-xl rounded-3xl bg-blue-50/30">
                <CardContent className="p-6">
                  <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-3">Gradovi</p>
                  <div className="flex items-center justify-between">
                    <p className="text-5xl font-black text-blue-800">{cities?.length || 0}</p>
                    <Building2 className="size-10 text-blue-700 opacity-20" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-xl rounded-3xl bg-emerald-50/30">
                <CardContent className="p-6">
                  <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-3">Otoci</p>
                  <div className="flex items-center justify-between">
                    <p className="text-5xl font-black text-emerald-800">{islands?.length || 0}</p>
                    <Anchor className="size-10 text-emerald-700 opacity-20" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-xl rounded-3xl bg-red-50/30">
                <CardContent className="p-6">
                  <p className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-3">Nacionalni Parkovi</p>
                  <div className="flex items-center justify-between">
                    <p className="text-5xl font-black text-red-800">{nationalParks.length || 0}</p>
                    <Trees className="size-10 text-red-700 opacity-20" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-xl rounded-3xl bg-indigo-50/30">
                <CardContent className="p-6">
                  <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-3">Spomenici</p>
                  <div className="flex items-center justify-between">
                    <p className="text-5xl font-black text-indigo-800">{listings?.filter(l => (l.locationCategoryId || l.categoryId) === 'homeland_war').length || 0}</p>
                    <Shield className="size-10 text-indigo-700 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>       </div>

        {/* INTERACTIVE EDIT MODAL FORM */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden bg-white max-h-[90vh] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between p-8 border-b bg-secondary/5">
                <div>
                  <CardTitle className="text-2xl uppercase font-black">
                    {editId ? 'Uredi' : 'Dodaj novi'} {editType === 'city' ? 'Grad' : editType === 'island' ? 'Otok' : 'Nacionalni park'}
                  </CardTitle>
                  <CardDescription>Uredite sadržaj, geografske koordinate i SEO metapodatke.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)} className="rounded-full size-12 hover:bg-black/5">
                  <X className="size-6" />
                </Button>
              </CardHeader>
              <CardContent className="p-8 overflow-y-auto flex-1 space-y-6 text-left">
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Naziv / Name</label>
                      <Input 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        placeholder="Naziv" 
                        required 
                      />
                    </div>
                    {editType !== 'park' && (
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Slug (npr. 'zagreb')</label>
                        <Input 
                          value={formData.slug} 
                          onChange={e => setFormData({...formData, slug: e.target.value})} 
                          placeholder="slug-grada" 
                          required 
                        />
                      </div>
                    )}
                    {editType === 'park' && (
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Grad / Lokacija</label>
                        <Input 
                          value={formData.city} 
                          onChange={e => setFormData({...formData, city: e.target.value})} 
                          placeholder="npr. Plitvička Jezera" 
                          required 
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Opis (Hrvatski)</label>
                    <Textarea 
                      rows={4} 
                      value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})} 
                      placeholder="Opis na hrvatskom..." 
                      required 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Opis (Engleski / English Description)</label>
                    <Textarea 
                      rows={4} 
                      value={formData.descriptionEn} 
                      onChange={e => setFormData({...formData, descriptionEn: e.target.value})} 
                      placeholder="English description..." 
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Slika URL / Image Path</label>
                      <div className="flex flex-col gap-3">
                        <Input 
                          value={formData.image} 
                          onChange={e => setFormData({...formData, image: e.target.value})} 
                          placeholder="npr. /cities/split.webp ili Unsplash URL" 
                          required 
                        />
                        <ImageUpload 
                          defaultImage={formData.image}
                          onUploadComplete={(url) => setFormData(prev => ({...prev, image: url}))} 
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Regija / Region</label>
                      <select 
                        className="w-full h-10 px-3 rounded-lg border bg-white font-medium text-sm"
                        value={formData.region}
                        onChange={e => setFormData({...formData, region: e.target.value})}
                      >
                        <option value="Dalmacija">Dalmacija</option>
                        <option value="Istra">Istra</option>
                        <option value="Kvarner">Kvarner</option>
                        <option value="Središnja Hrvatska">Središnja Hrvatska</option>
                        <option value="Slavonija">Slavonija</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Stanovništvo / Pop</label>
                      <Input 
                        value={formData.population} 
                        onChange={e => setFormData({...formData, population: e.target.value})} 
                        placeholder="npr. 800000" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Geografska širina (Lat)</label>
                      <Input 
                        type="number"
                        step="0.00001"
                        value={formData.lat} 
                        onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})} 
                        required 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Geografska dužina (Lng)</label>
                      <Input 
                        type="number"
                        step="0.00001"
                        value={formData.lng} 
                        onChange={e => setFormData({...formData, lng: parseFloat(e.target.value)})} 
                        required 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Gradonačelnik / Općina</label>
                      <Input 
                        value={formData.mayor} 
                        onChange={e => setFormData({...formData, mayor: e.target.value})} 
                        placeholder="npr. Ivan Horvat" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Službeni Web</label>
                      <Input 
                        value={formData.officialWeb} 
                        onChange={e => setFormData({...formData, officialWeb: e.target.value})} 
                        placeholder="https://official.hr" 
                      />
                    </div>
                  </div>

                  {editType !== 'park' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Pozivni broj (Area code)</label>
                        <Input 
                          value={formData.areaCode} 
                          onChange={e => setFormData({...formData, areaCode: e.target.value})} 
                          placeholder="npr. 01 ili 021" 
                        />
                      </div>
                      {editType === 'city' && (
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Poštanski broj (Zip)</label>
                          <Input 
                            value={formData.zipCode} 
                            onChange={e => setFormData({...formData, zipCode: e.target.value})} 
                            placeholder="npr. 10000" 
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* SEO METADATA SECTION */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-black/5 space-y-4">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">SEO Optimizacija / Meta Tags</p>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">SEO Naslov (SEO Title)</label>
                        <Input 
                          value={formData.seoTitle} 
                          onChange={e => setFormData({...formData, seoTitle: e.target.value})} 
                          placeholder="Zadano se generira automatski" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">SEO Opis (SEO Description)</label>
                        <Textarea 
                          rows={2} 
                          value={formData.seoDescription} 
                          onChange={e => setFormData({...formData, seoDescription: e.target.value})} 
                          placeholder="Maksimalno 160 znakova" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Ključne riječi (SEO Keywords)</label>
                        <Input 
                          value={formData.seoKeywords} 
                          onChange={e => setFormData({...formData, seoKeywords: e.target.value})} 
                          placeholder="npr. dubrovnik guide, star grad, atrakcije" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-xl font-bold h-12 px-8 flex-1">Spremi promjene</Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl h-12 px-8">Odustani</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-black/5 gap-6 mb-8 overflow-x-auto pb-1 text-slate-600">
          {[
            { id: 'listings', name: 'Objekti / Prijave', icon: <CreditCard className="size-4" /> },
            { id: 'blogs', name: 'Magazin (Blog)', icon: <BookOpen className="size-4" /> },
            { id: 'cities', name: 'Gradovi', icon: <Building2 className="size-4" /> },
            { id: 'islands', name: 'Otoci', icon: <Anchor className="size-4" /> },
            { id: 'parks', name: 'Nacionalni parkovi', icon: <Trees className="size-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-4 font-black uppercase text-xs tracking-wider transition-all border-b-2 outline-none ${activeTab === tab.id ? 'border-primary text-primary font-black' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* TAB 1: LISTINGS */}
        {activeTab === 'listings' && (
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b p-8 bg-secondary/5">
              <div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight">Upravljanje Prijavama</CardTitle>
                <CardDescription>Odobrite nove objekte i provjerite status naplate.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {listingsLoading ? (
                <div className="p-24 flex justify-center"><Loader2 className="animate-spin size-8 text-primary" /></div>
              ) : (
                <div className="divide-y divide-black/5 text-left">
                  {(!listings || listings.filter(l => (l.locationCategoryId || l.categoryId) !== 'national_parks').length === 0) ? (
                    <div className="p-24 text-center text-muted-foreground italic">Nema prijava u sustavu.</div>
                  ) : (
                    listings
                      .filter(l => (l.locationCategoryId || l.categoryId) !== 'national_parks')
                      .map((listing) => {
                        const categoryId = listing.locationCategoryId || listing.categoryId;
                        const category = CATEGORIES.find(c => c.id === categoryId);
                        const name = listing.name || listing.objectName || 'Bez naziva';
                        
                        return (
                          <div key={listing.id} className="flex flex-col md:flex-row items-center justify-between p-8 hover:bg-secondary/5 transition-colors gap-6">
                            <div className="flex items-center gap-6 w-full md:w-auto">
                              {getFirstPhoto(listing.photoUrls) ? (
                                <div className="relative size-16 rounded-2xl overflow-hidden shadow-inner border border-black/5 flex-shrink-0">
                                  <img src={getFirstPhoto(listing.photoUrls)} alt={name} className="absolute inset-0 w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className={`size-16 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner flex-shrink-0 ${listing.locationCategoryType === 'Paid' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                  {name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <p className="font-black text-xl mb-1">{name}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
                                  {category?.name} <span className="opacity-30">•</span> {listing.city}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center justify-end gap-6 w-full md:w-auto">
                              <div className="flex flex-col items-end">
                                <p className="text-[9px] font-black uppercase text-muted-foreground/50 tracking-widest mb-1">Plaćanje</p>
                                {listing.paymentStatus === 'paid' ? (
                                  <Badge className="bg-green-500 hover:bg-green-600 text-[9px] font-black h-5 px-3">PROKNJIŽENO</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-[9px] h-5 px-3 font-black opacity-30">NIJE PLAĆENO</Badge>
                                )}
                              </div>
                              
                              <div className="flex flex-col items-end">
                                <p className="text-[9px] font-black uppercase text-muted-foreground/50 tracking-widest mb-1">Status</p>
                                <Badge variant="outline" className={`
                                  ${listing.status === 'pending' ? 'border-orange-500 text-orange-500 bg-orange-50' : ''}
                                  ${listing.status === 'active' || listing.status === 'approved' ? 'border-blue-500 text-blue-500 bg-blue-50' : ''}
                                  ${listing.status === 'rejected' ? 'border-red-500 text-red-500 bg-red-50' : ''}
                                  uppercase font-black text-[9px] px-3 h-5 rounded-lg
                                `}>
                                  {listing.status}
                                </Badge>
                              </div>
                              
                              <div className="flex gap-2">
                                {listing.status === 'pending' && (
                                  <>
                                    <Button variant="ghost" size="icon" onClick={() => handleReject(listing.id)} className="text-red-500 hover:bg-red-50 rounded-xl size-10 border border-black/5">
                                      <XCircle className="size-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleApprove(listing.id)} className="text-blue-500 hover:bg-blue-50 rounded-xl size-10 border border-black/5">
                                      <CheckCircle2 className="size-5" />
                                    </Button>
                                  </>
                                )}
                                {(listing.status === 'active' || listing.status === 'approved' || listing.status === 'rejected') && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleReset(listing.id)} 
                                    className="text-muted-foreground text-[9px] font-black uppercase tracking-widest hover:text-primary rounded-xl h-10 px-4"
                                  >
                                    <RotateCcw className="size-3 mr-1" /> Reset
                                  </Button>
                                )}
                                <Link href={`/admin/edit-listing/${listing.id}`}>
                                  <Button variant="outline" size="icon" className="text-blue-500 hover:bg-blue-50 rounded-xl size-10 border-blue-500/20 bg-blue-500/5">
                                    <Edit2 className="size-4" />
                                  </Button>
                                </Link>
                                <Button variant="outline" size="icon" onClick={() => handleDelete(listing.id)} className="text-red-500 hover:bg-red-50 rounded-xl size-10 border-red-500/20 bg-red-500/5">
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* TAB 2: BLOGS */}
        {activeTab === 'blogs' && (
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b p-8 bg-secondary/5">
              <div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight">Magazin (Blog)</CardTitle>
                <CardDescription>Upravljajte postojećim člancima u Magazinu.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {blogsLoading ? (
                <div className="p-24 flex justify-center"><Loader2 className="animate-spin size-8 text-primary" /></div>
              ) : (
                <div className="divide-y divide-black/5 text-left">
                  {!blogs || blogs.length === 0 ? (
                    <div className="p-24 text-center text-muted-foreground italic">Nema objavljenih članaka.</div>
                  ) : (
                    blogs.map((blog) => (
                      <div key={blog.id} className="flex flex-col md:flex-row items-center justify-between p-8 hover:bg-secondary/5 transition-colors gap-6">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                          <div className="relative size-16 rounded-2xl overflow-hidden shadow-inner border border-black/5 bg-muted flex-shrink-0">
                            {blog.image && <img src={blog.image} alt={blog.title} className="absolute inset-0 w-full h-full object-cover" />}
                          </div>
                          <div>
                            <p className="font-black text-xl mb-1">{blog.title}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
                              {blog.category || 'Nema kategorije'} <span className="opacity-30">•</span> Autor: {blog.author || 'Nepoznato'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Link href={`/blog/${blog.id}`}>
                            <Button variant="outline" size="icon" className="text-primary hover:bg-primary/10 rounded-xl size-10 border-primary/20 bg-primary/5">
                              <Sparkles className="size-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/new-blog?edit=${blog.id}`}>
                            <Button variant="outline" size="icon" className="text-blue-500 hover:bg-blue-50 rounded-xl size-10 border-blue-500/20 bg-blue-500/5">
                              <Edit2 className="size-4" />
                            </Button>
                          </Link>
                          <Button variant="outline" size="icon" onClick={() => handleDeleteBlog(blog.id)} className="text-red-500 hover:bg-red-50 rounded-xl size-10 border-red-500/20 bg-red-500/5">
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* TAB 3: CITIES */}
        {activeTab === 'cities' && (
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b p-8 bg-secondary/5">
              <div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight">Upravljanje Gradovima</CardTitle>
                <CardDescription>Dodajte nove gradove, uredujte opise, geografske kordinate i SEO postavke.</CardDescription>
              </div>
              <Button onClick={() => startEditCity()} className="bg-primary text-white rounded-xl font-bold h-10 px-4">
                <PlusCircle className="size-4 mr-2" /> Dodaj Grad
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {citiesLoading ? (
                <div className="p-24 flex justify-center"><Loader2 className="animate-spin size-8 text-primary" /></div>
              ) : (
                <div className="divide-y divide-black/5 text-left">
                  {!cities || cities.length === 0 ? (
                    <div className="p-24 text-center text-muted-foreground italic">Nema upisanih gradova.</div>
                  ) : (
                    cities.map((city) => (
                      <div key={city.id} className="flex flex-col md:flex-row items-center justify-between p-8 hover:bg-secondary/5 transition-colors gap-6">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                          <div className="relative size-16 rounded-2xl overflow-hidden shadow-inner border border-black/5 bg-muted flex-shrink-0">
                            {city.image && <img src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover" />}
                          </div>
                          <div>
                            <p className="font-black text-xl mb-1">{city.name} <span className="text-xs font-normal text-muted-foreground italic">({city.slug})</span></p>
                            <p className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
                              {city.region} <span className="opacity-30">•</span> Stanovnika: {city.population || 'N/A'} <span className="opacity-30">•</span> Pozivni: {city.areaCode || 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => startEditCity(city)} className="text-blue-500 hover:bg-blue-50 rounded-xl size-10 border-blue-500/20 bg-blue-500/5">
                            <Edit2 className="size-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDeleteCity(city.id)} className="text-red-500 hover:bg-red-50 rounded-xl size-10 border-red-500/20 bg-red-500/5">
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* TAB 4: ISLANDS */}
        {activeTab === 'islands' && (
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b p-8 bg-secondary/5">
              <div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight">Upravljanje Otocima</CardTitle>
                <CardDescription>Upravljajte hrvatskim otocima, opisima, lokacijama i SEO podacima.</CardDescription>
              </div>
              <Button onClick={() => startEditIsland()} className="bg-primary text-white rounded-xl font-bold h-10 px-4">
                <PlusCircle className="size-4 mr-2" /> Dodaj Otok
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {islandsLoading ? (
                <div className="p-24 flex justify-center"><Loader2 className="animate-spin size-8 text-primary" /></div>
              ) : (
                <div className="divide-y divide-black/5 text-left">
                  {!islands || islands.length === 0 ? (
                    <div className="p-24 text-center text-muted-foreground italic">Nema upisanih otoka.</div>
                  ) : (
                    islands.map((island) => (
                      <div key={island.id} className="flex flex-col md:flex-row items-center justify-between p-8 hover:bg-secondary/5 transition-colors gap-6">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                          <div className="relative size-16 rounded-2xl overflow-hidden shadow-inner border border-black/5 bg-muted flex-shrink-0">
                            {island.image && <img src={island.image} alt={island.name} className="absolute inset-0 w-full h-full object-cover" />}
                          </div>
                          <div>
                            <p className="font-black text-xl mb-1">{island.name} <span className="text-xs font-normal text-muted-foreground italic">({island.slug})</span></p>
                            <p className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
                              {island.region} <span className="opacity-30">•</span> Stanovnika: {island.population || 'N/A'} <span className="opacity-30">•</span> Općina: {island.mayor || 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => startEditIsland(island)} className="text-blue-500 hover:bg-blue-50 rounded-xl size-10 border-blue-500/20 bg-blue-500/5">
                            <Edit2 className="size-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDeleteIsland(island.id)} className="text-red-500 hover:bg-red-50 rounded-xl size-10 border-red-500/20 bg-red-500/5">
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* TAB 5: NATIONAL PARKS */}
        {activeTab === 'parks' && (
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b p-8 bg-secondary/5">
              <div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight">Nacionalni Parkovi</CardTitle>
                <CardDescription>Upravljajte nacionalnim parkovima i njihovim detaljnim opisima te lokacijama.</CardDescription>
              </div>
              <Button onClick={() => startEditPark()} className="bg-primary text-white rounded-xl font-bold h-10 px-4">
                <PlusCircle className="size-4 mr-2" /> Dodaj Park
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {listingsLoading ? (
                <div className="p-24 flex justify-center"><Loader2 className="animate-spin size-8 text-primary" /></div>
              ) : (
                <div className="divide-y divide-black/5 text-left">
                  {nationalParks.length === 0 ? (
                    <div className="p-24 text-center text-muted-foreground italic">Nema upisanih nacionalnih parkova.</div>
                  ) : (
                    nationalParks.map((park) => {
                      const image = getFirstPhoto(park.photoUrls);
                      return (
                        <div key={park.id} className="flex flex-col md:flex-row items-center justify-between p-8 hover:bg-secondary/5 transition-colors gap-6">
                          <div className="flex items-center gap-6 w-full md:w-auto">
                            <div className="relative size-16 rounded-2xl overflow-hidden shadow-inner border border-black/5 bg-muted flex-shrink-0">
                              {image && <img src={image} alt={park.name} className="absolute inset-0 w-full h-full object-cover" />}
                            </div>
                            <div>
                              <p className="font-black text-xl mb-1">{park.name}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
                                {park.region} <span className="opacity-30">•</span> Lokacija: {park.city} <span className="opacity-30">•</span> Koordinate: {park.latitude}, {park.longitude}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => startEditPark(park)} className="text-blue-500 hover:bg-blue-50 rounded-xl size-10 border-blue-500/20 bg-blue-500/5">
                              <Edit2 className="size-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDelete(park.id)} className="text-red-500 hover:bg-red-50 rounded-xl size-10 border-red-500/20 bg-red-500/5">
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

      </main>
    </div>
  );
}
