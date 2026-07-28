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
  BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { generateListingUrl } from '@/app/lib/utils/slug';
import { Card, CardContent } from '@/components/ui/card';
import { getFirstPhoto } from '@/app/lib/image-helpers';
import { Badge } from '@/components/ui/badge';
import { useCollection } from '@/pocketbase';
import Map from '@/components/map/Map';
import { useLanguage } from '@/contexts/LanguageContext';
import FAQSection from '@/components/ui/FAQSection';
import AdBanner from '@/components/ads/AdBanner';
import WikiView from '@/components/ui/WikiView';
import { DEFAULT_LISTING_IMAGE } from '@/app/lib/constants';

interface CityClientProps {
  city: any;
  cityListings: any[];
  globalSpecialListings?: any[];
  allBlogs?: any[];
}

export default function CityClient({ city, cityListings, globalSpecialListings = [], allBlogs = [] }: CityClientProps) {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [wikiData, setWikiData] = useState<{extract: string, thumbnail?: string}>({ extract: '' });

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
  const emergencyListings = cityListings?.filter(l => ['pharmacy', 'emergency', 'police', 'firefighters'].includes(l.locationCategoryId || l.categoryId)) || [];
  const popularListings = cityListings?.filter(l => ['beaches', 'opgs', 'wineries'].includes(l.locationCategoryId || l.categoryId)) || [];
  const viewpointListings = cityListings?.filter(l => ['viewpoints', 'landmarks'].includes(l.locationCategoryId || l.categoryId)) || [];
  const gastroListings = cityListings?.filter(l => ['restaurants'].includes(l.locationCategoryId || l.categoryId)) || [];

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
  );

  // Obližnji Nacionalni parkovi
  const nearbyNationalParks = globalSpecialListings.filter(
    l => l.locationCategoryId === 'national_parks' && (l.region === city.region || l.city === city.name)
  );

  // Povezani blogovi (članci koji spominju grad u naslovu ili sadržaju)
  const relatedArticles = allBlogs.filter(
    a => a.title.toLowerCase().includes(city.name.toLowerCase()) || 
         a.excerpt?.toLowerCase().includes(city.name.toLowerCase())
  ).slice(0, 3);

  const getDirectionsUrl = (lat: number, lng: number) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pb-24">
        {/* HERO HEADER */}
        <section className="relative h-[65vh] w-full overflow-hidden">
          <Image src={city.image} alt={city.name} fill className="object-cover brightness-[0.4]" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pb-24">
            <Badge className="bg-primary/20 backdrop-blur-md text-white mb-6 px-8 py-2 rounded-full font-black text-xs uppercase tracking-[0.3em]">{city.region}</Badge>
            <h1 className="text-6xl md:text-[8rem] font-black text-white font-headline drop-shadow-2xl italic tracking-tighter leading-none">
              {city.name} <span className="block text-2xl md:text-4xl not-italic tracking-widest mt-4 opacity-80 uppercase">{isEn ? 'GUIDE & HISTORY' : 'VODIČ I POVIJEST'}</span>
            </h1>
          </div>
        </section>

        <div className="container mx-auto px-6 -mt-16 relative z-20 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* LEFT CONTENT COLUMN */}
            <div className="lg:col-span-8 space-y-12">
              {/* O GRADU CARD */}
              <Card className="rounded-[3rem] shadow-2xl border-none overflow-hidden bg-white/95 backdrop-blur-3xl p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex-1 space-y-8">
                    <h2 className="text-4xl font-headline font-black leading-tight">{isEn ? `About ${city.name}` : `O gradu ${city.name}`}</h2>
                    <div 
                      className="prose prose-xl max-w-none text-muted-foreground font-body italic leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: language === 'en' && city.descriptionEn ? city.descriptionEn : city.description }}
                    />
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

              {/* LISTINGS CATEGORIES COLUMNS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-6">
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] text-red-600 flex items-center gap-2"><ShieldAlert className="size-4" /> {isEn ? 'Emergency Services' : 'Hitne službe'}</h4>
                  {emergencyListings.map(l => (
                    <Card key={l.id} className="border-none shadow-lg rounded-2xl bg-red-50/50 p-4">
                      <p className="font-black text-sm mb-1">{l.name}</p>
                      <a href={`tel:${l.contactPhone}`} className="text-xs font-black text-red-600 flex items-center gap-1"><PhoneIcon className="size-3" /> {l.contactPhone}</a>
                    </Card>
                  ))}
                </div>
                <div className="space-y-6">
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2"><Umbrella className="size-4" /> {isEn ? 'Popular Places' : 'Popularno'}</h4>
                  {popularListings.map(l => (
                    <Link key={l.id} href={generateListingUrl(l.locationCategoryId || l.categoryId, l.name, l.id)}>
                      <Card className="border-none shadow-lg rounded-2xl bg-blue-50/50 p-4 hover:scale-[1.02] transition-transform cursor-pointer">
                        <p className="font-black text-sm">{l.name}</p>
                      </Card>
                    </Link>
                  ))}
                </div>
                <div className="space-y-6">
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] text-purple-600 flex items-center gap-2"><Binoculars className="size-4" /> {isEn ? 'Viewpoints' : 'Vidikovci'}</h4>
                  {viewpointListings.map(l => (
                    <Link key={l.id} href={generateListingUrl(l.locationCategoryId || l.categoryId, l.name, l.id)}>
                      <Card className="border-none shadow-lg rounded-2xl bg-purple-50/50 p-4 hover:scale-[1.02] transition-transform cursor-pointer">
                        <p className="font-black text-sm">{l.name}</p>
                      </Card>
                    </Link>
                  ))}
                </div>
                <div className="space-y-6">
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary flex items-center gap-2"><Utensils className="size-4" /> {isEn ? 'Gastronomy' : 'Gastro'}</h4>
                  {gastroListings.map(l => (
                    <Link key={l.id} href={generateListingUrl(l.locationCategoryId || l.categoryId, l.name, l.id)}>
                      <Card className="border-none shadow-lg rounded-2xl bg-orange-50/50 p-4 hover:scale-[1.02] transition-transform cursor-pointer">
                        <p className="font-black text-sm">{l.name}</p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>

              {/* TELEFONSKE SLUŽBE (EMERGENCY SERVICE NUMBERS) */}
              <Card className="rounded-[2.5rem] shadow-xl border-none overflow-hidden bg-slate-900 text-white p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <ShieldAlert className="size-6 text-red-500 animate-pulse" />
                  <h3 className="text-xl font-headline font-black uppercase tracking-wider">{isEn ? 'Emergency Call Services' : 'Telefonski brojevi hitnih službi'}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {emergencyServices.map((srv, idx) => (
                    <a 
                      key={idx} 
                      href={`tel:${srv.phone}`}
                      className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all flex items-center justify-between"
                    >
                      <div>
                        <p className="font-black text-sm text-white">{srv.name}</p>
                        <p className="text-[10px] text-white/50">{srv.desc}</p>
                      </div>
                      <Badge className="bg-red-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full tracking-wider">
                        {srv.phone}
                      </Badge>
                    </a>
                  ))}
                </div>
              </Card>

              {/* GOOGLE ADS TILE IN CONTENT */}
              <div className="my-8">
                <AdBanner format="rectangle" className="w-full h-[250px] shadow-sm rounded-3xl" />
              </div>

              {/* NEARBY HOMELAND WAR MEMORIALS (DOMOVINSKI RAT) */}
              {nearbyWarMemorials.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-black/5 pb-4">
                    <Shield className="size-5 text-red-600" />
                    <h3 className="text-2xl font-headline font-black italic tracking-tighter text-foreground">
                      {isEn ? 'Nearby Homeland War Memorials' : 'Spomen obilježja Domovinskog rata u blizini'}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {nearbyWarMemorials.map((l) => {
                      const name = isEn && l.metadata?.nameEn ? l.metadata.nameEn : l.name;
                      const image = getFirstPhoto(l) || DEFAULT_LISTING_IMAGE;
                      const path = generateListingUrl(l.locationCategoryId || l.categoryId, l.name, l.id);
                      return (
                        <Link key={l.id} href={path} className="group">
                          <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-white h-full flex flex-col">
                            <div className="relative aspect-[16/10] overflow-hidden">
                              <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                              <Badge className="absolute top-3 left-3 bg-red-600 text-white border-none font-black text-[8px] uppercase tracking-wider">
                                {isEn ? 'Memorial' : 'Spomen obilježje'}
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

              {/* NEARBY NATIONAL PARKS */}
              {nearbyNationalParks.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-black/5 pb-4">
                    <Trees className="size-5 text-emerald-600" />
                    <h3 className="text-2xl font-headline font-black italic tracking-tighter text-foreground">
                      {isEn ? 'Nearby National Parks' : 'Nacionalni parkovi u blizini'}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {nearbyNationalParks.map((l) => {
                      const name = isEn && l.metadata?.nameEn ? l.metadata.nameEn : l.name;
                      const image = getFirstPhoto(l.photoUrls) || DEFAULT_LISTING_IMAGE;
                      const path = generateListingUrl('national_parks', l.name, l.id);
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
                    <BookOpen className="size-5 text-secondary" />
                    <h3 className="text-2xl font-headline font-black italic tracking-tighter text-foreground">
                      {isEn ? `Stories and News from ${city.name}` : `Zanimljivosti i vijesti iz: ${city.name}`}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedArticles.map((a) => {
                      const bTitle = isEn && a.titleEn ? a.titleEn : a.title;
                      return (
                        <Link key={a.id} href={`/blog/${a.id}`} className="group">
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

              {/* Sidebar Ad Placement */}
              <AdBanner format="vertical" className="w-full h-[600px] shadow-sm rounded-3xl" />
            </aside>
          </div>

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
