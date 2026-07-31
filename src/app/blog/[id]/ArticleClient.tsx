
"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import FAQSection from '@/components/ui/FAQSection';
import AdBanner from '@/components/ads/AdBanner';
import { formatDate } from '@/lib/utils';

export default function ArticleClient({ article, relatedArticles }: { article: any, relatedArticles: any[] }) {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const title = isEn && article.titleEn ? article.titleEn : article.title;
  const excerpt = isEn && article.excerptEn ? article.excerptEn : article.excerpt;
  const content = isEn && article.contentEn ? article.contentEn : article.content;
  const displayReadTime = article.readTime || '5 min';
  const displayDate = article.publishDate ? formatDate(article.publishDate) : (article.created ? formatDate(article.created) : null);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pb-24">
        {/* Article Header */}
        <section className="relative h-[70vh] w-full bg-slate-900">
          {article.image && <Image src={article.image} alt={title} fill className="object-cover brightness-[0.7]" priority />}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center max-w-4xl space-y-6">
              <Badge className="bg-primary hover:bg-primary text-white border-none px-6 py-2 text-sm font-black uppercase tracking-widest">
                {article.category}
              </Badge>
              <h1 className="text-4xl md:text-7xl font-headline font-black text-white leading-[1.1] drop-shadow-2xl">
                {title}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 font-bold">
                {displayDate && (
                  <span className="flex items-center gap-2">
                    <Calendar className="size-5 text-primary" />
                    {displayDate}
                  </span>
                )}
                <span className="flex items-center gap-2"><User className="size-5 text-primary" /> {article.author}</span>
                <span className="flex items-center gap-2">
                  <Clock className="size-5 text-primary" /> 
                  {isEn ? `${displayReadTime} read` : `${displayReadTime} čitanja`}
                </span>
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
              <Button variant="outline" size="icon" className="rounded-full size-12 hover:bg-primary hover:text-white transition-all"><svg viewBox="0 0 24 24" fill="currentColor" className="size-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></Button>
              <Button variant="outline" size="icon" className="rounded-full size-12 hover:bg-primary hover:text-white transition-all"><LinkIcon className="size-5" /></Button>
            </div>

            {/* Main Body */}
            <div className="lg:col-span-8 space-y-12">
              <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/40">
                {excerpt && (
                  <p className="text-2xl font-bold italic text-primary/80 mb-10 leading-relaxed font-body">
                    "{excerpt}"
                  </p>
                )}
                
                <div className="prose prose-xl max-w-none font-body leading-loose text-foreground/90 whitespace-pre-wrap" dangerouslySetInnerHTML={{__html: content}}>
                </div>

                <div className="mt-16 pt-12 border-t flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-full bg-secondary/20 flex items-center justify-center">
                      <User className="size-8 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">
                        {isEn ? 'Written by' : 'Napisao/la'}
                      </p>
                      <p className="text-xl font-bold">{article.author}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="secondary" className="rounded-xl px-8 font-bold">
                      <Share2 className="size-4 mr-2" /> 
                      {isEn ? 'SHARE ARTICLE' : 'PODIJELI ČLANAK'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Related articles mockup */}
              <div className="space-y-8">
                <h4 className="text-3xl font-headline font-black">
                  {isEn ? 'You might also be interested in' : 'Možda će vas zanimati'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {relatedArticles.slice(0, 2).map(item => {
                    const rTitle = isEn && item.titleEn ? item.titleEn : item.title;
                    const rExcerpt = isEn && item.excerptEn ? item.excerptEn : item.excerpt;
                    return (
                      <Link key={item.id} href={`/blog/${item.slug || item.id}`}>
                        <div className="bg-white rounded-[2rem] overflow-hidden shadow-lg group">
                          <div className="relative h-48 bg-slate-100 flex items-center justify-center">
                            {item.image ? (
                              <Image src={item.image} alt={rTitle} fill className="object-cover group-hover:scale-105 transition-transform" />
                            ) : (
                              <span className="text-slate-300 font-bold uppercase tracking-widest">{item.category || 'BLOG'}</span>
                            )}
                          </div>
                          <div className="p-6">
                            <h5 className="font-bold text-lg mb-2 line-clamp-1">{rTitle}</h5>
                            <p className="text-sm text-muted-foreground line-clamp-2">{rExcerpt}</p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Ad or newsletter */}
            <div className="lg:col-span-3 space-y-8 pt-24">
              <div className="bg-foreground text-white p-8 rounded-[2rem] space-y-6 shadow-2xl">
                <h4 className="text-2xl font-black italic">
                  {isEn ? 'Subscribe' : 'Pretplati se'}
                </h4>
                <p className="text-white/60 font-body">
                  {isEn 
                    ? 'The best stories about Croatia straight to your inbox every Sunday.'
                    : 'Najbolje priče o Hrvatskoj direktno u tvoj inbox svaku nedjelju.'}
                </p>
                <input className="w-full h-12 bg-white/10 rounded-xl px-4 text-white border border-white/20 focus:outline-none focus:border-primary" placeholder={isEn ? 'Email address' : 'Email adresa'} />
                <Button className="w-full bg-primary font-black h-12 rounded-xl">
                  {isEn ? 'JOIN US' : 'PRIDRUŽI SE'}
                </Button>
              </div>
              <AdBanner format="vertical" className="w-full h-[600px] shadow-sm rounded-3xl" />
            </div>

          </div>
        </article>

        {/* DYNAMIC FAQ SECTION */}
        <FAQSection type="blog" name={title} />
      </main>
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Link href="/blog">
          <Button variant="ghost" className="text-foreground hover:bg-foreground/5 flex items-center gap-2">
            <ArrowLeft className="size-4" /> 
            {isEn ? 'BACK TO MAGAZINE' : 'NATRAG NA MAGAZIN'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
