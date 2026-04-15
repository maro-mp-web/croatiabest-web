
"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { CITIES } from '@/app/lib/constants';
import { MOCK_LISTINGS } from '@/app/lib/mock-data';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Navigation, ArrowLeft, ShieldAlert, HeartPulse, Flame, Pill } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export default function CityPage() {
  const params = useParams();
  const { t } = useLanguage();
  const [wikiData, setWikiData] = useState<string>('');
  const city = CITIES.find(c => c.slug === params.slug);

  useEffect(() => {
    if (city) {
      // Wikipedia API (hr)
      fetch(`https://hr.wikipedia.org/api/rest_v1/page/summary/${city.name}`)
        .then(res => res.json())
        .then(data => {
          if (data.extract) setWikiData(data.extract);
        })
        .catch(err => console.error('Wiki error', err));
    }
  }, [city]);

  if (!city) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Grad nije pronađen</h1>
        <Link href="/">
          <Button variant="link" className="mt-4">{t.backToHome}</Button>
        </Link>
      </div>
    );
  }

  const cityEmergency = MOCK_LISTINGS.filter(l => l.city === city.name && ['pharmacy', 'emergency', 'police', 'firefighters'].includes(l.categoryId));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pb-24">
        {/* City Hero */}
        <div className="relative h-[60vh] w-full overflow-hidden">
          <Image src={city.image} alt={city.name} fill className="object-cover brightness-75" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center text-center p-6">
            <h1 className="text-6xl md:text-8xl font-black text-white font-headline drop-shadow-2xl">{city.name}</h1>
          </div>
        </div>

        <div className="container mx-auto px-6 -mt-16 relative z-20 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-12">
              <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2.5rem] p-8 md:p-12">
                <h2 className="text-4xl font-headline font-black mb-6">O gradu {city.name} (Wikipedia)</h2>
                <p className="text-xl leading-relaxed text-muted-foreground font-body italic mb-8">
                  {wikiData || city.description}
                </p>
                <div className="grid grid-cols-2 gap-6 pt-8 border-t">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Stanovništvo</p>
                    <p className="text-2xl font-black">{city.population}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Regija</p>
                    <p className="text-2xl font-black">{city.region}</p>
                  </div>
                </div>
              </div>

              {/* Emergency Services Section */}
              <div className="space-y-6">
                <h3 className="text-3xl font-headline font-black flex items-center gap-3">
                  <ShieldAlert className="text-primary size-8" /> HITNE INFORMACIJE (0-24)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cityEmergency.map(service => (
                    <Card key={service.id} className="border-none shadow-lg bg-secondary/5 overflow-hidden">
                      <CardContent className="p-6 flex items-start gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                          {service.categoryId === 'pharmacy' && <Pill className="text-green-600" />}
                          {service.categoryId === 'emergency' && <HeartPulse className="text-red-600" />}
                          {service.categoryId === 'police' && <ShieldAlert className="text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-lg leading-tight mb-1">{service.name}</p>
                          <p className="text-sm text-muted-foreground mb-3">{service.address}</p>
                          <a href={`tel:${service.phone}`} className="inline-flex items-center text-primary font-bold hover:underline">
                            Nazovi: {service.phone}
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              <div className="bg-primary p-10 rounded-[2.5rem] text-white shadow-2xl shadow-primary/30">
                <h3 className="text-3xl font-black mb-4">Planiraj posjet</h3>
                <p className="text-white/80 mb-8 font-body">Pronađite najbolje lokacije u gradu {city.name} na našoj interaktivnoj karti.</p>
                <Link href="/explore">
                  <Button className="w-full h-14 bg-white text-primary hover:bg-white/90 rounded-2xl font-black">
                    OTVORI KARTU
                  </Button>
                </Link>
              </div>
            </aside>

          </div>
        </div>
      </main>

      <footer className="bg-foreground text-white py-12">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <p className="text-white/40 text-xs font-black">&copy; 2024 CroatiaBest</p>
          <Link href="/"><Button variant="ghost" className="text-white/60"><ArrowLeft className="mr-2" /> POČETNA</Button></Link>
        </div>
      </footer>
    </div>
  );
}
