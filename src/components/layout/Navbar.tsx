"use client"

import React from 'react';
import Link from 'next/link';
import { Map, LayoutGrid, Info, Search, Menu, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-headline text-2xl font-bold text-primary tracking-tight">
              Croatia<span className="text-accent">Best</span>
            </span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link href="/explore" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
              <Map className="size-4" /> Istraži Kartu
            </Link>
            <Link href="/blog" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
              <BookOpen className="size-4" /> Magazin
            </Link>
            <Link href="/info" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
              <Info className="size-4" /> Informacije
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full max-w-sm hidden lg:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Traži plaže, restorane, gradove..." 
              className="pl-10 bg-secondary/50 border-none focus-visible:ring-primary" 
            />
          </div>
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
                <Link href="/explore" className="text-lg font-medium">Istraži Kartu</Link>
                <Link href="/blog" className="text-lg font-medium">Magazin</Link>
                <Link href="/info" className="text-lg font-medium">Informacije</Link>
                <Link href="/admin" className="text-lg font-medium">Admin Panel</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}