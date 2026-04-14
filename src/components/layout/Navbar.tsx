
"use client"

import React from 'react';
import Link from 'next/link';
import { Map, Info, Search, Menu, User, BookOpen, Globe, ChevronDown, Building2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/brand/Logo';
import { CITIES } from '@/app/lib/constants';

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();

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
                {CITIES.map((city) => (
                  <DropdownMenuItem key={city.slug} asChild>
                    <Link href={`/cities/${city.slug}`} className="w-full cursor-pointer font-medium hover:bg-primary/5 hover:text-primary rounded-lg transition-colors">
                      {city.name}
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
          <div className="w-full max-w-[150px] xl:max-w-xs hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder={t.searchPlaceholder}
              className="pl-10 bg-secondary/5 border-none focus-visible:ring-primary h-10 rounded-full" 
            />
          </div>

          <Link href="/submit" className="hidden sm:block">
            <Button className="rounded-full bg-primary hover:bg-primary/90 font-black px-6 shadow-lg shadow-primary/20">
              <PlusCircle className="size-4 mr-2" /> PRIJAVI OBJEKT
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 font-bold h-10">
                <Globe className="size-4 text-secondary" />
                <span className="uppercase">{language}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem onClick={() => setLanguage('hr')} className="font-medium">Hrvatski (HR)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')} className="font-medium">English (EN)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/admin">
            <Button variant="ghost" size="icon" className="rounded-full size-10 hover:bg-primary/10 hover:text-primary">
              <User className="size-5" />
            </Button>
          </Link>
          
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
                  <Link href="/submit" className="text-xl font-black text-primary uppercase tracking-tight">Prijavi Objekt</Link>
                  <Link href="/explore" className="text-xl font-black uppercase tracking-tight hover:text-primary transition-colors">{t.navExplore}</Link>
                  <div className="border-t pt-4 pb-2">
                    <p className="text-xs font-bold text-muted-foreground mb-4 tracking-widest uppercase">{t.navCities}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {CITIES.map(city => (
                        <Link key={city.slug} href={`/cities/${city.slug}`} className="text-sm font-bold hover:text-primary transition-colors">{city.name}</Link>
                      ))}
                    </div>
                  </div>
                  <Link href="/blog" className="text-xl font-black uppercase tracking-tight hover:text-primary transition-colors">{t.navBlog}</Link>
                  <Link href="/admin" className="text-xl font-black uppercase tracking-tight hover:text-primary transition-colors">{t.navAdmin}</Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
