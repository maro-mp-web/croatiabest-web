
"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { CITIES, CATEGORIES } from '@/app/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowLeft, ShieldAlert, HeartPulse, Flame, Pill, Loader2, Users, Landmark, Compass, Info, Phone as PhoneIcon, Globe, Home as HomeIcon, Map as MapIcon } from 'lucide-react';
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
  const cityEmergency = cityListings?.filter(l => ['pharmacy', 'emergency', 'police', 'firefighters'].includes(l.locationCategoryId || l.categoryId)) || [];

  if (!city) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pb-24">
        <section className="relative h-[60vh] w-full overflow-hidden">
          <Image src={city.image} alt={city.name} fill className="object-cover brightness-50" priority />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pb-20">
            <Badge className="bg-primary/20 backdrop-blur-md text-white mb-4 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest">{city.region}</Badge>
            <h1 className="text-7xl md:text-9xl font-black text-white font-headline drop-shadow-2xl italic tracking-tighter">{city.name}</h1>
          </div>
        </section>

        <div className="container mx-auto px-6 -mt-20 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              <Card className="rounded-[3rem] shadow-2xl border-none overflow-hidden bg-white/95 backdrop-blur-3xl p-10 md:p-16">
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex-1 space-y-8">
                    <h2 className="text-4xl font-headline font-black">O gradu {city.name}</h2>
                    <div className="prose prose-xl max-w-none text-muted-foreground font-body italic leading-relaxed">
                      {wikiData.extract || city.description}
                    </div>
                  </div>
                  <div className="w-full md:w-80 space-y-6 bg-secondary/5 rounded-3xl p-8 border border-black/5">
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary border-b pb-4">Info Karton</h3>
                    {[
                      { icon: <Users className="size-4" />, label: 'Stanovnika', value: city.population },
                      { icon: <Landmark className="size-4" />, label: 'Gradonačelnik', value: city.mayor },
                      { icon: <PhoneIcon className="size-4" />, label: 'Pozivni broj', value: city.areaCode },
                      { icon: <HomeIcon className="size-4" />, label: 'Poštanski broj', value: city.zipCode },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="text-muted-foreground">{item.icon}</div>
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase">{item.label}</p>
                          <p className="font-bold">{item.value || 'N/A'}</p>
                        </div>
                      </div>
                    ))}
                    {city.officialWeb && (
                      <a href={city.officialWeb} target="_blank" className="block pt-4 text-xs font-black text-primary flex items-center gap-2 hover:underline">
                        <Globe className="size-4" /> SLUŽBENA STRANICA
                      </a>
                    )}
                  </div>
                </div>
              </Card>

              <div className="space-y-8">
                <h3 className="text-4xl font-headline font-black flex items-center gap-4"><ShieldAlert className="text-primary size-10" /> DEŽURNE SLUŽBE</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cityEmergency.map(s => (
                    <Card key={s.id} className="border-none shadow-xl rounded-[2.5rem] bg-white hover:scale-[1.02] transition-transform">
                      <CardContent className="p-8 flex items-center gap-6">
                        <div className="p-4 bg-primary/5 rounded-2xl">
                          {s.locationCategoryId === 'pharmacy' ? <Pill className="text-green-600" /> : <HeartPulse className="text-red-600" />}
                        </div>
                        <div>
                          <p className="font-black text-lg">{s.name}</p>
                          <p className="text-sm text-muted-foreground mb-2">{s.address}</p>
                          <a href={`tel:${s.contactPhone}`} className="text-sm font-black text-primary flex items-center gap-2"><PhoneIcon className="size-3" /> {s.contactPhone}</a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-8">
              <Card className="rounded-[3rem] shadow-2xl border-none overflow-hidden bg-white">
                <div className="p-8 border-b bg-secondary/5 font-black text-xl italic flex items-center gap-2">
                  <MapIcon className="size-5" /> Karta grada
                </div>
                <div className="h-[400px] w-full relative">
                  <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                    <Map defaultCenter={{ lat: city.lat, lng: city.lng }} defaultZoom={13} disableDefaultUI={true} gestureHandling={'greedy'} className="w-full h-full">
                      {cityListings?.map(l => (
                        <AdvancedMarker key={l.id} position={{ lat: l.latitude, lng: l.longitude }}>
                          <Pin background={CATEGORIES.find(c => c.id === l.locationCategoryId)?.color || '#333'} />
                        </AdvancedMarker>
                      ))}
                    </Map>
                  </APIProvider>
                </div>
                <div className="p-8">
                  <Link href="/explore"><Button className="w-full h-14 bg-primary rounded-2xl font-black uppercase tracking-widest shadow-xl">ISTRAŽI SVE LOKACIJE</Button></Link>
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
