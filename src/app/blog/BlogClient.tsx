
"use client"

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Calendar, User, Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogClient({ articles }: { articles: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || article.category === category;
    return matchesSearch && matchesCategory;
  });

  const featuredArticle = articles[0];

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
        {featuredArticle && category === 'all' && !searchQuery && (
          <Link href={`/blog/${featuredArticle.slug || featuredArticle.id}`}>
            <section className="relative h-[60vh] rounded-[3rem] overflow-hidden mb-20 group cursor-pointer shadow-2xl bg-slate-900 flex items-center justify-center">
              {featuredArticle.image && <Image src={featuredArticle.image} alt={featuredArticle.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-16 text-white">
                <Badge className="w-fit mb-4 bg-primary border-none font-black">{featuredArticle.category}</Badge>
                <h2 className="text-4xl md:text-6xl font-headline font-bold mb-6 max-w-3xl leading-tight">
                  {featuredArticle.title}
                </h2>
                <div className="flex items-center gap-6 text-white/70 font-bold text-sm">
                  <span className="flex items-center gap-2"><User className="size-4" /> {featuredArticle.author || 'CroatiaBest'}</span>
                  <span className="flex items-center gap-2"><Calendar className="size-4" /> {featuredArticle.created ? new Date(featuredArticle.created.replace(' ', 'T')).toLocaleDateString('hr-HR') : ''}</span>
                  <span className="flex items-center gap-2"><Clock className="size-4" /> {featuredArticle.readTime}</span>
                </div>
              </div>
            </section>
          </Link>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
          <Tabs value={category} onValueChange={setCategory} className="bg-secondary/50 p-1 rounded-2xl">
            <TabsList className="bg-transparent">
              <TabsTrigger value="all" className="rounded-xl px-6 font-bold">Sve</TabsTrigger>
              <TabsTrigger value="Putovanja" className="rounded-xl px-6 font-bold">Putovanja</TabsTrigger>
              <TabsTrigger value="Gastronomija" className="rounded-xl px-6 font-bold">Gastronomija</TabsTrigger>
              <TabsTrigger value="Kultura" className="rounded-xl px-6 font-bold">Kultura</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Pretraži članke..." 
              className="pl-12 h-12 rounded-2xl bg-secondary/30 border-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredArticles.map((article) => (
            <Link key={article.id} href={`/blog/${article.slug || article.id}`}>
              <Card className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] bg-white/60 backdrop-blur-md h-full flex flex-col">
                <div className="relative h-64 overflow-hidden bg-slate-100 flex items-center justify-center">
                  {article.image ? (
                    <Image src={article.image} alt={article.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <span className="text-slate-300 font-bold uppercase tracking-widest">{article.category || 'BLOG'}</span>
                  )}
                  <Badge className="absolute top-6 left-6 bg-white/95 text-primary border-none shadow-lg font-black">{article.category}</Badge>
                </div>
                <CardContent className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Calendar className="size-3" /> {article.created ? new Date(article.created.replace(' ', 'T')).toLocaleDateString('hr-HR') : ''}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3" /> {article.readTime}</span>
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
            <Button variant="link" onClick={() => {setSearchQuery(''); setCategory('all')}}>Prikaži sve članke</Button>
          </div>
        )}
      </main>
    </div>
  );
}
