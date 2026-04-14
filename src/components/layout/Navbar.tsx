"use client"

import React from 'react';
import Link from 'next/link';
import { Map, Info, Search, Menu, User, BookOpen, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-headline text-2xl font-bold text-primary tracking-tight">
              Croatia<span className="text-secondary">Best</span>
            </span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link href="/explore" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
              <Map className="size-4" /> {t.navExplore}
            </Link>
            <Link href="/blog" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
              <BookOpen className="size-4" /> {t.navBlog}
            </Link>
            <Link href="/info" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
              <Info className="size-4" /> {t.navInfo}
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full max-w-sm hidden lg:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder={t.searchPlaceholder}
              className="pl-10 bg-secondary/10 border-none focus-visible:ring-primary" 
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe className="size-4" />
                <span className="uppercase">{language}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('hr')}>Hrvatski (HR)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')}>English (EN)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/admin">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="size-5" />
            </Button>
          </Link>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 pt-10">
                <Link href="/explore" className="text-lg font-medium">{t.navExplore}</Link>
                <Link href="/blog" className="text-lg font-medium">{t.navBlog}</Link>
                <Link href="/info" className="text-lg font-medium">{t.navInfo}</Link>
                <Link href="/admin" className="text-lg font-medium">{t.navAdmin}</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}