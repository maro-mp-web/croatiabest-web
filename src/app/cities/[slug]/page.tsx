
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
  Star,
  ArrowRight,
  History,
  Flag,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

export default function CityPage() {
  const params = useParams();
  const { t } = useLanguage();
  const [wikiData, setWikiData] = useState<{extract: string, thumbnail?: string}>({ extract: '' });
  const city = CITIES.find(c => c.slug === params.slug);
  const firestore = useFirestore();

  useEffect(() => {
    if (city) {
      document.title = `${city.name} - Službeni turistički vodič, povijest i lokacije | CroatiaBest`;
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

  const emergency = cityListings?.filter(l => ['pharmacy', 'emergency', 'police', 'firefighters'].includes(l.locationCategoryId || l.categoryId)) || [];
  const popular = cityListings?.filter(l => ['beaches', 'opgs', 'wineries'].includes(l.locationCategoryId || l.categoryId)) || [];
  const viewpoints = cityListings?.filter(l => ['viewpoints', 'landmarks'].includes(l.locationCategoryId || l.categoryId)) || [];
  const gastro = cityListings?.filter(l => ['restaurants'].includes(l.locationCategoryId || l.categoryId)) || [];

  if (!city) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pb-24">
        <section className="relative h-[60vh] w-full overflow-hidden">
          <Image src={city.image} alt={`Vodič kroz grad ${city.name}`} fill className="object-cover brightness-[0.4]" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pb-24">
            <Badge className="bg-primary/20 backdrop-blur-md text-white mb-6 px-8 py-2 rounded-full font-black text-xs uppercase tracking-[0.3em]">{city.region}</Badge>
            <h1 className="text-6xl md:text-[8rem] font-black text-white font-headline drop-shadow-2xl italic tracking-tighter leading-none">
              {city.name} <span className="block text-2xl md:text-4xl not-italic tracking-widest mt-4 opacity-80 uppercase">Vodič i Povijest</span>
            </h1>
          </div>
        </section>

        <div className="container mx-auto px-6 -mt-16 relative z-20 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              <Card className="rounded-[3rem] shadow-2xl border-none overflow-hidden bg-white/95 backdrop-blur-3xl p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                       <Badge variant="outline" className="border-primary text-primary font-black uppercase tracking-widest px-4 py-1">O gradu {city.name}</Badge>
                    </div>
                    <h2 className="text-4xl font-headline font-black leading-tight">Otkrijte {city.name}: Sve što trebate znati</h2>
                    <div className="prose prose-xl max-w-none text-muted-foreground font-body italic leading-relaxed whitespace-pre-wrap">
                      {wikiData.extract || city.description}
                    </div>
                  </div>
                  
                  <div className="w-full md:w-80 space-y-8 bg-secondary/5 rounded-[2.5rem] p-8 border border-black/5 h-fit">
                    {wikiData.thumbnail && (
                      <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-8 shadow-inner border border-black/5 bg-white p-6">
                        <p className="text-[10px] font-black text-center text-muted-foreground uppercase mb-4 tracking-widest">Simbol {city.name}</p>
                        <div className="relative h-full w-full">
                          <Image src={wikiData.thumbnail} alt={`Službeni grb grada ${city.name}`} fill className="object-contain" />
                        </div>
                      </div>
                    )}
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary border-b border-primary/10 pb-4">Gradske Informacije</h3>
                    <div className="space-y-4">
                      {[
                        { icon: <Users className="size-4" />, label: 'Stanovnika', value: city.population },
                        { icon: <Landmark className="size-4" />, label: 'Gradonačelnik', value: city.mayor },
                        { icon: <PhoneIcon className="size-4" />, label: 'Pozivni broj', value: city.areaCode },
                        { icon: <HomeIcon className="size-4" />, label: 'Poštanski broj', value: city.zipCode },
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
                        <Globe className="size-4" /> Službeni web
                      </a>
                    )}
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            </div>

            <aside className="lg:col-span-4 space-y-12">
              <Card className="rounded-[3rem] shadow-2xl border-none overflow-hidden bg-white">
                <div className="p-8 border-b bg-secondary/5 font-black text-xl italic flex items-center gap-2">
                  <MapIcon className="size-5" /> Lokacije u {city.name}
                </div>
                <div className="h-[400px] w-full relative">
                  <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                    <Map defaultCenter={{ lat: city.lat, lng: city.lng }} defaultZoom={13} disableDefaultUI={true} gestureHandling={'greedy'} className="w-full h-full">
                      {cityListings?.map(l => {
                        const lat = typeof l.latitude === 'string' ? parseFloat(l.latitude) : l.latitude;
                        const lng = typeof l.longitude === 'string' ? parseFloat(l.longitude) : l.longitude;
                        if (isNaN(lat) || isNaN(lng)) return null;
                        return (
                          <Marker key={l.id} position={{ lat, lng }} />
                        );
                      })}
                    </Map>
                  </APIProvider>
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
