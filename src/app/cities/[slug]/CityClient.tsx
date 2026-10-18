"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import Image from 'next/image';
import { 
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
  Shield,
  Trees,
  Compass,
  ArrowRight,
  ChevronRight,
  BookOpen,
  BedDouble,
  Building2
} from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { generateListingUrl } from '@/app/lib/utils/slug';
import { Card, CardContent } from '@/components/ui/card';
import { getFirstPhoto, isDummyPlaceholderPhoto } from '@/app/lib/image-helpers';
import { Badge } from '@/components/ui/badge';
import { getLocalizedUrl } from '@/lib/i18n-routes';
import { useCollection, useUser } from '@/pocketbase';
import Map from '@/components/map/Map';
import { useLanguage } from '@/contexts/LanguageContext';
import FAQSection from '@/components/ui/FAQSection';
import AdBanner from '@/components/ads/AdBanner';
import WikiView from '@/components/ui/WikiView';
import { DEFAULT_LISTING_IMAGE } from '@/app/lib/constants';
import WeatherWidget, { WeatherAnchorPill } from '@/components/weather/WeatherWidget';
import type { WeatherData } from '@/app/lib/weather';

interface CityClientProps {
  city: any;
  cityListings: any[];
  globalSpecialListings?: any[];
  allBlogs?: any[];
  weather?: WeatherData | null;
}

