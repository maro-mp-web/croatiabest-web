"use client"

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Clock, ArrowRight, Newspaper, Flame, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { calculateReadTime } from '@/lib/utils';
import { getLocalizedUrl } from '@/lib/i18n-routes';
import { useLanguage } from '@/contexts/LanguageContext';

const CATEGORIES = [
  { id: 'all', label: 'Sve vijesti' },
  { id: 'Vijesti iz Hrvatske', label: 'Hrvatska' },
  { id: 'Vijesti iz Svijeta', label: 'Svijet' },
  { id: 'Zanimljivosti', label: 'Zanimljivosti' },
  { id: 'Poznati Hrvati', label: 'Poznati Hrvati' },
  { id: 'Slavni u Hrvatskoj', label: 'Slavni u RH' },
  { id: 'Iz Povijesti', label: 'Povijest' },
  { id: 'Iz geografije', label: 'Geografija' },
  { id: 'Domovinski rat', label: 'Domovinski rat' },
];

export default function VijestiHubClient({ articles }: { articles: any[] }) {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      (article.title && article.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = filteredArticles[0];
  const gridArticles = filteredArticles.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 md:px-6 py-10 flex-1">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 space-y-3">
          <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20 font-black tracking-widest uppercase px-5 py-1.5 text-xs rounded-full flex items-center gap-1.5">
            <Flame className="size-3.5 fill-rose-500 text-rose-500" />
            AKTUALNO & UŽIVO
          </Badge>
          <h1 className="text-4xl md:text-6xl font-headline font-black tracking-tight text-slate-900">
            Vijesti iz <span className="text-primary italic">Hrvatske & Svijeta</span>
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl font-body">
            Najnovije turističke vijesti, aktualnosti, gastro novosti i ekskluzivne priče u stvarnom vremenu.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Pretraži naslove i teme..."
              className="pl-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Featured Big Article (if exists) */}
        {featuredArticle && (
          <div className="mb-12">
            <Link href={getLocalizedUrl(`/blog/${featuredArticle.slug || featuredArticle.id}`, language)} className="group block">
              <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl border border-black/5 grid grid-cols-1 lg:grid-cols-12 min-h-[420px] transition-all hover:shadow-primary/10">
                {/* Image side */}
                <div className="lg:col-span-7 relative h-72 lg:h-auto overflow-hidden">
                  {featuredArticle.image ? (
                    <Image
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      fill
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <Newspaper className="size-16 text-slate-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950/70 via-transparent to-transparent" />
                  <Badge className="absolute top-6 left-6 bg-rose-600 text-white border-none shadow-lg font-black uppercase tracking-wider text-xs px-4 py-1.5">
                    {featuredArticle.category || 'VIJESTI'}
                  </Badge>
                </div>

                {/* Content side */}
                <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between bg-slate-950 text-white">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-white/60 mb-4 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-rose-400" />
                        {featuredArticle.readTime || `${calculateReadTime(featuredArticle.content)} min`} čitanja
                      </span>
                      <span>•</span>
                      <span>{featuredArticle.author || 'CroatiaBest Redakcija'}</span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-black font-headline leading-tight group-hover:text-primary transition-colors mb-4">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-white/80 font-body text-sm lg:text-base leading-relaxed line-clamp-4">
                      {featuredArticle.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                    <span className="text-amber-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                      Pročitaj cijelu vijest <ArrowRight className="size-4 group-hover:translate-x-2 transition-transform" />
                    </span>
                    <span className="text-[11px] text-white/40 italic">CroatiaBest Vijesti</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridArticles.map((article) => (
            <Link key={article.id} href={getLocalizedUrl(`/blog/${article.slug || article.id}`, language)}>
              <Card className="group overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 rounded-[2rem] bg-white h-full flex flex-col hover:-translate-y-1">
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  {article.image ? (
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200">
                      <Newspaper className="size-10 text-slate-400" />
                    </div>
                  )}
                  <Badge className="absolute top-4 left-4 bg-slate-900/90 text-white backdrop-blur-md border-none shadow-md font-bold text-[11px] uppercase tracking-wider">
                    {article.category || 'VIJESTI'}
                  </Badge>
                </div>

                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {article.readTime || `${calculateReadTime(article.content)} min`}
                      </span>
                      <span>•</span>
                      <span>{article.author || 'Redakcija'}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2 text-slate-900 font-headline">
                      {article.title}
                    </h3>
                    <p className="text-slate-600 font-body text-xs md:text-sm line-clamp-3 leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-black text-primary">
                    <span className="tracking-wider uppercase">Pročitaj više</span>
                    <ArrowRight className="size-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
            <Newspaper className="size-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Trenutno nema vijesti za odabrani filter.</h3>
            <p className="text-slate-500 text-sm mb-6">Pokušajte odabrati drugu kategoriju ili očistiti pretragu.</p>
            <Button
              variant="outline"
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="rounded-xl font-bold"
            >
              Prikaži sve vijesti
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
