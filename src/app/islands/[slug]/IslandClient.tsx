"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import Image from 'next/image';
import { 
  Anchor, 
  ShieldAlert, 
  Users, 
  Landmark, 
  Phone as PhoneIcon, 
  Globe, 
  Home as HomeIcon, 
  Map as MapIcon,
  Binoculars,
  Utensils,
  Umbrella,
  ChevronRight,
  BedDouble,
  ArrowRight,
  MapPin,
  Shield,
  BookOpen,
  Calendar,
  Clock,
  Newspaper,
  Sparkles
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { generateListingUrl } from '@/app/lib/utils/slug';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollection, useUser } from '@/pocketbase';
import Map from '@/components/map/Map';
import WikiView from '@/components/ui/WikiView';
import FAQSection from '@/components/ui/FAQSection';
import { useLanguage } from '@/contexts/LanguageContext';
import { getFirstPhoto, isDummyPlaceholderPhoto } from '@/app/lib/image-helpers';
import { getLocalizedUrl } from '@/lib/i18n-routes';
import { DEFAULT_LISTING_IMAGE } from '@/app/lib/constants';
import AdBanner from '@/components/ads/AdBanner';
import WeatherWidget, { WeatherAnchorPill } from '@/components/weather/WeatherWidget';
import type { WeatherData } from '@/app/lib/weather';
import { formatDate } from '@/lib/utils';

const DEFAULT_BLOG_IMAGE = 'https://croatiabest.com.hr/hero-dubrovnik.jpg';

interface IslandClientProps {
  island: any;
  listings: any[];
  articles?: any[];
  islandCities?: any[];
  globalSpecialListings?: any[];
  weather?: WeatherData | null;
}

