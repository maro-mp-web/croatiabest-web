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
  MapPin
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { generateListingUrl } from '@/app/lib/utils/slug';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollection } from '@/pocketbase';
import Map from '@/components/map/Map';
import WikiView from '@/components/ui/WikiView';
import { useLanguage } from '@/contexts/LanguageContext';
import { getFirstPhoto } from '@/app/lib/image-helpers';
import { getLocalizedUrl } from '@/lib/i18n-routes';
import { DEFAULT_LISTING_IMAGE } from '@/app/lib/constants';
import AdBanner from '@/components/ads/AdBanner';

interface IslandClientProps {
  island: any;
  listings: any[];
  articles?: any[];
  islandCities?: any[];
}

export default function IslandClient({ island, listings = [], articles = [], islandCities = [] }: IslandClientProps) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  
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
        <Link href={getLocalizedUrl(`/listing/${viewMoreSlug}`, language)} className={`w-full py-3 rounded-xl border-2 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:bg-foreground hover:text-white ${colorClass.replace('text-', 'border-').replace('600', '200')}`}>
          {isEn ? 'View More' : 'Pogledaj više'} <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pb-24">
        <section className="relative h-[60vh] w-full overflow-hidden">
          <Image src={island.image} alt={island.name} fill className="object-cover brightness-[0.4]" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pb-24">
            <div className="size-16 rounded-full border border-white/40 flex items-center justify-center backdrop-blur-md mb-6">
              <Anchor className="text-white size-8" />
            </div>
            <h1 className="text-6xl md:text-[8rem] font-black text-white font-headline drop-shadow-2xl italic tracking-tighter leading-none">
              Otok {island.name} <span className="block text-2xl md:text-4xl not-italic tracking-widest mt-4 opacity-80 uppercase">Vodič i Plaže</span>
            </h1>
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

              {/* GOOGLE ADS TILE IN CONTENT */}
              <div className="my-8">
                <AdBanner format="rectangle" className="w-full h-[250px] shadow-sm rounded-3xl" />
              </div>

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

              <AdBanner format="vertical" className="w-full h-[600px] shadow-sm rounded-3xl" />

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
          
          {/* LISTINGS CATEGORIES COLUMNS - FULL WIDTH SECTION */}
          {(popularListings.length > 0 || viewpointListings.length > 0 || gastroListings.length > 0 || apartmentsListings.length > 0) && (
            <div className="mt-20 pt-16 border-t border-black/5">
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

          {/* WIKIPEDIA SECTIONS */}
          {island?.wikiSections?.length > 0 && (
            <WikiView sections={island.wikiSections} />
          )}

        </div>
      </main>
    </div>
  );
}