export default function CityClient({ city, cityListings, globalSpecialListings = [], allBlogs = [], weather = null }: CityClientProps) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { user } = useUser();
  const isAdmin = user?.email === 'maro.webdeveloper@gmail.com';

  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [wikiData, setWikiData] = useState<{extract: string, thumbnail?: string}>({ extract: '' });
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    if (city) {
      const encodedCity = encodeURIComponent(city.name);
      fetch(`https://hr.wikipedia.org/api/rest_v1/page/summary/${encodedCity}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.extract) {
            setWikiData({ extract: data.extract, thumbnail: data.thumbnail?.source });
          }
        })
        .catch(err => console.error('Wiki error', err));
    }
  }, [city]);

  if (!city) return null;

  // Filter listings
  const popularListings = cityListings?.filter(l => ['beaches', 'opgs', 'wineries'].includes(l.locationCategoryId || l.categoryId)) || [];
  const viewpointListings = cityListings?.filter(l => ['viewpoints', 'landmarks'].includes(l.locationCategoryId || l.categoryId)) || [];
  const gastroListings = cityListings?.filter(l => ['restaurants'].includes(l.locationCategoryId || l.categoryId)) || [];
  const apartmentsListings = cityListings?.filter(l => ['apartments', 'hotels', 'camps', 'accommodation', 'rooms', 'villas'].includes(l.locationCategoryId || l.categoryId)) || [];

  // Hitne službe telefonski brojevi
  const emergencyServices = [
    { name: isEn ? 'General Emergency Number' : 'Jedinstveni hitni broj', phone: '112', desc: isEn ? 'General safety & rescue' : 'Opća pomoć u hitnim situacijama' },
    { name: isEn ? 'Police' : 'Policija', phone: '192', desc: isEn ? 'Security & crime reports' : 'Prijava kaznenih djela i nesreća' },
    { name: isEn ? 'Firefighters' : 'Vatrogasci', phone: '193', desc: isEn ? 'Fires & rescue operations' : 'U slučaju požara i prirodnih nepogoda' },
    { name: isEn ? 'Ambulance' : 'Hitna pomoć', phone: '194', desc: isEn ? 'Medical emergency response' : 'Hitan medicinski prijevoz i pomoć' },
    { name: isEn ? 'Mountain Rescue (HGSS)' : 'Gorska služba spašavanja (HGSS)', phone: '+385 91 721 0000', desc: isEn ? 'Wilderness search & rescue' : 'Potrage i spašavanja na nepristupačnim terenima' },
  ];

  // Obližnji spomenici Domovinskog rata
  const nearbyWarMemorials = globalSpecialListings.filter(
    l => l.locationCategoryId === 'homeland_war' && (l.region === city.region || l.city === city.name)
  ).slice(0, 8); // Max 8 spomenika

  // Obližnji Nacionalni parkovi
  const nearbyNationalParks = globalSpecialListings.filter(
    l => l.locationCategoryId === 'national_parks' && (l.region === city.region || l.city === city.name)
  );

  // Helper to extract word stem for Croatian declensions (e.g. Dubrovnik -> dubrovni, Korčula -> korčul, Pula -> pul)
  const getStem = (name: string) => {
    const n = name.toLowerCase().trim();
    if (n.endsWith('a') || n.endsWith('e') || n.endsWith('i') || n.endsWith('o') || n.endsWith('u')) {
      return n.slice(0, -1);
    }
    return n;
  };

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

  const matchesCity = (a: any) => {
    const cityName = city.name.toLowerCase();
    const cityStem = getStem(city.name);
    const regionName = (city.region || '').toLowerCase();
    
    // 1. Tag check
    const tagArray = Array.isArray(a.tags) 
      ? a.tags 
      : typeof a.tags === 'string' 
        ? a.tags.split(',').map((t: string) => t.trim()) 
        : [];
    const hasTag = tagArray.some((t: string) => {
      const tl = t.toLowerCase();
      return tl === cityName || (cityStem.length >= 4 && tl.includes(cityStem)) || (regionName && tl === regionName);
    });

    // 2. Title, excerpt, and content check
    const textToSearch = `${a.title || ''} ${a.titleEn || ''} ${a.excerpt || ''} ${a.excerptEn || ''} ${(a.content || '').slice(0, 1500)}`.toLowerCase();
    const hasMention = textToSearch.includes(cityName) || (cityStem.length >= 4 && textToSearch.includes(cityStem));
    
    // 3. Direct city/location field if present
    const hasCityField = (a.city && a.city.toLowerCase() === cityName) || (a.location && a.location.toLowerCase().includes(cityName));

    return hasTag || hasMention || hasCityField;
  };

  // Vijesti vezane uz grad (direktne ili najnovije turističke aktualnosti)
  const directCityNews = allBlogs.filter(a => isNewsArticle(a) && matchesCity(a));
  const fallbackNews = allBlogs.filter(a => isNewsArticle(a) && !directCityNews.includes(a));
  const cityNews = (directCityNews.length > 0 ? directCityNews : fallbackNews).slice(0, 5);
  const hasDirectNews = directCityNews.length > 0;

  // Povezani putopisi i gastro vodiči (direktni ili najnoviji vodiči)
  const directArticles = allBlogs.filter(a => !isNewsArticle(a) && matchesCity(a));
  const fallbackArticles = allBlogs.filter(a => !isNewsArticle(a) && !directArticles.includes(a));
  const relatedArticles = (directArticles.length > 0 ? directArticles : fallbackArticles).slice(0, 3);
  const hasDirectArticles = directArticles.length > 0;

  const getDirectionsUrl = (lat: number, lng: number) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  // Rich Structured Data (TouristDestination + BreadcrumbList)
  const destinationSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristDestination',
        '@id': `https://croatiabest.com.hr/cities/${city.slug}#destination`,
        name: isEn && city.nameEn ? city.nameEn : city.name,
        description: isEn && city.descriptionEn 
          ? city.descriptionEn.replace(/<[^>]*>/g, '').substring(0, 300) 
          : (city.description ? city.description.replace(/<[^>]*>/g, '').substring(0, 300) : `Turistički vodič kroz ${city.name}`),
        url: `https://croatiabest.com.hr/cities/${city.slug}`,
        image: city.image ? [city.image] : [],
        geo: {
          '@type': 'GeoCoordinates',
          latitude: city.lat,
          longitude: city.lng,
        },
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: city.region || 'Hrvatska',
        },
        touristType: [
          'Cultural tourism',
          'Beach tourism',
          'Gastronomy',
          'Historical heritage',
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
        '@id': `https://croatiabest.com.hr/cities/${city.slug}#breadcrumb`,
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
            name: isEn ? 'Cities' : 'Gradovi',
            item: isEn ? 'https://croatiabest.com.hr/cities' : 'https://croatiabest.com.hr/gradovi',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: isEn && city.nameEn ? city.nameEn : city.name,
            item: `https://croatiabest.com.hr/cities/${city.slug}`,
          },
        ],
      },
    ],
  };

  const renderCategoryCards = (listings: any[], categoryTitle: string, icon: React.ReactNode, colorClass: string, viewMoreSlug: string) => {
    const limitedListings = listings.slice(0, 5);
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
        <Link href={`${getLocalizedUrl('/explore', language)}?category=${viewMoreSlug}&q=${encodeURIComponent(city.name)}`} className={`w-full py-3 rounded-xl border-2 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:bg-foreground hover:text-white ${colorClass.replace('text-', 'border-').replace('600', '200')}`}>
          {isEn ? 'View More' : 'Pogledaj više'} <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationSchema) }}
      />
      <Navbar />
      {isAdmin && (
        <div className="bg-sky-950/90 text-sky-100 border-b border-sky-500/30 px-6 py-2.5 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 text-xs font-semibold z-30 relative">
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-sky-400 animate-pulse" />
            <span>Prijavljeni ste kao administrator: <strong>Grad {city.name}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin?tab=cities"
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow font-bold text-xs"
            >
              <Building2 className="size-3.5" /> Administracija Gradova
            </Link>
          </div>
        </div>
      )}
      <main className="flex-1 pb-24">
        {/* HERO HEADER */}
        <section className="relative h-[65vh] w-full overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950">
          {city.image && !isDummyPlaceholderPhoto(city.image) && (
            <Image src={city.image} alt={city.name} fill className="object-cover brightness-[0.4]" priority />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pb-24">
            <Badge className="bg-primary/20 backdrop-blur-md text-white mb-6 px-8 py-2 rounded-full font-black text-xs uppercase tracking-[0.3em]">{city.region}</Badge>
            <h1 className="text-6xl md:text-[8rem] font-black text-white font-headline drop-shadow-2xl italic tracking-tighter leading-none">
              {city.name} <span className="block text-2xl md:text-4xl not-italic tracking-widest mt-4 opacity-80 uppercase">{isEn ? 'GUIDE & HISTORY' : 'VODIČ I POVIJEST'}</span>
            </h1>
            {weather && (
              <div className="mt-6 animate-fade-in">
                <WeatherAnchorPill data={weather} isEn={isEn} />
              </div>
            )}
          </div>
        </section>

        <div className="container mx-auto px-6 -mt-16 relative z-20 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* LEFT CONTENT COLUMN */}
            <div className="lg:col-span-8 space-y-12">
              {/* O GRADU CARD */}
              <Card className="rounded-[3rem] shadow-2xl border-none overflow-hidden bg-white/95 backdrop-blur-3xl p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex-1">
                    <h2 className="text-4xl font-headline font-black leading-tight mb-8">{isEn ? `About ${city.name}` : `O gradu ${city.name}`}</h2>
                    <div className="relative">
                      <div 
                        className={`prose prose-xl max-w-none text-muted-foreground font-body italic leading-relaxed transition-all duration-500 ${isDescriptionExpanded ? '' : 'max-h-[300px] overflow-hidden'}`}
                        dangerouslySetInnerHTML={{ __html: language === 'en' && city.descriptionEn ? city.descriptionEn : city.description }}
                      />
                      {!isDescriptionExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
                      )}
                    </div>
                    <button 
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="mt-4 font-black text-sm uppercase tracking-widest text-primary flex items-center gap-2 hover:underline bg-primary/10 px-6 py-2.5 rounded-full"
                    >
                      {isDescriptionExpanded ? (isEn ? 'Read less' : 'Prikaži manje') : (isEn ? 'Read more' : 'Pročitaj više')}
                      <ChevronRight className={`size-4 transition-transform ${isDescriptionExpanded ? '-rotate-90' : 'rotate-90'}`} />
                    </button>
                  </div>
                  
                  {/* SIDE INFO */}
                  <div className="w-full md:w-80 space-y-8 bg-secondary/5 rounded-[2.5rem] p-8 border border-black/5 h-fit">
                    {wikiData.thumbnail && (
                      <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-8 shadow-inner border border-black/5 bg-white p-6 text-center">
                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-4 tracking-widest">{isEn ? 'Coat of arms' : 'Grb grada'}</p>
                        <div className="relative h-full w-full">
                          <Image src={wikiData.thumbnail} alt="Grb" fill className="object-contain" />
                        </div>
                      </div>
                    )}
                    <div className="space-y-4">
                      {[
                        { icon: <Users className="size-4" />, label: isEn ? 'Population' : 'Stanovnika', value: city.population },
                        { icon: <Landmark className="size-4" />, label: isEn ? 'Mayor' : 'Gradonačelnik', value: city.mayor },
                        { icon: <PhoneIcon className="size-4" />, label: isEn ? 'Area code' : 'Pozivni broj', value: city.areaCode },
                        { icon: <HomeIcon className="size-4" />, label: isEn ? 'Zip code' : 'Poštanski broj', value: city.zipCode },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="p-2 bg-white rounded-lg shadow-sm">{item.icon}</div>
                          <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{item.label}</p>
                            <p className="font-bold text-base">{item.value || 'N/A'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {city.officialWeb && (
                      <a href={city.officialWeb} target="_blank" className="block pt-6 text-xs font-black text-primary flex items-center justify-center gap-2 hover:underline bg-white rounded-xl py-3 shadow-sm uppercase">
                        <Globe className="size-4" /> {isEn ? 'Official web' : 'Službeni web'}
                      </a>
                    )}
                  </div>
                </div>
              </Card>

              {/* CITY NEWS (TAGGED BLOGS) */}
              {cityNews.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-black/5 pb-4">
                    <BookOpen className="size-6 text-primary" />
                    <h3 className="text-3xl font-headline font-black italic tracking-tighter text-foreground">
                      {hasDirectNews 
                        ? (isEn ? `News & Articles: ${city.name}` : `Vijesti i članci: ${city.name}`) 
                        : (isEn ? 'Latest Travel News & Updates' : 'Aktualne turističke vijesti')}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                    {cityNews.map((a) => {
                      const bTitle = isEn && a.titleEn ? a.titleEn : a.title;
                      return (
                        <Link key={a.id} href={getLocalizedUrl(`/blog/${a.slug || a.id}`, language)} className="group block">
                          <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-white relative h-32 group-hover:shadow-lg transition-all duration-300">
                            <Image src={a.image} alt={bTitle} fill className="object-cover brightness-[0.5] group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <CardContent className="absolute bottom-2 left-3 right-3 p-0 z-10">
                              <h4 className="font-black text-xs leading-tight text-white group-hover:text-primary transition-colors line-clamp-3">{bTitle}</h4>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* GOOGLE ADS TILE IN CONTENT (ZAPAMĆENA POZICIJA) */}
              <AdBanner format="rectangle" positionId="CITY_IN_CONTENT_RECTANGLE" className="w-full h-[250px] my-8 shadow-sm rounded-3xl" />

              {/* NEARBY NATIONAL PARKS */}
              {nearbyNationalParks.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-black/5 pb-4">
                    <Trees className="size-6 text-emerald-600" />
                    <h3 className="text-3xl font-headline font-black italic tracking-tighter text-foreground">
                      {isEn ? 'Nearby National Parks' : 'Nacionalni parkovi u blizini'}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {nearbyNationalParks.map((l) => {
                      const name = isEn && l.metadata?.nameEn ? l.metadata.nameEn : l.name;
                      const image = getFirstPhoto(l) || DEFAULT_LISTING_IMAGE;
                      const path = generateListingUrl('national_parks', l.name, language, l.id);
                      return (
                        <Link key={l.id} href={path} className="group">
                          <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-white h-full flex flex-col">
                            <div className="relative aspect-[16/10] overflow-hidden">
                              <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                              <Badge className="absolute top-3 left-3 bg-emerald-600 text-white border-none font-black text-[8px] uppercase tracking-wider">
                                {isEn ? 'National Park' : 'Nacionalni park'}
                              </Badge>
                            </div>
                            <CardContent className="p-4 flex-1">
                              <h4 className="font-bold text-sm leading-tight text-foreground group-hover:text-primary transition-colors">{name}</h4>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* RELATED MAGAZINE BLOG ARTICLES */}
              {relatedArticles.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-black/5 pb-4">
                    <BookOpen className="size-6 text-secondary" />
                    <h3 className="text-3xl font-headline font-black italic tracking-tighter text-foreground">
                      {hasDirectArticles 
                        ? (isEn ? `Stories & Guides: ${city.name}` : `Zanimljivosti i vodiči: ${city.name}`) 
                        : (isEn ? 'Croatia Travel Guides & Stories' : 'Vodiči i zanimljivosti iz Hrvatske')}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedArticles.map((a) => {
                      const bTitle = isEn && a.titleEn ? a.titleEn : a.title;
                      return (
                        <Link key={a.id} href={getLocalizedUrl(`/blog/${a.slug || a.id}`, language)} className="group">
                          <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-white h-full flex flex-col">
                            <div className="relative aspect-[16/10] overflow-hidden">
                              <Image src={a.image} alt={bTitle} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                              <Badge className="absolute top-3 left-3 bg-secondary text-white border-none font-black text-[8px] uppercase tracking-wider">
                                {a.category}
                              </Badge>
                            </div>
                            <CardContent className="p-4 flex-1">
                              <h4 className="font-bold text-sm leading-tight text-foreground group-hover:text-primary transition-colors">{bTitle}</h4>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT SIDEBAR MAP COLUMN */}
            <aside className="lg:col-span-4 space-y-12">
              <Card className="rounded-[3rem] shadow-2xl border-none overflow-hidden bg-white">
                <div className="p-8 border-b bg-secondary/5 font-black text-xl italic flex items-center gap-2">
                  <MapIcon className="size-5" /> {isEn ? 'Location Map' : 'Lokacija na karti'}
                </div>
                <div className="relative aspect-square w-full rounded-b-[3rem] overflow-hidden">
                  <Map 
                    center={{ lat: city.lat, lng: city.lng }}
                    zoom={13}
                    listings={cityListings || []}
                    selectedListingId={selectedListingId}
                    onSelectListing={setSelectedListingId}
                    getDirectionsUrl={getDirectionsUrl}
                    showCenterMarker={true}
                    centerMarkerName={`Centar - ${city.name}`}
                  />
                </div>
              </Card>

              {/* Sidebar Ad Placement (ZAPAMĆENA POZICIJA) */}
              <AdBanner format="vertical" positionId="CITY_SIDEBAR_VERTICAL" className="w-full h-[600px] shadow-sm rounded-3xl" />

              {/* TELEFONSKE SLUŽBE (EMERGENCY SERVICE NUMBERS) - MOVED TO SIDEBAR */}
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
                  {isEn ? `Discover the best places in ${city.name} categorized for your convenience.` : `Pronađite najbolje lokacije u gradu ${city.name} podijeljene po kategorijama.`}
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
              <WeatherWidget data={weather} locationName={city.name} isEn={isEn} />
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
                      ? `Memorial sites and historical monuments in and around ${city.name}.` 
                      : `Spomenici, spomen obilježja i mjesta sjećanja iz Domovinskog rata na području: ${city.name} i okolice.`}
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
          {city?.wikiSections?.length > 0 && (
            <WikiView sections={city.wikiSections} />
          )}

          {/* DYNAMIC FAQ SECTION */}
          <FAQSection 
            type="city" 
            name={city.name} 
            zipCode={city.zipCode} 
            population={city.population} 
          />
        </div>
      </main>
    </div>
  );
}
