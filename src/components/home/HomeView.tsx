"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getFirstPhoto, isDummyPlaceholderPhoto } from '@/app/lib/image-helpers';
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
import { translations } from '@/lib/translations';
import { useCollection } from '@/pocketbase';
import AdBanner from '@/components/ads/AdBanner';
import { generateListingUrl } from '@/app/lib/utils/slug';
import { useRouter } from 'next/navigation';
import { DEFAULT_LISTING_IMAGE } from '@/app/lib/constants';
import { getLocalizedUrl } from '@/lib/i18n-routes';
import Map from '@/components/map/Map';
import { toast } from '@/hooks/use-toast';

export default function HomeView({ forcedLanguage }: { forcedLanguage?: 'hr' | 'en' } = {}) {
  const { language: contextLanguage, t: contextT } = useLanguage();
  const language = forcedLanguage || contextLanguage;
  const t = translations[language] || contextT;
  const isEn = language === 'en';
  const router = useRouter();

  const { data: allListings } = useCollection('listings', {
    filter: 'status = "active"',
    sort: '-created',
  });

  const { data: cities } = useCollection('cities', { sort: 'name' });
  const { data: islands } = useCollection('islands', { sort: 'name' });
  const { data: homepageSections } = useCollection('homepage_sections', { sort: 'order' });

  const { data: blogArticles } = useCollection('blogs', {
    sort: '-id',
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
  const [blogCategoryTab, setBlogCategoryTab] = useState('all');
  const [activeNewsIndex, setActiveNewsIndex] = useState(0);

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
      toast({ 
        title: isEn ? 'Error' : 'Greška', 
        description: isEn ? 'Please enter a valid email address.' : 'Unesite ispravnu e-mail adresu.', 
        variant: 'destructive' 
      });
      return;
    }
    setNewsletterSubscribed(true);
    toast({ 
      title: isEn ? 'Thank you for subscribing!' : 'Hvala na prijavi!', 
      description: isEn ? 'You have successfully subscribed to our newsletter.' : 'Uspješno ste prijavljeni na naš newsletter.' 
    });
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

  // Translation helper for article & listing categories
  const formatCategory = (cat: string) => {
    if (!isEn) return cat;
    const catMap: Record<string, string> = {
      'Vijesti iz Hrvatske': 'Croatia',
      'Vijesti iz Svijeta': 'World',
      'Poznati Hrvati': 'Famous Croats',
      'Slavni u Hrvatskoj': 'Celebrities in Croatia',
      'Zanimljivosti': 'Curiosities',
      'Iz Povijesti': 'History',
      'Iz geografije': 'Geography',
      'Domovinski rat': 'Homeland War',
      'Putovanja': 'Travel',
      'Gastronomija': 'Gastronomy',
      'Vodiči': 'Guides',
      'Kultura': 'Culture',
      'Magazin': 'Magazine',
      'MAGAZIN': 'MAGAZINE',
      'VIJESTI': 'NEWS',
      'Restorani': 'Restaurants',
      'Smještaj': 'Stays',
      'Plaže': 'Beaches',
      'Vinarije & OPG': 'Wineries & Farms',
    };
    return catMap[cat] || cat;
  };

  // Translation helper for geographical regions
  const formatRegion = (reg: string) => {
    if (!isEn) return reg;
    const regMap: Record<string, string> = {
      'Središnja Hrvatska': 'Central Croatia',
      'Južna Dalmacija': 'Southern Dalmatia',
      'Srednja Dalmacija': 'Central Dalmatia',
      'Istra': 'Istria',
      'Sjeverna Hrvatska': 'Northern Croatia',
      'Kvarner': 'Kvarner',
      'Slavonija': 'Slavonia',
      'Lika i Gorski kotar': 'Lika & Gorski Kotar',
    };
    return regMap[reg] || reg;
  };

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
    const regions = isEn
      ? ['Central Croatia', 'Southern Dalmatia', 'Central Dalmatia', 'Istria', 'Northern Croatia']
      : ['Središnja Hrvatska', 'Južna Dalmacija', 'Srednja Dalmacija', 'Istra', 'Sjeverna Hrvatska'];
    const rawRegion = dbCity?.region || regions[idx % regions.length];
    const image = dbCity ? (dbCity.image || getFirstPhoto(dbCity, 'image')) : '';
    const cityName = (isEn && (dbCity as any)?.nameEn) || dbCity?.name || slug.charAt(0).toUpperCase() + slug.slice(1);
    return {
      name: cityName,
      slug,
      region: formatRegion(rawRegion),
      image: image || DEFAULT_LISTING_IMAGE,
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
    const dbIsland = (islands || []).find(i => 
      i.slug === slug || 
      i.slug === `otok-${slug}` || 
      i.name.toLowerCase().includes(slug)
    );
    const regions = isEn
      ? ['Southern Dalmatia', 'Central Dalmatia', 'Kvarner', 'Kvarner', 'Southern Dalmatia']
      : ['Južna Dalmacija', 'Srednja Dalmacija', 'Kvarner', 'Kvarner', 'Južna Dalmacija'];
    const rawRegion = dbIsland?.region || regions[idx % regions.length];
    const image = dbIsland ? (dbIsland.image || getFirstPhoto(dbIsland, 'image')) : '';
    const islandName = (isEn && (dbIsland as any)?.nameEn) || dbIsland?.name || slug.charAt(0).toUpperCase() + slug.slice(1);
    return {
      name: islandName,
      slug: dbIsland?.slug || slug,
      region: formatRegion(rawRegion),
      image: image || DEFAULT_LISTING_IMAGE,
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

  // Definicija rubrika vijesti
  const NEWS_CATEGORIES = [
    'Vijesti iz Hrvatske',
    'Vijesti iz Svijeta',
    'Poznati Hrvati',
    'Slavni u Hrvatskoj',
    'Zanimljivosti',
    'Iz Povijesti',
    'Iz geografije',
    'Domovinski rat',
  ];

  // 1. Filtriranje isključivo VIJESTI (iz bota ili news rubrika)
  const allValidNewsArticles = (blogArticles || []).filter(a => {
    if (Array.isArray(a.tags) && a.tags.includes('pending_approval')) return false;
    const isTaggedNews = Array.isArray(a.tags) && (a.tags.includes('vijesti') || a.tags.includes('bot'));
    const isCategoryNews = NEWS_CATEGORIES.includes(a.category);
    return isTaggedNews || isCategoryNews;
  });

  const filteredNews = allValidNewsArticles.filter(a => {
    if (newsCategoryTab === 'all') return true;
    return a.category === newsCategoryTab;
  });

  const featuredNewsArticle = filteredNews[0] || allValidNewsArticles[0];
  const sideNewsArticles = (filteredNews.length > 1 ? filteredNews.slice(1, 4) : allValidNewsArticles.slice(1, 4));

  // 2. Filtriranje isključivo BLOG / MAGAZIN članaka (redakcijski putopisi, gastro, vodiči - bez bota)
  const allEditorialBlogArticles = (blogArticles || []).filter(a => {
    if (Array.isArray(a.tags) && a.tags.includes('pending_approval')) return false;
    const isTaggedNews = Array.isArray(a.tags) && (a.tags.includes('vijesti') || a.tags.includes('bot'));
    const isCategoryNews = NEWS_CATEGORIES.includes(a.category);
    return !isTaggedNews && !isCategoryNews;
  });

  const displayBlogArticles = allEditorialBlogArticles.length > 0 ? allEditorialBlogArticles : (blogArticles || []);

  const filteredBlogArticles = displayBlogArticles.filter(a => {
    if (blogCategoryTab === 'all') return true;
    return a.category === blogCategoryTab;
  });

  const featuredBlogArticle = filteredBlogArticles[0] || displayBlogArticles[0];
  const sideBlogArticles = (filteredBlogArticles.length > 1 ? filteredBlogArticles.slice(1, 5) : displayBlogArticles.slice(1, 5));

  // Hero ticker news rotation
  useEffect(() => {
    if (allValidNewsArticles.length === 0) return;
    const interval = setInterval(() => {
      setActiveNewsIndex(prev => (prev + 1) % Math.min(allValidNewsArticles.length, 8));
    }, 4500);
    return () => clearInterval(interval);
  }, [allValidNewsArticles.length]);

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
              {/* Top Badges & Live News Ticker */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/15 rounded-full text-white text-[11px] font-black tracking-[0.25em] uppercase shadow-lg shadow-black/20">
                  <Sparkles className="size-3.5 text-amber-400 fill-amber-400" />
                  {isEn ? 'DISCOVER THE SECRETS & BEAUTY OF CROATIA' : 'OTKRIJTE TAJNE I LJEPOTE HRVATSKE'}
                </div>

                {allValidNewsArticles.length > 0 && (
                  <div className="inline-flex items-center gap-2.5 py-1.5 px-4 bg-black/50 hover:bg-black/70 backdrop-blur-xl border border-rose-500/30 rounded-full text-white text-xs transition-all shadow-lg group">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-[10px] tracking-wider uppercase rounded-full shadow-sm shrink-0">
                      <span className="size-2 rounded-full bg-white animate-ping" />
                      {isEn ? 'LIVE NEWS' : 'UŽIVO VIJESTI'}
                    </span>
                    {(() => {
                      const curNews = allValidNewsArticles[activeNewsIndex];
                      const curTitle = isEn ? (curNews?.titleEn || curNews?.title) : (curNews?.title || curNews?.titleEn);
                      return (
                        <Link
                          href={`/blog/${curNews?.slug || curNews?.id}`}
                          className="hover:text-amber-300 font-bold transition-colors truncate max-w-[220px] sm:max-w-md inline-block"
                          title={curTitle}
                        >
                          {curTitle}
                        </Link>
                      );
                    })()}
                    <Link href="/vijesti" className="text-amber-400 hover:text-amber-300 font-black text-[11px] shrink-0 border-l border-white/20 pl-2">
                      {isEn ? 'All →' : 'Sve →'}
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Heading matching screenshot styling */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight font-headline">
                {isEn ? (
                  <>
                    Discover the soul of <span className="font-serif italic font-normal text-amber-300 drop-shadow-[0_4px_16px_rgba(251,191,36,0.3)]">Croatia</span>
                  </>
                ) : (
                  <>
                    Otkrij dušu <span className="font-serif italic font-normal text-amber-300 drop-shadow-[0_4px_16px_rgba(251,191,36,0.3)]">Hrvatske</span>
                  </>
                )}
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg md:text-xl text-white/90 font-body max-w-2xl leading-relaxed">
                {isEn
                  ? 'From Adriatic islands to historic cities and world-class gastronomy. Discover unique experiences and book the best locations.'
                  : 'Od jadranskih otoka do povijesnih gradova i vrhunske gastronomske ponude. Otkrijte jedinstvena iskustva i rezervirajte najbolje lokacije.'}
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
                      placeholder={isEn ? "Search cities, restaurants, beaches..." : "Pretraži gradove, restorane, plaže..."}
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
                      <option value="all" className="bg-slate-900 text-white">{isEn ? "Category (All)" : "Kategorija (Sve)"}</option>
                      <option value="restaurants" className="bg-slate-900 text-white">{isEn ? "Restaurants & Gastro" : "Restorani & Gastro"}</option>
                      <option value="hotels" className="bg-slate-900 text-white">{isEn ? "Hotels & Stays" : "Hoteli & Smještaj"}</option>
                      <option value="beaches" className="bg-slate-900 text-white">{isEn ? "Beaches" : "Plaže"}</option>
                      <option value="wineries" className="bg-slate-900 text-white">{isEn ? "Wineries & Farms" : "Vinarije & OPG"}</option>
                      <option value="landmarks" className="bg-slate-900 text-white">{isEn ? "Landmarks" : "Znamenitosti"}</option>
                      <option value="national_parks" className="bg-slate-900 text-white">{isEn ? "National Parks" : "Nacionalni parkovi"}</option>
                    </select>
                  </div>

                  {/* City Select */}
                  <div className="w-full md:w-auto px-2 border-t md:border-t-0 md:border-l border-white/15">
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full md:w-36 bg-transparent text-white/90 text-xs md:text-sm font-bold outline-none py-2 px-2 cursor-pointer focus:text-white"
                    >
                      <option value="all" className="bg-slate-900 text-white">{isEn ? "City / Region" : "Grad / Regija"}</option>
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
                    <Search className="size-4 mr-2" /> {isEn ? "Search" : "Pretraži"}
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
                <span className="text-xs text-white/60 font-semibold mr-1">{isEn ? 'Popular:' : 'Popularno:'}</span>
                {[
                  { label: 'Dubrovnik', href: '/cities/dubrovnik' },
                  { label: 'Plitvice', href: '/explore?q=plitvice' },
                  { label: 'Hvar', href: '/islands/hvar' },
                  { label: isEn ? 'Restaurants' : 'Restorani', href: '/explore?category=restaurants' },
                  { label: isEn ? 'National Parks' : 'Nacionalni parkovi', href: '/explore?category=national_parks' },
                  { label: isEn ? 'Wineries' : 'Vinarije', href: '/explore?category=wineries' },
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
                  { value: '1.000+', label: isEn ? 'Verified Locations' : 'Provjerenih lokacija' },
                  { value: '10+', label: isEn ? 'National Parks' : 'Nacionalnih parkova' },
                  { value: '4.9 / 5', label: isEn ? 'Average Rating' : 'Prosječna ocjena' },
                  { value: '100%', label: isEn ? 'Authentic Experience' : 'Autentično iskustvo' },
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
                  {isEn ? 'INTERACTIVE MAP OF CROATIA' : 'INTERAKTIVNA KARTA HRVATSKE'}
                </Badge>
                <h2 className="text-3xl md:text-5xl font-black italic tracking-tight font-headline text-slate-900">
                  {isEn ? 'Explore Croatia on the interactive map' : 'Istražite Hrvatsku na interaktivnoj karti'}
                </h2>
                <p className="text-slate-600 text-sm md:text-base max-w-2xl mt-2 font-medium">
                  {isEn
                    ? 'Discover top locations across all regions: Michelin-starred restaurants, hidden coves, historic landmarks, and natural wonders across the Adriatic.'
                    : 'Otkrijte najbolje lokacije u svim regijama: restorane s Michelinovom zvjezdicom, skrivene uvale, povijesne znamenitosti i prirodne ljepote diljem Jadrana.'}
                </p>
              </div>

              <Link href="/explore">
                <Button variant="outline" className="rounded-2xl h-11 px-6 font-bold text-xs uppercase tracking-wider text-primary border-primary/30 hover:bg-primary/5">
                  {isEn ? 'Open full-screen map' : 'Otvori kartu u cijelom zaslonu'} <ArrowRight className="size-4 ml-2" />
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
                    { id: 'all', label: isEn ? 'All locations' : 'Sve lokacije' },
                    { id: 'beaches', label: isEn ? 'Beaches' : 'Plaže' },
                    { id: 'restaurants', label: isEn ? 'Gastronomy' : 'Gastronomija' },
                    { id: 'hotels', label: isEn ? 'Accommodation' : 'Smještaj' },
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
                    <h3 className="font-black text-sm uppercase tracking-wider text-slate-800">
                      {isEn ? 'Live Featured Locations' : 'Uživo istaknute lokacije'}
                    </h3>
                    <Badge variant="outline" className="text-[10px] bg-white font-bold">
                      {mapListings.length} {isEn ? 'available' : 'dostupno'}
                    </Badge>
                  </div>

                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {mapFeedListings.map((l) => {
                      const image = getFirstPhoto(l) || DEFAULT_LISTING_IMAGE;
                      const path = generateListingUrl(l.locationCategoryId || l.categoryId, l.name, l.id);
                      const isSelected = selectedMapListingId === l.id;
                      const lFeedName = isEn && l.metadata?.nameEn ? l.metadata.nameEn : l.name;
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
                            <Image src={image} alt={lFeedName} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-xs text-slate-900 truncate">{lFeedName}</h4>
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
                    {isEn ? `View all ${allListings?.length || 24} locations →` : `Pogledaj svih ${allListings?.length || 24} lokacija →`}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2.5. MINI SEKCIJA VIJESTI (Tik ispod karte - zatraženo od korisnika) */}
        <section className="py-16 bg-white relative z-30 border-b border-black/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20 font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-2 flex items-center gap-1.5 w-fit">
                  <Flame className="size-3.5 fill-rose-500 text-rose-500" />
                  {isEn ? 'NEWS & UPDATES' : 'AKTUALNOSTI & VIJESTI'}
                </Badge>
                <h2 className="text-3xl md:text-5xl font-black italic tracking-tight font-headline text-slate-900">
                  {isEn ? 'Tourism News & Events' : 'Turističke Vijesti & Događanja'}
                </h2>
                <p className="text-slate-600 text-sm md:text-base max-w-xl mt-1 font-medium">
                  {isEn
                    ? 'All tourism news, current events and curiosities from Croatia in real time.'
                    : 'Sve novosti iz turizma, aktualna događanja i zanimljivosti iz Hrvatske u stvarnom vremenu.'}
                </p>
              </div>

              {/* Filter tabs for news */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: isEn ? 'All news' : 'Sve vijesti' },
                  { id: 'Vijesti iz Hrvatske', label: isEn ? 'Croatia' : 'Hrvatska' },
                  { id: 'Vijesti iz Svijeta', label: isEn ? 'World' : 'Svijet' },
                  { id: 'Zanimljivosti', label: isEn ? 'Curiosities' : 'Zanimljivosti' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setNewsCategoryTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      newsCategoryTab === tab.id
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
                <Link href="/vijesti">
                  <Button variant="outline" className="rounded-xl font-bold text-xs uppercase tracking-wider h-9 px-4 text-primary border-primary/30 hover:bg-primary/5">
                    {isEn ? `All news (${allValidNewsArticles.length}) →` : `Sve vijesti (${allValidNewsArticles.length}) →`}
                  </Button>
                </Link>
              </div>
            </div>

            {/* News Magazine Compact Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Featured Main News Card (5/12) */}
              {featuredNewsArticle ? (
                <div className="lg:col-span-5 h-full">
                  <Link href={`/blog/${featuredNewsArticle.slug || featuredNewsArticle.id}`} className="group h-full flex flex-col">
                    <div className="relative h-64 md:h-72 w-full rounded-[2rem] overflow-hidden bg-slate-900 shadow-xl border border-black/5">
                      {featuredNewsArticle.image && (
                        <Image src={featuredNewsArticle.image} alt={isEn ? (featuredNewsArticle.titleEn || featuredNewsArticle.title) : featuredNewsArticle.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                      <Badge className="absolute top-4 left-4 bg-rose-600 text-white font-black text-[11px] uppercase px-3 py-1 shadow-md">
                        {formatCategory(featuredNewsArticle.category)}
                      </Badge>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-center gap-2 text-xs text-white/70 mb-1.5 font-medium">
                          <Clock className="size-3 text-rose-400" />
                          <span>{featuredNewsArticle.readTime || '3 min'} {isEn ? 'read' : 'čitanja'}</span>
                          <span>•</span>
                          <span>{featuredNewsArticle.author || 'CroatiaBest'}</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black italic font-headline leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {isEn ? (featuredNewsArticle.titleEn || featuredNewsArticle.title) : (featuredNewsArticle.title || featuredNewsArticle.titleEn)}
                        </h3>
                      </div>
                    </div>
                    <div className="p-3 pt-2.5 flex-1 flex flex-col justify-between">
                      <p className="text-xs md:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {isEn ? (featuredNewsArticle.excerptEn || featuredNewsArticle.excerpt) : (featuredNewsArticle.excerpt || featuredNewsArticle.excerptEn)}
                      </p>
                      <span className="text-primary font-black text-xs uppercase tracking-wider mt-2.5 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        {isEn ? 'Read full story' : 'Pročitajte cijelu vijest'} <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="lg:col-span-5 flex items-center justify-center p-8 bg-slate-50 rounded-[2rem] border border-dashed border-slate-300">
                  <p className="text-slate-400 font-bold text-sm">{isEn ? 'Loading latest news...' : 'Učitavanje najnovijih vijesti...'}</p>
                </div>
              )}

              {/* Side News Grid (7/12) - 3 Compact items */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {sideNewsArticles.map((article) => {
                  const displayTitle = isEn ? (article.titleEn || article.title) : (article.title || article.titleEn);
                  const displayExcerpt = isEn ? (article.excerptEn || article.excerpt) : (article.excerpt || article.excerptEn);
                  return (
                    <Link key={article.id} href={`/blog/${article.slug || article.id}`} className="group h-full">
                      <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:shadow-lg hover:border-slate-300 transition-all flex flex-col justify-between h-full">
                        <div className="space-y-2.5">
                          <div className="relative h-32 w-full rounded-xl overflow-hidden bg-slate-200">
                            {article.image && (
                              <Image src={article.image} alt={displayTitle} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            )}
                            <Badge className="absolute top-2 left-2 bg-black/75 text-white font-bold text-[9px] uppercase">
                              {formatCategory(article.category)}
                            </Badge>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 font-medium">
                              <Clock className="size-2.5" /> {article.readTime || '3 min'}
                            </div>
                            <h4 className="font-black text-xs md:text-sm text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                              {displayTitle}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                              {displayExcerpt}
                            </p>
                          </div>
                        </div>
                        <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-primary">
                          <span>{isEn ? 'Read' : 'Pročitaj'}</span>
                          <ChevronRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 3. ISTRAŽITE GRADOVE */}
        <section className="py-24 bg-white relative z-30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-3">
              <Badge className="bg-primary/10 text-primary border-none font-black px-6 py-2 rounded-full text-xs uppercase tracking-widest">
                {isEn ? 'DESTINATIONS IN FOCUS' : 'DESTINACIJE U FOKUSU'}
              </Badge>
              <h2 className="text-4xl md:text-6xl font-headline font-black italic tracking-tight text-slate-900">
                {isEn ? 'Explore Cities' : 'Istražite gradove'}
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base font-medium">
                {isEn
                  ? 'From millennial cultural heritage to modern Mediterranean life – every city tells a unique story.'
                  : 'Od tisućljetne kulturne baštine do modernog mediteranskog života - svaki grad priča jedinstvenu priču.'}
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
                        {city.image ? (
                          <Image src={city.image} alt={city.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-all duration-1000 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
                            <Building2 className="w-10 h-10 text-white/20 mb-2" />
                            <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">{isEn ? 'Photo coming soon' : 'Fotografija uskoro'}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent z-10" />
                      
                      <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                        <p className="text-[10px] font-black uppercase text-amber-400 mb-1 tracking-[0.2em]">{city.region}</p>
                        <h3 className="text-2xl md:text-3xl font-black italic mb-2 text-white group-hover:text-primary transition-colors leading-tight">{city.name}</h3>
                        
                        <div className="overflow-hidden h-0 group-hover:h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out flex items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            {isEn ? 'CITY GUIDE' : 'VODIČ KROZ GRAD'} <Compass className="size-4 animate-spin-slow text-primary" />
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
                      {isEn ? 'PARTNERSHIP' : 'PARTNERSTVO'}
                    </Badge>
                    <h3 className="text-2xl font-black italic font-headline leading-tight mb-3">
                      {isEn ? 'Join as a partner' : 'Dođite kao partner'}
                    </h3>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {isEn
                        ? 'Connect your restaurant, hotel, villa or agency with thousands of travelers visiting CroatiaBest daily.'
                        : 'Povežite vaš restoran, hotel, vilu ili turističku agenciju s tisućama posjetitelja koji svakodnevno pretražuju CroatiaBest.'}
                    </p>
                  </div>
                  <Link href="/submit">
                    <Button className="w-full rounded-2xl h-12 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-wider shadow-lg">
                      {isEn ? 'Add your listing →' : 'Dodajte vaš objekt →'}
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
                {isEn ? 'ADRIATIC SEA ISLANDS' : 'OTOCI JADRANSKOG MORA'}
              </Badge>
              <h2 className="text-4xl md:text-6xl font-headline font-black italic tracking-tight text-slate-900">
                {isEn ? 'Explore Islands' : 'Istražite otoke'}
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base font-medium">
                {isEn
                  ? 'Discover crystal-clear waters, secluded bays, authentic food, and peace across more than a thousand Adriatic islands.'
                  : 'Otkrijte kristalno more, skrivene uvale, autentičnu hranu i mir na više od tisuću jadranskih otoka.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {featuredIslands.map((island) => (
                <div key={island.slug} className={`relative group overflow-hidden rounded-[2.5rem] shadow-md hover:shadow-2xl transition-all duration-700 ${island.colSpan}`}>
                  <div className="absolute inset-0 z-0">
                    {island.image ? (
                      <Image src={island.image} alt={island.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-all duration-1000 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-sky-950 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
                        <Compass className="w-10 h-10 text-white/20 mb-2" />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">{isEn ? 'Photo coming soon' : 'Fotografija uskoro'}</span>
                      </div>
                    )}
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
                  {isEn ? 'POPULAR' : 'POPULARNO'}
                </Badge>
                <h2 className="text-3xl md:text-5xl font-black italic tracking-tight font-headline text-slate-900">
                  {isEn ? 'Most Popular Locations' : 'Najpopularnije lokacije'}
                </h2>
                <p className="text-slate-600 text-sm md:text-base max-w-xl mt-2 font-medium">
                  {isEn
                    ? 'Verified favorites according to visitor reviews and local experts.'
                    : 'Provjereni favoriti prema ocjenama posjetitelja i lokalnih stručnjaka.'}
                </p>
              </div>

              {/* Tabs for categories */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'restaurants', label: isEn ? 'Restaurants' : 'Restorani', icon: <Utensils className="size-4" /> },
                  { id: 'hotels', label: isEn ? 'Accommodation' : 'Smještaj', icon: <Hotel className="size-4" /> },
                  { id: 'beaches', label: isEn ? 'Beaches' : 'Plaže', icon: <Umbrella className="size-4" /> },
                  { id: 'wineries', label: isEn ? 'Wineries & Farms' : 'Vinarije & OPG', icon: <GlassWater className="size-4" /> },
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
                const desc = (isEn ? (l.metadata?.descriptionEn || l.descriptionEn || l.description) : l.description) || (isEn ? 'Recommended location in Croatia.' : 'Preporučena lokacija u Hrvatskoj.');
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
                            {l.address || desc}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100 text-xs">
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="size-3.5 fill-amber-400 text-amber-400" /> 4.9
                          </div>
                          <span className="text-primary font-bold text-xs uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                            {isEn ? 'Details →' : 'Detalji →'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Homepage Mid-page Banner (ZAPAMĆENA POZICIJA) */}
            <AdBanner format="horizontal" positionId="HOMEPAGE_HORIZONTAL_MID" className="w-full max-w-4xl mt-12 mx-auto shadow-sm rounded-2xl overflow-hidden border border-black/5" />
          </div>
        </section>

        {/* 6. KULTURA I ZNAMENITOSTI */}
        <section className="py-20 bg-slate-50 relative z-30 border-t border-black/5">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-10">
              <div>
                <Badge className="bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-3">
                  {isEn ? 'CULTURAL HERITAGE' : 'KULTURNA BAŠTINA'}
                </Badge>
                <h2 className="text-3xl md:text-5xl font-black italic tracking-tight font-headline text-slate-900">
                  {isEn ? 'Culture & Landmarks' : 'Kultura i Znamenitosti'}
                </h2>
                <p className="text-slate-600 text-sm md:text-base max-w-xl mt-2 font-medium">
                  {isEn
                    ? 'Historic fortresses, monuments, and UNESCO heritage that bear witness to Croatia\'s rich past.'
                    : 'Povijesne utvrde, spomenici i UNESCO baština koja svjedoči o bogatoj prošlosti Hrvatske.'}
                </p>
              </div>
              <Link href="/explore?category=landmarks">
                <Button variant="link" className="text-primary font-black uppercase text-xs tracking-wider">
                  {isEn ? 'Explore more →' : 'Istraži više →'}
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cultureListings.map((l: any) => {
                const cName = isEn && l.metadata?.nameEn ? l.metadata.nameEn : l.name;
                const cDesc = (isEn ? (l.metadata?.descriptionEn || l.descriptionEn || l.description) : l.description) || (isEn ? 'Historic landmark and cultural attraction.' : 'Povijesna znamenitost i kulturna atrakcija.');
                return (
                  <Link key={l.id} href={generateListingUrl(l.locationCategoryId || l.categoryId, l.name, l.id)} className="group">
                    <div className="relative h-72 md:h-80 rounded-[2.5rem] overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500">
                      <Image src={getFirstPhoto(l) || DEFAULT_LISTING_IMAGE} alt={cName} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                        <Badge className="w-fit bg-amber-400 text-slate-950 font-black text-[10px] uppercase mb-2">
                          {l.city}
                        </Badge>
                        <h3 className="text-2xl md:text-3xl font-black italic font-headline leading-tight group-hover:text-primary transition-colors">
                          {cName}
                        </h3>
                        <p className="text-xs text-white/80 line-clamp-2 mt-2 leading-relaxed">
                          {cDesc}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. SEKCIJA: CROATIABEST MAGAZIN & PUTOPISI (Odvojeno od vijesti) */}
        <section className="py-24 bg-white relative z-30 border-t border-black/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <Badge className="bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-3 flex items-center gap-1.5 w-fit">
                  <BookOpen className="size-3.5 text-primary" />
                  {isEn ? 'CROATIABEST MAGAZINE' : 'CROATIABEST MAGAZIN'}
                </Badge>
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tight font-headline text-slate-900">
                  {isEn ? 'Stories, Guides & Gastro Experiences' : 'Priče, Vodiči i Gastro Doživljaji'}
                </h2>
                <p className="text-slate-600 text-sm md:text-base max-w-xl mt-2 font-medium">
                  {isEn
                    ? 'Get inspired for your next journey: authentic travelogues, top tavern recommendations, and hidden Adriatic gems.'
                    : 'Inspirirajte se za sljedeće putovanje: autentični putopisi, preporuke vrhunskih konoba i skriveni jadranski biseri.'}
                </p>
              </div>

              {/* Filter tabs for magazine */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: isEn ? 'All topics' : 'Sve teme' },
                  { id: 'Putovanja', label: isEn ? 'Travel' : 'Putovanja' },
                  { id: 'Gastronomija', label: isEn ? 'Gastronomy' : 'Gastronomija' },
                  { id: 'Vodiči', label: isEn ? 'Guides' : 'Vodiči' },
                  { id: 'Kultura', label: isEn ? 'Culture' : 'Kultura' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setBlogCategoryTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      blogCategoryTab === tab.id
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
                <Link href="/blog">
                  <Button variant="ghost" className="text-primary font-bold text-xs uppercase tracking-wider h-10 px-3">
                    {isEn ? 'All magazine stories →' : 'Cijeli magazin →'}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Editorial Magazine Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Featured Large Blog Article (5/12) */}
              {featuredBlogArticle ? (
                <div className="lg:col-span-5 h-full">
                  <Link href={`/blog/${featuredBlogArticle.slug || featuredBlogArticle.id}`} className="group h-full flex flex-col">
                    <div className="relative h-72 md:h-80 w-full rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-xl border border-black/5">
                      {featuredBlogArticle.image && (
                        <Image src={featuredBlogArticle.image} alt={isEn ? (featuredBlogArticle.titleEn || featuredBlogArticle.title) : featuredBlogArticle.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <Badge className="absolute top-5 left-5 bg-primary text-white font-black text-xs uppercase px-3.5 py-1">
                        {formatCategory(featuredBlogArticle.category || 'MAGAZIN')}
                      </Badge>
                      <div className="absolute bottom-5 left-5 right-5 text-white">
                        <div className="flex items-center gap-3 text-xs text-white/70 mb-2 font-medium">
                          <span>{featuredBlogArticle.author || (isEn ? 'CroatiaBest Editorial' : 'CroatiaBest Redakcija')}</span>
                          <span>•</span>
                          <span>{featuredBlogArticle.readTime || '5 min'} {isEn ? 'read' : 'čitanja'}</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black italic font-headline leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {isEn ? (featuredBlogArticle.titleEn || featuredBlogArticle.title) : (featuredBlogArticle.title || featuredBlogArticle.titleEn)}
                        </h3>
                      </div>
                    </div>
                    <div className="p-4 pt-3 flex-1 flex flex-col justify-between">
                      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {isEn ? (featuredBlogArticle.excerptEn || featuredBlogArticle.excerpt) : (featuredBlogArticle.excerpt || featuredBlogArticle.excerptEn)}
                      </p>
                      <span className="text-primary font-black text-xs uppercase tracking-wider mt-4 inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                        {isEn ? 'Read full article' : 'Pročitajte cijeli putopis'} <ArrowRight className="size-4" />
                      </span>
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="lg:col-span-5 flex items-center justify-center p-12 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-300">
                  <p className="text-slate-400 font-bold text-sm">{isEn ? 'Magazine stories coming soon.' : 'Članci magazina stižu uskoro.'}</p>
                </div>
              )}

              {/* Side Magazine Grid (7/12) */}
              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                {sideBlogArticles.map((article) => {
                  const displayTitle = isEn ? (article.titleEn || article.title) : (article.title || article.titleEn);
                  const displayExcerpt = isEn ? (article.excerptEn || article.excerpt) : (article.excerpt || article.excerptEn);
                  return (
                    <Link key={article.id} href={`/blog/${article.slug || article.id}`} className="group">
                      <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:border-slate-300 transition-all flex flex-col justify-between h-full">
                        <div className="space-y-3">
                          <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-200">
                            {article.image && (
                              <Image src={article.image} alt={displayTitle} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            )}
                            <Badge className="absolute top-2.5 left-2.5 bg-black/75 text-white font-bold text-[10px] uppercase">
                              {formatCategory(article.category || 'MAGAZIN')}
                            </Badge>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1 font-medium">
                              <Clock className="size-3" /> {article.readTime || '4 min'}
                            </div>
                            <h4 className="font-black text-sm text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                              {displayTitle}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                              {displayExcerpt}
                            </p>
                          </div>
                        </div>
                        <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-primary">
                          <span>{isEn ? 'Read more' : 'Opširnije'}</span>
                          <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

            </div>
          </div>
        </section>

        {/* 7.5. O NAMA / ABOUT US SECTION (SEO & E-E-A-T TRUST SIGNALS) */}
        <section className="py-20 bg-slate-50 relative z-30 border-t border-black/5">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto bg-white rounded-[3rem] p-8 md:p-14 border border-black/5 shadow-xl space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/5 pb-8">
                <div className="space-y-2">
                  <Badge className="bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest flex items-center gap-1.5 w-fit">
                    <Sparkles className="size-3.5" />
                    {isEn ? 'ABOUT CROATIABEST' : 'O PROJEKTU CROATIABEST'}
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-headline font-black italic tracking-tight text-slate-900">
                    {isEn 
                      ? 'CroatiaBest — Your curated digital guide to Croatia' 
                      : 'CroatiaBest — Vaš autentični digitalni vodič kroz Hrvatsku'}
                  </h2>
                </div>
                <Link href={getLocalizedUrl('/about', language)}>
                  <Button variant="outline" className="rounded-2xl h-11 px-6 font-bold text-xs uppercase tracking-wider text-primary border-primary/30 hover:bg-primary/5 shrink-0">
                    {isEn ? 'Full story & Vision →' : 'Saznajte više o nama →'}
                  </Button>
                </Link>
              </div>

              <div className="prose prose-slate max-w-none text-slate-600 text-sm md:text-base leading-relaxed space-y-4 font-medium">
                <p>
                  {isEn
                    ? 'CroatiaBest was created out of a deep passion for authentic Croatia — from hidden Adriatic coves, pristine pebble beaches, and thousand-year-old stone towns to family-owned konobas, boutique wineries, and luxury resorts.'
                    : 'CroatiaBest je nastao iz strasti prema autentičnoj Hrvatskoj — od skrivenih jadranskih uvala, kristalnih šljunčanih plaža i tisućljetnih kamenih gradova, do obiteljskih konoba, butik vinarija i vrhunskog smještaja.'}
                </p>
                <p>
                  {isEn
                    ? 'Our mission is to offer travelers independent, verified, and up-to-date recommendations. We combine high-speed interactive mapping, real-time Adriatic sea and weather data, and cultural history to help you discover the true soul of Croatia.'
                    : 'Naša misija je pružiti putnicima i posjetiteljima neovisne, provjerene i točne preporuke. Spajamo modernu interaktivnu kartu, podatke o vremenu i temperaturi mora u stvarnom vremenu te bogatu povijesnu baštinu kako biste doživjeli Hrvatsku na najbolji mogući način.'}
                </p>
              </div>

              {/* 3 Trust pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-black/5">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="size-5 text-primary shrink-0" />
                  <div>
                    <h3 className="font-black text-xs uppercase tracking-wider text-slate-900">
                      {isEn ? '100% Curated' : '100% Provjereno'}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isEn ? 'Carefully selected locations' : 'Pažljivo odabrane lokacije'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <Compass className="size-5 text-primary shrink-0" />
                  <div>
                    <h3 className="font-black text-xs uppercase tracking-wider text-slate-900">
                      {isEn ? 'Interactive Map' : 'Interaktivna Karta'}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isEn ? 'Fast navigation & routes' : 'Navigacija i rute uživo'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <ShieldCheck className="size-5 text-primary shrink-0" />
                  <div>
                    <h3 className="font-black text-xs uppercase tracking-wider text-slate-900">
                      {isEn ? 'Local Heritage' : 'Kulturna Baština'}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isEn ? 'History, cities & islands' : 'Gradovi, otoci i povijest'}
                    </p>
                  </div>
                </div>
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
                    {isEn ? 'EXCLUSIVE CROATIA GUIDE' : 'EKSKLUZIVNI VODIČ KROZ HRVATSKU'}
                  </Badge>
                  <h3 className="text-3xl md:text-4xl font-black italic font-headline leading-tight">
                    {isEn ? 'Planning a trip to Croatia?' : 'Planirate putovanje po Hrvatskoj?'}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-md">
                    {isEn
                      ? 'Subscribe to our newsletter and receive weekly recommendations, hidden gems, and exclusive gastro stories directly to your inbox.'
                      : 'Prijavite se na naš newsletter i primajte tjedne preporuke, skrivene bisere i ekskluzivne gastro priče izravno u vaš inbox.'}
                  </p>
                </div>

                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder={isEn ? "Enter your email address..." : "Unesite vašu e-mail adresu..."}
                      className="flex-1 h-12 rounded-2xl bg-white/10 border border-white/20 px-5 text-sm text-white placeholder-white/50 outline-none focus:border-primary transition-all font-medium"
                    />
                    <Button 
                      type="submit"
                      className="h-12 px-8 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-black text-xs uppercase tracking-wider shrink-0 shadow-lg shadow-rose-950"
                    >
                      {isEn ? 'Subscribe' : 'Prijavi me'} <ArrowRight className="size-4 ml-1.5" />
                    </Button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {isEn
                      ? 'No spam. You can unsubscribe at any time with one click.'
                      : 'Bez spama. Možete se odjaviti u bilo kojem trenutku jednim klikom.'}
                  </p>
                </form>
              </div>

              {/* Right Card: Za vlasnike objekata */}
              <div className="p-8 md:p-12 rounded-[2.5rem] bg-white text-slate-900 flex flex-col justify-between space-y-6 shadow-2xl">
                <div className="space-y-3">
                  <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-3 py-1">
                    {isEn ? 'FOR PROPERTY OWNERS' : 'ZA VLASNIKE OBJEKATA'}
                  </Badge>
                  <h3 className="text-3xl md:text-4xl font-black italic font-headline leading-tight">
                    {isEn ? 'Do you own a villa, hotel, or top restaurant?' : 'Posjedujete vilu, hotel ili vrhunski restoran?'}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed max-w-md">
                    {isEn
                      ? 'Connect your property with thousands of travelers exploring the best destinations, beaches, and gastronomy on CroatiaBest every day.'
                      : 'Povežite svoj objekt s tisućama posjetitelja koji svakodnevno istražuju najbolja mjesta, plaže i gastronomiju na CroatiaBest.'}
                  </p>
                </div>

                <div className="space-y-3">
                  <Link href="/submit">
                    <Button className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-lg">
                      {isEn ? '+ List your property' : '+ Prijavite vaš objekt'}
                    </Button>
                  </Link>
                  <p className="text-[11px] text-slate-500">
                    {isEn
                      ? 'Quick and easy registration for verified hosts and hospitality businesses.'
                      : 'Jednostavna i brza prijava za sve verificirane ugostitelje i iznajmljivače.'}
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
