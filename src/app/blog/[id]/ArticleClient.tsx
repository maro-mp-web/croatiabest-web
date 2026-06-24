
"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ArticleClient({ article, relatedArticles }: { article: any, relatedArticles: any[] }) {

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pb-24">
        {/* Article Header */}
        <section className="relative h-[70vh] w-full">
          <Image src={article.image} alt={article.title} fill className="object-cover brightness-[0.7]" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center max-w-4xl space-y-6">
              <Badge className="bg-primary hover:bg-primary text-white border-none px-6 py-2 text-sm font-black uppercase tracking-widest">
                {article.category}
              </Badge>
              <h1 className="text-4xl md:text-7xl font-headline font-black text-white leading-[1.1] drop-shadow-2xl">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 font-bold">
                <span className="flex items-center gap-2"><User className="size-5 text-primary" /> {article.author}</span>
                <span className="flex items-center gap-2"><Calendar className="size-5 text-primary" /> {article.date}</span>
                <span className="flex items-center gap-2"><Clock className="size-5 text-primary" /> {article.readTime} čitanja</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <article className="container mx-auto px-4 -mt-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Sidebar Social */}
            <div className="hidden lg:flex lg:col-span-1 flex-col gap-4 pt-24 sticky top-24 h-fit">
              <Button variant="outline" size="icon" className="rounded-full size-12 hover:bg-primary hover:text-white transition-all"><Facebook className="size-5" /></Button>
              <Button variant="outline" size="icon" className="rounded-full size-12 hover:bg-primary hover:text-white transition-all"><Twitter className="size-5" /></Button>
              <Button variant="outline" size="icon" className="rounded-full size-12 hover:bg-primary hover:text-white transition-all"><LinkIcon className="size-5" /></Button>
            </div>

            {/* Main Body */}
            <div className="lg:col-span-8 space-y-12">
              <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/40">
                <p className="text-2xl font-bold italic text-primary/80 mb-10 leading-relaxed font-body">
                  "{article.excerpt}"
                </p>
                
                <div className="prose prose-xl max-w-none font-body leading-loose text-foreground/90 whitespace-pre-wrap" dangerouslySetInnerHTML={{__html: article.content}}>
                </div>

                <div className="mt-16 pt-12 border-t flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-full bg-secondary/20 flex items-center justify-center">
                      <User className="size-8 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Napisao/la</p>
                      <p className="text-xl font-bold">{article.author}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="secondary" className="rounded-xl px-8 font-bold"><Share2 className="size-4 mr-2" /> PODIJELI ČLANAK</Button>
                  </div>
                </div>
              </div>

              {/* Related articles mockup */}
              <div className="space-y-8">
                <h4 className="text-3xl font-headline font-black">Možda će vas zanimati</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {relatedArticles.slice(0, 2).map(item => (
                    <Link key={item.id} href={`/blog/${item.id}`}>
                      <div className="bg-white rounded-[2rem] overflow-hidden shadow-lg group">
                        <div className="relative h-48">
                          <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="p-6">
                          <h5 className="font-bold text-lg mb-2 line-clamp-1">{item.title}</h5>
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Ad or newsletter */}
            <div className="lg:col-span-3 space-y-8 pt-24">
              <div className="bg-foreground text-white p-8 rounded-[2rem] space-y-6 shadow-2xl">
                <h4 className="text-2xl font-black italic">Pretplati se</h4>
                <p className="text-white/60 font-body">Najbolje priče o Hrvatskoj direktno u tvoj inbox svaku nedjelju.</p>
                <input className="w-full h-12 bg-white/10 rounded-xl px-4 text-white border border-white/20 focus:outline-none focus:border-primary" placeholder="Email adresa" />
                <Button className="w-full bg-primary font-black h-12 rounded-xl">PRIDRUŽI SE</Button>
              </div>

              <div className="p-8 border-2 border-dashed rounded-[2rem] text-center space-y-4">
                <p className="text-xs font-black text-muted-foreground tracking-widest uppercase">Oglasni prostor</p>
                <div className="h-48 flex items-center justify-center text-muted-foreground/30 italic">Pronađi svoj put na CroatiaBest</div>
              </div>
            </div>

          </div>
        </article>
      </main>
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Link href="/blog">
          <Button variant="ghost" className="text-foreground hover:bg-foreground/5 flex items-center gap-2">
            <ArrowLeft className="size-4" /> NATRAG NA MAGAZIN
          </Button>
        </Link>
      </div>
    </div>
  );
}
