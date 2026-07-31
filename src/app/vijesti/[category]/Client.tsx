"use client"

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { calculateReadTime } from '@/lib/utils';
import { getLocalizedUrl } from '@/lib/i18n-routes';
import { useLanguage } from '@/contexts/LanguageContext';

export default function VijestiClient({ articles, category }: { articles: any[], category: string }) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = articles.filter(article => {
    return article.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <Badge className="bg-primary/10 text-primary border-none text-xs font-black tracking-widest uppercase px-6 py-2">
            Vijesti
          </Badge>
          <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tight">{category}</h1>
          <p className="text-muted-foreground text-xl max-w-2xl font-body italic">
            Najnovije vijesti i zanimljivosti.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 justify-end items-center mb-12">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Pretraži vijesti..." 
              className="pl-12 h-12 rounded-2xl bg-secondary/30 border-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredArticles.map((article) => (
            <Link key={article.id} href={getLocalizedUrl(`/blog/${article.slug || article.id}`, language)}>
              <Card className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] bg-white/60 backdrop-blur-md h-full flex flex-col">
                <div className="relative h-64 overflow-hidden bg-slate-100 flex items-center justify-center">
                  {article.image ? (
                    <Image src={article.image} alt={article.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <span className="text-slate-300 font-bold uppercase tracking-widest">{article.category || 'VIJESTI'}</span>
                  )}
                  <Badge className="absolute top-6 left-6 bg-white/95 text-primary border-none shadow-lg font-black">{article.category}</Badge>
                </div>
                <CardContent className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Clock className="size-3" /> {article.readTime && article.readTime !== '5 min' ? article.readTime : `${calculateReadTime(article.content)} min`}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors flex-1">{article.title}</h3>
                  <p className="text-muted-foreground font-body line-clamp-3 mb-6">{article.excerpt}</p>
                  <Button variant="ghost" className="w-full justify-between p-0 font-black hover:bg-transparent group/btn">
                    PROČITAJ VIŠE <ArrowRight className="size-4 group-hover/btn:translate-x-2 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-24">
            <h3 className="text-2xl font-bold text-muted-foreground">Nismo pronašli članke za ovaj pojam.</h3>
            <Button variant="link" onClick={() => {setSearchQuery('')}}>Prikaži sve vijesti</Button>
          </div>
        )}
      </main>
    </div>
  );
}
