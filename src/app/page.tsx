"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getFirstPhoto } from '@/app/lib/image-helpers';
import { 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  ChevronRight,
  Utensils,
  Hotel,
  Umbrella,
  GlassWater,
  Shield,
  Landmark,
  Library,
  Binoculars,
  Search,
  Star,
  Compass,
  BookOpen,
  Eye,
  Calendar,
  Clock,
  ExternalLink,
  ShieldCheck,
  Send,
  Building2,
  Anchor,
  CheckCircle2,
  Newspaper,
  Flame
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCollection } from '@/pocketbase';
import AdBanner from '@/components/ads/AdBanner';
import { generateListingUrl } from '@/app/lib/utils/slug';
import { useRouter } from 'next/navigation';
import { DEFAULT_LISTING_IMAGE } from '@/app/lib/constants';
import { getLocalizedUrl } from '@/lib/i18n-routes';
import Map from '@/components/map/Map';
import { toast } from '@/hooks/use-toast';

export default function Home() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const isEn = language === 'en';

  const { data: allListings } = useCollection('listings', {
    filter: 'status = "active"',
    sort: '-created',
  });

  const { data: cities } = useCollection('cities');
  const { data: islands } = useCollection('islands');
  const { data: homepageSections } = useCollection('homepage_sections', { sort: 'order' });

  const { data: blogArticles } = useCollection('blogs', {
    sort: '-publishDate',
  });

  // Hero Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Interactive Map section state
  const [mapCategory, setMapCategory] = useState<'all' | 'beaches' | 'restaurants' | 'hotels'>('all');
  const [selectedMapListingId, setSelectedMapListingId] = useState<string | null>(null);

  // Popular locations active tab
  const [activePopularTab, setActivePopularTab] = useState<'restaurants' | 'hotels' | 'beaches' | 'wineries'>('restaurants');

  // News section active category tab
  const [newsCategoryTab, setNewsCategoryTab] = useState('all');

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }
    const filtered = (allListings || []).filter(l => {
      const name = isEn && l.metadata?.nameEn ? l.metadata.nameEn : l.name;
      return name.toLowerCase().includes(val.toLowerCase()) || 
             l.city.toLowerCase().includes(val.toLowerCase());
    }).slice(0, 5);
    setSearchResults(filtered);
  };

  const handleExecuteSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedCity && selectedCity !== 'all') params.set('city', selectedCity);
    router.push(`/explore?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleExecuteSearch();
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      toast({ title: 'Greška', description: 'Unesite ispravnu e-mail adresu.', variant: 'destructive' });
      return;
    }
    setNewsletterSubscribed(true);
    toast({ title: 'Hvala na prijavi!', description: 'Uspješno ste prijavljeni na naš newsletter.' });
    setNewsletterEmail('');
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.search-box-container')) {
        setShowResults(false);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('click', handleOutsideClick);
      }
    };
  }, []);

  // Cities Setup — predefined list for consistent high quality visual cards
  const featuredCitiesSlugs = ['zagreb', 'dubrovnik', 'split', 'rovinj', 'varazdin'];
  const colSpansCities = [
    'md:col-span-5 md:row-span-2 h-[380px]', 
    'md:col-span-4 h-[180px]', 
    'md:col-span-4 h-[180px]', 
    'md:col-span-4 h-[200px]', 
    'md:col-span-5 h-[200px]'
  ];
  const featuredCities = featuredCitiesSlugs.map((slug, idx) => {
    const dbCity = (cities || []).find(c => c.slug === slug);
    const regions = ['Središnja Hrvatska', 'Južna Dalmacija', 'Srednja Dalmacija', 'Istra', 'Sjeverna Hrvatska'];
    const image = (dbCity && typeof dbCity.image === 'string' && dbCity.image.trim() !== '') 
      ? dbCity.image 
      : `/cities/${slug}.webp`;
    return {
      name: dbCity?.name || slug.charAt(0).toUpperCase() + slug.slice(1),
      slug,
      region: dbCity?.region || regions[idx % regions.length],
      image,
      colSpan: colSpansCities[idx % colSpansCities.length],
      indexStr: `0${idx + 1}`,
    };
  });

  // Islands Setup
  const featuredIslandsSlugs = ['korcula', 'hvar', 'krk', 'cres', 'mljet'];
  const colSpansIslands = [
    'md:col-span-4 md:row-span-2 h-[380px]', 
    'md:col-span-2 h-[180px]', 
    'md:col-span-2 h-[180px]', 
    'md:col-span-3 h-[200px]', 
    'md:col-span-3 h-[200px]'
  ];
  const featuredIslands = featuredIslandsSlugs.map((slug, idx) => {
    const dbIsland = (islands || []).find(i => i.slug === slug);
    const regions = ['Južna Dalmacija', 'Srednja Dalmacija', 'Kvarner', 'Kvarner', 'Južna Dalmacija'];
    const image = (dbIsland && typeof dbIsland.image === 'string' && dbIsland.image.trim() !== '') 
      ? dbIsland.image 
      : `/islands/${slug}.webp`;
    return {
      name: dbIsland?.name || slug.charAt(0).toUpperCase() + slug.slice(1),
      slug,
      region: dbIsland?.region || regions[idx % regions.length],
      image,
      colSpan: colSpansIslands[idx % colSpansIslands.length],
    };
  });

  // Listing splits for map and popular sections
  const activeListings = (allListings || []).filter(l => l.status === 'active' || !l.status);
  
  // Map filtered listings
  const mapListings = activeListings.filter(l => {
    if (mapCategory === 'all') return true;
    const cat = l.locationCategoryId || l.categoryId || '';
    if (mapCategory === 'beaches') return cat === 'beaches';
    if (mapCategory === 'restaurants') return cat === 'restaurants';
    if (mapCategory === 'hotels') return cat === 'hotels';
    return true;
  });

  // Listings for the side feed on the map
  const mapFeedListings = mapListings.slice(0, 5);

  // Popular category listings based on active tab
  const currentPopularListings = activeListings.filter(l => {
    const cat = l.locationCategoryId || l.categoryId;
    return cat === activePopularTab;
  }).slice(0, 8);

  // Culture & Monuments
  const cultureListings = activeListings.filter(l => {
    const cat = l.locationCategoryId || l.categoryId;
    return ['homeland_war', 'landmarks', 'culture', 'viewpoints'].includes(cat);
  }).slice(0, 2);

  // News / Vijesti articles (exclude pending_approval)
  const allValidArticles = (blogArticles || []).filter(
    a => !Array.isArray(a.tags) || !a.tags.includes('pending_approval')
  );

  const filteredNews = allValidArticles.filter(a => {
    if (newsCategoryTab === 'all') return true;
    return a.category === newsCategoryTab;
  });

  // Featured article and side articles
  const featuredNewsArticle = filteredNews[0] || allValidArticles[0];
  const sideNewsArticles = (filteredNews.length > 1 ? filteredNews.slice(1, 5) : allValidArticles.slice(1, 5));

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden selection:bg-primary selection:text-white">
      <Navbar transparent />
      
      <main className="flex-1 relative">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute top-[65%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[180px] pointer-events-none" />

        {/* 1. HERO SECTION (Fix: Dedicated direct hero background to completely prevent 1-second old photo flicker) */}
        <section className="relative z-40 min-h-[92vh] w-full flex items-center pt-32 pb-24 bg-slate-950">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image 
              src="/hero-dubrovnik.jpg"
              alt="CroatiaBest Hero"
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              className="object-cover opacity-85 scale-100"
            />
            {/* Dark luxury gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/30 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent z-10" />
          </div>

          <div className="container mx-auto px-6 relative z-20">
            <div className="max-w-4xl space-y-8 text-left">
              {/* Top Badge */}
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/15 rounded-full text-white text-[11px] font-black tracking-[0.25em] uppercase shadow-lg shadow-black/20">
                <Sparkles className="size-3.5 text-amber-400 fill-amber-400" />
                OTKRIJTE TAJNE I LJEPOTE HRVATSKE
              </div>
              
              {/* Heading matching screenshot styling */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight font-headline">
                Otkrij dušu <span className="font-serif italic font-normal text-amber-300 drop-shadow-[0_4px_16px_rgba(251,191,36,0.3)]">Hrvatske</span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg md:text-xl text-white/90 font-body max-w-2xl leading-relaxed">
                Od jadranskih otoka do povijesnih gradova i vrhunske gastronomske ponude. Otkrijte jedinstvena iskustva i rezervirajte najbolje lokacije.
              </p>

              {/* Rich Multi-filter Search Bar (as shown in reference screenshot) */}
              <div className="relative w-full max-w-3xl pt-2 search-box-container">
                <div className="p-2 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-2">
                  {/* Text search input */}
                  <div className="flex items-center flex-1 w-full px-4 py-2">
                    <Search className="size-5 text-amber-400 mr-3 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Pretraži gradove, restorane, plaže..."
                      className="w-full bg-transparent text-white placeholder-white/50 outline-none text-sm md:text-base font-semibold"
                    />
                  </div>

                  {/* Category Select */}
                  <div className="w-full md:w-auto px-2 border-t md:border-t-0 md:border-l border-white/15">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full md:w-36 bg-transparent text-white/90 text-xs md:text-sm font-bold outline-none py-2 px-2 cursor-pointer focus:text-white"
                    >
                      <option value="all" className="bg-slate-900 text-white">Kategorija (Sve)</option>
                      <option value="restaurants" className="bg-slate-900 text-white">Restorani & Gastro</option>
                      <option value="hotels" className="bg-slate-900 text-white">Hoteli & Smještaj</option>
                      <option value="beaches" className="bg-slate-900 text-white">Plaže</option>
                      <option value="wineries" className="bg-slate-900 text-white">Vinarije & OPG</option>
                      <option value="landmarks" className="bg-slate-900 text-white">Znamenitosti</option>
                      <option value="national_parks" className="bg-slate-900 text-white">Nacionalni parkovi</option>
                    </select>
                  </div>

                  {/* City Select */}
                  <div className="w-full md:w-auto px-2 border-t md:border-t-0 md:border-l border-white/15">
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full md:w-36 bg-transparent text-white/90 text-xs md:text-sm font-bold outline-none py-2 px-2 cursor-pointer focus:text-white"
                    >
                      <option value="all" className="bg-slate-900 text-white">Grad / Regija</option>
                      <option value="Dubrovnik" className="bg-slate-900 text-white">Dubrovnik</option>
                      <option value="Split" className="bg-slate-900 text-white">Split</option>
                      <option value="Zagreb" className="bg-slate-900 text-white">Zagreb</option>
                      <option value="Rovinj" className="bg-slate-900 text-white">Rovinj</option>
                      <option value="Zadar" className="bg-slate-900 text-white">Zadar</option>
                      <option value="Hvar" className="bg-slate-900 text-white">Hvar</option>
                      <option value="Korčula" className="bg-slate-900 text-white">Korčula</option>
                    </select>
                  </div>

                  {/* Search Button (Orange/Red gradient) */}
                  <Button
                    onClick={handleExecuteSearch}
                    className="w-full md:w-auto rounded-2xl h-12 px-8 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-900/40 shrink-0"
                  >
                    <Search className="size-4 mr-2" /> Pretraži
                  </Button>
                </div>

                {/* Instant autocomplete search suggestions */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-slate-900/95 backdrop-blur-3xl border border-white/15 rounded-3xl shadow-2xl overflow-hidden z-50 p-4 space-y-2 max-h-[350px] overflow-y-auto">
                    {searchResults.map((l) => {
                      const image = getFirstPhoto(l) || DEFAULT_LISTING_IMAGE;
                      const path = generateListingUrl(l.locationCategoryId || l.categoryId, l.name, l.id);
                      const lName = isEn && l.metadata?.nameEn ? l.metadata.nameEn : l.name;
                      return (
                        <Link key={l.id} href={path} className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-2xl transition-all">
                          <div className="relative size-12 rounded-xl overflow-hidden shrink-0 bg-white/5 border border-white/10">
                            <Image src={image} alt={lName} fill className="object-cover" />
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <p className="font-bold text-white text-sm truncate">{lName}</p>
                            <p className="text-[11px] text-amber-400 font-bold uppercase">{l.city}</p>
                          </div>
                          <ChevronRight className="size-4 text-white/50" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick filter pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs text-white/60 font-semibold mr-1">Popularno:</span>
                {[
                  { label: 'Dubrovnik', href: '/cities/dubrovnik' },
                  { label: 'Plitvice', href: '/explore?q=plitvice' },
                  { label: 'Hvar', href: '/islands/hvar' },
                  { label: 'Restorani', href: '/explore?category=restaurants' },
                  { label: 'Nacionalni parkovi', href: '/explore?category=national_parks' },
                  { label: 'Vinarije', href: '/explore?category=wineries' },
                ].map((chip) => (
                  <Link
                    key={chip.label}
                    href={chip.href}
                    className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/90 text-xs font-semibold backdrop-blur-md transition-all hover:scale-105"
                  >
                    {chip.label}
                  </Link>
                ))}
              </div>

              {/* 4 Glassmorphic Counter Badges (matching bottom of screenshot) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6">
                {[
                  { value: '1.000+', label: 'Provjerenih lokacija' },
                  { value: '10+', label: 'Nacionalnih parkova' },
                  { value: '4.9 / 5', label: 'Prosječna ocjena' },
                  { value: '100%', label: 'Autentično iskustvo' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 flex flex-col justify-center">
                    <span className="text-2xl font-black text-white leading-tight font-headline">{stat.value}</span>
                    <span className="text-[11px] text-white/75 font-semibold mt-0.5">{stat.label}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* 2. INTERAKTIVNA KARTA HRVATSKE (Matching reference screenshot) */}
        <section className="py-20 bg-slate-50 relative z-30 border-b border-black/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <Badge className="bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-3">
                  INTERAKTIVNA KARTA HRVATSKE
                </Badge>
                <h2 className="text-3xl md:text-5xl font-black italic tracking-tight font-headline text-slate-900">
                  Istražite Hrvatsku na interaktivnoj karti
                </h2>
                <p className="text-slate-600 text-sm md:text-base max-w-2xl mt-2 font-medium">
                  Otkrijte najbolje lokacije u svim regijama: restorane s Michelinovom zvjezdicom, skrivene uvale, povijesne znamenitosti i prirodne ljepote diljem Jadrana.
                </p>
              </div>

              <Link href="/explore">
                <Button variant="outline" className="rounded-2xl h-11 px-6 font-bold text-xs uppercase tracking-wider text-primary border-primary/30 hover:bg-primary/5">
                  Otvori kartu u cijelom zaslonu <ArrowRight className="size-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Map and Side-feed container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-4 md:p-6 rounded-[2.5rem] shadow-xl border border-black/5">
              {/* Map Column (8/12) */}
              <div className="lg:col-span-8 space-y-4">
                {/* Category filter pills for map */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {[
                    { id: 'all', label: 'Sve lokacije' },
                    { id: 'beaches', label: 'Plaže' },
                    { id: 'restaurants', label: 'Gastronomija' },
                    { id: 'hotels', label: 'Smještaj' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setMapCategory(cat.id as any)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        mapCategory === cat.id
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* The Map itself */}
                <div className="relative h-[480px] w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200">
                  <Map 
                    center={{ lat: 44.5, lng: 16.5 }} 
                    zoom={7} 
                    listings={mapListings} 
                    selectedListingId={selectedMapListingId}
                    onSelectListing={setSelectedMapListingId}
                  />
                </div>
              </div>

              {/* Side Feed Column (4/12): Uživo istaknute lokacije */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                    <h3 className="font-black text-sm uppercase tracking-wider text-slate-800">Uživo istaknute lokacije</h3>
                    <Badge variant="outline" className="text-[10px] bg-white font-bold">{mapListings.length} dostupno</Badge>
                  </div>

                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {mapFeedListings.map((l) => {
                      const image = getFirstPhoto(l) || DEFAULT_LISTING_IMAGE;
                      const path = generateListingUrl(l.locationCategoryId || l.categoryId, l.name, l.id);
                      const isSelected = selectedMapListingId === l.id;
                      return (
                        <div
                          key={l.id}
                          onClick={() => setSelectedMapListingId(l.id)}
                          className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-primary/10 border-primary shadow-sm' 
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="relative size-14 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                            <Image src={image} alt={l.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-xs text-slate-900 truncate">{l.name}</h4>
                            <p className="text-[10px] text-slate-500 font-semibold truncate mt-0.5">{l.city || l.address}</p>
                            <div className="flex items-center gap-1 mt-1 text-amber-500 text-[10px] font-bold">
                              <Star className="size-3 fill-amber-400 text-amber-400" /> 4.9
                            </div>
                          </div>
                          <Link href={path} className="shrink-0">
                            <Button size="sm" variant="ghost" className="size-8 p-0 rounded-lg text-slate-400 hover:text-primary">
                              <ChevronRight className="size-4" />
                            </Button>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Link href="/explore" className="w-full">
                  <Button className="w-full rounded-xl h-11 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-wider shadow-md">
                    Pogledaj svih {allListings?.length || 24} lokacija →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ISTRAŽITE GRADOVE */}
        <section className="py-24 bg-white relative z-30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-3">
              <Badge className="bg-primary/10 text-primary border-none font-black px-6 py-2 rounded-full text-xs uppercase tracking-widest">
                DESTINACIJE U FOKUSU
              </Badge>
              <h2 className="text-4xl md:text-6xl font-headline font-black italic tracking-tight text-slate-900">
                Istražite gradove
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base font-medium">
                Od tisućljetne kulturne baštine do modernog mediteranskog života - svaki grad priča jedinstvenu priču.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Cities Bento Grid (9/12) */}
              <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-9 gap-6">
                {featuredCities.map((city) => (
                  <Link key={city.slug} href={getLocalizedUrl(`/cities/${city.slug}`, language)} className={`${city.colSpan} group`}>
                    <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg border border-black/5 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-500 ease-out bg-slate-900">
                      
                      <div className="absolute top-4 right-6 z-20 text-white/30 text-3xl font-black font-headline italic tracking-tighter select-none">
                        {city.indexStr}
                      </div>

                      <div className="relative w-full h-full">
                        <Image src={city.image} alt={city.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-all duration-1000 group-hover:scale-105" />
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent z-10" />
                      
                      <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                        <p className="text-[10px] font-black uppercase text-amber-400 mb-1 tracking-[0.2em]">{city.region}</p>
                        <h3 className="text-2xl md:text-3xl font-black italic mb-2 text-white group-hover:text-primary transition-colors leading-tight">{city.name}</h3>
                        
                        <div className="overflow-hidden h-0 group-hover:h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out flex items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            VODIČ KROZ GRAD <Compass className="size-4 animate-spin-slow text-primary" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Promo Card: Dođite kao partner (3/12) */}
              <div className="lg:col-span-3 h-full">
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl border border-white/10 flex flex-col justify-between h-[420px]">
                  <div>
                    <Badge className="bg-primary text-white font-black text-[10px] uppercase tracking-widest px-3 py-1 mb-4">
                      PARTNERSTVO
                    </Badge>
                    <h3 className="text-2xl font-black italic font-headline leading-tight mb-3">
                      Dođite kao partner
                    </h3>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Povežite vaš restoran, hotel, vilu ili turističku agenciju s tisućama posjetitelja koji svakodnevno pretražuju CroatiaBest.
                    </p>
                  </div>
                  <Link href="/submit">
                    <Button className="w-full rounded-2xl h-12 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-wider shadow-lg">
                      Dodajte vaš objekt →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. ISTRAŽITE OTOKE */}
        <section className="py-24 bg-slate-50 relative z-30 border-y border-black/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-3">
              <Badge className="bg-secondary/10 text-secondary border-none font-black px-6 py-2 rounded-full text-xs uppercase tracking-widest">
                OTOCI JADRANSKOG MORA
              </Badge>
              <h2 className="text-4xl md:text-6xl font-headline font-black italic tracking-tight text-slate-900">
                Istražite otoke
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base font-medium">
                Otkrijte kristalno more, skrivene uvale, autentičnu hranu i mir na više od tisuću jadranskih otoka.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {featuredIslands.map((island) => (
                <div key={island.slug} className={`relative group overflow-hidden rounded-[2.5rem] shadow-md hover:shadow-2xl transition-all duration-700 ${island.colSpan}`}>
                  <div className="absolute inset-0 z-0">
                    <Image src={island.image} alt={island.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-all duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-85 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                    <p className="text-[10px] font-black uppercase text-amber-400 mb-1 tracking-[0.2em]">{island.region}</p>
                    <h3 className="text-2xl md:text-3xl font-black italic mb-2 text-white group-hover:text-primary transition-colors leading-tight">{island.name}</h3>
                  </div>
                  <Link href={getLocalizedUrl(`/islands/${island.slug}`, language)} className="absolute inset-0 z-30">
                    <span className="sr-only">{island.name}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. NAJPOPULARNIJE LOKACIJE */}
        <section className="py-24 bg-white relative z-30">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <Badge className="bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-3">
                  POPULARNO
                </Badge>
                <h2 className="text-3xl md:text-5xl font-black italic tracking-tight font-headline text-slate-900">
                  Najpopularnije lokacije
                </h2>
                <p className="text-slate-600 text-sm md:text-base max-w-xl mt-2 font-medium">
                  Provjereni favoriti prema ocjenama posjetitelja i lokalnih stručnjaka.
                </p>
              </div>

              {/* Tabs for categories */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'restaurants', label: 'Restorani', icon: <Utensils className="size-4" /> },
                  { id: 'hotels', label: 'Smještaj', icon: <Hotel className="size-4" /> },
                  { id: 'beaches', label: 'Plaže', icon: <Umbrella className="size-4" /> },
                  { id: 'wineries', label: 'Vinarije & OPG', icon: <GlassWater className="size-4" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActivePopularTab(tab.id as any)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
                      activePopularTab === tab.id
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of locations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentPopularListings.map((l) => {
                const name = isEn && l.metadata?.nameEn ? l.metadata.nameEn : l.name;
                const image = getFirstPhoto(l) || DEFAULT_LISTING_IMAGE;
                const path = generateListingUrl(l.locationCategoryId || l.categoryId, l.name, l.id);
                return (
                  <Link key={l.id} href={path} className="group">
                    <Card className="rounded-[2rem] border border-slate-200/80 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white flex flex-col h-full">
                      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                        <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        <Badge className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] uppercase font-bold border-none">
                          {l.city}
                        </Badge>
                      </div>
                      <CardContent className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-black text-base text-slate-900 group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                            {name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {l.address || l.description || 'Preporučena lokacija u Hrvatskoj.'}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100 text-xs">
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="size-3.5 fill-amber-400 text-amber-400" /> 4.9
                          </div>
                          <span className="text-primary font-bold text-xs uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                            Detalji →
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            <div className="mt-12 flex justify-center">
              <AdBanner format="horizontal" className="w-full max-w-4xl shadow-sm rounded-2xl overflow-hidden border border-black/5" />
            </div>
          </div>
        </section>

        {/* 6. KULTURA I ZNAMENITOSTI */}
        <section className="py-20 bg-slate-50 relative z-30 border-t border-black/5">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-10">
              <div>
                <Badge className="bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-3">
                  KULTURNA BAŠTINA
                </Badge>
                <h2 className="text-3xl md:text-5xl font-black italic tracking-tight font-headline text-slate-900">
                  Kultura i Znamenitosti
                </h2>
                <p className="text-slate-600 text-sm md:text-base max-w-xl mt-2 font-medium">
                  Povijesne utvrde, spomenici i UNESCO baština koja svjedoči o bogatoj prošlosti Hrvatske.
                </p>
              </div>
              <Link href="/explore?category=landmarks">
                <Button variant="link" className="text-primary font-black uppercase text-xs tracking-wider">
                  Istraži više →
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cultureListings.map((l: any) => (
                <Link key={l.id} href={generateListingUrl(l.locationCategoryId || l.categoryId, l.name, l.id)} className="group">
                  <div className="relative h-72 md:h-80 rounded-[2.5rem] overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500">
                    <Image src={getFirstPhoto(l) || DEFAULT_LISTING_IMAGE} alt={l.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                      <Badge className="w-fit bg-amber-400 text-slate-950 font-black text-[10px] uppercase mb-2">
                        {l.city}
                      </Badge>
                      <h3 className="text-2xl md:text-3xl font-black italic font-headline leading-tight group-hover:text-primary transition-colors">
                        {l.name}
                      </h3>
                      <p className="text-xs text-white/80 line-clamp-2 mt-2 leading-relaxed">
                        {l.description || 'Povijesna znamenitost i kulturna atrakcija.'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 7. NOVA SEKCIJA: TURISTIČKE VIJESTI & MAGAZIN (Requested by user) */}
        <section className="py-24 bg-white relative z-30 border-t border-black/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <Badge className="bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-3 flex items-center gap-1.5 w-fit">
                  <Newspaper className="size-3.5 text-primary" />
                  CROATIABEST MAGAZIN & VIJESTI
                </Badge>
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tight font-headline text-slate-900">
                  Najnovije Vijesti & Priče iz Hrvatske
                </h2>
                <p className="text-slate-600 text-sm md:text-base max-w-xl mt-2 font-medium">
                  Aktualnosti iz turizma, gastro vodiči, putopisi i zanimljivosti iz cijele zemlje.
                </p>
              </div>

              {/* Filter tabs for news */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: 'Sve vijesti' },
                  { id: 'Vijesti iz Hrvatske', label: 'Hrvatska' },
                  { id: 'Vijesti iz Svijeta', label: 'Svijet' },
                  { id: 'Zanimljivosti', label: 'Zanimljivosti' },
                  { id: 'Putovanja', label: 'Magazin' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setNewsCategoryTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      newsCategoryTab === tab.id
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
                <Link href="/vijesti/vijesti-iz-hrvatske">
                  <Button variant="ghost" className="text-primary font-bold text-xs uppercase tracking-wider h-10 px-3">
                    Sve vijesti →
                  </Button>
                </Link>
              </div>
            </div>

            {/* News Magazine Layout: 1 Featured Hero Card + 4 Sidebar Articles */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Featured Large News Article (5/12) */}
              {featuredNewsArticle ? (
                <div className="lg:col-span-5 h-full">
                  <Link href={`/blog/${featuredNewsArticle.slug || featuredNewsArticle.id}`} className="group h-full flex flex-col">
                    <div className="relative h-72 md:h-80 w-full rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-xl border border-black/5">
                      {featuredNewsArticle.image && (
                        <Image src={featuredNewsArticle.image} alt={featuredNewsArticle.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <Badge className="absolute top-5 left-5 bg-primary text-white font-black text-xs uppercase px-3.5 py-1">
                        {featuredNewsArticle.category}
                      </Badge>
                      <div className="absolute bottom-5 left-5 right-5 text-white">
                        <div className="flex items-center gap-3 text-xs text-white/70 mb-2 font-medium">
                          <span>{featuredNewsArticle.author || 'CroatiaBest'}</span>
                          <span>•</span>
                          <span>{featuredNewsArticle.readTime || '3 min'} čitanja</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black italic font-headline leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {featuredNewsArticle.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-4 pt-3 flex-1 flex flex-col justify-between">
                      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {featuredNewsArticle.excerpt}
                      </p>
                      <span className="text-primary font-black text-xs uppercase tracking-wider mt-4 inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                        Pročitajte cijeli članak <ArrowRight className="size-4" />
                      </span>
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="lg:col-span-5 flex items-center justify-center p-12 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-300">
                  <p className="text-slate-400 font-bold text-sm">Uskoro prve vijesti i priče.</p>
                </div>
              )}

              {/* Side News Grid (7/12) */}
              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                {sideNewsArticles.map((article) => (
                  <Link key={article.id} href={`/blog/${article.slug || article.id}`} className="group">
                    <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:border-slate-300 transition-all flex flex-col justify-between h-full">
                      <div className="space-y-3">
                        <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-200">
                          {article.image && (
                            <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          )}
                          <Badge className="absolute top-2.5 left-2.5 bg-black/75 text-white font-bold text-[10px] uppercase">
                            {article.category}
                          </Badge>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1 font-medium">
                            <Clock className="size-3" /> {article.readTime || '3 min'}
                          </div>
                          <h4 className="font-black text-sm text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                            {article.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                            {article.excerpt}
                          </p>
                        </div>
                      </div>
                      <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-primary">
                        <span>Detaljnije</span>
                        <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* 8. CALL TO ACTION SECTION: Newsletter & Postanite Partner (Bottom of screenshot) */}
        <section className="py-20 bg-slate-950 text-white relative z-30">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Card: Newsletter */}
              <div className="p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-white/10 flex flex-col justify-between space-y-6 shadow-2xl">
                <div className="space-y-3">
                  <Badge className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase tracking-widest px-3 py-1">
                    EKSKLUZIVNI VODIČ KROZ HRVATSKU
                  </Badge>
                  <h3 className="text-3xl md:text-4xl font-black italic font-headline leading-tight">
                    Planirate putovanje po Hrvatskoj?
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-md">
                    Prijavite se na naš newsletter i primajte tjedne preporuke, skrivene bisere i ekskluzivne gastro priče izravno u vaš inbox.
                  </p>
                </div>

                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Unesite vašu e-mail adresu..."
                      className="flex-1 h-12 rounded-2xl bg-white/10 border border-white/20 px-5 text-sm text-white placeholder-white/50 outline-none focus:border-primary transition-all font-medium"
                    />
                    <Button 
                      type="submit"
                      className="h-12 px-8 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-black text-xs uppercase tracking-wider shrink-0 shadow-lg shadow-rose-950"
                    >
                      Prijavi me <ArrowRight className="size-4 ml-1.5" />
                    </Button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Bez spama. Možete se odjaviti u bilo kojem trenutku jednim klikom.
                  </p>
                </form>
              </div>

              {/* Right Card: Za vlasnike objekata */}
              <div className="p-8 md:p-12 rounded-[2.5rem] bg-white text-slate-900 flex flex-col justify-between space-y-6 shadow-2xl">
                <div className="space-y-3">
                  <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-3 py-1">
                    ZA VLASNIKE OBJEKATA
                  </Badge>
                  <h3 className="text-3xl md:text-4xl font-black italic font-headline leading-tight">
                    Posjedujete vilu, hotel ili vrhunski restoran?
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed max-w-md">
                    Povežite svoj objekt s tisućama posjetitelja koji svakodnevno istražuju najbolja mjesta, plaže i gastronomiju na CroatiaBest.
                  </p>
                </div>

                <div className="space-y-3">
                  <Link href="/submit">
                    <Button className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-lg">
                      + Prijavite vaš objekt
                    </Button>
                  </Link>
                  <p className="text-[11px] text-slate-500">
                    Jednostavna i brza prijava za sve verificirane ugostitelje i iznajmljivače.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
