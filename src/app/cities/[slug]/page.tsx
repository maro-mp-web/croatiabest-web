
"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { CITIES, CATEGORIES } from '@/app/lib/constants';
import { MOCK_ARTICLES } from '@/app/lib/mock-data';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  ArrowLeft, 
  ShieldAlert, 
  HeartPulse, 
  Flame, 
  Pill, 
  Loader2, 
  Users, 
  Landmark, 
  Compass, 
  Info, 
  Phone as PhoneIcon, 
  Globe, 
  Home as HomeIcon, 
  Map as MapIcon,
  Binoculars,
  Utensils,
  Umbrella,
  History,
  User,
  Star,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

export default function CityPage() {
  const params = useParams();
  const { t } = useLanguage();
  const [wikiData, setWikiData] = useState<{extract: string, thumbnail?: string}>({ extract: '' });
  const city = CITIES.find(c => c.slug === params.slug);
  const firestore = useFirestore();

  useEffect(() => {
    if (city) {
      document.title = `${city.name} - Službeni vodič | CroatiaBest`;
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

  const cityQuery = useMemoFirebase(() => {
    if (!firestore || !city) return null;
    return query(
      collection(firestore, 'listings'),
      where('city', '==', city.name),
      where('status', '==', 'active')
    );
  }, [firestore, city]);

  const { data: cityListings, isLoading } = useCollection(cityQuery);

  // Group listings by columns
  const emergency = cityListings?.filter(l => ['pharmacy', 'emergency', 'police', 'firefighters'].includes(l.locationCategoryId || l.categoryId)) || [];
  const popular = cityListings?.filter(l => ['beaches', 'opgs', 'wineries'].includes(l.locationCategoryId || l.categoryId)) || [];
  const viewpoints = cityListings?.filter(l => ['viewpoints', 'landmarks'].includes(l.locationCategoryId || l.categoryId)) || [];
  const gastro = cityListings?.filter(l => ['restaurants'].includes(l.locationCategoryId || l.categoryId)) || [];

  // Filter blog posts related to the city
  const relatedArticles = MOCK_ARTICLES.filter(a => 
    a.title.toLowerCase().includes(city?.name.toLowerCase() || '') || 
    a.content.toLowerCase().includes(city?.name.toLowerCase() || '')
  );

  if (!city) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pb-24">
        {/* HERO SECTION */}
        <section className="relative h-[65vh] w-full overflow-hidden">
          <Image src={city.image} alt={city.name} fill className="object-cover brightness-[0.4]" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pb-24">
            <Badge className="bg-primary/20 backdrop-blur-md text-white mb-6 px-8 py-2 rounded-full font-black text-xs uppercase tracking-[0.3em]">{city.region}</Badge>
            <h1 className="text-7xl md:text-[10rem] font-black text-white font-headline drop-shadow-2xl italic tracking-tighter leading-none">{city.name}</h1>
          </div>
        </section>

        <div className="container mx-auto px-6 -mt-24 relative z-20 space-y-16">
          {/* INFO CARD & DESCRIPTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              <Card className="rounded-[3.5rem] shadow-2xl border-none overflow-hidden bg-white/95 backdrop-blur-3xl p-10 md:p-16">
                <div className="flex flex-col md:flex-row gap-16">
                  <div className="flex-1 space-y-10">
                    <div className="flex items-center gap-4">
                       <Badge variant="outline" className="border-primary text-primary font-black uppercase tracking-widest px-4 py-1">Gradski Vodič</Badge>
                    </div>
                    <h2 className="text-5xl font-headline font-black leading-tight">Otkrijte {city.name}</h2>
                    <div className="prose prose-2xl max-w-none text-muted-foreground font-body italic leading-relaxed whitespace-pre-wrap">
                      {wikiData.extract || city.description}
                    </div>
                  </div>
                  
                  <div className="w-full md:w-80 space-y-8 bg-secondary/5 rounded-[2.5rem] p-10 border border-black/5 h-fit">
                    {wikiData.thumbnail && (
                      <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-8 shadow-inner border border-black/5 bg-white p-6">
                        <p className="text-[10px] font-black text-center text-muted-foreground uppercase mb-4 tracking-widest">Simbol grada</p>
                        <div className="relative h-full w-full">
                          <Image src={wikiData.thumbnail} alt={`Logo grada ${city.name}`} fill className="object-contain" />
                        </div>
                      </div>
                    )}
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary border-b border-primary/10 pb-4">Info Putovnica</h3>
                    <div className="space-y-6">
                      {[
                        { icon: <Users className="size-5" />, label: 'Stanovnika', value: city.population },
                        { icon: <Landmark className="size-5" />, label: 'Gradonačelnik', value: city.mayor },
                        { icon: <PhoneIcon className="size-5" />, label: 'Pozivni broj', value: city.areaCode },
                        { icon: <HomeIcon className="size-5" />, label: 'Poštanski broj', value: city.zipCode },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                          <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-primary/5 transition-colors">{item.icon}</div>
                          <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{item.label}</p>
                            <p className="font-bold text-lg">{item.value || 'N/A'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {city.officialWeb && (
                      <a href={city.officialWeb} target="_blank" className="block pt-6 text-xs font-black text-primary flex items-center justify-center gap-2 hover:underline bg-white rounded-xl py-3 shadow-sm">
                        <Globe className="size-4" /> SLUŽBENA STRANICA
                      </a>
                    )}
                  </div>
                </div>
              </Card>

              {/* 4 COLUMN GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* COLUMN 1: EMERGENCY */}
                <div className="space-y-6">
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] text-red-600 flex items-center gap-2"><ShieldAlert className="size-4" /> Hitne službe</h4>
                  {emergency.length > 0 ? emergency.map(l => (
                    <Card key={l.id} className="border-none shadow-lg rounded-2xl bg-red-50/50 p-4">
                      <p className="font-black text-sm mb-1">{l.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{l.address}</p>
                      <a href={`tel:${l.contactPhone}`} className="text-xs font-black text-red-600 flex items-center gap-1"><PhoneIcon className="size-3" /> {l.contactPhone}</a>
                    </Card>
                  )) : <p className="text-xs text-muted-foreground italic">Nema upisanih službi</p>}
                </div>

                {/* COLUMN 2: POPULAR */}
                <div className="space-y-6">
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2"><Umbrella className="size-4" /> Popularno</h4>
                  {popular.length > 0 ? popular.map(l => (
                    <Link key={l.id} href={`/listing/${l.id}`}>
                      <Card className="border-none shadow-lg rounded-2xl bg-blue-50/50 p-4 hover:scale-[1.02] transition-transform cursor-pointer mb-3">
                        <p className="font-black text-sm mb-1">{l.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{l.address}</p>
                      </Card>
                    </Link>
                  )) : <p className="text-xs text-muted-foreground italic">Još nema lokacija</p>}
                </div>

                {/* COLUMN 3: VIEWPOINTS */}
                <div className="space-y-6">
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] text-purple-600 flex items-center gap-2"><Binoculars className="size-4" /> Vidikovci</h4>
                  {viewpoints.length > 0 ? viewpoints.map(l => (
                    <Link key={l.id} href={`/listing/${l.id}`}>
                      <Card className="border-none shadow-lg rounded-2xl bg-purple-50/50 p-4 hover:scale-[1.02] transition-transform cursor-pointer mb-3">
                        <p className="font-black text-sm mb-1">{l.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{l.address}</p>
                      </Card>
                    </Link>
                  )) : <p className="text-xs text-muted-foreground italic">Još nema lokacija</p>}
                </div>

                {/* COLUMN 4: GASTRO */}
                <div className="space-y-6">
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary flex items-center gap-2"><Utensils className="size-4" /> Gastro</h4>
                  {gastro.length > 0 ? gastro.map(l => (
                    <Link key={l.id} href={`/listing/${l.id}`}>
                      <Card className="border-none shadow-lg rounded-2xl bg-primary/5 p-4 hover:scale-[1.02] transition-transform cursor-pointer mb-3">
                        <p className="font-black text-sm mb-1">{l.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{l.address}</p>
                      </Card>
                    </Link>
                  )) : <p className="text-xs text-muted-foreground italic">Još nema lokacija</p>}
                </div>
              </div>

              {/* BLOG / ARTICLE SECTION */}
              <div className="space-y-10 pt-12 border-t border-black/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-4xl font-headline font-black uppercase tracking-tighter italic">Priče i povijest</h3>
                  <Link href="/blog"><Button variant="ghost" className="font-black text-xs uppercase tracking-widest">Vidi magazin <ArrowRight className="size-4 ml-2" /></Button></Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {relatedArticles.length > 0 ? relatedArticles.map(article => (
                    <Link key={article.id} href={`/blog/${article.id}`}>
                      <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden group bg-white">
                        <div className="relative h-48">
                          <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="p-8 space-y-3">
                          <Badge variant="secondary" className="text-[10px] font-black uppercase">{article.category}</Badge>
                          <h4 className="text-2xl font-black leading-tight group-hover:text-primary transition-colors">{article.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 italic font-body">{article.excerpt}</p>
                        </div>
                      </Card>
                    </Link>
                  )) : (
                    <div className="col-span-2 p-20 border-2 border-dashed rounded-[3rem] text-center text-muted-foreground italic">
                      Trenutno nema članaka vezanih uz ovaj grad. Naši urednici rade na novim pričama.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SIDEBAR: MAP & TRIVIA */}
            <aside className="lg:col-span-4 space-y-12">
              <Card className="rounded-[3rem] shadow-2xl border-none overflow-hidden bg-white">
                <div className="p-8 border-b bg-secondary/5 font-black text-xl italic flex items-center gap-2">
                  <MapIcon className="size-5" /> Lokacije u blizini
                </div>
                <div className="h-[450px] w-full relative">
                  <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                    <Map defaultCenter={{ lat: city.lat, lng: city.lng }} defaultZoom={13} disableDefaultUI={true} gestureHandling={'greedy'} className="w-full h-full">
                      {cityListings?.map(l => (
                        <AdvancedMarker key={l.id} position={{ lat: l.latitude, lng: l.longitude }}>
                          <Pin background={CATEGORIES.find(c => c.id === (l.locationCategoryId || l.categoryId))?.color || '#333'} />
                        </AdvancedMarker>
                      ))}
                    </Map>
                  </APIProvider>
                </div>
                <div className="p-8">
                  <Link href="/explore"><Button className="w-full h-14 bg-primary rounded-2xl font-black uppercase tracking-widest shadow-xl">OTVORI VELIKU KARTU</Button></Link>
                </div>
              </Card>

              {/* TRIVIA / ZANIMLJIVOSTI */}
              <div className="bg-foreground text-white p-12 rounded-[3.5rem] space-y-8 shadow-2xl relative overflow-hidden group">
                <Star className="size-20 text-primary absolute -top-4 -right-4 opacity-10 group-hover:rotate-12 transition-transform" />
                <h4 className="text-3xl font-black italic">Zanimljivosti</h4>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-black text-primary uppercase tracking-widest">Jeste li znali?</p>
                    <p className="text-lg font-body italic text-white/80 leading-relaxed">
                      Grad {city.name} je središte {city.region} i krije brojne tajne koje tek čekaju da budu otkrivene.
                    </p>
                  </div>
                  <div className="pt-6 border-t border-white/10">
                     <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">Poznati Hrvati</p>
                     <p className="text-sm text-white/60 font-medium">Istražite listu poznatih ličnosti rođenih u ovom gradu na našem blogu.</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
