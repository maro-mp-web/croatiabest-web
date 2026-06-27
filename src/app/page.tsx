"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  const { data: blogArticles } = useCollection('blogs', {
    sort: '-created',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const getFirstPhoto = (urls: any) => {
    try {
      if (Array.isArray(urls)) return urls[0];
      if (typeof urls === 'string') return JSON.parse(urls)[0];
    } catch (e) {}
    return null;
  };

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

  // Cities Setup
  const featuredCitiesSlugs = ['zagreb', 'dubrovnik', 'split', 'rovinj', 'varazdin'];
  const featuredCities = featuredCitiesSlugs.map((slug, idx) => {
    const dbCity = (cities || []).find(c => c.slug === slug);
    const colSpans = ['md:col-span-5 md:row-span-2 h-[380px]', 'md:col-span-4 h-[180px]', 'md:col-span-4 h-[180px]', 'md:col-span-4 h-[200px]', 'md:col-span-5 h-[200px]'];
    const regions = ['Središnja Hrvatska', 'Dalmacija', 'Dalmacija', 'Istra', 'Središnja Hrvatska'];
    return {
      name: dbCity?.name || slug.charAt(0).toUpperCase() + slug.slice(1),
      slug,
      region: dbCity?.region || regions[idx],
      image: dbCity?.image || `/cities/${slug}.webp`,
      colSpan: colSpans[idx],
      indexStr: `0${idx + 1}`
    };
  });

  // Islands Setup
  const featuredIslandsSlugs = ['korcula', 'hvar', 'krk', 'cres', 'mljet'];
  const featuredIslands = featuredIslandsSlugs.map((slug, idx) => {
    const dbIsland = (islands || []).find(i => i.slug === slug);
    const colSpans = ['md:col-span-4 md:row-span-2 h-[380px]', 'md:col-span-2 h-[180px]', 'md:col-span-2 h-[180px]', 'md:col-span-3 h-[200px]', 'md:col-span-3 h-[200px]'];
    const regions = ['Dalmacija', 'Dalmacija', 'Kvarner', 'Kvarner', 'Dalmacija'];
    return {
      name: dbIsland?.name || slug.charAt(0).toUpperCase() + slug.slice(1),
      slug,
      region: dbIsland?.region || regions[idx],
      image: dbIsland?.image || `/islands/${slug}.webp`,
      colSpan: colSpans[idx],
      indexStr: `0${idx + 1}`
    };
  });

  // National Parks Setup (from listings DB)
  const nationalParks = (allListings || []).filter(l => (l.locationCategoryId || l.categoryId) === 'national_parks').slice(0, 3);

  const defaultArticles = [
    {
      id: 'mock-1',
      title: '10 Skrivenih Plaža Koje Morate Posjetiti',
      titleEn: '10 Hidden Beaches You Must Visit',
      excerpt: 'Hrvatska obala skriva predivne uvale daleko od gužvi. Otkrijte skrivene dragulje Jadrana.',
      excerptEn: 'The Croatian coast hides beautiful bays far from the crowds. Discover the hidden gems of the Adriatic.',
      category: 'Putovanja',
      image: 'https://picsum.photos/seed/beach1/800/600',
      author: 'Maro Pincević',
      readTime: '5 min',
      created: new Date().toISOString()
    },
    {
      id: 'mock-2',
      title: 'Gastro Vodič: Najbolji Istarski Tartufi',
      titleEn: 'Gastro Guide: The Best Truffles',
      excerpt: 'Saznajte gdje kušati autentične specijalitete s crnim i bijelim tartufima u unutrašnjosti Istre.',
      excerptEn: 'Find out where to taste authentic specialties with black and white truffles in the heart of Istria.',
      category: 'Gastronomija',
      image: 'https://picsum.photos/seed/truffles/800/600',
      author: 'CroatiaBest Team',
      readTime: '4 min',
      created: new Date().toISOString()
    },
    {
      id: 'mock-3',
      title: 'Kulturni Vodič Kroz Veličanstvenu Arenu u Puli',
      titleEn: 'Cultural Guide Through Pula Arena',
      excerpt: 'Povijest jednog od najbolje očuvanih rimskih amfiteatara na svijetu i priče o gladijatorima.',
      excerptEn: 'The history of one of the best preserved Roman amphitheatres in the world and stories about gladiators.',
      category: 'Kultura',
      image: 'https://picsum.photos/seed/pula/800/600',
      author: 'Lokalni Vodič',
      readTime: '6 min',
      created: new Date().toISOString()
    },
    {
      id: 'mock-hist-1',
      title: 'Kravata - Hrvatski izum koji je osvojio cijeli svijet',
      titleEn: 'The Necktie - A Croatian Invention That Conquered the World',
      excerpt: 'Saznajte kako su hrvatski vojnici u 17. stoljeću proširili modu koja je postala simbol elegancije.',
      excerptEn: 'Learn how Croatian soldiers in the 17th century spread the fashion that became a symbol of elegance.',
      category: 'Izumi',
      image: 'https://picsum.photos/seed/cravat/800/600',
      author: 'Urednik Povijesti',
      readTime: '5 min',
      created: new Date().toISOString()
    },
    {
      id: 'mock-hist-2',
      title: 'Nikola Tesla: Genij iz Smiljana',
      titleEn: 'Nikola Tesla: The Genius from Smiljan',
      excerpt: 'Biografija i priče o vizionaru koji je svojim izumima izmjenične struje rasvijetlio planetu.',
      excerptEn: 'Biography and stories about the visionary who lit up the planet with his alternating current inventions.',
      category: 'Poznati Hrvati',
      image: 'https://picsum.photos/seed/tesla/800/600',
      author: 'Urednik Znanosti',
      readTime: '8 min',
      created: new Date().toISOString()
    },
    {
      id: 'mock-war-1',
      title: 'Spomen obilježja Domovinskog rata diljem Hrvatske',
      titleEn: 'Homeland War Memorials Across Croatia',
      excerpt: 'Pregled najznačajnijih spomenika, muzeja i mjesta sjećanja posvećenih herojima i povijesti obrane.',
      excerptEn: 'Review of the most significant monuments, museums, and memorial sites dedicated to heroes and the history of defense.',
      category: 'Domovinski rat',
      image: 'https://picsum.photos/seed/memorial/800/600',
      author: 'Urednik Domovinski rat',
      readTime: '7 min',
      created: new Date().toISOString()
    }
  ];

  const articlesList = blogArticles && blogArticles.length > 0 ? blogArticles : defaultArticles;

  // Paid Premium categories
  const premiumCategories = [
    { id: 'restaurants', name: t.cat_restaurants || 'Gastronomija', icon: <Utensils className="size-6" />, color: 'from-orange-500 to-red-600', desc: 'Vrhunski restorani, konobe i gastro ponuda.' },
    { id: 'hotels', name: t.cat_hotels || 'Smještaj', icon: <Hotel className="size-6" />, color: 'from-blue-500 to-indigo-600', desc: 'Ekskluzivni hoteli, luksuzne vile i apartmani.' },
    { id: 'beaches', name: t.cat_beaches || 'Najljepše Plaže', icon: <Umbrella className="size-6" />, color: 'from-teal-400 to-cyan-600', desc: 'Plaže s plavom zastavicom i skrivene uvale.' },
    { id: 'wineries', name: t.cat_wineries || 'Vinarije & OPG', icon: <GlassWater className="size-6" />, color: 'from-purple-500 to-pink-600', desc: 'Vrhunska vina, maslinova ulja i domaći proizvodi.' },
  ];

  // Public/free categories
  const publicCategories = [
    { id: 'homeland_war', name: 'Domovinski rat', icon: <Shield className="size-5" /> },
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
      <Navbar />
      
      <main className="flex-1 relative">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute top-[65%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[180px] pointer-events-none" />

        {/* HERO SECTION */}
        <section className="relative min-h-[95vh] w-full overflow-hidden flex items-center pt-32 pb-24 bg-slate-950">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/hero-dubrovnik.jpg"
              alt="CroatiaBest Hero"
              fill
              priority
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
                      const image = getFirstPhoto(l.photoUrls) || DEFAULT_LISTING_IMAGE;
                      const path = generateListingUrl(l.locationCategoryId || l.categoryId, l.name, l.id);
                      const lName = language === 'en' && l.metadata?.nameEn ? l.metadata.nameEn : l.name;
                      return (
                        <Link key={l.id} href={path} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5">
                          <div className="relative size-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                            <Image src={image} alt={lName} fill className="object-cover" />
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
                        <Image src={city.image} alt={city.name} fill className="object-cover transition-all duration-1000 group-hover:scale-105" />
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent z-10" />
                      
                      <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                        <p className="text-[9px] font-black uppercase text-primary mb-1 tracking-[0.2em]">{city.region}</p>
                        <h4 className="text-2xl md:text-3xl font-black italic mb-3 text-white group-hover:text-primary transition-colors leading-tight">{city.name}</h4>
                        
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

        {/* SECTION 1: POPULAR LOCATIONS & LATEST ARTICLES & SPONSOR TILE */}
        <section className="py-24 bg-slate-50 relative z-30 border-b border-black/5">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Column (8/12) - Popular locations + Sponsor Card */}
              <div className="lg:col-span-8 space-y-8">
                <div className="flex justify-between items-end border-b border-black/5 pb-6">
                  <div>
                    <Badge className="bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full text-[9px] uppercase tracking-wider mb-2">
                      {language === 'en' ? 'Trending Places' : 'Istaknute Lokacije'}
                    </Badge>
                    <h3 className="text-3xl md:text-4xl font-headline font-black italic tracking-tighter text-foreground leading-none">
                      {language === 'en' ? 'Most Popular Locations' : 'Najpopularnija mjesta'}
                    </h3>
                  </div>
                  <Link href="/explore">
                    <Button variant="link" className="text-primary font-black uppercase text-xs tracking-wider">
                      {language === 'en' ? 'See all explore' : 'Istraži cijelu kartu'} <ArrowRight className="ml-1 size-4" />
                    </Button>
                  </Link>
                </div>

                {/* 4-Item Grid: 3 listings + 1 Google Ad card */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {popularListings.map((l) => {
                    const name = language === 'en' && l.metadata?.nameEn ? l.metadata.nameEn : l.name;
                    const image = getFirstPhoto(l.photoUrls) || DEFAULT_LISTING_IMAGE;
                    const path = generateListingUrl(l.locationCategoryId || l.categoryId, l.name, l.id);
                    return (
                      <Link key={l.id} href={path} className="group">
                        <div className="p-[1px] bg-gradient-to-br from-transparent to-transparent hover:from-primary hover:to-secondary rounded-[2rem] shadow-md hover:shadow-xl transition-all duration-500 h-full">
                          <Card className="rounded-[2rem] border-none overflow-hidden h-full flex flex-col bg-white">
                            <div className="relative aspect-[4/5] overflow-hidden">
                              <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                              <div className="absolute top-3 left-3">
                                <Badge className="bg-white/95 text-primary border-none shadow-sm font-black uppercase text-[8px] tracking-wider px-2 py-0.5">
                                  {language === 'en' ? 'Popular' : 'Popularno'}
                                </Badge>
                              </div>
                            </div>
                            <CardContent className="p-4 flex-1 flex flex-col justify-between bg-white">
                              <div className="space-y-1">
                                <h4 className="font-black text-sm line-clamp-1 group-hover:text-primary transition-colors leading-tight">{name}</h4>
                                <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">{l.city}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </Link>
                    );
                  })}
                  {/* Google Ad Tile */}
                  <div className="h-full flex">
                    <AdBanner format="rectangle" className="w-full h-full min-h-[250px] shadow-md rounded-[2rem] border-2 border-dashed" />
                  </div>
                </div>
              </div>

              {/* Right Column (4/12) - Blog articles title rename */}
              <div className="lg:col-span-4 space-y-8">
                <div className="flex justify-between items-end border-b border-black/5 pb-6">
                  <div>
                    <Badge className="bg-secondary/10 text-secondary border-none font-black px-4 py-1.5 rounded-full text-[9px] uppercase tracking-wider mb-2">
                      {language === 'en' ? 'Discover Stories' : 'Magazin vijesti'}
                    </Badge>
                    <h3 className="text-3xl md:text-4xl font-headline font-black italic tracking-tighter text-foreground leading-none">
                      {language === 'en' ? 'Blog Articles' : 'Blog članci'}
                    </h3>
                  </div>
                  <Link href="/blog">
                    <Button variant="link" className="text-secondary font-black uppercase text-xs tracking-wider">
                      {language === 'en' ? 'All articles' : 'Cijeli magazin'} <ChevronRight className="size-4" />
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-col gap-4">
                  {articlesList.slice(0, 3).map((article) => {
                    const bTitle = language === 'en' && article.titleEn ? article.titleEn : article.title;
                    return (
                      <Link key={article.id} href={`/blog/${article.id}`} className="group">
                        <div className="flex items-center gap-4 p-3 bg-white hover:bg-secondary/5 border border-black/5 rounded-2xl transition-all hover:shadow-md">
                          <div className="relative size-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border">
                            <Image src={article.image} alt={bTitle} fill className="object-cover" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <span className="text-[8px] font-black text-secondary uppercase tracking-widest">{article.category}</span>
                            <h4 className="font-bold text-sm text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">{bTitle}</h4>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2: PREMIUM PARTNERS */}
        <section className="py-24 bg-white relative z-30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <Badge className="bg-primary/10 text-primary border-none font-black px-6 py-2.5 rounded-full text-xs uppercase tracking-widest">
                {language === 'en' ? 'Premium Partners' : 'Premium Partneri'}
              </Badge>
              <h2 className="text-4xl md:text-5xl font-headline font-black italic tracking-tighter text-foreground leading-none">
                {language === 'en' ? 'Featured Categories' : 'Istaknute kategorije'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {premiumCategories.map((cat) => {
                const count = (allListings || []).filter(l => (l.locationCategoryId || l.categoryId) === cat.id).length;
                return (
                  <Link key={cat.id} href={`/explore?category=${cat.id}`} className="group">
                    <div className="p-[1px] rounded-[2.5rem] bg-gradient-to-br from-transparent to-transparent hover:from-primary hover:to-secondary transition-all duration-500 shadow-lg hover:shadow-2xl cursor-pointer">
                      <Card className="rounded-[2.5rem] border-none overflow-hidden bg-white h-full">
                        <CardContent className="p-8 flex flex-col gap-6">
                          <div className={`size-14 rounded-2xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-500`}>
                            {React.cloneElement(cat.icon as any, { className: 'size-6' })}
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-black text-lg uppercase tracking-wider text-foreground">{cat.name}</h4>
                            <p className="text-xs text-muted-foreground font-body leading-relaxed">{cat.desc}</p>
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t mt-auto text-xs font-bold text-primary">
                            <span>{count} {language === 'en' ? 'exclusive places' : 'ekskluzivnih mjesta'}</span>
                            <ChevronRight className="size-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 3: OTHER OBJECTS & MAGAZINE ARTICLES CATEGORIES */}
        <section className="py-24 bg-slate-50 relative z-30 border-t border-b border-black/5">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Column (6/12) - Other Public Object Categories & Places & Sponsor Tile */}
              <div className="lg:col-span-6 space-y-8">
                <div className="flex justify-between items-end border-b border-black/5 pb-6">
                  <div>
                    <Badge className="bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full text-[9px] uppercase tracking-wider mb-2">
                      {language === 'en' ? 'Culture & Nature' : 'Kulturna Baština & Atrakcije'}
                    </Badge>
                    <h3 className="text-3xl font-headline font-black italic tracking-tighter text-foreground leading-none">
                      {language === 'en' ? 'Other Tourist Categories' : 'Ostale atrakcije i javne usluge'}
                    </h3>
                  </div>
                </div>

                {/* 3-Item Grid: 2 listings + 1 Ad banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {publicListings.map((l) => {
                    const name = language === 'en' && l.metadata?.nameEn ? l.metadata.nameEn : l.name;
                    const image = getFirstPhoto(l.photoUrls) || DEFAULT_LISTING_IMAGE;
                    const path = generateListingUrl(l.locationCategoryId || l.categoryId, l.name, l.id);
                    const catName = publicCategories.find(c => c.id === (l.locationCategoryId || l.categoryId))?.name || 'Znamenitost';
                    return (
                      <Link key={l.id} href={path} className="group">
                        <div className="p-[1px] bg-gradient-to-br from-transparent to-transparent hover:from-primary hover:to-secondary rounded-[2rem] shadow-md hover:shadow-xl transition-all duration-500 h-full">
                          <Card className="rounded-[2rem] border-none overflow-hidden h-full flex flex-col bg-white">
                            <div className="relative aspect-[4/5] overflow-hidden">
                              <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                              <div className="absolute top-3 left-3">
                                <Badge className="bg-foreground text-white border-none shadow-sm font-black uppercase text-[8px] tracking-wider px-2 py-0.5">
                                  {catName}
                                </Badge>
                              </div>
                            </div>
                            <CardContent className="p-4 flex-1 flex flex-col justify-between bg-white">
                              <div className="space-y-1">
                                <h4 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors leading-tight">{name}</h4>
                                <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">{l.city}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </Link>
                    );
                  })}
                  {/* Google Ad Tile */}
                  <div className="h-full flex">
                    <AdBanner format="rectangle" className="w-full h-full min-h-[180px] shadow-md rounded-[2rem] border-2 border-dashed" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {publicCategories.map((cat) => {
                    const count = (allListings || []).filter(l => (l.locationCategoryId || l.categoryId) === cat.id).length;
                    return (
                      <Link key={cat.id} href={`/explore?category=${cat.id}`} className="flex items-center justify-between p-4 bg-white border border-black/5 rounded-2xl hover:border-primary/20 transition-all shadow-sm">
                        <span className="text-xs font-black uppercase tracking-wider text-foreground/80">{cat.name}</span>
                        <Badge className="bg-secondary/10 text-secondary border-none font-bold text-[10px]">{count}</Badge>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Right Column (6/12) - Magazine Articles & Categories */}
              <div className="lg:col-span-6 space-y-8">
                <div className="flex justify-between items-end border-b border-black/5 pb-6">
                  <div>
                    <Badge className="bg-secondary/10 text-secondary border-none font-black px-4 py-1.5 rounded-full text-[9px] uppercase tracking-wider mb-2">
                      {language === 'en' ? 'Discover Magazine' : 'Istražite Teme'}
                    </Badge>
                    <h3 className="text-3xl font-headline font-black italic tracking-tighter text-foreground leading-none">
                      {language === 'en' ? 'Stories by Categories' : 'Kategorije članaka i priče'}
                    </h3>
                  </div>
                </div>

                {/* Grid of magazine themes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articlesList.slice(0, 2).map((article) => {
                    const bTitle = language === 'en' && article.titleEn ? article.titleEn : article.title;
                    const bExcerpt = language === 'en' && article.excerptEn ? article.excerptEn : article.excerpt;
                    return (
                      <Link key={article.id} href={`/blog/${article.id}`} className="group h-full">
                        <div className="group rounded-[2rem] overflow-hidden shadow-md border border-black/5 bg-white hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-full flex flex-col">
                          <div className="relative h-40 overflow-hidden">
                            <Image src={article.image} alt={bTitle} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                            <Badge className="absolute top-4 left-4 bg-secondary text-white border-none shadow-md font-black text-[8px] uppercase tracking-wider">{article.category}</Badge>
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                              <h4 className="text-base font-bold font-headline leading-snug line-clamp-2 group-hover:text-primary transition-colors">{bTitle}</h4>
                              <p className="text-muted-foreground line-clamp-2 font-body text-[11px] leading-relaxed">{bExcerpt}</p>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t mt-4 text-[9px] text-muted-foreground font-bold">
                              <span>{article.author || 'CroatiaBest'}</span>
                              <span>{article.readTime || '5 min'}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Subcategories/tags for blogs */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {['Putovanja', 'Gastronomija', 'Kultura', 'Savjeti', 'Povijest', 'Poznati Hrvati', 'Izumi', 'Domovinski rat'].map((catName) => {
                    const count = articlesList.filter(a => a.category === catName).length;
                    return (
                      <Link key={catName} href="/blog" className="px-4 py-2.5 bg-white border border-black/5 rounded-xl hover:border-secondary/20 transition-all shadow-sm text-xs font-bold text-foreground/80 flex items-center gap-2">
                        <span>{catName}</span>
                        <span className="text-[10px] text-secondary font-black">({count > 0 ? count : 1})</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* BOTTOM SECTION: KULTURNA BAŠTINA & DOMOVINSKI RAT & SPOMENICI (3-COLUMN GROUPED ROW) */}
        <section className="py-24 bg-white relative z-30 border-b border-black/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <Badge className="bg-red-50 text-red-600 border-none font-black px-6 py-2.5 rounded-full text-xs uppercase tracking-widest">
                {language === 'en' ? 'Heritage & History' : 'Kulturna Baština i Povijest'}
              </Badge>
              <h2 className="text-4xl md:text-5xl font-headline font-black italic tracking-tighter text-foreground leading-none">
                {language === 'en' ? 'History, Homeland War & Monuments' : 'Povijest, Domovinski rat i Spomenici'}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Column 1: History, Inventions, Famous Croats (Blog) */}
              <div className="space-y-6 bg-slate-50/50 p-8 rounded-[2.5rem] border border-black/5">
                <h3 className="text-xl font-headline font-black italic flex items-center gap-2 border-b pb-4 text-foreground">
                  <Lightbulb className="size-5 text-primary" /> {language === 'en' ? 'History & Inventions' : 'Iz Povijesti i Izumi'}
                </h3>
                <div className="space-y-4">
                  {historyArticles.length > 0 ? (
                    historyArticles.map((a) => {
                      const bTitle = isEn && a.titleEn ? a.titleEn : a.title;
                      return (
                        <Link key={a.id} href={`/blog/${a.id}`} className="block group">
                          <div className="p-4 bg-white border border-black/5 rounded-2xl hover:shadow-md transition-all">
                            <span className="text-[8px] font-black text-primary uppercase tracking-widest">{a.category}</span>
                            <h4 className="font-bold text-sm text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors mt-1">{bTitle}</h4>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <p className="text-xs text-muted-foreground italic font-body">{language === 'en' ? 'No articles available.' : 'Nema dostupnih članaka.'}</p>
                  )}
                </div>
              </div>

              {/* Column 2: Homeland War (Blog) */}
              <div className="space-y-6 bg-slate-50/50 p-8 rounded-[2.5rem] border border-black/5">
                <h3 className="text-xl font-headline font-black italic flex items-center gap-2 border-b pb-4 text-foreground">
                  <Shield className="size-5 text-red-600" /> {language === 'en' ? 'Homeland War Stories' : 'Domovinski rat (Priče)'}
                </h3>
                <div className="space-y-4">
                  {warArticles.length > 0 ? (
                    warArticles.map((a) => {
                      const bTitle = isEn && a.titleEn ? a.titleEn : a.title;
                      return (
                        <Link key={a.id} href={`/blog/${a.id}`} className="block group">
                          <div className="p-4 bg-white border border-black/5 rounded-2xl hover:shadow-md transition-all">
                            <span className="text-[8px] font-black text-red-600 uppercase tracking-widest">{a.category}</span>
                            <h4 className="font-bold text-sm text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors mt-1">{bTitle}</h4>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <p className="text-xs text-muted-foreground italic font-body">{language === 'en' ? 'No articles available.' : 'Nema dostupnih članaka.'}</p>
                  )}
                </div>
              </div>

              {/* Column 3: Spomenici (Monuments Listings) */}
              <div className="space-y-6 bg-slate-50/50 p-8 rounded-[2.5rem] border border-black/5">
                <h3 className="text-xl font-headline font-black italic flex items-center gap-2 border-b pb-4 text-foreground">
                  <Landmark className="size-5 text-secondary" /> {language === 'en' ? 'Historical Monuments' : 'Spomenici i Znamenitosti'}
                </h3>
                <div className="space-y-4">
                  {monumentListings.length > 0 ? (
                    monumentListings.map((l) => {
                      const name = isEn && l.metadata?.nameEn ? l.metadata.nameEn : l.name;
                      const path = generateListingUrl(l.locationCategoryId || l.categoryId, l.name, l.id);
                      return (
                        <Link key={l.id} href={path} className="block group">
                          <div className="p-4 bg-white border border-black/5 rounded-2xl hover:shadow-md transition-all">
                            <span className="text-[8px] font-black text-secondary uppercase tracking-widest">
                              {l.locationCategoryId === 'homeland_war' ? (language === 'en' ? 'War Memorial' : 'Spomen obilježje') : (language === 'en' ? 'Monument' : 'Spomenik')}
                            </span>
                            <h4 className="font-bold text-sm text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors mt-1">{name}</h4>
                            <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-1 flex items-center gap-0.5"><MapPin className="size-2.5" /> {l.city}</p>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <p className="text-xs text-muted-foreground italic font-body">{language === 'en' ? 'No monuments registered.' : 'Nema registriranih spomenika.'}</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ISLANDS BENTO GRID SECTION (Otoci) - PREDZADNJA SEKCIJA */}
        <section className="py-24 bg-slate-50 relative z-30 border-t border-b border-black/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <Badge className="bg-primary/10 text-primary border-none font-black px-6 py-2.5 rounded-full text-xs uppercase tracking-widest">
                {language === 'en' ? 'Islands of Croatia' : 'Hrvatski Otoci'}
              </Badge>
              <h2 className="text-5xl md:text-6xl font-headline font-black italic tracking-tighter text-foreground leading-none">
                {language === 'en' ? 'Explore beautiful islands' : 'Istražite otoke'}
              </h2>
              <p className="text-muted-foreground font-body italic text-base max-w-xl mx-auto">
                {language === 'en' ? 'Highlighted islands Korčula, Hvar, Krk, Cres, and Mljet.' : 'Istaknuti otoci Korčula, Hvar, Krk, Cres i Mljet.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              {featuredIslands.map((island) => (
                <Link key={island.slug} href={`/islands/${island.slug}`} className={`${island.colSpan} group`}>
                  <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg border border-black/5 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 ease-out bg-slate-900">
                    
                    <div className="absolute top-4 right-6 z-20 text-white/20 text-4xl font-black font-headline italic tracking-tighter select-none">
                      {island.indexStr}
                    </div>

                    <div className="relative w-full h-full">
                      <Image src={island.image} alt={island.name} fill className="object-cover transition-all duration-1000 group-hover:scale-105" />
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent z-10" />
                    
                    <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                      <p className="text-[9px] font-black uppercase text-primary mb-1 tracking-[0.2em]">{island.region}</p>
                      <h4 className="text-2xl md:text-3xl font-black italic mb-3 text-white group-hover:text-primary transition-colors leading-tight">{island.name}</h4>
                      
                      <div className="overflow-hidden h-0 group-hover:h-10 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out flex items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                          {language === 'en' ? 'EXPLORE ISLAND' : 'ISTRAŽI OTOK'} <Compass className="size-4 animate-spin-slow text-primary" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* NATIONAL PARKS SECTION - ZADNJA SEKCIJA */}
        <section className="py-24 bg-white relative z-30 border-b border-black/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
              <div className="text-left space-y-4">
                <Badge className="bg-emerald-100 text-emerald-700 border-none font-black px-6 py-2.5 rounded-full text-xs uppercase tracking-widest">
                  {language === 'en' ? 'Nature Heritage' : 'Nacionalni Parkovi'}
                </Badge>
                <h2 className="text-4xl md:text-5xl font-headline font-black italic tracking-tighter text-foreground leading-none">
                  {language === 'en' ? 'Most Visited National Parks' : 'Nacionalni Parkovi'}
                </h2>
                <p className="text-muted-foreground font-body italic text-base max-w-xl">
                  {language === 'en' ? 'Explore Plitvice, Krka, and Mljet National Parks.' : 'Istražite predivne prirodne ljepote Plitvica, Krke i Mljeta.'}
                </p>
              </div>
              <Link href="/explore?category=national_parks">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest px-6 py-4 rounded-full transition-all">
                  {language === 'en' ? 'See all parks' : 'Prikaži više'} <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {nationalParks.map((park) => {
                const name = isEn && park.metadata?.nameEn ? park.metadata.nameEn : park.name;
                const desc = isEn && park.metadata?.descriptionEn ? park.metadata.descriptionEn : park.description;
                const image = getFirstPhoto(park.photoUrls) || DEFAULT_LISTING_IMAGE;
                const path = generateListingUrl('national_parks', park.name, park.id);
                return (
                  <Link key={park.id} href={path} className="group">
                    <div className="p-[1px] bg-gradient-to-br from-transparent to-transparent hover:from-emerald-500 hover:to-teal-500 rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all duration-500 h-full">
                      <Card className="rounded-[2.5rem] border-none overflow-hidden h-full flex flex-col bg-white">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-emerald-600 text-white border-none shadow-md font-black uppercase text-[8px] tracking-wider px-3 py-1">
                              {language === 'en' ? 'National Park' : 'Nacionalni park'}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-6 flex-1 flex flex-col justify-between">
                          <div className="space-y-3">
                            <h4 className="font-black text-xl text-foreground line-clamp-1 group-hover:text-emerald-600 transition-colors leading-tight">{name}</h4>
                            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest flex items-center gap-1"><MapPin className="size-3" /> {park.city}</p>
                            <p className="text-muted-foreground font-body leading-relaxed text-xs line-clamp-3">{desc}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
