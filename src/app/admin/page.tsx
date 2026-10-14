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
  ArrowLeft,
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
  X,
  ExternalLink,
  LogOut,
  Image as ImageIcon,
  Search,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';
import { WikiSectionsEditor } from '@/components/ui/WikiSectionsEditor';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { CATEGORIES } from '@/app/lib/constants';
import { generateListingUrl } from '@/app/lib/utils/slug';
import { NewsBotManager } from '@/components/admin/NewsBotManager';
import { MediaManager } from '@/components/media/MediaManager';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, useCollection, usePB } from '@/pocketbase';
import { getFirstPhoto } from '@/app/lib/image-helpers';

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const pb = usePB();
  const router = useRouter();

  // Helper: parse wikiSections that may come as JSON string from PocketBase
  const parseWikiSections = (raw: any): any[] => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') {
      try { return JSON.parse(raw); } catch { return []; }
    }
    return [];
  };

  // Logout handler
  const handleLogout = () => {
    if (!pb) return;
    pb.authStore.clear();
    router.push('/');
  };
  
  // Stroga provjera administratora - isključivo maro.webdeveloper@gmail.com
  const isAdmin = user?.email === 'maro.webdeveloper@gmail.com';

  const { data: listings, isLoading: listingsLoading } = useCollection('listings', {
    sort: '-created',
  });

  const { data: blogs, isLoading: blogsLoading } = useCollection('blogs', { sort: '-publishDate' });

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

  // Tab State: "listings" | "blogs" | "cities" | "islands" | "parks" | "sections" | "bot" | "media"
  const [activeTab, setActiveTab] = useState<'listings' | 'blogs' | 'cities' | 'islands' | 'parks' | 'sections' | 'bot' | 'media'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab && ['listings', 'blogs', 'cities', 'islands', 'parks', 'sections', 'bot', 'media'].includes(tab)) {
        return tab as any;
      }
    }
    return 'listings';
  });

  // Sync tab with URL on mount & browser navigation (popstate)
  useEffect(() => {
    const updateFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab && ['listings', 'blogs', 'cities', 'islands', 'parks', 'sections', 'bot', 'media'].includes(tab)) {
        setActiveTab(tab as any);
      }
    };
    updateFromUrl();
    window.addEventListener('popstate', updateFromUrl);
    return () => window.removeEventListener('popstate', updateFromUrl);
  }, []);

  const switchTab = (tabId: string) => {
    setActiveTab(tabId as any);
    setIsEditing(false);
    setIsEditingSection(false);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    window.history.replaceState({}, '', url.toString());
  };

  const refreshTab = (tabId?: string) => {
    const target = tabId || activeTab;
    window.location.href = `/admin?tab=${target}`;
  };

  // Search and Pagination States
  const [searchListings, setSearchListings] = useState('');
  const [statusFilterListings, setStatusFilterListings] = useState<'all' | 'pending' | 'active' | 'rejected'>('all');
  const [pageListings, setPageListings] = useState(1);

  const [searchCities, setSearchCities] = useState('');
  const [pageCities, setPageCities] = useState(1);

  const [searchIslands, setSearchIslands] = useState('');
  const [pageIslands, setPageIslands] = useState(1);

  const [searchParks, setSearchParks] = useState('');
  const [pageParks, setPageParks] = useState(1);

  const [searchBlogs, setSearchBlogs] = useState('');
  const [pageBlogs, setPageBlogs] = useState(1);

  const ITEMS_PER_PAGE = 10;

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

  // Auto-scroll to top when editor opens so it never jumps to the bottom
  useEffect(() => {
    if (isEditing || isEditingSection) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isEditing, isEditingSection]);

  const handleApprove = async (id: string) => {
    if (!pb) return;
    try {
      await pb.collection('listings').update(id, { status: 'active' });
      refreshTab('listings');
    } catch (error) {
      console.error('Approve error:', error);
    }
  };

  const handleReject = async (id: string) => {
    if (!pb) return;
    try {
      await pb.collection('listings').update(id, { status: 'rejected' });
      refreshTab('listings');
    } catch (error) {
      console.error('Reject error:', error);
    }
  };

  const handleReset = async (id: string) => {
    if (!pb) return;
    try {
      await pb.collection('listings').update(id, { status: 'pending' });
      refreshTab('listings');
    } catch (error) {
      console.error('Reset error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!pb) return;
    if (confirm('Jeste li sigurni da želite obrisati ovaj objekt?')) {
      try {
        await pb.collection('listings').delete(id);
        refreshTab('listings');
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
        refreshTab('blogs');
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
        refreshTab('cities');
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
        refreshTab('islands');
      } catch (error) {
        console.error('Island delete error:', error);
      }
    }
  };

  // Edit action triggers
  const startEditCity = (cityItem?: any) => {
    switchTab('cities');
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
        seoTitle: cityItem.seoTitle || cityItem.seo_title || cityItem.metadata?.seoTitle || '',
        seoDescription: cityItem.seoDescription || cityItem.seo_description || cityItem.metadata?.seoDescription || '',
        seoKeywords: cityItem.seoKeywords || cityItem.seo_keywords || cityItem.metadata?.seoKeywords || '',
        seoTitleEn: cityItem.seoTitleEn || cityItem.seo_title_en || cityItem.metadata?.seoTitleEn || '',
        seoDescriptionEn: cityItem.seoDescriptionEn || cityItem.seo_description_en || cityItem.metadata?.seoDescriptionEn || '',
        seoKeywordsEn: cityItem.seoKeywordsEn || cityItem.seo_keywords_en || cityItem.metadata?.seoKeywordsEn || '',
        wikiSections: parseWikiSections(cityItem.wikiSections),
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
        wikiSections: [],
      });
    }
    setIsEditing(true);
  };

  const startEditIsland = (islandItem?: any) => {
    switchTab('islands');
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
        seoTitle: islandItem.seoTitle || islandItem.seo_title || islandItem.metadata?.seoTitle || '',
        seoDescription: islandItem.seoDescription || islandItem.seo_description || islandItem.metadata?.seoDescription || '',
        seoKeywords: islandItem.seoKeywords || islandItem.seo_keywords || islandItem.metadata?.seoKeywords || '',
        seoTitleEn: islandItem.seoTitleEn || islandItem.seo_title_en || islandItem.metadata?.seoTitleEn || '',
        seoDescriptionEn: islandItem.seoDescriptionEn || islandItem.seo_description_en || islandItem.metadata?.seoDescriptionEn || '',
        seoKeywordsEn: islandItem.seoKeywordsEn || islandItem.seo_keywords_en || islandItem.metadata?.seoKeywordsEn || '',
        wikiSections: parseWikiSections(islandItem.wikiSections),
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
        lat: 43.17,
        lng: 16.44,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
        seoTitleEn: '',
        seoDescriptionEn: '',
        seoKeywordsEn: '',
        wikiSections: [],
      });
    }
    setIsEditing(true);
  };


  const startEditSection = (sectionItem?: any) => {
    switchTab('sections');
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
        refreshTab('sections');
      } catch (error) {
        console.error('Section delete error:', error);
      }
    }
  };

  const startEditPark = (parkItem?: any) => {
    switchTab('parks');
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
      refreshTab('sections');
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
          seo_title: formData.seoTitle,
          seo_description: formData.seoDescription,
          seo_keywords: formData.seoKeywords,
          seo_title_en: formData.seoTitleEn,
          seo_description_en: formData.seoDescriptionEn,
          seo_keywords_en: formData.seoKeywordsEn,
          metadata: {
            seoTitle: formData.seoTitle,
            seoDescription: formData.seoDescription,
            seoKeywords: formData.seoKeywords,
            seoTitleEn: formData.seoTitleEn,
            seoDescriptionEn: formData.seoDescriptionEn,
            seoKeywordsEn: formData.seoKeywordsEn,
          },
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
          seo_title: formData.seoTitle,
          seo_description: formData.seoDescription,
          seo_keywords: formData.seoKeywords,
          seo_title_en: formData.seoTitleEn,
          seo_description_en: formData.seoDescriptionEn,
          seo_keywords_en: formData.seoKeywordsEn,
          metadata: {
            seoTitle: formData.seoTitle,
            seoDescription: formData.seoDescription,
            seoKeywords: formData.seoKeywords,
            seoTitleEn: formData.seoTitleEn,
            seoDescriptionEn: formData.seoDescriptionEn,
            seoKeywordsEn: formData.seoKeywordsEn,
          },
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
      refreshTab(activeTab);
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

  // Calculate total revenue from paid listings
  const totalRevenue = listings?.reduce((sum, listing) => {
    if (listing.paymentStatus === 'paid') {
      const categoryId = listing.locationCategoryId || listing.categoryId;
      const cat = CATEGORIES.find(c => c.id === categoryId);
      const priceNum = cat?.price ? parseInt(cat.price.replace(/[^0-9]/g, '')) || 99 : 99;
      return sum + priceNum;
    }
    return sum;
  }, 0) || 0;

  // Filtered & Paginated: Listings
  const filteredListings = (listings || [])
    .filter(l => (l.locationCategoryId || l.categoryId) !== 'national_parks')
    .filter(l => {
      if (statusFilterListings === 'pending') return l.status === 'pending';
      if (statusFilterListings === 'active') return l.status === 'active' || l.status === 'approved';
      if (statusFilterListings === 'rejected') return l.status === 'rejected';
      return true;
    })
    .filter(l => {
      if (!searchListings.trim()) return true;
      const q = searchListings.toLowerCase();
      const name = (l.name || l.objectName || '').toLowerCase();
      const city = (l.city || '').toLowerCase();
      const cat = (CATEGORIES.find(c => c.id === (l.locationCategoryId || l.categoryId))?.name || '').toLowerCase();
      return name.includes(q) || city.includes(q) || cat.includes(q);
    });
  const totalPagesListings = Math.ceil(filteredListings.length / ITEMS_PER_PAGE) || 1;
  const paginatedListings = filteredListings.slice((pageListings - 1) * ITEMS_PER_PAGE, pageListings * ITEMS_PER_PAGE);

  // Filtered & Paginated: Cities
  const filteredCities = (cities || []).filter(c => {
    if (!searchCities.trim()) return true;
    const q = searchCities.toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(q) ||
      (c.slug || '').toLowerCase().includes(q) ||
      (c.region || '').toLowerCase().includes(q) ||
      (c.areaCode || '').toLowerCase().includes(q)
    );
  });
  const totalPagesCities = Math.ceil(filteredCities.length / ITEMS_PER_PAGE) || 1;
  const paginatedCities = filteredCities.slice((pageCities - 1) * ITEMS_PER_PAGE, pageCities * ITEMS_PER_PAGE);

  // Filtered & Paginated: Islands
  const filteredIslands = (islands || []).filter(i => {
    if (!searchIslands.trim()) return true;
    const q = searchIslands.toLowerCase();
    return (
      (i.name || '').toLowerCase().includes(q) ||
      (i.slug || '').toLowerCase().includes(q) ||
      (i.region || '').toLowerCase().includes(q)
    );
  });
  const totalPagesIslands = Math.ceil(filteredIslands.length / ITEMS_PER_PAGE) || 1;
  const paginatedIslands = filteredIslands.slice((pageIslands - 1) * ITEMS_PER_PAGE, pageIslands * ITEMS_PER_PAGE);

  // Filtered & Paginated: Parks
  const filteredParks = nationalParks.filter(p => {
    if (!searchParks.trim()) return true;
    const q = searchParks.toLowerCase();
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.city || '').toLowerCase().includes(q) ||
      (p.region || '').toLowerCase().includes(q)
    );
  });
  const totalPagesParks = Math.ceil(filteredParks.length / ITEMS_PER_PAGE) || 1;
  const paginatedParks = filteredParks.slice((pageParks - 1) * ITEMS_PER_PAGE, pageParks * ITEMS_PER_PAGE);

  // Filtered & Paginated: Blogs
  const filteredBlogs = (blogs || []).filter(b => {
    if (!searchBlogs.trim()) return true;
    const q = searchBlogs.toLowerCase();
    return (
      (b.title || '').toLowerCase().includes(q) ||
      (b.category || '').toLowerCase().includes(q) ||
      (b.author || '').toLowerCase().includes(q)
    );
  });
  const totalPagesBlogs = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE) || 1;
  const paginatedBlogs = filteredBlogs.slice((pageBlogs - 1) * ITEMS_PER_PAGE, pageBlogs * ITEMS_PER_PAGE);

  // Helper: Search Bar
  const renderSearchBar = (
    placeholder: string,
    value: string,
    onChange: (val: string) => void,
    totalCount: number,
    filteredCount: number,
    extraControls?: React.ReactNode
  ) => (
    <div className="p-6 border-b bg-slate-50/50 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 pr-9 bg-white rounded-xl border-black/10 h-11 text-sm font-medium shadow-sm focus:border-primary"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            title="Očisti pretragu"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {extraControls}
        <div className="text-xs font-bold text-slate-500 bg-white px-3 py-2 rounded-xl border border-black/5 shadow-sm">
          Prikazano: <span className="text-primary font-black">{Math.min(filteredCount, ITEMS_PER_PAGE)}</span> od <span className="text-slate-900 font-black">{filteredCount}</span>
          {filteredCount !== totalCount && (
            <span className="text-slate-400 ml-1 font-normal">(ukupno {totalCount})</span>
          )}
        </div>
      </div>
    </div>
  );

  // Helper: Pagination
  const renderPagination = (currentPage: number, totalPages: number, setPage: React.Dispatch<React.SetStateAction<number>>) => {
    if (totalPages <= 1) return null;
    return (
      <div className="p-6 border-t bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground font-medium">
          Stranica <strong className="text-foreground">{currentPage}</strong> od <strong className="text-foreground">{totalPages}</strong>
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => {
              setPage(p => Math.max(1, p - 1));
            }}
            className="rounded-xl h-9 px-4 font-bold"
          >
            <ChevronLeft className="size-4 mr-1" /> Prethodna
          </Button>
          <span className="text-xs font-bold text-slate-400 px-2">
            {currentPage} / {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => {
              setPage(p => Math.min(totalPages, p + 1));
            }}
            className="rounded-xl h-9 px-4 font-bold"
          >
            Sljedeća <ChevronRight className="size-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  };

  const renderEntityEditor = () => (
    <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white mb-8">
      <CardHeader className="flex flex-row items-center justify-between border-b p-8 bg-secondary/5">
        <div className="flex items-center gap-4">
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            onClick={() => setIsEditing(false)} 
            className="rounded-xl size-10 border-black/10 bg-white hover:bg-black/5"
            title="Natrag na popis"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <CardTitle className="text-2xl uppercase font-black">
              {editId ? 'Uredi' : 'Dodaj novi'} {editType === 'city' ? 'Grad' : editType === 'island' ? 'Otok' : 'Nacionalni park'}
            </CardTitle>
            <CardDescription>Uredite sadržaj, geografske koordinate i SEO metapodatke.</CardDescription>
          </div>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setIsEditing(false)} 
          className="rounded-xl font-bold h-10 px-4"
        >
          Odustani
        </Button>
      </CardHeader>
      <CardContent className="p-8 space-y-6 text-left">
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
                  placeholder="npr. URL slike ili učitajte datoteku ispod" 
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

          {/* WIKI SECTIONS EDITOR (Only for City and Island) */}
          {(editType === 'city' || editType === 'island') && (
            <WikiSectionsEditor 
              sections={formData.wikiSections}
              onChange={(sections) => setFormData({...formData, wikiSections: sections})}
            />
          )}

          {/* STICKY FLOATING ACTION BAR */}
          <div className="sticky bottom-6 z-30 pt-4">
            <div className="bg-white/95 backdrop-blur-md border border-black/10 shadow-2xl rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(false)} 
                  className="text-slate-500 hover:text-slate-900 font-bold"
                >
                  <ArrowLeft className="size-4 mr-2" /> Odustani
                </Button>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {formData.name ? `Uređivanje: ${formData.name}` : `Novi ${editType === 'city' ? 'grad' : editType === 'island' ? 'otok' : 'park'}`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditing(false)} 
                  className="rounded-xl font-bold h-11 px-6"
                >
                  Odustani
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 text-white rounded-xl font-black h-11 px-8 shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  <Check className="size-4" /> Spremi promjene
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderSectionEditor = () => (
    <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white mb-8">
      <CardHeader className="flex flex-row items-center justify-between border-b p-8 bg-secondary/5">
        <div className="flex items-center gap-4">
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            onClick={() => setIsEditingSection(false)} 
            className="rounded-xl size-10 border-black/10 bg-white hover:bg-black/5"
            title="Natrag na popis"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <CardTitle className="text-2xl uppercase font-black">
              {editId ? 'Uredi' : 'Dodaj novu'} Sekciju Naslovnice
            </CardTitle>
            <CardDescription>Uredite sadržaj, fotografije i raspored sekcije na početnoj stranici.</CardDescription>
          </div>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setIsEditingSection(false)} 
          className="rounded-xl font-bold h-10 px-4"
        >
          Odustani
        </Button>
      </CardHeader>
      <CardContent className="p-8 text-left">
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

          {/* STICKY FLOATING ACTION BAR */}
          <div className="sticky bottom-6 z-30 pt-4">
            <div className="bg-white/95 backdrop-blur-md border border-black/10 shadow-2xl rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditingSection(false)} 
                  className="text-slate-500 hover:text-slate-900 font-bold"
                >
                  <ArrowLeft className="size-4 mr-2" /> Odustani
                </Button>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {formData.title ? `Sekcija: ${formData.title}` : 'Nova sekcija'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditingSection(false)} 
                  className="rounded-xl font-bold h-11 px-6"
                >
                  Odustani
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 text-white rounded-xl font-black h-11 px-8 shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  <Check className="size-4" /> Spremi Sekciju
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );

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
          
          {/* Logout Button */}
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="rounded-2xl h-14 px-8 font-black border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-sm"
          >
            <LogOut className="size-5 mr-2" /> Odjavi se
          </Button>
          
          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button 
              onClick={() => switchTab('islands')} 
              variant={activeTab === 'islands' ? 'default' : 'outline'}
              className="rounded-2xl h-12 px-5 font-bold border-emerald-500/30 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 shadow-sm flex items-center gap-2"
            >
              <Anchor className="size-4" /> Administracija Otoka ({islands?.length || 0})
            </Button>
            <Button 
              onClick={() => switchTab('cities')} 
              variant={activeTab === 'cities' ? 'default' : 'outline'}
              className="rounded-2xl h-12 px-5 font-bold border-blue-500/30 text-blue-700 bg-blue-50 hover:bg-blue-100 shadow-sm flex items-center gap-2"
            >
              <Building2 className="size-4" /> Administracija Gradova ({cities?.length || 0})
            </Button>
            <Link href="/admin/new-listing">
              <Button className="bg-foreground text-white hover:bg-foreground/90 rounded-2xl font-black h-12 px-5 shadow-sm">
                <PlusCircle className="size-4 mr-1.5" /> Dodaj Objekt
              </Button>
            </Link>
            <Link href="/admin/new-blog">
              <Button className="bg-primary text-white hover:bg-primary/90 rounded-2xl font-black h-12 px-5 shadow-sm">
                <PlusCircle className="size-4 mr-1.5" /> Dodaj Članak
              </Button>
            </Link>
            <Button onClick={() => startEditCity()} className="bg-blue-600 text-white hover:bg-blue-700 rounded-2xl font-black h-12 px-5 shadow-sm">
              <PlusCircle className="size-4 mr-1.5" /> Novi Grad
            </Button>
            <Button onClick={() => startEditIsland()} className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-2xl font-black h-12 px-5 shadow-sm">
              <PlusCircle className="size-4 mr-1.5" /> Novi Otok
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="rounded-2xl h-12 px-5 font-black border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-sm ml-auto"
            >
              <LogOut className="size-4 mr-1.5" /> Odjavi se
            </Button>
          </div>
        </div>

        {/* PRIMARY NAVIGATION TABS (STICKY & PROMINENT) */}
        <div className="sticky top-20 z-20 bg-background/95 backdrop-blur-md pt-2 pb-4 border-b border-black/10 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'listings', name: 'Objekti / Prijave', icon: <CreditCard className="size-4" />, count: listings?.length },
              { id: 'islands', name: 'Otoci', icon: <Anchor className="size-4" />, count: islands?.length },
              { id: 'cities', name: 'Gradovi', icon: <Building2 className="size-4" />, count: cities?.length },
              { id: 'parks', name: 'Nacionalni parkovi', icon: <Trees className="size-4" />, count: nationalParks.length },
              { id: 'blogs', name: 'Magazin (Blog)', icon: <BookOpen className="size-4" />, count: blogs?.length },
              { id: 'media', name: 'Medijska zbirka', icon: <ImageIcon className="size-4 text-primary" /> },
              { id: 'sections', name: 'Naslovnica', icon: <LayoutTemplate className="size-4" /> },
              { id: 'bot', name: 'Vijesti Bot', icon: <Sparkles className="size-4 text-amber-500" /> },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => switchTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap shadow-sm ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-primary/25 shadow-lg scale-[1.02]'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-black/5'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
                {typeof tab.count === 'number' && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    activeTab === tab.id ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-8 mb-10">
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Statistika Objekata (Kliknite za pregled)</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card 
                onClick={() => { switchTab('listings'); setStatusFilterListings('pending'); }}
                className="border-none shadow-xl rounded-3xl bg-orange-50/50 hover:bg-orange-50/80 cursor-pointer hover:scale-[1.02] hover:shadow-2xl transition-all group"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">U obradi</p>
                    <span className="text-[10px] font-bold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">Pregledaj →</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-5xl font-black text-orange-700">{listings?.filter(l => l.status === 'pending').length || 0}</p>
                    <Clock className="size-10 text-orange-600 opacity-20 group-hover:opacity-40 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
              <Card 
                onClick={() => { switchTab('listings'); setStatusFilterListings('active'); }}
                className="border-none shadow-xl rounded-3xl bg-blue-50/50 hover:bg-blue-50/80 cursor-pointer hover:scale-[1.02] hover:shadow-2xl transition-all group"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Aktivno</p>
                    <span className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">Pregledaj →</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-5xl font-black text-blue-700">{listings?.filter(l => (l.status === 'active' || l.status === 'approved') && (l.locationCategoryId || l.categoryId) !== 'national_parks').length || 0}</p>
                    <MapPin className="size-10 text-blue-600 opacity-20 group-hover:opacity-40 transition-opacity" />
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
              <Card 
                onClick={() => { switchTab('listings'); setStatusFilterListings('all'); }}
                className="border-none shadow-xl rounded-3xl bg-primary/5 hover:bg-primary/10 cursor-pointer hover:scale-[1.02] hover:shadow-2xl transition-all group"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Premium</p>
                    <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">Pregledaj →</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-5xl font-black text-primary">{listings?.filter(l => l.locationCategoryType === 'Paid' || l.locationCategoryType === 'paid').length || 0}</p>
                    <CreditCard className="size-10 text-primary opacity-20 group-hover:opacity-40 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Statistika Lokacija i Atrakcija (Kliknite za upravljanje)</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card 
                onClick={() => switchTab('islands')}
                className={`border-2 shadow-xl rounded-3xl cursor-pointer hover:scale-[1.02] hover:shadow-2xl transition-all group ${
                  activeTab === 'islands' ? 'border-emerald-500 bg-emerald-50/80 shadow-emerald-500/10' : 'border-transparent bg-emerald-50/40 hover:bg-emerald-50/70'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1.5">
                      <Anchor className="size-3 text-emerald-600" /> Otoci
                    </p>
                    <span className="text-[10px] font-bold text-emerald-700 group-hover:underline">Upravljaj otocima →</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-5xl font-black text-emerald-800">{islands?.length || 0}</p>
                    <Anchor className="size-10 text-emerald-700 opacity-20 group-hover:opacity-40 transition-opacity" />
                  </div>
                </CardContent>
              </Card>

              <Card 
                onClick={() => switchTab('cities')}
                className={`border-2 shadow-xl rounded-3xl cursor-pointer hover:scale-[1.02] hover:shadow-2xl transition-all group ${
                  activeTab === 'cities' ? 'border-blue-500 bg-blue-50/80 shadow-blue-500/10' : 'border-transparent bg-blue-50/40 hover:bg-blue-50/70'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest flex items-center gap-1.5">
                      <Building2 className="size-3 text-blue-600" /> Gradovi
                    </p>
                    <span className="text-[10px] font-bold text-blue-700 group-hover:underline">Upravljaj gradovima →</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-5xl font-black text-blue-800">{cities?.length || 0}</p>
                    <Building2 className="size-10 text-blue-700 opacity-20 group-hover:opacity-40 transition-opacity" />
                  </div>
                </CardContent>
              </Card>

              <Card 
                onClick={() => switchTab('parks')}
                className={`border-2 shadow-xl rounded-3xl cursor-pointer hover:scale-[1.02] hover:shadow-2xl transition-all group ${
                  activeTab === 'parks' ? 'border-red-500 bg-red-50/80 shadow-red-500/10' : 'border-transparent bg-red-50/40 hover:bg-red-50/70'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-black text-red-700 uppercase tracking-widest flex items-center gap-1.5">
                      <Trees className="size-3 text-red-600" /> Nac. Parkovi
                    </p>
                    <span className="text-[10px] font-bold text-red-700 group-hover:underline">Upravljaj parkovima →</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-5xl font-black text-red-800">{nationalParks.length || 0}</p>
                    <Trees className="size-10 text-red-700 opacity-20 group-hover:opacity-40 transition-opacity" />
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
        </div>

        {/* TAB 1: LISTINGS */}
        {activeTab === 'listings' && (
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b p-8 bg-secondary/5">
              <div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight">Upravljanje Prijavama i Objektima</CardTitle>
                <CardDescription>Odobrite nove objekte, pretražujte bazu i provjerite status naplate.</CardDescription>
              </div>
              <Link href="/admin/new-listing">
                <Button className="bg-primary text-white rounded-xl font-bold h-10 px-4">
                  <PlusCircle className="size-4 mr-2" /> Dodaj Objekt
                </Button>
              </Link>
            </CardHeader>
            {renderSearchBar(
              'Pretraži objekte po nazivu, gradu ili kategoriji...',
              searchListings,
              (v) => { setSearchListings(v); setPageListings(1); },
              listings?.filter(l => (l.locationCategoryId || l.categoryId) !== 'national_parks').length || 0,
              filteredListings.length,
              (
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-black/5">
                  {(['all', 'pending', 'active', 'rejected'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => { setStatusFilterListings(st); setPageListings(1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        statusFilterListings === st
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {st === 'all' && 'Svi'}
                      {st === 'pending' && 'Na čekanju'}
                      {st === 'active' && 'Aktivni'}
                      {st === 'rejected' && 'Odbijeni'}
                    </button>
                  ))}
                </div>
              )
            )}
            <CardContent className="p-0">
              {listingsLoading ? (
                <div className="p-24 flex justify-center"><Loader2 className="animate-spin size-8 text-primary" /></div>
              ) : (
                <>
                  <div className="divide-y divide-black/5 text-left">
                    {paginatedListings.length === 0 ? (
                      <div className="p-24 text-center text-muted-foreground italic">
                        {searchListings ? 'Nema pronađenih objekata za traženi pojam.' : 'Nema prijava u sustavu.'}
                      </div>
                    ) : (
                      paginatedListings.map((listing) => {
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
                                <a 
                                  href={generateListingUrl(listing.locationCategoryId || listing.categoryId, listing.metadata?.slug || listing.name)} 
                                  target="_blank" 
                                  rel="noreferrer"
                                >
                                  <Button variant="outline" size="icon" title="Otvori javni SEO link" className="text-emerald-600 hover:bg-emerald-50 rounded-xl size-10 border-emerald-500/20 bg-emerald-500/5">
                                    <ExternalLink className="size-4" />
                                  </Button>
                                </a>
                                <Link href={`/admin/edit-listing/${listing.id}`}>
                                  <Button variant="outline" size="icon" title="Uredi objekt i SEO" className="text-blue-500 hover:bg-blue-50 rounded-xl size-10 border-blue-500/20 bg-blue-500/5" >                                  
                                    <Edit2 className="size-4" />
                                  </Button>
                                </Link>
                                <Button variant="outline" size="icon" title="Obriši" onClick={() => handleDelete(listing.id)} className="text-red-500 hover:bg-red-50 rounded-xl size-10 border-red-500/20 bg-red-500/5">
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  {renderPagination(pageListings, totalPagesListings, setPageListings)}
                </>
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
              <Link href="/admin/new-blog">
                <Button className="bg-primary text-white rounded-xl font-bold h-10 px-4">
                  <PlusCircle className="size-4 mr-2" /> Novi Članak
                </Button>
              </Link>
            </CardHeader>
            {renderSearchBar(
              'Pretraži članke po naslovu, kategoriji ili autoru...',
              searchBlogs,
              (v) => { setSearchBlogs(v); setPageBlogs(1); },
              blogs?.length || 0,
              filteredBlogs.length
            )}
            <CardContent className="p-0">
              {blogsLoading ? (
                <div className="p-24 flex justify-center"><Loader2 className="animate-spin size-8 text-primary" /></div>
              ) : (
                <>
                  <div className="divide-y divide-black/5 text-left">
                    {paginatedBlogs.length === 0 ? (
                      <div className="p-24 text-center text-muted-foreground italic">
                        {searchBlogs ? 'Nema članaka za traženi pojam.' : 'Nema objavljenih članaka.'}
                      </div>
                    ) : (
                      paginatedBlogs.map((blog) => (
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
                  {renderPagination(pageBlogs, totalPagesBlogs, setPageBlogs)}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* TAB 3: CITIES */}
        {activeTab === 'cities' && (
          isEditing && editType === 'city' ? (
            renderEntityEditor()
          ) : (
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
              {renderSearchBar(
                'Pretraži gradove po nazivu, slugu, regiji ili pozivnom broju...',
                searchCities,
                (v) => { setSearchCities(v); setPageCities(1); },
                cities?.length || 0,
                filteredCities.length
              )}
              <CardContent className="p-0">
                {citiesLoading ? (
                  <div className="p-24 flex justify-center"><Loader2 className="animate-spin size-8 text-primary" /></div>
                ) : (
                  <>
                    <div className="divide-y divide-black/5 text-left">
                      {paginatedCities.length === 0 ? (
                        <div className="p-24 text-center text-muted-foreground italic">
                          {searchCities ? 'Nema pronađenih gradova za traženi pojam.' : 'Nema upisanih gradova.'}
                        </div>
                      ) : (
                        paginatedCities.map((city) => (
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
                              <a href={`/cities/${city.slug}`} target="_blank" rel="noreferrer">
                                <Button variant="outline" size="icon" title="Otvori javnu stranicu grada" className="text-emerald-600 hover:bg-emerald-50 rounded-xl size-10 border-emerald-500/20 bg-emerald-500/5">
                                  <ExternalLink className="size-4" />
                                </Button>
                              </a>
                              <Button variant="outline" size="icon" title="Uredi grad" onClick={() => startEditCity(city)} className="text-blue-500 hover:bg-blue-50 rounded-xl size-10 border-blue-500/20 bg-blue-500/5">
                                <Edit2 className="size-4" />
                              </Button>
                              <Button variant="outline" size="icon" title="Obriši grad" onClick={() => handleDeleteCity(city.id)} className="text-red-500 hover:bg-red-50 rounded-xl size-10 border-red-500/20 bg-red-500/5">
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {renderPagination(pageCities, totalPagesCities, setPageCities)}
                  </>
                )}
              </CardContent>
            </Card>
          )
        )}

        {/* TAB 4: ISLANDS */}
        {activeTab === 'islands' && (
          isEditing && editType === 'island' ? (
            renderEntityEditor()
          ) : (
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
              {renderSearchBar(
                'Pretraži otoke po nazivu, slugu ili regiji...',
                searchIslands,
                (v) => { setSearchIslands(v); setPageIslands(1); },
                islands?.length || 0,
                filteredIslands.length
              )}
              <CardContent className="p-0">
                {islandsLoading ? (
                  <div className="p-24 flex justify-center"><Loader2 className="animate-spin size-8 text-primary" /></div>
                ) : (
                  <>
                    <div className="divide-y divide-black/5 text-left">
                      {paginatedIslands.length === 0 ? (
                        <div className="p-24 text-center text-muted-foreground italic">
                          {searchIslands ? 'Nema pronađenih otoka za traženi pojam.' : 'Nema upisanih otoka.'}
                        </div>
                      ) : (
                        paginatedIslands.map((island) => (
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
                              <a href={`/islands/${island.slug}`} target="_blank" rel="noreferrer">
                                <Button variant="outline" size="icon" title="Otvori javnu stranicu otoka" className="text-emerald-600 hover:bg-emerald-50 rounded-xl size-10 border-emerald-500/20 bg-emerald-500/5">
                                  <ExternalLink className="size-4" />
                                </Button>
                              </a>
                              <Button variant="outline" size="icon" title="Uredi otok" onClick={() => startEditIsland(island)} className="text-blue-500 hover:bg-blue-50 rounded-xl size-10 border-blue-500/20 bg-blue-500/5">
                                <Edit2 className="size-4" />
                              </Button>
                              <Button variant="outline" size="icon" title="Obriši otok" onClick={() => handleDeleteIsland(island.id)} className="text-red-500 hover:bg-red-50 rounded-xl size-10 border-red-500/20 bg-red-500/5">
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {renderPagination(pageIslands, totalPagesIslands, setPageIslands)}
                  </>
                )}
              </CardContent>
            </Card>
          )
        )}

        {/* TAB 5: NATIONAL PARKS */}
        {activeTab === 'parks' && (
          isEditing && editType === 'park' ? (
            renderEntityEditor()
          ) : (
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="flex flex-row items-center justify-between border-b p-8 bg-secondary/5">
                <div>
                  <CardTitle className="text-2xl font-black uppercase tracking-tight">Nacionalni Parkovi</CardTitle>
                  <CardDescription>Upravljajte nacionalnim parkovima i njihovim detaljnim opisima te lokacijama.</CardDescription>
                </div>
                <Link href="/admin/new-listing">
                  <Button className="bg-primary text-white rounded-xl font-bold h-10 px-4">
                    <PlusCircle className="size-4 mr-2" /> Dodaj Park / Objekt
                  </Button>
                </Link>
              </CardHeader>
              {renderSearchBar(
                'Pretraži nacionalne parkove...',
                searchParks,
                (v) => { setSearchParks(v); setPageParks(1); },
                nationalParks.length,
                filteredParks.length
              )}
              <CardContent className="p-0">
                {listingsLoading ? (
                  <div className="p-24 flex justify-center"><Loader2 className="animate-spin size-8 text-primary" /></div>
                ) : (
                  <>
                    <div className="divide-y divide-black/5 text-left">
                      {paginatedParks.length === 0 ? (
                        <div className="p-24 text-center text-muted-foreground italic">
                          {searchParks ? 'Nema pronađenih parkova za traženi pojam.' : 'Nema upisanih nacionalnih parkova.'}
                        </div>
                      ) : (
                        paginatedParks.map((park) => {
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
                                <Link href={`/admin/edit-listing/${park.id}`}>
                                  <Button variant="outline" size="icon" title="Uredi objekt i SEO" className="text-blue-500 hover:bg-blue-50 rounded-xl size-10 border-blue-500/20 bg-blue-500/5">
                                    <Edit2 className="size-4" />
                                  </Button>
                                </Link>
                                <Button variant="outline" size="icon" onClick={() => handleDelete(park.id)} className="text-red-500 hover:bg-red-50 rounded-xl size-10 border-red-500/20 bg-red-500/5">
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    {renderPagination(pageParks, totalPagesParks, setPageParks)}
                  </>
                )}
              </CardContent>
            </Card>
          )
        )}

        {/* TAB: SECTIONS */}
        {activeTab === 'sections' && (
          isEditingSection ? (
            renderSectionEditor()
          ) : (
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
          )
        )}

        {/* TAB: MEDIJSKA ZBIRKA */}
        {activeTab === 'media' && (
          <MediaManager />
        )}

        {/* TAB: VIJESTI BOT */}
        {activeTab === 'bot' && (
          <NewsBotManager blogs={blogs || []} onBlogsUpdate={() => window.location.reload()} />
        )}

      </main>
    </div>
  );
}
