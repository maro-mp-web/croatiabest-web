
"use client"

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Calendar, User, Clock, ArrowRight, MapPin, Compass, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate, calculateReadTime } from '@/lib/utils';
import { getLocalizedUrl } from '@/lib/i18n-routes';
import { useLanguage } from '@/contexts/LanguageContext';

const POPULAR_DESTINATIONS = [
  { name: 'Dubrovnik', isIsland: false },
  { name: 'Split', isIsland: false },
  { name: 'Zagreb', isIsland: false },
  { name: 'Zadar', isIsland: false },
  { name: 'Rovinj', isIsland: false },
  { name: 'Hvar', isIsland: true, label: 'Otok Hvar', labelEn: 'Island Hvar' },
  { name: 'Korčula', isIsland: true, label: 'Otok Korčula', labelEn: 'Island Korčula' },
  { name: 'Brač', isIsland: true, label: 'Otok Brač', labelEn: 'Island Brač' },
  { name: 'Krk', isIsland: true, label: 'Otok Krk', labelEn: 'Island Krk' },
];

export default function BlogClient({ articles }: { articles: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const { language } = useLanguage();
  const isEn = language === 'en';

  const filteredArticles = articles.filter(article => {
    const q = searchQuery.toLowerCase().trim();
    const tagArray = Array.isArray(article.tags) 
      ? article.tags 
      : (typeof article.tags === 'string' ? article.tags.split(',') : []);

    const matchesSearch = !q || 
      (article.title && article.title.toLowerCase().includes(q)) ||
      (article.titleEn && article.titleEn.toLowerCase().includes(q)) ||
      (article.excerpt && article.excerpt.toLowerCase().includes(q)) ||
      (article.excerptEn && article.excerptEn.toLowerCase().includes(q)) ||
      tagArray.some((t: string) => t.toLowerCase().includes(q)) ||
      (article.city && article.city.toLowerCase().includes(q)) ||
      (article.location && article.location.toLowerCase().includes(q));

    const matchesCategory = category === 'all' || article.category === category;
    return matchesSearch && matchesCategory;
  });

  const featuredArticle = articles[0];

  const baseCategories = ['Putovanja', 'Gastronomija', 'Kultura', 'Povijest'];
  const extraCategories = Array.from(
    new Set(articles.map(a => a.category).filter(c => c && !baseCategories.includes(c) && c !== 'all'))
  );
  const displayCategories = [...baseCategories, ...extraCategories];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <Badge className="bg-primary/10 text-primary border-none text-xs font-black tracking-widest uppercase px-6 py-2">
            CroatiaBest Magazin
          </Badge>
          <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tight">Otkrijte priče o Hrvatskoj</h1>
          <p className="text-muted-foreground text-xl max-w-2xl font-body italic">
            Savjeti za putovanja, gastro vodiči i skrivene tajne naših gradova.
          </p>
        </div>

        {/* Hero Article */}
        {featuredArticle && category === 'all' && !searchQuery && (() => {
          const isEn = language === 'en';
          const featTitle = isEn ? (featuredArticle.titleEn || featuredArticle.title) : (featuredArticle.title || featuredArticle.titleEn);
          return (
            <Link href={getLocalizedUrl(`/blog/${featuredArticle.slug || featuredArticle.id}`, language)}>
              <section className="relative h-[60vh] rounded-[3rem] overflow-hidden mb-20 group cursor-pointer shadow-2xl bg-slate-900 flex items-center justify-center">
                {featuredArticle.image && <Image src={featuredArticle.image} alt={featTitle} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-16 text-white">
                  <Badge className="w-fit mb-4 bg-primary border-none font-black">{featuredArticle.category}</Badge>
                  <h2 className="text-4xl md:text-6xl font-headline font-bold mb-6 max-w-3xl leading-tight">
                    {featTitle}
                  </h2>
                  <div className="flex items-center gap-6 text-white/70 font-bold text-sm">
                    <span className="flex items-center gap-2"><User className="size-4" /> {featuredArticle.author || 'CroatiaBest'}</span>
                    <span className="flex items-center gap-2"><Clock className="size-4" /> {featuredArticle.readTime && featuredArticle.readTime !== '5 min' ? featuredArticle.readTime : `${calculateReadTime(featuredArticle.content)} min`}</span>
                  </div>
                </div>
              </section>
            </Link>
          );
        })()}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
          <Tabs value={category} onValueChange={setCategory} className="bg-secondary/50 p-1 rounded-2xl">
            <TabsList className="bg-transparent flex flex-wrap h-auto gap-1">
              <TabsTrigger value="all" className="rounded-xl px-6 py-2.5 font-bold">Sve</TabsTrigger>
              {displayCategories.map(cat => (
                <TabsTrigger key={String(cat)} value={String(cat)} className="rounded-xl px-6 py-2.5 font-bold">
                  {String(cat)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder={isEn ? "Search articles & destinations..." : "Pretraži članke i destinacije..."} 
              className="pl-12 h-12 rounded-2xl bg-secondary/30 border-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Popular Destination Quick-Filters */}
        <div className="mb-10 p-4 md:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin className="size-3.5 text-primary" />
              {isEn ? 'Filter by Destination:' : 'Filtriraj po destinaciji:'}
            </span>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
              >
                <X className="size-3" /> {isEn ? 'Clear filter' : 'Poništi filter'}
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {POPULAR_DESTINATIONS.map(dest => {
              const isActive = searchQuery.toLowerCase() === dest.name.toLowerCase();
              const label = isEn 
                ? (dest.labelEn || dest.name)
                : (dest.label || dest.name);

              return (
                <button
                  key={dest.name}
                  onClick={() => setSearchQuery(isActive ? '' : dest.name)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive 
                      ? (dest.isIsland ? 'bg-sky-500 text-white shadow-md scale-105' : 'bg-primary text-white shadow-md scale-105')
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {dest.isIsland ? <Compass className="size-3 text-sky-400" /> : <MapPin className="size-3 text-primary" />}
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredArticles.map((article) => {
            const isEn = language === 'en';
            const displayTitle = isEn ? (article.titleEn || article.title) : (article.title || article.titleEn);
            const displayExcerpt = isEn ? (article.excerptEn || article.excerpt) : (article.excerpt || article.excerptEn);
            return (
              <Link key={article.id} href={getLocalizedUrl(`/blog/${article.slug || article.id}`, language)}>
                <Card className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] bg-white/60 backdrop-blur-md h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden bg-slate-100 flex items-center justify-center">
                    {article.image ? (
                      <Image src={article.image} alt={displayTitle} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <span className="text-slate-300 font-bold uppercase tracking-widest">{article.category || 'BLOG'}</span>
                    )}
                    <Badge className="absolute top-6 left-6 bg-white/95 text-primary border-none shadow-lg font-black">{article.category}</Badge>
                  </div>
                  <CardContent className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Clock className="size-3" /> {article.readTime && article.readTime !== '5 min' ? article.readTime : `${calculateReadTime(article.content)} min`}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors flex-1">{displayTitle}</h3>
                    <p className="text-muted-foreground font-body line-clamp-3 mb-6">{displayExcerpt}</p>
                    <Button variant="ghost" className="w-full justify-between p-0 font-black hover:bg-transparent group/btn">
                      {isEn ? 'READ MORE' : 'PROČITAJ VIŠE'} <ArrowRight className="size-4 group-hover/btn:translate-x-2 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-24">
            <h3 className="text-2xl font-bold text-muted-foreground">Nismo pronašli članke za ovaj pojam.</h3>
            <Button variant="link" onClick={() => {setSearchQuery(''); setCategory('all')}}>Prikaži sve članke</Button>
          </div>
        )}
      </main>
    </div>
  );
}