export default function IslandClient({ island, listings = [], articles = [], islandCities = [], globalSpecialListings = [], weather = null }: IslandClientProps) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { user } = useUser();
  const isAdmin = user?.email === 'maro.webdeveloper@gmail.com';
  
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [wikiData, setWikiData] = useState<{extract: string, thumbnail?: string}>({ extract: '' });
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    if (island) {
      const encodedIsland = encodeURIComponent(island.name);
      fetch(`https://hr.wikipedia.org/api/rest_v1/page/summary/${encodedIsland}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.extract) {
            setWikiData({ extract: data.extract, thumbnail: data.thumbnail?.source });
          }
        })
        .catch(err => console.error('Wiki error', err));
    }
  }, [island]);

  if (!island) return null;

  const popularListings = listings?.filter(l => ['beaches', 'opgs', 'wineries'].includes(l.locationCategoryId || l.categoryId)) || [];
  const viewpointListings = listings?.filter(l => ['viewpoints', 'landmarks'].includes(l.locationCategoryId || l.categoryId)) || [];
  const gastroListings = listings?.filter(l => ['restaurants'].includes(l.locationCategoryId || l.categoryId)) || [];
  const apartmentsListings = listings?.filter(l => ['apartments', 'hotels', 'camps', 'accommodation', 'rooms', 'villas'].includes(l.locationCategoryId || l.categoryId)) || [];

  const islandCityNames = (islandCities || []).map((c: any) => c.name?.toLowerCase());

  // Obližnji spomenici Domovinskog rata na otoku
  const nearbyWarMemorials = (globalSpecialListings || []).filter(
    l => l.locationCategoryId === 'homeland_war' && (
      (l.region && l.region.toLowerCase() === island.name.toLowerCase()) || 
      (l.city && (l.city.toLowerCase() === island.name.toLowerCase() || islandCityNames.includes(l.city.toLowerCase())))
    )
  ).slice(0, 8);

  // Helper to distinguish news articles from general magazine blogs
  const isNewsArticle = (a: any) => {
    const newsCategories = [
      'Vijesti iz Hrvatske', 'Vijesti iz Svijeta', 'Poznati Hrvati',
      'Slavni u Hrvatskoj', 'Zanimljivosti', 'Iz Povijesti',
      'Iz geografije', 'Domovinski rat'
    ];
    return newsCategories.includes(a.category) || 
      (Array.isArray(a.tags) && (a.tags.includes('news_bot') || a.tags.includes('vijesti')));
  };

  // Helper to extract root stem for Croatian declensions (e.g., Korčula -> Korčul, Hvar -> Hvar, Brač -> Brač)
  const getStem = (name: string) => {
    if (!name) return '';
    const clean = name.trim().toLowerCase();
    if (clean.length > 4 && /[aeiou]$/i.test(clean)) {
      return clean.slice(0, -1);
    }
    return clean;
  };

  const matchesIsland = (a: any) => {
    const islandName = island.name.toLowerCase();
    const islandStem = getStem(island.name);
    const regionName = island.region ? island.region.toLowerCase() : '';

    // 1. Tags matching
    const tagArray = Array.isArray(a.tags) 
      ? a.tags 
      : typeof a.tags === 'string' 
        ? a.tags.split(',').map((t: string) => t.trim()) 
        : [];
    const hasTag = tagArray.some((t: string) => {
      const tl = t.toLowerCase();
      return (
        tl === islandName || 
        tl === `otok ${islandName}` || 
        (islandStem.length >= 4 && tl.includes(islandStem)) ||
        islandCityNames.includes(tl) ||
        (regionName && tl === regionName)
      );
    });

    // 2. Title, excerpt, and content check
    const textToSearch = `${a.title || ''} ${a.titleEn || ''} ${a.excerpt || ''} ${a.excerptEn || ''} ${(a.content || '').slice(0, 1500)}`.toLowerCase();
    const hasMention = 
      textToSearch.includes(islandName) || 
      textToSearch.includes(`otok ${islandName}`) ||
      (islandStem.length >= 4 && textToSearch.includes(islandStem)) ||
      islandCityNames.some((c: string) => c && c.length >= 4 && textToSearch.includes(c));

    // 3. Direct city/location field if present
    const hasLocationField = 
      (a.city && (a.city.toLowerCase() === islandName || islandCityNames.includes(a.city.toLowerCase()))) ||
      (a.location && (a.location.toLowerCase().includes(islandName) || (islandStem.length >= 4 && a.location.toLowerCase().includes(islandStem))));

    return hasTag || hasMention || hasLocationField;
  };

  // Client-side live fallback if SSR blogs are empty or failed to serialize
  const { data: liveBlogs } = useCollection('blogs', { sort: '-created' });
  const rawArticles = (articles && articles.length > 0) ? articles : (liveBlogs || []);

  // Vijesti vezane uz otok (direktne ili opće turističke aktualnosti)
  const directIslandNews = rawArticles.filter(a => isNewsArticle(a) && matchesIsland(a));
  const fallbackIslandNews = rawArticles.filter(a => isNewsArticle(a) && !directIslandNews.some((d: any) => d.id === a.id));
  const islandNews = (
    directIslandNews.length >= 4 
      ? directIslandNews 
      : [...directIslandNews, ...fallbackIslandNews]
  ).slice(0, 4);
  const hasDirectNews = directIslandNews.length > 0;

  // Povezani putopisi i vodiči o otoku (direktni ili najnoviji vodiči)
  const directIslandArticles = rawArticles.filter(a => !isNewsArticle(a) && matchesIsland(a));
  const fallbackIslandArticles = rawArticles.filter(a => !isNewsArticle(a) && !directIslandArticles.some((d: any) => d.id === a.id));
  const relatedArticles = (
    directIslandArticles.length >= 4 
      ? directIslandArticles 
      : [...directIslandArticles, ...fallbackIslandArticles]
  ).slice(0, 4);
  const hasDirectArticles = directIslandArticles.length > 0;
  const totalArticlesCount = islandNews.length + relatedArticles.length;

  const getDirectionsUrl = (lat: number, lng: number) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  const emergencyServices = [
    { name: isEn ? 'General Emergency Number' : 'Jedinstveni hitni broj', phone: '112', desc: isEn ? 'General safety & rescue' : 'Opća pomoć u hitnim situacijama' },
    { name: isEn ? 'Police' : 'Policija', phone: '192', desc: isEn ? 'Security & crime reports' : 'Prijava kaznenih djela i nesreća' },
    { name: isEn ? 'Firefighters' : 'Vatrogasci', phone: '193', desc: isEn ? 'Fires & rescue operations' : 'U slučaju požara i prirodnih nepogoda' },
    { name: isEn ? 'Ambulance' : 'Hitna pomoć', phone: '194', desc: isEn ? 'Medical emergency response' : 'Hitan medicinski prijevoz i pomoć' },
    { name: isEn ? 'Mountain Rescue (HGSS)' : 'Gorska služba spašavanja (HGSS)', phone: '+385 91 721 0000', desc: isEn ? 'Wilderness search & rescue' : 'Potrage i spašavanja na nepristupačnim terenima' },
  ];

  const renderCategoryCards = (catListings: any[], categoryTitle: string, icon: React.ReactNode, colorClass: string, viewMoreSlug: string) => {
    const limitedListings = catListings.slice(0, 5);
    if (limitedListings.length === 0) return null;

    return (
      <div className="space-y-6 flex flex-col h-full">
        <h4 className={`font-black text-sm uppercase tracking-[0.2em] flex items-center gap-2 ${colorClass}`}>
          {icon} {categoryTitle}
        </h4>
        <div className="flex-1 space-y-4">
          {limitedListings.map(l => {
            const image = getFirstPhoto(l) || DEFAULT_LISTING_IMAGE;
            const name = isEn && l.metadata?.nameEn ? l.metadata.nameEn : l.name;
            return (
              <Link key={l.id} href={generateListingUrl(l.locationCategoryId || l.categoryId, l.name, language, l.id)} className="block group">
                <Card className="relative overflow-hidden border-none shadow-md rounded-2xl h-24 hover:shadow-lg transition-all duration-300">
                  <Image src={image} alt={name} fill className="object-cover brightness-[0.6] group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="font-black text-white text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">{name}</p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
        <Link href={`${getLocalizedUrl('/explore', language)}?category=${viewMoreSlug}&q=${encodeURIComponent(island.name)}`} className={`w-full py-3 rounded-xl border-2 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:bg-foreground hover:text-white ${colorClass.replace('text-', 'border-').replace('600', '200')}`}>
          {isEn ? 'View More' : 'Pogledaj više'} <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  };

  // Rich Structured Data (TouristDestination + BreadcrumbList)
  const destinationSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristDestination',
        '@id': `https://croatiabest.com.hr/islands/${island.slug}#destination`,
        name: isEn && island.nameEn ? island.nameEn : `Otok ${island.name}`,
        description: isEn && island.descriptionEn 
          ? island.descriptionEn.replace(/<[^>]*>/g, '').substring(0, 300) 
          : (island.description ? island.description.replace(/<[^>]*>/g, '').substring(0, 300) : `Turistički vodič kroz otok ${island.name}`),
        url: `https://croatiabest.com.hr/islands/${island.slug}`,
        image: island.image ? [island.image] : [],
        geo: {
          '@type': 'GeoCoordinates',
          latitude: island.lat,
          longitude: island.lng,
        },
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: island.region || 'Jadran, Hrvatska',
        },
        touristType: [
          'Island tourism',
          'Beach tourism',
          'Sailing and nautical',
          'Gastronomy',
          'Nature and heritage',
        ],
        ...(popularListings.length > 0 ? {
          includesAttraction: popularListings.slice(0, 5).map(l => ({
            '@type': 'TouristAttraction',
            name: isEn && l.metadata?.nameEn ? l.metadata.nameEn : l.name,
            url: `https://croatiabest.com.hr/objekt/${l.locationCategoryId || l.categoryId}/${l.slug || l.id}`,
          }))
        } : {})
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://croatiabest.com.hr/islands/${island.slug}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: isEn ? 'Home' : 'Početna',
            item: isEn ? 'https://croatiabest.com.hr/en' : 'https://croatiabest.com.hr',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: isEn ? 'Islands' : 'Otoci',
            item: isEn ? 'https://croatiabest.com.hr/islands' : 'https://croatiabest.com.hr/otoci',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: isEn && island.nameEn ? island.nameEn : island.name,
            item: `https://croatiabest.com.hr/islands/${island.slug}`,
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Rich Structured Data (TouristDestination + BreadcrumbList) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationSchema) }}
      />
      <Navbar />
      {isAdmin && (
        <div className="bg-emerald-950/90 text-emerald-100 border-b border-emerald-500/30 px-6 py-2.5 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 text-xs font-semibold z-30 relative">
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Prijavljeni ste kao administrator: <strong>Otok {island.name}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin?tab=islands"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow font-bold text-xs"
            >
              <Anchor className="size-3.5" /> Administracija Otoka
            </Link>
          </div>
        </div>
      )}
      <main className="flex-1 pb-24">
        <section className="relative h-[60vh] w-full overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950 to-slate-950">
          {island.image && !isDummyPlaceholderPhoto(island.image) && (
            <Image src={island.image} alt={island.name} fill className="object-cover brightness-[0.4]" priority />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pb-24">
            <div className="size-16 rounded-full border border-white/40 flex items-center justify-center backdrop-blur-md mb-6">
              <Anchor className="text-white size-8" />
            </div>
            <h1 className="text-6xl md:text-[8rem] font-black text-white font-headline drop-shadow-2xl italic tracking-tighter leading-none">
              Otok {island.name} <span className="block text-2xl md:text-4xl not-italic tracking-widest mt-4 opacity-80 uppercase">Vodič i Plaže</span>
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              {weather && (
                <div className="animate-fade-in">
                  <WeatherAnchorPill data={weather} isEn={isEn} />
                </div>
              )}
              {totalArticlesCount > 0 && (
                <a
                  href="#island-news-blog"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs uppercase tracking-wider border border-white/30 transition-all shadow-lg hover:scale-105"
                >
                  <Newspaper className="size-4 text-amber-300" />
                  {isEn ? `News & Blog (${totalArticlesCount})` : `Vijesti i blog (${totalArticlesCount})`}
                </a>
              )}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 -mt-16 relative z-20 space-y-16">
          
          {/* CITIES ON ISLAND SECTION */}
          {islandCities && islandCities.length > 0 && (
            <div className="bg-white/95 backdrop-blur-3xl shadow-xl rounded-[2.5rem] p-6 border border-black/5 overflow-hidden">
              <div className="flex items-center gap-2 mb-4 px-2">
                <MapPin className="size-5 text-primary" />
                <h3 className="text-xl font-headline font-black italic tracking-tighter">
                  {isEn ? `Places on the island of ${island.name}` : `Gradovi i mjesta na otoku ${island.name}`}
                </h3>
              </div>
              <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar snap-x px-2">
                {islandCities.map((c) => {
                  const image = c.image || DEFAULT_LISTING_IMAGE;
                  const cName = isEn && c.nameEn ? c.nameEn : c.name;
                  return (
                    <Link key={c.id} href={getLocalizedUrl(`/cities/${c.slug}`, language)} className="snap-start flex-none w-48 group">
                      <Card className="relative h-32 rounded-2xl overflow-hidden border-none shadow-sm hover:shadow-md transition-all">
                        <Image src={image} alt={cName} fill className="object-cover brightness-[0.7] group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <h4 className="font-black text-white text-lg drop-shadow-lg group-hover:text-primary transition-colors text-center px-2">{cName}</h4>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-16">
              <Card className="bg-white/95 backdrop-blur-3xl border border-white/60 shadow-2xl rounded-[3rem] p-8 md:p-12 overflow-hidden">
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex-1">
                    <h2 className="text-4xl font-headline font-black mb-8 leading-none">Upoznajte {island.name}</h2>
                    <div className="relative">
                      <div 
                        className={`prose prose-xl max-w-none text-muted-foreground font-body italic leading-relaxed mb-12 whitespace-pre-wrap transition-all duration-500 ${isDescriptionExpanded ? '' : 'max-h-[300px] overflow-hidden'}`}
                        dangerouslySetInnerHTML={{ __html: isEn && island.descriptionEn ? island.descriptionEn : (island.description || wikiData.extract) }}
                      />
                      {!isDescriptionExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
                      )}
                    </div>
                    <button 
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="-mt-4 mb-8 font-black text-sm uppercase tracking-widest text-primary flex items-center gap-2 hover:underline bg-primary/10 px-6 py-2.5 rounded-full"
                    >
                      {isDescriptionExpanded ? (isEn ? 'Read less' : 'Prikaži manje') : (isEn ? 'Read more' : 'Pročitaj više')}
                      <ChevronRight className={`size-4 transition-transform ${isDescriptionExpanded ? '-rotate-90' : 'rotate-90'}`} />
                    </button>
                  </div>
                  
                  <div className="w-full md:w-80 space-y-8 bg-foreground/5 rounded-[2.5rem] p-8 border border-black/5 h-fit">
                    {wikiData.thumbnail && (
                      <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-8 shadow-inner border border-black/5 bg-white p-6 text-center">
                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-4 tracking-widest">Otočni simbol</p>
                        <div className="relative h-full w-full">
                          <Image src={wikiData.thumbnail} alt="Simbol" fill className="object-contain" />
                        </div>
                      </div>
                    )}
                    <div className="space-y-4">
                      {[
                        { icon: <Users className="size-4" />, label: 'Stanovnika', value: island.population },
                        { icon: <Landmark className="size-4" />, label: 'Općina', value: island.mayor },
                        { icon: <PhoneIcon className="size-4" />, label: 'Pozivni broj', value: island.areaCode },
                        { icon: <HomeIcon className="size-4" />, label: 'Regija', value: island.region },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="p-2 bg-white rounded-lg shadow-sm">{item.icon}</div>
                          <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</p>
                            <p className="font-bold text-base">{item.value || 'N/A'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* DEDICATED ISLAND NEWS & STORIES SECTION */}
              <div id="island-news-blog" className="space-y-12 scroll-mt-24 pt-4 border-t border-black/5">
                {/* 1. LOKALNE I TURISTIČKE VIJESTI ZA OTOK */}
                {islandNews.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/5 pb-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Newspaper className="size-5 text-primary" />
                          <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-3 py-1">
                            {hasDirectNews ? (isEn ? 'Island News' : 'Otočne vijesti') : (isEn ? 'Croatia Travel News' : 'Turističke vijesti')}
                          </Badge>
                        </div>
                        <h3 className="text-3xl font-headline font-black italic tracking-tighter text-foreground">
                          {hasDirectNews 
                            ? (isEn ? `News & Articles: Island ${island.name}` : `Vijesti i aktualnosti: Otok ${island.name}`) 
                            : (isEn ? `Latest Travel News for ${island.name} Visitors` : `Aktualne vijesti za posjetitelje: Otok ${island.name}`)}
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium">
                          {isEn ? `Latest events, ferry schedules, cultural happenings and updates for ${island.name}.` : `Najnovija zbivanja, trajektne linije, kulturni programi i servisne informacije za otok ${island.name}.`}
                        </p>
                      </div>
                      <Link href={getLocalizedUrl('/vijesti', language)} className="text-xs font-black text-primary hover:underline flex items-center gap-1 shrink-0 uppercase tracking-wider">
                        {isEn ? 'All News' : 'Sve vijesti'} <ArrowRight className="size-3.5" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {islandNews.map((a) => {
                        const bTitle = isEn && a.titleEn ? a.titleEn : a.title;
                        const bExcerpt = isEn && a.excerptEn ? a.excerptEn : a.excerpt;
                        const aImg = a.image && !isDummyPlaceholderPhoto(a.image) ? a.image : DEFAULT_BLOG_IMAGE;
                        const isDirectMatch = matchesIsland(a);

                        return (
                          <Link key={a.id} href={getLocalizedUrl(`/blog/${a.slug || a.id}`, language)} className="group block h-full">
                            <Card className="rounded-[2rem] border border-black/5 shadow-md overflow-hidden bg-white hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                                <Image 
                                  src={aImg} 
                                  alt={bTitle} 
                                  fill 
                                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Badge className="absolute top-3 left-3 bg-primary text-white border-none font-black text-[9px] uppercase tracking-wider shadow-md">
                                  {a.category || (isEn ? 'News' : 'Vijesti')}
                                </Badge>
                                {isDirectMatch && (
                                  <Badge className="absolute top-3 right-3 bg-white/95 text-slate-900 border-none font-black text-[9px] uppercase tracking-wider shadow-md flex items-center gap-1">
                                    <Anchor className="size-2.5 text-primary" /> {island.name}
                                  </Badge>
                                )}
                              </div>
                              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                                    <Calendar className="size-3 text-primary" />
                                    <span>{formatDate(a.publishDate || a.created)}</span>
                                    <span>•</span>
                                    <Clock className="size-3 text-primary" />
                                    <span>{a.readTime || '3 min'}</span>
                                  </div>
                                  <h4 className="font-headline font-bold text-base leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                    {bTitle}
                                  </h4>
                                  {bExcerpt && (
                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-body">
                                      {bExcerpt}
                                    </p>
                                  )}
                                </div>
                                <span className="text-xs font-black text-primary flex items-center gap-1 pt-1 group-hover:translate-x-1 transition-transform">
                                  {isEn ? 'Read article' : 'Pročitaj članak'} <ArrowRight className="size-3" />
                                </span>
                              </CardContent>
                            </Card>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. VODIČI, BLOGOVI I OTOČNE PRIČE */}
                {relatedArticles.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/5 pb-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <BookOpen className="size-5 text-secondary" />
                          <Badge className="bg-secondary/10 text-secondary border-none text-[10px] font-black uppercase tracking-widest px-3 py-1">
                            {hasDirectArticles ? (isEn ? 'Island Stories' : 'Vodiči i priče') : (isEn ? 'Croatia Best Magazine' : 'CroatiaBest Magazin')}
                          </Badge>
                        </div>
                        <h3 className="text-3xl font-headline font-black italic tracking-tighter text-foreground">
                          {hasDirectArticles 
                            ? (isEn ? `Travel Stories & Guides: Island ${island.name}` : `Zanimljivosti i vodiči: Otok ${island.name}`) 
                            : (isEn ? `Travel Guides & Recommendations: ${island.name}` : `Preporuke i vodiči za posjetitelje: Otok ${island.name}`)}
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium">
                          {isEn ? `Secret coves, nautical routes, culinary spots and cultural highlights on ${island.name}.` : `Skrivene uvale, nautičke rute, otočni OPG-ovi i gastro preporuke za otok ${island.name}.`}
                        </p>
                      </div>
                      <Link href={getLocalizedUrl('/blog', language)} className="text-xs font-black text-secondary hover:underline flex items-center gap-1 shrink-0 uppercase tracking-wider">
                        {isEn ? 'All Guides' : 'Svi vodiči'} <ArrowRight className="size-3.5" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {relatedArticles.map((a) => {
                        const bTitle = isEn && a.titleEn ? a.titleEn : a.title;
                        const bExcerpt = isEn && a.excerptEn ? a.excerptEn : a.excerpt;
                        const aImg = a.image && !isDummyPlaceholderPhoto(a.image) ? a.image : DEFAULT_BLOG_IMAGE;
                        const isDirectMatch = matchesIsland(a);

                        return (
                          <Link key={a.id} href={getLocalizedUrl(`/blog/${a.slug || a.id}`, language)} className="group block h-full">
                            <Card className="rounded-[2rem] border border-black/5 shadow-md overflow-hidden bg-white hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                                <Image 
                                  src={aImg} 
                                  alt={bTitle} 
                                  fill 
                                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground border-none font-black text-[9px] uppercase tracking-wider shadow-md">
                                  {a.category || (isEn ? 'Guide' : 'Vodič')}
                                </Badge>
                                {isDirectMatch && (
                                  <Badge className="absolute top-3 right-3 bg-white/95 text-slate-900 border-none font-black text-[9px] uppercase tracking-wider shadow-md flex items-center gap-1">
                                    <Anchor className="size-2.5 text-secondary" /> {island.name}
                                  </Badge>
                                )}
                              </div>
                              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                                    <Calendar className="size-3 text-secondary" />
                                    <span>{formatDate(a.publishDate || a.created)}</span>
                                    <span>•</span>
                                    <Clock className="size-3 text-secondary" />
                                    <span>{a.readTime || '4 min'}</span>
                                  </div>
                                  <h4 className="font-headline font-bold text-base leading-snug text-foreground group-hover:text-secondary transition-colors line-clamp-2">
                                    {bTitle}
                                  </h4>
                                  {bExcerpt && (
                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-body">
                                      {bExcerpt}
                                    </p>
                                  )}
                                </div>
                                <span className="text-xs font-black text-secondary flex items-center gap-1 pt-1 group-hover:translate-x-1 transition-transform">
                                  {isEn ? 'Read guide' : 'Pročitaj vodič'} <ArrowRight className="size-3" />
                                </span>
                              </CardContent>
                            </Card>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* GOOGLE ADS TILE IN CONTENT (ZAPAMĆENA POZICIJA) */}
              <AdBanner format="rectangle" positionId="ISLAND_IN_CONTENT_RECTANGLE" className="w-full h-[250px] my-8 shadow-sm rounded-3xl" />

            </div>

            <aside className="lg:col-span-4 space-y-12">
              <Card className="rounded-[3.5rem] shadow-2xl border-none overflow-hidden bg-white">
                <div className="p-8 border-b bg-foreground/5">
                  <h3 className="text-2xl font-black italic">Lokacija</h3>
                </div>
                <div className="relative aspect-square w-full rounded-b-[3.5rem] overflow-hidden">
                  <Map 
                    center={{ lat: island.lat, lng: island.lng }}
                    zoom={11}
                    listings={listings || []}
                    selectedListingId={selectedListingId}
                    onSelectListing={setSelectedListingId}
                    getDirectionsUrl={getDirectionsUrl}
                    showCenterMarker={true}
                    centerMarkerName={`Centar - ${island.name}`}
                  />
                </div>
              </Card>

              {/* Sidebar Ad Placement (ZAPAMĆENA POZICIJA) */}
              <AdBanner format="vertical" positionId="ISLAND_SIDEBAR_VERTICAL" className="w-full h-[600px] shadow-sm rounded-3xl" />

              {/* TELEFONSKE SLUŽBE (EMERGENCY SERVICE NUMBERS) */}
              <Card className="rounded-[2.5rem] shadow-xl border-none overflow-hidden bg-slate-900 text-white p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <ShieldAlert className="size-6 text-red-500 animate-pulse" />
                  <h3 className="text-xl font-headline font-black uppercase tracking-wider">{isEn ? 'Emergency Call Services' : 'Hitne službe'}</h3>
                </div>
                <div className="flex flex-col gap-4">
                  {emergencyServices.map((srv, idx) => (
                    <a 
                      key={idx} 
                      href={`tel:${srv.phone}`}
                      className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all flex items-center justify-between group"
                    >
                      <div>
                        <p className="font-black text-sm text-white group-hover:text-red-400 transition-colors">{srv.name}</p>
                        <p className="text-[10px] text-white/50">{srv.desc}</p>
                      </div>
                      <Badge className="bg-red-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full tracking-wider shadow-lg">
                        {srv.phone}
                      </Badge>
                    </a>
                  ))}
                </div>
              </Card>

            </aside>
          </div>
          
          {/* LISTINGS CATEGORIES COLUMNS - FULL WIDTH SECTION (PRIJE VREMENA) */}
          {(popularListings.length > 0 || viewpointListings.length > 0 || gastroListings.length > 0 || apartmentsListings.length > 0) && (
            <div id="explore-listings" className="mt-16 pt-12 border-t border-black/5 scroll-mt-24">
              <div className="text-center mb-12">
                <h3 className="text-4xl font-headline font-black italic tracking-tighter">
                  {isEn ? 'Explore Top Categories' : 'Istražite najbolje lokacije'}
                </h3>
                <p className="text-muted-foreground mt-4 font-medium max-w-2xl mx-auto">
                  {isEn ? `Discover the best places on the island of ${island.name} categorized for your convenience.` : `Pronađite najbolje lokacije na otoku ${island.name} podijeljene po kategorijama.`}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {renderCategoryCards(popularListings, isEn ? 'Popular Places' : 'Popularno', <Umbrella className="size-5" />, 'text-blue-600', 'beaches')}
                {renderCategoryCards(viewpointListings, isEn ? 'Viewpoints' : 'Vidikovci', <Binoculars className="size-5" />, 'text-purple-600', 'viewpoints')}
                {renderCategoryCards(gastroListings, isEn ? 'Gastronomy' : 'Gastro', <Utensils className="size-5" />, 'text-orange-600', 'restaurants')}
                {renderCategoryCards(apartmentsListings, isEn ? 'Accommodation' : 'Apartmani', <BedDouble className="size-5" />, 'text-emerald-600', 'apartments')}
              </div>
            </div>
          )}

          {/* VRIJEME I MORE WIDGET (WEATHER & SEA HUB) */}
          {weather && (
            <div className="mt-16">
              <WeatherWidget data={weather} locationName={`Otok ${island.name}`} isEn={isEn} />
            </div>
          )}

          {/* NEARBY HOMELAND WAR MEMORIALS (DOMOVINSKI RAT) - ISPOD VREMENA */}
          {nearbyWarMemorials.length > 0 && (
            <div className="mt-16 pt-12 border-t border-black/5 space-y-8">
              <div className="flex items-center gap-3 border-b border-black/5 pb-4">
                <Shield className="size-7 text-red-600" />
                <div>
                  <h3 className="text-3xl font-headline font-black italic tracking-tighter text-foreground">
                    {isEn ? 'Homeland War Memorials' : 'Spomen obilježja Domovinskog rata'}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium mt-1">
                    {isEn 
                      ? `Memorial sites and historical monuments on the island of ${island.name}.` 
                      : `Spomenici, spomen obilježja i mjesta sjećanja iz Domovinskog rata na otoku: ${island.name}.`}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {nearbyWarMemorials.map((l) => {
                  const name = isEn && l.metadata?.nameEn ? l.metadata.nameEn : l.name;
                  const image = getFirstPhoto(l) || DEFAULT_LISTING_IMAGE;
                  const path = generateListingUrl(l.locationCategoryId || l.categoryId, l.name, language, l.id);
                  return (
                    <Link key={l.id} href={path} className="group">
                      <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-white h-full flex flex-col hover:shadow-xl transition-all duration-300">
                        <div className="relative aspect-square overflow-hidden">
                          <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                          <Badge className="absolute top-3 left-3 bg-red-600 text-white border-none font-black text-[8px] uppercase tracking-wider shadow-md">
                            {isEn ? 'Memorial' : 'Spomen obilježje'}
                          </Badge>
                        </div>
                        <CardContent className="p-4 flex-1 bg-white z-10 -mt-2 rounded-t-xl">
                          <h4 className="font-black text-sm leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">{name}</h4>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* WIKIPEDIA SECTIONS */}
          {island?.wikiSections?.length > 0 && (
            <WikiView sections={island.wikiSections} />
          )}

          {/* DYNAMIC FAQ SECTION */}
          <FAQSection 
            type="island" 
            name={island.name} 
            population={island.population} 
          />

        </div>
      </main>
    </div>
  );
}
