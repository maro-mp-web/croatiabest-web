
"use client"

import React from 'react';
import Link from 'next/link';
import { Map, Menu, BookOpen, ChevronDown, Building2, LayoutDashboard, Anchor, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/brand/Logo';
import { useUser, useCollection } from '@/pocketbase';

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useUser();

  const { data: citiesData } = useCollection('cities', { sort: 'name', requestKey: null });
  const { data: islandsData } = useCollection('islands', { sort: 'name', requestKey: null });

  const cities = citiesData || [];
  const islands = islandsData || [];

  // Stroga provjera administratora
  const isAdmin = user?.email === 'maro.webdeveloper@gmail.com';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Logo />
          </Link>
          <nav className="hidden gap-6 lg:flex items-center">
            <Link href="/explore" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors">
              <Map className="size-4" /> {t.navExplore}
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors outline-none">
                  <Building2 className="size-4" /> {t.navCities} <ChevronDown className="size-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 rounded-xl p-2 grid grid-cols-1 gap-1">
                {cities.map((city) => (
                  <DropdownMenuItem key={city.slug} asChild>
                    <Link href={`/cities/${city.slug}`} className="w-full cursor-pointer font-medium hover:bg-primary/5 hover:text-primary rounded-lg transition-colors">
                      {city.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors outline-none">
                  <Anchor className="size-4" /> {t.navIslands} <ChevronDown className="size-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 rounded-xl p-2 grid grid-cols-1 gap-1">
                {islands.map((island) => (
                  <DropdownMenuItem key={island.slug} asChild>
                    <Link href={`/islands/${island.slug}`} className="w-full cursor-pointer font-medium hover:bg-primary/5 hover:text-primary rounded-lg transition-colors">
                      {island.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/blog" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors">
              <BookOpen className="size-4" /> {t.navBlog}
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <Link href="/dodaj-objekt">
            <Button variant="outline" className="rounded-full border-primary text-primary font-black px-6">
              <PlusCircle className="size-4 mr-2" /> {t.navAddListing}
            </Button>
          </Link>

          <div className="flex items-center space-x-2 font-black text-sm">
            <button 
              onClick={() => setLanguage('hr')} 
              className={`transition-colors ${language === 'hr' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              HR
            </button>
            <span className="text-muted-foreground/30">|</span>
            <button 
              onClick={() => setLanguage('en')} 
              className={`transition-colors ${language === 'en' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              EN
            </button>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">Navigacija</SheetTitle>
              <SheetDescription className="sr-only">Glavni izbornik za mobilne uređaje</SheetDescription>
              <div className="flex flex-col gap-8 pt-12">
                <Logo className="mb-4" />
                <nav className="flex flex-col gap-4">
                  <Link href="/dodaj-objekt" className="text-xl font-black text-primary uppercase tracking-tight">
                    {t.navAddListing}
                  </Link>
                  <Link href="/explore" className="text-xl font-black uppercase tracking-tight hover:text-primary transition-colors">{t.navExplore}</Link>
                  <div className="border-t pt-4 pb-2">
                    <p className="text-xs font-bold text-muted-foreground mb-4 tracking-widest uppercase">{t.navCities}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {cities.map(city => (
                        <Link key={city.slug} href={`/cities/${city.slug}`} className="text-sm font-bold hover:text-primary transition-colors">{city.name}</Link>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-4 pb-2">
                    <p className="text-xs font-bold text-muted-foreground mb-4 tracking-widest uppercase">{t.navIslands}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {islands.map(island => (
                        <Link key={island.slug} href={`/islands/${island.slug}`} className="text-sm font-bold hover:text-primary transition-colors">{island.name}</Link>
                      ))}
                    </div>
                  </div>
                  <Link href="/blog" className="text-xl font-black uppercase tracking-tight hover:text-primary transition-colors">{t.navBlog}</Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
