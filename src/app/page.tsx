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
  Anchor,
  Trees,
  Award,
  Lightbulb,
  Bookmark
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCollection } from '@/pocketbase';
import AdBanner from '@/components/ads/AdBanner';
import { generateListingUrl } from '@/app/lib/utils/slug';
import { useRouter } from 'next/navigation';
import { DEFAULT_LISTING_IMAGE } from '@/app/lib/constants';

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
    sort: '-created',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }
    const filtered = (allListings || []).filter(l => {
      const isEnLang = language === 'en';
      const name = isEnLang && l.metadata?.nameEn ? l.metadata.nameEn : l.name;
      return name.toLowerCase().includes(val.toLowerCase()) || 
             l.city.toLowerCase().includes(val.toLowerCase());
    }).slice(0, 5);
    setSearchResults(filtered);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
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

  // Cities Setup — read from homepage_sections items or fall back to defaults
  const citiesSection = (homepageSections || []).find((s: any) => s.type === 'cities');
  const citiesSectionItems: any[] = (() => {
    try {
      const raw = citiesSection?.items;
      return typeof raw === 'string' ? JSON.parse(raw) : (raw || []);
    } catch { return []; }
  })();
  const featuredCitiesSlugs = citiesSectionItems.length > 0 ? citiesSectionItems.map(i => i.slug) : ['zagreb', 'dubrovnik', 'split', 'rovinj', 'varazdin'];
  const colSpansCities = ['md:col-span-5 md:row-span-2 h-[380px]', 'md:col-span-4 h-[180px]', 'md:col-span-4 h-[180px]', 'md:col-span-4 h-[200px]', 'md:col-span-5 h-[200px]'];
  const featuredCities = featuredCitiesSlugs.map((slug, idx) => {
    const dbCity = (cities || []).find(c => c.slug === slug);
    const sectionItem = citiesSectionItems.find(i => i.slug === slug);
    const regions = ['Središnja Hrvatska', 'Dalmacija', 'Dalmacija', 'Istra', 'Središnja Hrvatska'];
    // Image priority: section item override > db city image > fallback
    const image = (sectionItem?.image && sectionItem.image.trim() !== '') 
      ? sectionItem.image 
      : (dbCity && typeof dbCity.image === 'string' && dbCity.image.trim() !== '') 
        ? dbCity.image 
        : (getFirstPhoto(dbCity, 'image') || `/cities/${slug}.webp`);
    return {
      name: dbCity?.name || slug.charAt(0).toUpperCase() + slug.slice(1),
      slug,
      region: dbCity?.region || regions[idx % regions.length],
      image,
      colSpan: colSpansCities[idx % colSpansCities.length],
      indexStr: `0${idx + 1}`,
      description: sectionItem?.description || '',
      descriptionEn: sectionItem?.descriptionEn || '',
    };
  });

  // Islands Setup — read from homepage_sections items or fall back to defaults
  const islandsSection = (homepageSections || []).find((s: any) => s.type === 'islands');
  const islandsSectionItems: any[] = (() => {
    try {
      const raw = islandsSection?.items;
      return typeof raw === 'string' ? JSON.parse(raw) : (raw || []);
    } catch { return []; }
  })();
  const featuredIslandsSlugs = islandsSectionItems.length > 0 ? islandsSectionItems.map(i => i.slug) : ['korcula', 'hvar', 'krk', 'cres', 'mljet'];
  const colSpansIslands = ['md:col-span-4 md:row-span-2 h-[380px]', 'md:col-span-2 h-[180px]', 'md:col-span-2 h-[180px]', 'md:col-span-3 h-[200px]', 'md:col-span-3 h-[200px]'];
  const featuredIslands = featuredIslandsSlugs.map((slug, idx) => {
    const dbIsland = (islands || []).find(i => i.slug === slug);
    const sectionItem = islandsSectionItems.find(i => i.slug === slug);
    const regions = ['Dalmacija', 'Dalmacija', 'Kvarner', 'Kvarner', 'Dalmacija'];
    const image = (sectionItem?.image && sectionItem.image.trim() !== '') 
      ? sectionItem.image 
      : (dbIsland && typeof dbIsland.image === 'string' && dbIsland.image.trim() !== '') 
        ? dbIsland.image 
        : (getFirstPhoto(dbIsland, 'image') || `/islands/${slug}.webp`);
    return {
      name: dbIsland?.name || slug.charAt(0).toUpperCase() + slug.slice(1),
      slug,
      region: dbIsland?.region || regions[idx % regions.length],
      image,
      colSpan: colSpansIslands[idx % colSpansIslands.length],
      indexStr: `0${idx + 1}`,
      description: sectionItem?.description || '',
      descriptionEn: sectionItem?.descriptionEn || '',
    };
  });

  // National Parks Setup (from listings DB)
  const nationalParks = (allListings || []).filter(l => (l.locationCategoryId || l.categoryId) === 'national_parks').slice(0, 3);
  const articlesList = blogArticles || [];

  // Paid Premium categories
  const premiumCategories = [
    { id: 'restaurants', name: t.cat_restaurants || 'Gastronomija', icon: <Utensils className="size-6" />, color: 'from-orange-500 to-red-600', desc: 'Vrhunski restorani, konobe i gastro ponuda.' },
    { id: 'hotels', name: t.cat_hotels || 'Smještaj', icon: <Hotel className="size-6" />, color: 'from-blue-500 to-indigo-600', desc: 'Ekskluzivni hoteli, luksuzne vile i apartmani.' },
    { id: 'beaches', name: t.cat_beaches || 'Najljepše Plaže', icon: <Umbrella className="size-6" />, color: 'from-teal-400 to-cyan-600', desc: 'Plaže s plavom zastavicom i skrivene uvale.' },
    { id: 'wineries', name: t.cat_wineries || 'Vinarije & OPG', icon: <GlassWater className="size-6" />, color: 'from-purple-500 to-pink-600', desc: 'Vrhunska vina, maslinova ulja i domaći proizvodi.' },
  ];

  // Public/free categories
  const publicCategories = [
    { id: 'homeland_war', name: 'Spomenici', icon: <Shield className="size-5" /> },
    { id: 'landmarks', name: 'Znamenitosti', icon: <Landmark className="size-5" /> },
    { id: 'culture', name: 'Kultura & Muzeji', icon: <Library className="size-5" /> },
    { id: 'viewpoints', name: 'Vidikovci', icon: <Binoculars className="size-5" /> },
  ];

  // Logic splits:
  // 1. Most popular locations (listings from paid categories)
  const popularListings = (allListings || [])
    .filter(l => ['restaurants', 'hotels', 'beaches', 'wineries'].includes(l.locationCategoryId || l.categoryId))
    .slice(0, 3);

  // 2. Public locations (landmarks, Homeland War, viewpoints)
  const publicListings = (allListings || [])
    .filter(l => ['homeland_war', 'landmarks', 'culture', 'viewpoints'].includes(l.locationCategoryId || l.categoryId))
    .slice(0, 2);

  // 3. Spomenici i povijest
  const monumentListings = (allListings || [])
    .filter(l => (l.locationCategoryId || l.categoryId) === 'landmarks' || (l.locationCategoryId || l.categoryId) === 'homeland_war')
    .slice(0, 3);

  const historyArticles = articlesList.filter(a => ['Povijest', 'Izumi', 'Poznati Hrvati'].includes(a.category)).slice(0, 3);
  const warArticles = articlesList.filter(a => a.category === 'Domovinski rat').slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden selection:bg-primary selection:text-white">
      <Navbar transparent />
      
      <main className="flex-1 relative">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute top-[65%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[180px] pointer-events-none" />

        {/* HERO SECTION */}
        <section className="relative z-40 min-h-[95vh] w-full flex items-center pt-32 pb-24 bg-slate-950">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image 
              src={featuredCities.find(c => c.slug === 'dubrovnik')?.image || "/hero-dubrovnik.jpg"}
              alt="CroatiaBest Hero"
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              className="object-cover opacity-85 scale-100 animate-zoom-in"
            />
            {/* Custom dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent z-10" />
          </div>

          <div className="container mx-auto px-6 relative z-20">
            <div className="max-w-4xl space-y-10 animate-fade-in text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full text-white text-[12px] font-black tracking-[0.3em] uppercase shadow-lg shadow-black/20">
                <Sparkles className="size-4 text-primary fill-primary animate-pulse" /> {t.heroBadge}
              </div>
              
              {/* Heading */}
              <h1 className="text-6xl md:text-[7.5rem] font-black text-white leading-[0.85] tracking-tighter font-headline italic drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)]">
                {t.heroVideoTitle}
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-white/90 font-body italic max-w-2xl leading-relaxed drop-shadow">
                {t.heroVideoSub}
              </p>

              {/* Advanced Double-bordered Search Input */}
              <div className="relative w-full max-w-2xl pt-2 search-box-container" onFocus={() => setShowResults(true)}>
                <div className="p-[2px] bg-gradient-to-r from-primary via-secondary to-accent rounded-[2rem] shadow-2xl focus-within:scale-[1.01] transition-all duration-300">
                  <div className="flex items-center bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] px-6 py-3">
                    <Search className="size-6 text-primary mr-4 animate-bounce" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyDown={handleKeyDown}
                      placeholder={t.searchPlaceholder || "Pretraži plaže, restorane..."}
                      className="w-full h-12 bg-transparent text-white placeholder-white/40 outline-none text-lg font-bold"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => { setSearchQuery(''); setSearchResults([]); }} 
                        className="text-white/60 hover:text-white font-black text-sm uppercase px-2 py-1 bg-white/5 rounded-full transition-all mr-3"
                      >
                        X
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        if (searchQuery.trim()) {
                          router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
                        }
                      }}
                      className="bg-primary hover:bg-primary/95 text-white font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-full transition-all shadow-md flex-shrink-0"
                    >
                      {language === 'en' ? 'Search' : 'Traži'}
                    </button>
                  </div>
                </div>

                {/* Real-time search suggestions */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-4 bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden z-50 p-6 space-y-3 max-h-[380px] overflow-y-auto ring-1 ring-black/50">
                    {searchResults.map((l) => {
                      const image = getFirstPhoto(l) || DEFAULT_LISTING_IMAGE;
                      const path = generateListingUrl(l.locationCategoryId || l.categoryId, l.name, l.id);
                      const lName = language === 'en' && l.metadata?.nameEn ? l.metadata.nameEn : l.name;
                      return (
                        <Link key={l.id} href={path} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5">
                          <div className="relative size-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                            <Image src={image} alt={lName} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="font-black text-white text-lg line-clamp-1">{lName}</p>
                            <p className="text-xs text-primary font-black uppercase tracking-wider">{l.city}</p>
                          </div>
                          <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10">
                            <ChevronRight className="size-5" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* CITY GUIDES & DEDICATED AD COLUMN (SIDE-BY-SIDE) */}
        <section className="py-24 bg-white relative z-30 shadow-2xl rounded-t-[3.5rem] -mt-20 border-t border-black/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <Badge className="bg-primary/10 text-primary border-none font-black px-6 py-2.5 rounded-full text-xs uppercase tracking-widest">
                {language === 'en' ? 'Exclusive City Guides' : 'Ekskluzivni Vodiči'}
              </Badge>
              <h2 className="text-5xl md:text-6xl font-headline font-black italic tracking-tighter text-foreground leading-none">
                {language === 'en' ? 'Explore beautiful destinations' : 'Istražite gradove'}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Cities Bento Grid (9/12) */}
              <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-9 gap-6">
                {featuredCities.map((city) => (
                  <Link key={city.slug} href={`/cities/${city.slug}`} className={`${city.colSpan} group`}>
                    <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg border border-black/5 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 ease-out bg-slate-900">
                      
                      <div className="absolute top-4 right-6 z-20 text-white/20 text-4xl font-black font-headline italic tracking-tighter select-none">
                        {city.indexStr}
                      </div>

                      <div className="relative w-full h-full">
                        <Image src={city.image} alt={city.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-all duration-1000 group-hover:scale-105" />
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent z-10" />
                      
                      <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                        <p className="text-[9px] font-black uppercase text-primary mb-1 tracking-[0.2em]">{city.region}</p>
                        <h3 className="text-2xl md:text-3xl font-black italic mb-3 text-white group-hover:text-primary transition-colors leading-tight">{city.name}</h3>
                        
                        <div className="overflow-hidden h-0 group-hover:h-10 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out flex items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            {language === 'en' ? 'EXPLORE CITY' : 'VODIČ KROZ GRAD'} <Compass className="size-4 animate-spin-slow text-primary" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Vertical Ads Banner Slot (3/12) */}
              <div className="lg:col-span-3 h-full">
                <div className="sticky top-24 bg-slate-50 border border-black/5 p-4 rounded-[2.5rem] shadow-md flex items-center justify-center">
                  <AdBanner format="vertical" className="w-full h-[600px] max-w-full" />
                </div>
              </div>
            </div>

          </div>
        </section>

        
        {/* DYNAMIC SECTIONS */}
        {(homepageSections || []).filter((s: any) => s.isActive !== false).map((section: any, index: number) => {
          
          if (section.type === 'custom') {
            return (
              <section key={section.id} className="py-24 relative z-30" style={{ backgroundColor: index % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                <div className="container mx-auto px-6">
                  <div className="max-w-4xl mx-auto space-y-8">
                    {section.title && (
                      <h2 className="text-4xl md:text-5xl font-headline font-black italic tracking-tighter text-foreground leading-none text-center">
                        {section.title}
                      </h2>
                    )}
                    {section.image && (
                      <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <Image src={section.image} alt={section.title} fill className="object-cover" />
                      </div>
                    )}
                    {section.content && (
                      <div className="prose prose-lg prose-slate max-w-none prose-headings:font-headline prose-headings:italic prose-a:text-primary" dangerouslySetInnerHTML={{ __html: section.content }} />
                    )}
                  </div>
                </div>
              </section>
            );
          }



          if (section.type === 'islands') {
            return (
              <section key={section.id} className="py-24 relative z-30 bg-white">
                <div className="container mx-auto px-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div className="max-w-xl space-y-4">
                      <Badge className="bg-secondary/10 text-secondary border-none font-black px-6 py-2.5 rounded-full text-xs uppercase tracking-widest">{language === 'en' ? 'Island Hopping' : 'Otočne Destinacije'}</Badge>
                      <h2 className="text-4xl md:text-5xl font-headline font-black italic tracking-tighter text-foreground leading-none">
                        {section.title}
                      </h2>
                      {section.content && <div className="text-muted-foreground text-lg leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: section.content }} />}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:auto-rows-min">
                    {featuredIslands.map((island) => (
                      <div key={island.slug} className={`relative group overflow-hidden rounded-[2rem] shadow-md hover:shadow-xl transition-all duration-700 ${island.colSpan}`}>
                        <div className="absolute inset-0 z-0">
                          <Image src={island.image} alt={island.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-all duration-1000 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                          <p className="text-[9px] font-black uppercase text-secondary mb-1 tracking-[0.2em]">{island.region}</p>
                          <h3 className="text-2xl md:text-3xl font-black italic mb-2 text-white group-hover:text-secondary transition-colors leading-tight">{island.name}</h3>
                        </div>
                        <Link href={`/islands/${island.slug}`} className="absolute inset-0 z-30"><span className="sr-only">{island.name}</span></Link>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          if (section.type === 'popular_listings') {
            return (
              <section key={section.id} className="py-24 bg-slate-50 relative z-30 border-b border-black/5">
                <div className="container mx-auto px-6">
                  <div className="flex justify-between items-end border-b border-black/5 pb-6 mb-8">
                    <div className="max-w-2xl space-y-2">
                      <Badge className="bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full text-[9px] uppercase tracking-wider mb-2">Istaknuto</Badge>
                      <h3 className="text-3xl md:text-4xl font-headline font-black italic tracking-tighter text-foreground leading-none">{section.title}</h3>
                      {section.content && <div className="text-muted-foreground font-medium" dangerouslySetInnerHTML={{ __html: section.content }} />}
                    </div>
                    <Link href="/explore">
                      <Button variant="link" className="text-primary font-black uppercase text-xs tracking-wider">
                        {language === 'en' ? 'See all' : 'Istraži sve'} <ArrowRight className="ml-1 size-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {popularListings.map((l) => {
                      const name = language === 'en' && l.metadata?.nameEn ? l.metadata.nameEn : l.name;
                      const image = getFirstPhoto(l) || DEFAULT_LISTING_IMAGE;
                      const path = generateListingUrl(l.locationCategoryId || l.categoryId, l.name, l.id);
                      return (
                        <Link key={l.id} href={path} className="group">
                          <div className="p-[1px] bg-gradient-to-br from-transparent to-transparent hover:from-primary hover:to-secondary rounded-[2rem] shadow-md hover:shadow-xl transition-all duration-500 h-full">
                            <Card className="rounded-[2rem] border-none overflow-hidden h-full flex flex-col bg-white">
                              <div className="relative aspect-[4/5] overflow-hidden">
                                <Image src={image} alt={name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                              </div>
                              <CardContent className="p-4 flex-1 flex flex-col justify-between bg-white">
                                <h4 className="font-black text-sm line-clamp-1">{name}</h4>
                                <p className="text-[9px] text-muted-foreground uppercase">{l.city}</p>
                              </CardContent>
                            </Card>
                          </div>
                        </Link>
                      );
                    })}
                    <div className="h-full flex"><AdBanner format="rectangle" className="w-full h-full min-h-[250px] shadow-md rounded-[2rem]" /></div>
                  </div>
                </div>
              </section>
            );
          }

          if (section.type === 'premium') {
            return (
              <section key={section.id} className="py-24 bg-white relative z-30">
                <div className="container mx-auto px-6">
                  <div className="text-center mb-16 space-y-4">
                    <Badge className="bg-primary/10 text-primary border-none font-black px-6 py-2.5 rounded-full text-xs uppercase tracking-widest">Premium</Badge>
                    <h2 className="text-4xl md:text-5xl font-headline font-black italic tracking-tighter text-foreground leading-none">{section.title}</h2>
                    {section.content && <div className="text-muted-foreground max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: section.content }} />}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {premiumCategories.map((cat) => (
                      <Link key={cat.id} href={`/explore?category=${cat.id}`} className="group">
                        <div className="p-[1px] rounded-[2.5rem] bg-gradient-to-br from-transparent to-transparent hover:from-primary hover:to-secondary transition-all duration-500 shadow-lg hover:shadow-2xl">
                          <Card className="rounded-[2.5rem] border-none bg-white h-full p-8 flex flex-col gap-6">
                            <div className={`size-14 rounded-2xl bg-gradient-to-br ${cat.color} text-white flex justify-center items-center shadow-md group-hover:scale-105 transition-transform duration-500`}>
                              {React.cloneElement(cat.icon as any, { className: 'size-6' })}
                            </div>
                            <h3 className="font-black text-lg uppercase tracking-wider">{cat.name}</h3>
                          </Card>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          if (section.type === 'public_listings') {
            return (
              <section key={section.id} className="py-24 bg-slate-50 relative z-30">
                <div className="container mx-auto px-6">
                  <div className="mb-8">
                    <h3 className="text-3xl font-headline font-black italic">{section.title}</h3>
                    {section.content && <div dangerouslySetInnerHTML={{ __html: section.content }} className="mt-2 text-slate-600" />}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {publicListings.map((l: any) => (
                      <Link key={l.id} href={generateListingUrl(l.locationCategoryId || l.categoryId, l.name, l.id)}>
                        <Card className="rounded-[2rem] border-none overflow-hidden h-64 relative group shadow-md hover:shadow-xl">
                          <Image src={getFirstPhoto(l) || DEFAULT_LISTING_IMAGE} alt={l.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/40" />
                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <h4 className="font-bold">{l.name}</h4>
                            <p className="text-[10px] uppercase">{l.city}</p>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );
          }
          
          return null;
        })}

      </main>
    </div>
  );
}
