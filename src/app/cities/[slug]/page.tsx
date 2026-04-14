
"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { CITIES } from '@/app/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Navigation, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CityPage() {
  const params = useParams();
  const { t } = useLanguage();
  const city = CITIES.find(c => c.slug === params.slug);

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* City Hero */}
        <div className="relative h-[60vh] w-full overflow-hidden">
          <Image 
            src={city.image} 
            alt={city.name} 
            fill 
            className="object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center text-center p-6">
            <div className="animate-fade-in space-y-4">
              <h1 className="text-6xl md:text-8xl font-black text-white font-headline drop-shadow-2xl">
                {city.name}
              </h1>
              <div className="flex items-center justify-center gap-6 text-white/90">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <MapPin className="size-4 text-primary" />
                  <span className="text-sm font-bold uppercase tracking-widest">{city.region}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* City Content */}
        <div className="container mx-auto px-6 -mt-16 relative z-20 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Info Card */}
            <div className="lg:col-span-2 space-y-12">
              <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2.5rem] p-8 md:p-12 space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl font-headline font-black tracking-tight">O gradu {city.name}</h2>
                  <p className="text-xl leading-relaxed text-muted-foreground font-body">
                    {city.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-black/5">
                  <div className="flex items-center gap-4">
                    <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Users className="size-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t.population}</p>
                      <p className="text-2xl font-black">{city.population}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="size-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                      <MapPin className="size-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t.region}</p>
                      <p className="text-2xl font-black">{city.region}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <Link href="/explore">
                    <Button className="h-14 px-8 rounded-2xl bg-foreground hover:bg-primary transition-all font-bold text-lg">
                      <Navigation className="size-5 mr-3" /> {t.heroCTA}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Quick Facts Section (Mock) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-[2rem] bg-orange-50 border border-orange-100 space-y-3">
                  <h4 className="font-bold text-orange-700 text-xl">Povijest i Kultura</h4>
                  <p className="text-orange-900/70">Otkrijte tisuće godina povijesti utisnute u svaku kamenitu ulicu i trg ovog nevjerojatnog grada.</p>
                </div>
                <div className="p-8 rounded-[2rem] bg-blue-50 border border-blue-100 space-y-3">
                  <h4 className="font-bold text-blue-700 text-xl">Gastronomija</h4>
                  <p className="text-blue-900/70">Uživajte u autentičnim okusima koji spajaju tradicionalnu kuhinju s modernim mediteranskim pristupom.</p>
                </div>
              </div>
            </div>

            {/* Right: Sidebar / Explore More */}
            <aside className="space-y-8">
              <div className="bg-primary p-10 rounded-[2.5rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 size-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <h3 className="text-3xl font-black leading-tight mb-6">Planiraj posjet {city.name}</h3>
                <p className="text-white/80 mb-8 font-body text-lg italic">"Dozvolite nam da vas vodimo kroz najbolje restorane, smještaj i skrivene plaže koje ovaj grad nudi."</p>
                <Link href="/explore">
                  <Button className="w-full h-14 bg-white text-primary hover:bg-white/90 rounded-2xl font-black text-lg">
                    ISTRAŽI SVE LOKACIJE
                  </Button>
                </Link>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-secondary/5 border-2 border-dashed border-secondary/20 text-center space-y-4">
                <h4 className="font-bold text-secondary text-sm uppercase tracking-[0.2em]">Oglasni prostor</h4>
                <div className="h-48 flex items-center justify-center text-muted-foreground/40 italic">
                  Postanite vidljivi posjetiteljima {city.name}
                </div>
                <Link href="/submit">
                  <Button variant="link" className="text-secondary font-bold">Prijavi svoj objekt ovdje &rarr;</Button>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-xs font-black tracking-widest uppercase">&copy; 2024 CroatiaBest - {city.name}</p>
          <Link href="/">
            <Button variant="ghost" className="text-white/60 hover:text-white flex items-center gap-2">
              <ArrowLeft className="size-4" /> {t.backToHome}
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  );
}
