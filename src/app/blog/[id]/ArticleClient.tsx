
"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser, usePB } from '@/pocketbase';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Calendar, User, Clock, Share2, Facebook, Link as LinkIcon, 
  Edit3, ShieldCheck, MapPin, Compass, Waves, UtensilsCrossed, Landmark, ArrowRight, ExternalLink 
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import FAQSection from '@/components/ui/FAQSection';
import AdBanner from '@/components/ads/AdBanner';
import { formatDate } from '@/lib/utils';
import { getLocalizedUrl } from '@/lib/i18n-routes';

export default function ArticleClient({ 
  article, 
  relatedArticles,
  cities = [],
  islands = []
}: { 
  article: any; 
  relatedArticles: any[];
  cities?: any[];
  islands?: any[];
}) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { user } = useUser();
  const pb = usePB();

  const isAdmin = Boolean(
    user?.email === 'maro.webdeveloper@gmail.com' ||
    user?.email === 'admin@croatiabest.hr' ||
    (user as any)?.role === 'admin' ||
    (user as any)?.isAdmin === true ||
    (pb?.authStore?.isSuperuser ?? false)
  );

  const title = isEn && article.titleEn ? article.titleEn : article.title;
  const excerpt = isEn && article.excerptEn ? article.excerptEn : article.excerpt;
  const content = isEn && article.contentEn ? article.contentEn : article.content;
  const displayReadTime = article.readTime || '5 min';
  const displayDate = article.publishDate ? formatDate(article.publishDate) : (article.created ? formatDate(article.created) : null);

  // Helper to extract root stem for Croatian declensions (e.g., Korčula -> Korčul, Split -> Split)
  const getStem = (name: string) => {
    if (!name) return '';
    const clean = name.trim().toLowerCase();
    if (clean.length > 4 && /[aeiou]$/i.test(clean)) {
      return clean.slice(0, -1);
    }
    return clean;
  };

  const articleTags = Array.isArray(article.tags) 
    ? article.tags 
    : (typeof article.tags === 'string' ? article.tags.split(',').map((t: string) => t.trim()) : []);

  const searchCorpus = `${article.title || ''} ${article.titleEn || ''} ${article.excerpt || ''} ${(article.content || '').slice(0, 2500)}`.toLowerCase();

  // Find matched island first (or city)
  const matchedIsland = (islands || []).find((isl: any) => {
    const name = (isl.name || '').toLowerCase();
    const stem = getStem(isl.name);
    const hasTag = articleTags.some((t: string) => {
      const tl = t.toLowerCase();
      return tl === name || tl === `otok ${name}` || (stem.length >= 4 && tl.includes(stem));
    });
    const hasField = (article.city && article.city.toLowerCase() === name) || (article.location && article.location.toLowerCase().includes(name));
    const hasMention = searchCorpus.includes(name) || searchCorpus.includes(`otok ${name}`) || (stem.length >= 4 && searchCorpus.includes(stem));
    return hasTag || hasField || hasMention;
  });

  // Find matched city
  const matchedCity = (cities || []).find((c: any) => {
    const name = (c.name || '').toLowerCase();
    const stem = getStem(c.name);
    const hasTag = articleTags.some((t: string) => {
      const tl = t.toLowerCase();
      return tl === name || (stem.length >= 4 && tl.includes(stem));
    });
    const hasField = (article.city && article.city.toLowerCase() === name) || (article.location && article.location.toLowerCase().includes(name));
    const hasMention = searchCorpus.includes(name) || (stem.length >= 4 && searchCorpus.includes(stem));
    return hasTag || hasField || hasMention;
  });

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
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Badge className="bg-primary hover:bg-primary text-white border-none px-6 py-2 text-sm font-black uppercase tracking-widest shadow-lg">
                  {article.category}
                </Badge>

                {matchedCity && (
                  <Link href={getLocalizedUrl(`/cities/${matchedCity.slug}`, language)}>
                    <Badge className="bg-white hover:bg-white/90 text-slate-900 border-none px-5 py-2 text-sm font-black tracking-wide flex items-center gap-1.5 shadow-xl transition-all hover:scale-105 cursor-pointer">
                      <MapPin className="size-4 text-primary" />
                      {isEn && matchedCity.nameEn ? matchedCity.nameEn : matchedCity.name}
                    </Badge>
                  </Link>
                )}

                {matchedIsland && (!matchedCity || matchedCity.name.toLowerCase() !== matchedIsland.name.toLowerCase()) && (
                  <Link href={getLocalizedUrl(`/islands/${matchedIsland.slug}`, language)}>
                    <Badge className="bg-sky-500 hover:bg-sky-400 text-white border-none px-5 py-2 text-sm font-black tracking-wide flex items-center gap-1.5 shadow-xl transition-all hover:scale-105 cursor-pointer">
                      <Compass className="size-4" />
                      {isEn ? `Island ${matchedIsland.name}` : `Otok ${matchedIsland.name}`}
                    </Badge>
                  </Link>
                )}

                {isAdmin && (
                  <Link href={`/admin/new-blog?edit=${article.id}`}>
                    <Button size="sm" className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-full px-5 h-9 shadow-xl gap-2 border border-amber-300 transition-all hover:scale-105">
                      <Edit3 className="size-4" /> Uredi ovaj članak
                    </Button>
                  </Link>
                )}
              </div>
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
                  <div className="flex flex-wrap items-center gap-4">
                    {isAdmin && (
                      <Link href={`/admin/new-blog?edit=${article.id}`}>
                        <Button className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl px-6 h-12 shadow-lg gap-2 border border-amber-300">
                          <Edit3 className="size-4" /> 
                          {isEn ? 'EDIT ARTICLE' : 'UREDI OVAJ ČLANAK'}
                        </Button>
                      </Link>
                    )}
                    <Button variant="secondary" className="rounded-xl px-8 font-bold h-12">
                      <Share2 className="size-4 mr-2" /> 
                      {isEn ? 'SHARE ARTICLE' : 'PODIJELI ČLANAK'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* CONNECTED DESTINATION SHOWCASE CARD */}
              {matchedCity ? (
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl p-6 sm:p-10 border border-white/10 group">
                  <div className="absolute inset-0 opacity-25 group-hover:opacity-35 transition-opacity duration-700">
                    <Image 
                      src={matchedCity.image || '/hero-dubrovnik.jpg'} 
                      alt={matchedCity.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
                  
                  <div className="relative z-10 space-y-6 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-primary text-white border-none font-black text-xs uppercase tracking-widest px-4 py-1.5 flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        {isEn ? 'Connected Destination' : 'Povezana destinacija'}
                      </Badge>
                      <Badge className="bg-white/15 text-white border-white/20 font-bold text-xs">
                        {isEn ? 'City Guide' : 'Vodič kroz grad'}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-3xl sm:text-4xl font-headline font-black text-white tracking-tight">
                        {isEn ? `Explore ${matchedCity.nameEn || matchedCity.name}` : `Istražite grad: ${matchedCity.name}`}
                      </h3>
                      <p className="text-slate-300 text-sm sm:text-base line-clamp-3 leading-relaxed font-body">
                        {isEn && matchedCity.descriptionEn
                          ? matchedCity.descriptionEn.replace(/<[^>]*>/g, '').slice(0, 200)
                          : (matchedCity.description ? matchedCity.description.replace(/<[^>]*>/g, '').slice(0, 200) : (isEn ? 'Discover top attractions, local beaches, restaurants and travel guides.' : 'Otkrijte najbolje atrakcije, plaže, restorane i kompletan vodič kroz destinaciju.'))}...
                      </p>
                    </div>

                    {/* Quick navigation pill links */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Link href={`${getLocalizedUrl('/explore', language)}?category=beaches&q=${encodeURIComponent(matchedCity.name)}`}>
                        <span className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/15 transition-colors cursor-pointer">
                          <Waves className="size-3 text-cyan-400" /> {isEn ? 'Beaches' : 'Plaže'}
                        </span>
                      </Link>
                      <Link href={`${getLocalizedUrl('/explore', language)}?category=restaurants&q=${encodeURIComponent(matchedCity.name)}`}>
                        <span className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/15 transition-colors cursor-pointer">
                          <UtensilsCrossed className="size-3 text-amber-400" /> {isEn ? 'Restaurants' : 'Restorani'}
                        </span>
                      </Link>
                      <Link href={`${getLocalizedUrl('/explore', language)}?category=attractions&q=${encodeURIComponent(matchedCity.name)}`}>
                        <span className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/15 transition-colors cursor-pointer">
                          <Landmark className="size-3 text-emerald-400" /> {isEn ? 'Attractions' : 'Znamenitosti'}
                        </span>
                      </Link>
                    </div>

                    <div>
                      <Link href={getLocalizedUrl(`/cities/${matchedCity.slug}`, language)}>
                        <Button className="bg-primary hover:bg-primary/90 text-white font-black text-sm rounded-2xl px-6 h-12 shadow-xl gap-2 hover:gap-3 transition-all">
                          {isEn ? `Open Complete ${matchedCity.nameEn || matchedCity.name} Guide` : `Pogledaj cijeli vodič kroz ${matchedCity.name}`}
                          <ArrowRight className="size-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : matchedIsland ? (
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl p-6 sm:p-10 border border-white/10 group">
                  <div className="absolute inset-0 opacity-25 group-hover:opacity-35 transition-opacity duration-700">
                    <Image 
                      src={matchedIsland.image || '/hero-dubrovnik.jpg'} 
                      alt={matchedIsland.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
                  
                  <div className="relative z-10 space-y-6 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-sky-500 text-white border-none font-black text-xs uppercase tracking-widest px-4 py-1.5 flex items-center gap-1.5">
                        <Compass className="size-3.5" />
                        {isEn ? 'Connected Island' : 'Povezani otok'}
                      </Badge>
                      <Badge className="bg-white/15 text-white border-white/20 font-bold text-xs">
                        {isEn ? 'Island Guide' : 'Vodič kroz otok'}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-3xl sm:text-4xl font-headline font-black text-white tracking-tight">
                        {isEn ? `Explore Island ${matchedIsland.name}` : `Istražite otok: ${matchedIsland.name}`}
                      </h3>
                      <p className="text-slate-300 text-sm sm:text-base line-clamp-3 leading-relaxed font-body">
                        {isEn && matchedIsland.descriptionEn
                          ? matchedIsland.descriptionEn.replace(/<[^>]*>/g, '').slice(0, 200)
                          : (matchedIsland.description ? matchedIsland.description.replace(/<[^>]*>/g, '').slice(0, 200) : (isEn ? 'Discover secret coves, top beaches, local gastronomy and sights.' : 'Otkrijte skrivene uvale, najbolje plaže, lokalnu gastronomiju i znamenitosti.'))}...
                      </p>
                    </div>

                    {/* Quick navigation pill links */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Link href={`${getLocalizedUrl('/explore', language)}?category=beaches&q=${encodeURIComponent(matchedIsland.name)}`}>
                        <span className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/15 transition-colors cursor-pointer">
                          <Waves className="size-3 text-cyan-400" /> {isEn ? 'Island Beaches' : 'Plaže na otoku'}
                        </span>
                      </Link>
                      <Link href={`${getLocalizedUrl('/explore', language)}?category=restaurants&q=${encodeURIComponent(matchedIsland.name)}`}>
                        <span className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/15 transition-colors cursor-pointer">
                          <UtensilsCrossed className="size-3 text-amber-400" /> {isEn ? 'Restaurants' : 'Restorani'}
                        </span>
                      </Link>
                    </div>

                    <div>
                      <Link href={getLocalizedUrl(`/islands/${matchedIsland.slug}`, language)}>
                        <Button className="bg-sky-500 hover:bg-sky-600 text-white font-black text-sm rounded-2xl px-6 h-12 shadow-xl gap-2 hover:gap-3 transition-all">
                          {isEn ? `Open Complete Island ${matchedIsland.name} Guide` : `Pogledaj cijeli vodič: Otok ${matchedIsland.name}`}
                          <ArrowRight className="size-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl p-6 sm:p-8 border border-white/10">
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-xl">
                      <Badge className="bg-primary/20 text-primary border border-primary/30 font-black text-xs uppercase tracking-widest px-3 py-1">
                        CroatiaBest Vodiči
                      </Badge>
                      <h4 className="text-2xl font-headline font-black text-white">
                        {isEn ? 'Explore Croatia’s Top Cities & Islands' : 'Istražite najljepše gradove i otoke Hrvatske'}
                      </h4>
                      <p className="text-slate-300 text-sm font-body">
                        {isEn ? 'Interactive maps, verified local attractions, top beaches and gastronomy.' : 'Interaktivne karte, provjerene lokacije, najbolje plaže i vrhunski restorani.'}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      <Link href={getLocalizedUrl('/gradovi', language)}>
                        <Button className="bg-white text-slate-900 hover:bg-slate-100 font-black rounded-xl text-xs px-5 h-11">
                          <MapPin className="size-3.5 mr-1.5 text-primary" />
                          {isEn ? 'All Cities' : 'Svi gradovi'}
                        </Button>
                      </Link>
                      <Link href={getLocalizedUrl('/otoci', language)}>
                        <Button className="bg-sky-500 hover:bg-sky-600 text-white font-black rounded-xl text-xs px-5 h-11">
                          <Compass className="size-3.5 mr-1.5" />
                          {isEn ? 'All Islands' : 'Svi otoci'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

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
                      <Link key={item.id} href={getLocalizedUrl(`/blog/${item.slug || item.id}`, language)}>
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
              {/* Sidebar Ad Placement (ZAPAMĆENA POZICIJA) */}
              <AdBanner format="vertical" positionId="BLOG_ARTICLE_SIDEBAR_VERTICAL" className="w-full h-[600px] shadow-sm rounded-3xl" />
            </div>

          </div>
        </article>

        {/* DYNAMIC FAQ SECTION */}
        <FAQSection type="blog" name={title} />
      </main>
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Link href={getLocalizedUrl("/blog", language)}>
          <Button variant="ghost" className="text-foreground hover:bg-foreground/5 flex items-center gap-2">
            <ArrowLeft className="size-4" /> 
            {isEn ? 'BACK TO MAGAZINE' : 'NATRAG NA MAGAZIN'}
          </Button>
        </Link>
      </div>

      {/* FLOATING ADMIN QUICK ACTION BAR */}
      {isAdmin && (
        <aside aria-label="Admin bar" className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-950/95 text-white p-2.5 pl-4 rounded-2xl shadow-2xl backdrop-blur-md border border-amber-500/40 ring-1 ring-white/10">
          <span className="text-xs font-black text-amber-400 flex items-center gap-1.5 mr-1">
            <ShieldCheck className="size-4 text-amber-400" /> Admin
          </span>
          <Link href={`/admin/new-blog?edit=${article.id}`}>
            <Button size="sm" className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow h-9 gap-1.5 transition-all hover:scale-105">
              <Edit3 className="size-3.5" /> Uredi ovaj članak
            </Button>
          </Link>
          <Link href="/admin?tab=bot">
            <Button size="sm" variant="ghost" className="hover:bg-white/10 text-slate-300 text-xs rounded-xl h-9">
              Vijesti Bot
            </Button>
          </Link>
        </aside>
      )}
    </div>
  );
}
