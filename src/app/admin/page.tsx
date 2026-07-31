"use client"

import React, { useState, useEffect } from 'react';
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
  LayoutTemplate,
  ChevronUp,
  ChevronDown,
  Globe,
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
import { WikiSectionsEditor } from '@/components/ui/WikiSectionsEditor';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { CATEGORIES } from '@/app/lib/constants';
import Link from 'next/link';
import { useUser, useCollection, usePB } from '@/pocketbase';
import { getFirstPhoto } from '@/app/lib/image-helpers';

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const pb = usePB();
  
  // Stroga provjera administratora - isključivo maro.webdeveloper@gmail.com
  const isAdmin = user?.email === 'maro.webdeveloper@gmail.com';

  const { data: listings, isLoading: listingsLoading } = useCollection('listings', {
    sort: '-created',
  });

  const { data: blogs, isLoading: blogsLoading } = useCollection('blogs', { sort: '-publishDate,-created' });

  const { data: cities, isLoading: citiesLoading } = useCollection('cities', {
    sort: 'name',
  });

  const { data: islands, isLoading: islandsLoading } = useCollection('islands', {
    sort: 'name',
  });

  const { data: homepageSections, isLoading: sectionsLoading } = useCollection('homepage_sections', {
    sort: 'order',
  });

  const { data: homepageSeoData } = useCollection('homepage_seo');
  const homepageSeo = homepageSeoData?.[0] || null;
  const [seoForm, setSeoForm] = useState<any>({});
  const [seoSaving, setSeoSaving] = useState(false);

  // Sync seoForm when data loads
  useEffect(() => {
    if (homepageSeo && !seoForm.seoTitle) {
      setSeoForm({
        seoTitle: homepageSeo.seoTitle || '',
        seoTitleEn: homepageSeo.seoTitleEn || '',
        seoDescription: homepageSeo.seoDescription || '',
        seoDescriptionEn: homepageSeo.seoDescriptionEn || '',
        seoKeywords: homepageSeo.seoKeywords || '',
        seoKeywordsEn: homepageSeo.seoKeywordsEn || '',
      });
    }
  }, [homepageSeo]);

  // Section items state
  const [sectionItems, setSectionItems] = useState<any[]>([]);

  // Tab State: "listings" | "blogs" | "cities" | "islands" | "parks"
  const [activeTab, setActiveTab] = useState<'listings' | 'blogs' | 'cities' | 'islands' | 'parks' | 'sections'>('listings');

  // Edit Panel State
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSection, setIsEditingSection] = useState(false);
  const [editType, setEditType] = useState<'city' | 'island' | 'park' | 'section' | null>(null);
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
    seoTitleEn: '',
    seoDescriptionEn: '',
    seoKeywordsEn: '',
    wikiSections: [],
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
        seoTitleEn: cityItem.seoTitleEn || '',
        seoDescriptionEn: cityItem.seoDescriptionEn || '',
        seoKeywordsEn: cityItem.seoKeywordsEn || '',
        wikiSections: cityItem.wikiSections || [],
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
        seoTitleEn: '',
        seoDescriptionEn: '',
        seoKeywordsEn: '',
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
        seoTitleEn: islandItem.seoTitleEn || '',
        seoDescriptionEn: islandItem.seoDescriptionEn || '',
        seoKeywordsEn: islandItem.seoKeywordsEn || '',
        wikiSections: islandItem.wikiSections || [],
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
        seoTitleEn: '',
        seoDescriptionEn: '',
        seoKeywordsEn: '',
      });
    }
    setIsEditing(true);
  };


  const startEditSection = (sectionItem?: any) => {
    setEditType('section');
    if (sectionItem) {
      setEditId(sectionItem.id);
      setFormData({
        title: sectionItem.title || '',
        titleEn: sectionItem.titleEn || '',
        type: sectionItem.type || 'custom',
        content: sectionItem.content || '',
        contentEn: sectionItem.contentEn || '',
        image: sectionItem.image || '',
        order: sectionItem.order || 1,
        isActive: sectionItem.isActive !== false,
      });
      // Parse items
      let parsedItems = [];
      try {
        parsedItems = typeof sectionItem.items === 'string' ? JSON.parse(sectionItem.items) : (sectionItem.items || []);
      } catch(e) { parsedItems = []; }
      setSectionItems(parsedItems);
    } else {
      setEditId(null);
      setFormData({
        title: '',
        titleEn: '',
        type: 'custom',
        content: '',
        contentEn: '',
        image: '',
        order: (homepageSections?.length || 0) + 1,
        isActive: true,
      });
      setSectionItems([]);
    }
    setIsEditingSection(true);
  };

  const handleDeleteSection = async (id: string) => {
    if (!pb) return;
    if (confirm('Jeste li sigurni da želite obrisati ovu sekciju?')) {
      try {
        await pb.collection('homepage_sections').delete(id);
        window.location.reload();
      } catch (error) {
        console.error('Section delete error:', error);
      }
    }
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
        image: getFirstPhoto(parkItem),
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

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pb) return;
    try {
      const data: any = {
        title: formData.title,
        titleEn: formData.titleEn,
        type: formData.type,
        content: formData.content,
        contentEn: formData.contentEn,
        image: formData.image,
        order: parseInt(formData.order),
        isActive: formData.isActive,
        items: JSON.stringify(sectionItems),
      };
      if (editId) {
        await pb.collection('homepage_sections').update(editId, data);
      } else {
        await pb.collection('homepage_sections').create(data);
      }
      setIsEditingSection(false);
      window.location.reload();
    } catch(err) {
      console.error(err);
      alert('Greška pri spremanju sekcije!');
    }
  };

  const handleSaveSeo = async () => {
    if (!pb) return;
    setSeoSaving(true);
    try {
      if (homepageSeo) {
        await pb.collection('homepage_seo').update(homepageSeo.id, seoForm);
      } else {
        await pb.collection('homepage_seo').create(seoForm);
      }
      alert('SEO postavke spremljene!');
    } catch(err) {
      console.error(err);
      alert('Greška pri spremanju SEO!');
    }
    setSeoSaving(false);
  };

  const addSectionItem = (slug: string) => {
    if (sectionItems.find(i => i.slug === slug)) return;
    setSectionItems([...sectionItems, { slug, image: '', description: '', descriptionEn: '' }]);
  };

  const removeSectionItem = (slug: string) => {
    setSectionItems(sectionItems.filter(i => i.slug !== slug));
  };

  const moveSectionItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...sectionItems];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newItems.length) return;
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    setSectionItems(newItems);
  };

  const updateSectionItem = (index: number, field: string, value: string) => {
    const newItems = [...sectionItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setSectionItems(newItems);
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
          seoTitle: formData.seoTitle,
          seoDescription: formData.seoDescription,
          seoKeywords: formData.seoKeywords,
          seoTitleEn: formData.seoTitleEn,
          seoDescriptionEn: formData.seoDescriptionEn,
          seoKeywordsEn: formData.seoKeywordsEn,
          wikiSections: formData.wikiSections,
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
          mayor: formData.mayor,
          officialWeb: formData.officialWeb,
          areaCode: formData.areaCode,
          region: formData.region,
          image: formData.image,
          lat: formData.lat,
          lng: formData.lng,
          seoTitle: formData.seoTitle,
          seoDescription: formData.seoDescription,
          seoKeywords: formData.seoKeywords,
          seoTitleEn: formData.seoTitleEn,
          seoDescriptionEn: formData.seoDescriptionEn,
          seoKeywordsEn: formData.seoKeywordsEn,
          wikiSections: formData.wikiSections,
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

                {/* SECTIONS EDIT MODAL */}
        {isEditingSection && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden bg-white max-h-[90vh] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between p-8 border-b bg-secondary/5">
                <div>
                  <CardTitle className="text-2xl uppercase font-black">
                    {editId ? 'Uredi' : 'Dodaj novu'} Sekciju Naslovnice
                  </CardTitle>
                  <CardDescription>Uredite sadržaj, fotografije i raspored sekcije na početnoj stranici.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsEditingSection(false)} className="rounded-full size-12 hover:bg-black/5">
                  <X className="size-6" />
                </Button>
              </CardHeader>
              <CardContent className="p-8 overflow-y-auto flex-1 text-left">
                <form onSubmit={handleSaveSection} className="space-y-6">
                  {/* BILINGUAL TITLES */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">🇭🇷 Naslov Sekcije (HR)</label>
                      <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="npr. Istražite gradove" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-blue-500 uppercase">🇬🇧 Section Title (EN)</label>
                      <Input value={formData.titleEn} onChange={e => setFormData({...formData, titleEn: e.target.value})} placeholder="e.g. Explore Cities" />
                    </div>
                  </div>

                  {/* TYPE + ORDER + ACTIVE */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Tip Sadržaja</label>
                      <select className="w-full h-10 px-3 rounded-lg border bg-white font-medium text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                        <option value="custom">Tekst i Slike</option>
                        <option value="cities">Grid Gradova</option>
                        <option value="islands">Grid Otoka</option>
                        <option value="premium">Premium Kategorije</option>
                        <option value="popular_listings">Popularne Lokacije</option>
                        <option value="public_listings">Znamenitosti</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Redoslijed</label>
                      <Input type="number" value={formData.order} onChange={e => setFormData({...formData, order: e.target.value})} required />
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="size-5" />
                        <span className="font-bold text-sm">Aktivno</span>
                      </label>
                    </div>
                  </div>

                  {/* BILINGUAL DESCRIPTION */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">🇭🇷 Opis (Hrvatski)</p>
                    <RichTextEditor value={formData.content} onChange={(html) => setFormData({...formData, content: html})} placeholder="Upišite opis sekcije..." />
                  </div>
                  <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 space-y-4">
                    <p className="text-xs font-black text-blue-400 uppercase tracking-widest">🇬🇧 Description (English)</p>
                    <RichTextEditor value={formData.contentEn} onChange={(html) => setFormData({...formData, contentEn: html})} placeholder="Enter section description..." />
                  </div>

                  {/* SECTION IMAGE (for custom type) */}
                  {formData.type === 'custom' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Glavna Slika</label>
                      <div className="flex flex-col gap-3">
                        <Input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="URL Slike" />
                        <ImageUpload defaultImage={formData.image} onUploadComplete={(url) => setFormData((prev: any) => ({...prev, image: url}))} />
                      </div>
                    </div>
                  )}

                  {/* ITEMS PICKER — for cities / islands */}
                  {(formData.type === 'cities' || formData.type === 'islands') && (
                    <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-200/50 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-black text-amber-700 uppercase tracking-widest">
                          {formData.type === 'cities' ? '🏙️ Gradovi na naslovnici' : '🏝️ Otoci na naslovnici'}
                        </p>
                        <div className="flex items-center gap-2">
                          <select
                            id="itemPicker"
                            className="h-9 px-3 rounded-lg border bg-white text-sm font-medium"
                            defaultValue=""
                            onChange={e => { if (e.target.value) { addSectionItem(e.target.value); e.target.value = ''; } }}
                          >
                            <option value="" disabled>+ Dodaj...</option>
                            {(formData.type === 'cities' ? (cities || []) : (islands || []))
                              .filter(item => !sectionItems.find(si => si.slug === item.slug))
                              .map(item => (
                                <option key={item.slug} value={item.slug}>{item.name}</option>
                              ))
                            }
                          </select>
                        </div>
                      </div>

                      {sectionItems.length === 0 && (
                        <p className="text-sm text-amber-600 italic">Nema odabranih stavki. Dodajte ih iz padajućeg izbornika iznad.</p>
                      )}

                      <div className="space-y-3">
                        {sectionItems.map((item, idx) => {
                          const sourceList = formData.type === 'cities' ? (cities || []) : (islands || []);
                          const dbItem = sourceList.find(c => c.slug === item.slug);
                          const displayName = dbItem?.name || item.slug;
                          const defaultImage = dbItem?.image || getFirstPhoto(dbItem, 'image') || '';
                          return (
                            <div key={item.slug} className="bg-white rounded-xl border p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-lg font-black text-slate-300">{idx + 1}</span>
                                  {(item.image || defaultImage) && <img src={item.image || defaultImage} alt="" className="size-10 rounded-lg object-cover" />}
                                  <div>
                                    <p className="font-black text-base">{displayName}</p>
                                    <p className="text-[10px] text-slate-400 uppercase">{dbItem?.region || ''}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => moveSectionItem(idx, 'up')} disabled={idx === 0}>
                                    <ChevronUp className="size-4" />
                                  </Button>
                                  <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => moveSectionItem(idx, 'down')} disabled={idx === sectionItems.length - 1}>
                                    <ChevronDown className="size-4" />
                                  </Button>
                                  <Button type="button" variant="ghost" size="icon" className="size-8 text-red-500" onClick={() => removeSectionItem(item.slug)}>
                                    <Trash2 className="size-4" />
                                  </Button>
                                </div>
                              </div>
                              {/* Custom image override */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Posebna fotografija (prazno = koristi zadanu)</label>
                                <div className="flex gap-2">
                                  <Input className="flex-1 h-8 text-sm" value={item.image} onChange={e => updateSectionItem(idx, 'image', e.target.value)} placeholder={defaultImage ? 'Koristi zadanu fotografiju' : 'URL slike'} />
                                  <ImageUpload defaultImage={item.image} onUploadComplete={(url) => updateSectionItem(idx, 'image', url)} />
                                </div>
                              </div>
                              {/* Bilingual short description */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase">🇭🇷 Kratki opis</label>
                                  <Input className="h-8 text-sm" value={item.description} onChange={e => updateSectionItem(idx, 'description', e.target.value)} placeholder="Opis na naslovnici..." />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-blue-400 uppercase">🇬🇧 Short desc</label>
                                  <Input className="h-8 text-sm" value={item.descriptionEn} onChange={e => updateSectionItem(idx, 'descriptionEn', e.target.value)} placeholder="Homepage description..." />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button type="button" variant="ghost" onClick={() => setIsEditingSection(false)}>Odustani</Button>
                    <Button type="submit" className="bg-primary text-white font-bold h-10 px-8 rounded-xl shadow-lg">Spremi Sekciju</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

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
                    <RichTextEditor 
                      value={formData.description} 
                      onChange={(html) => setFormData({...formData, description: html})} 
                      placeholder="Opis na hrvatskom..." 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Opis (Engleski / English Description)</label>
                    <RichTextEditor 
                      value={formData.descriptionEn} 
                      onChange={(html) => setFormData({...formData, descriptionEn: html})} 
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
                          onUploadComplete={(url) => setFormData((prev: any) => ({...prev, image: url}))} 
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

                  {/* SEO METADATA SECTION — HR */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-black/5 space-y-4">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">🇭🇷 SEO — Hrvatski</p>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">SEO Naslov (HR)</label>
                        <Input 
                          value={formData.seoTitle} 
                          onChange={e => setFormData({...formData, seoTitle: e.target.value})} 
                          placeholder="npr. Split - Turistički vodič | CroatiaBest" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">SEO Opis (HR)</label>
                        <Textarea 
                          rows={2} 
                          value={formData.seoDescription} 
                          onChange={e => setFormData({...formData, seoDescription: e.target.value})} 
                          placeholder="Maksimalno 160 znakova" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Ključne riječi (HR)</label>
                        <Input 
                          value={formData.seoKeywords} 
                          onChange={e => setFormData({...formData, seoKeywords: e.target.value})} 
                          placeholder="npr. split, dalmacija, plaže, restorani" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* SEO METADATA SECTION — EN */}
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-4">
                    <p className="text-xs font-black text-blue-400 uppercase tracking-widest">🇬🇧 SEO — English</p>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-blue-500 uppercase">SEO Title (EN)</label>
                        <Input 
                          value={formData.seoTitleEn} 
                          onChange={e => setFormData({...formData, seoTitleEn: e.target.value})} 
                          placeholder="e.g. Split - Tourist Guide | CroatiaBest" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-blue-500 uppercase">SEO Description (EN)</label>
                        <Textarea 
                          rows={2} 
                          value={formData.seoDescriptionEn} 
                          onChange={e => setFormData({...formData, seoDescriptionEn: e.target.value})} 
                          placeholder="Max 160 characters" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-blue-500 uppercase">Keywords (EN)</label>
                        <Input 
                          value={formData.seoKeywordsEn} 
                          onChange={e => setFormData({...formData, seoKeywordsEn: e.target.value})} 
                          placeholder="e.g. split, dalmatia, beaches, restaurants" 
                        />
                      </div>
                    </div>
                  </div>

                  
                  {editType === 'section' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Naslov sekcije</label>
                          <Input 
                            value={formData.title} 
                            onChange={e => setFormData({...formData, title: e.target.value})} 
                            placeholder="npr. Istražite gradove" 
                            required 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Vrsta (Template)</label>
                          <select 
                            className="w-full h-10 px-3 rounded-lg border bg-white font-medium text-sm"
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value})}
                          >
                            <option value="custom">Custom HTML / Slike i Tekst</option>
                            <option value="cities">Gradovi (Grid)</option>
                            <option value="islands">Otoci (Grid)</option>
                            <option value="premium">Premium Lokacije</option>
                            <option value="popular_listings">Popularne Lokacije</option>
                            <option value="public_listings">Znamenitosti / Javne</option>
                            <option value="monuments">Spomenici i Povijest</option>
                            <option value="history_articles">Članci: Povijest</option>
                            <option value="war_articles">Članci: Domovinski Rat</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Redoslijed (Order)</label>
                          <Input 
                            type="number"
                            value={formData.order} 
                            onChange={e => setFormData({...formData, order: e.target.value})} 
                            required 
                          />
                        </div>
                        <div className="space-y-1 flex flex-col justify-end">
                          <label className="flex items-center gap-2 cursor-pointer p-2 border rounded-lg bg-slate-50">
                            <input 
                              type="checkbox" 
                              checked={formData.isActive} 
                              onChange={e => setFormData({...formData, isActive: e.target.checked})}
                              className="w-5 h-5 accent-primary"
                            />
                            <span className="font-bold text-sm">Prikaži na naslovnici (Aktivno)</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Fotografija (Opcionalno)</label>
                        <div className="flex flex-col gap-3">
                          <Input 
                            value={formData.image} 
                            onChange={e => setFormData({...formData, image: e.target.value})} 
                            placeholder="URL slike..." 
                          />
                          <ImageUpload 
                            defaultImage={formData.image}
                            onUploadComplete={(url) => setFormData((prev: any) => ({...prev, image: url}))} 
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Opis / Sadržaj (Podržava poveznice, stilove)</label>
                        <RichTextEditor 
                          value={formData.content} 
                          onChange={(html) => setFormData({...formData, content: html})} 
                          placeholder="Upiši tekst sekcije..." 
                        />
                      </div>
                    </div>
                  )}
{/* WIKI SECTIONS EDITOR (Only for City and Island) */}
                  {(editType === 'city' || editType === 'island') && (
                    <WikiSectionsEditor 
                      sections={formData.wikiSections}
                      onChange={(sections) => setFormData({...formData, wikiSections: sections})}
                    />
                  )}

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
            { id: 'parks', name: 'Nacionalni parkovi', icon: <Trees className="size-4" /> },
            { id: 'sections', name: 'Naslovnica', icon: <LayoutTemplate className="size-4" /> }
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
                              {getFirstPhoto(listing) ? (
                                <div className="relative size-16 rounded-2xl overflow-hidden shadow-inner border border-black/5 flex-shrink-0">
                                  <img src={getFirstPhoto(listing)} alt={name} className="absolute inset-0 w-full h-full object-cover" />
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
                          <Link href={`/blog/${blog.slug || blog.id}`}>
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
                      const image = getFirstPhoto(park);
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

        {/* TAB: SECTIONS */}
        {activeTab === 'sections' && (
          <div className="space-y-8">
            {/* HOMEPAGE SEO */}
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="flex flex-row items-center justify-between border-b p-8 bg-emerald-50/50">
                <div>
                  <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2"><Globe className="size-5" /> SEO Naslovnice</CardTitle>
                  <CardDescription>Generalne meta oznake za početnu stranicu (dvojezično).</CardDescription>
                </div>
                <Button onClick={handleSaveSeo} disabled={seoSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold px-6 h-10">
                  {seoSaving ? <Loader2 className="animate-spin size-4 mr-2" /> : null} Spremi SEO
                </Button>
              </CardHeader>
              <CardContent className="p-8 space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">🇭🇷 SEO Naslov</label>
                    <Input value={seoForm.seoTitle || ''} onChange={e => setSeoForm({...seoForm, seoTitle: e.target.value})} placeholder="CroatiaBest - Vodič kroz Hrvatsku" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-blue-400 uppercase">🇬🇧 SEO Title</label>
                    <Input value={seoForm.seoTitleEn || ''} onChange={e => setSeoForm({...seoForm, seoTitleEn: e.target.value})} placeholder="CroatiaBest - Guide to Croatia" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">🇭🇷 Meta Opis</label>
                    <Textarea rows={2} value={seoForm.seoDescription || ''} onChange={e => setSeoForm({...seoForm, seoDescription: e.target.value})} placeholder="Opis stranice do 160 znakova" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-blue-400 uppercase">🇬🇧 Meta Description</label>
                    <Textarea rows={2} value={seoForm.seoDescriptionEn || ''} onChange={e => setSeoForm({...seoForm, seoDescriptionEn: e.target.value})} placeholder="Page description up to 160 chars" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">🇭🇷 Ključne Riječi</label>
                    <Input value={seoForm.seoKeywords || ''} onChange={e => setSeoForm({...seoForm, seoKeywords: e.target.value})} placeholder="Hrvatska, turizam, gradovi" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-blue-400 uppercase">🇬🇧 Keywords</label>
                    <Input value={seoForm.seoKeywordsEn || ''} onChange={e => setSeoForm({...seoForm, seoKeywordsEn: e.target.value})} placeholder="Croatia, tourism, cities" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SECTIONS LIST */}
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="flex flex-row items-center justify-between border-b p-8 bg-secondary/5">
                <div>
                  <CardTitle className="text-2xl font-black uppercase tracking-tight">Sekcije Naslovnice</CardTitle>
                  <CardDescription>Upravljanje dinamičkim blokovima na početnoj stranici.</CardDescription>
                </div>
                <Button onClick={() => startEditSection()} className="bg-primary hover:bg-primary/90 text-white rounded-full font-bold px-6 h-12 shadow-lg hover:shadow-xl transition-all">
                  <PlusCircle className="mr-2 size-5" /> Nova Sekcija
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {sectionsLoading ? (
                  <div className="p-24 flex justify-center"><Loader2 className="animate-spin size-8 text-primary" /></div>
                ) : (
                  <div className="divide-y divide-black/5 text-left">
                    {!homepageSections || homepageSections.length === 0 ? (
                      <div className="p-16 text-center text-slate-400 font-medium">Nema dodanih sekcija.</div>
                    ) : (
                      homepageSections.map((sec: any) => {
                        const itemCount = (() => { try { const items = typeof sec.items === 'string' ? JSON.parse(sec.items) : (sec.items || []); return items.length; } catch { return 0; } })();
                        return (
                          <div key={sec.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="size-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-xl text-slate-400">{sec.order}</div>
                              <div>
                                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                  {sec.title}
                                  {sec.titleEn && <span className="text-xs text-blue-400 font-medium">/ {sec.titleEn}</span>}
                                  {!sec.isActive && <Badge variant="outline" className="text-xs">Neaktivno</Badge>}
                                </h3>
                                <div className="text-sm text-slate-500 mt-1 flex items-center gap-3">
                                  <span>Tip: <strong className="uppercase text-[10px] bg-slate-100 px-2 py-0.5 rounded-full">{sec.type}</strong></span>
                                  {itemCount > 0 && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">{itemCount} stavki</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                              <Button variant="outline" size="sm" onClick={() => startEditSection(sec)} className="flex-1 md:flex-none">
                                <Edit2 className="size-4 mr-2" /> Uredi
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteSection(sec.id)} className="flex-1 md:flex-none">
                                <Trash2 className="size-4 mr-2" /> Obriši
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
          </div>
        )}

      </main>
    </div>
  );
}
