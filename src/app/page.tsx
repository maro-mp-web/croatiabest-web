import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES, INFO_CATEGORIES } from '@/app/lib/constants';
import { MOCK_LISTINGS, MOCK_ARTICLES } from '@/app/lib/mock-data';
import { MapPin, ArrowRight, Star, TrendingUp } from 'lucide-react';

export default function Home() {
  const paidCategories = CATEGORIES.filter(c => c.type === 'paid');
  const featuredListings = MOCK_LISTINGS.filter(l => l.categoryId === 'restaurants' || l.categoryId === 'hotels');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center text-center px-4 overflow-hidden">
          <Image
            src="https://picsum.photos/seed/croatia/1920/1080"
            alt="Hero Croatia"
            fill
            className="object-cover brightness-[0.4]"
            priority
            data-ai-hint="dubrovnik coast"
          />
          <div className="relative z-10 max-w-4xl space-y-6 animate-fade-in">
            <Badge variant="outline" className="text-white border-white/40 bg-white/10 px-4 py-1 text-sm uppercase tracking-widest backdrop-blur-md">
              Otkrijte najbolje od Hrvatske
            </Badge>
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl text-white font-bold tracking-tight">
              Croatia<span className="text-accent">Best</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto">
              Vaš ultimativni vodič kroz skrivene dragulje, najbolje restorane i sve važne informacije na jednom mjestu.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/explore">
                <Button size="lg" className="rounded-full px-8 text-lg bg-primary hover:bg-primary/90">
                  Istraži Kartu
                </Button>
              </Link>
              <Link href="/blog">
                <Button size="lg" variant="outline" className="rounded-full px-8 text-lg text-white border-white hover:bg-white hover:text-primary">
                  Pročitaj Blog
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Bar */}
        <div className="bg-primary py-8 overflow-hidden">
          <div className="container mx-auto px-4 flex gap-8 items-center justify-center animate-marquee whitespace-nowrap">
            {paidCategories.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.id}`} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <span className="text-xs uppercase tracking-tighter font-medium">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Listings Section */}
        <section className="py-24 container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-widest text-sm">
                <Star className="size-4 fill-primary" />
                Izdvojeno
              </div>
              <h2 className="text-4xl font-headline font-bold">Najbolja Mjesta za Posjetiti</h2>
            </div>
            <Link href="/explore">
              <Button variant="link" className="text-primary p-0 h-auto group">
                Vidi sve objekte <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
              <Card key={listing.id} className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={listing.images[0]}
                    alt={listing.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md">
                    {CATEGORIES.find(c => c.id === listing.categoryId)?.name}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{listing.name}</h3>
                  <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <MapPin className="size-4 mr-1" /> {listing.address}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className={`size-3 ${i < 4 ? 'fill-accent text-accent' : 'text-muted'}`} />
                      ))}
                    </div>
                    <Link href={`/listing/${listing.id}`}>
                      <Button size="sm" variant="outline" className="rounded-full hover:bg-primary hover:text-white">
                        Detalji
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Ad Banner 1 */}
        <section className="container mx-auto px-4 py-12">
          <div className="w-full h-48 bg-secondary/50 rounded-2xl flex items-center justify-center border-2 border-dashed border-muted-foreground/20 text-muted-foreground">
            <div className="text-center">
              <span className="block text-xs uppercase tracking-widest mb-2">Oglasni prostor</span>
              <p className="font-headline text-lg">Vaš oglas ovdje</p>
            </div>
          </div>
        </section>

        {/* Magazine / News Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px flex-1 bg-border" />
              <h2 className="text-3xl font-headline font-bold text-center px-4">CroatiaBest Magazin</h2>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {MOCK_ARTICLES.map((article, idx) => (
                <div key={article.id} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
                  <div className="relative w-full md:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="w-full md:w-1/2 space-y-4">
                    <Badge variant="secondary" className="text-accent bg-accent/10">{article.category}</Badge>
                    <h3 className="text-2xl font-bold leading-tight hover:text-primary cursor-pointer transition-colors">{article.title}</h3>
                    <p className="text-muted-foreground line-clamp-3">{article.excerpt}</p>
                    <div className="flex items-center gap-4 pt-4 border-t">
                      <div className="size-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold uppercase">CB</div>
                      <div className="text-xs">
                        <p className="font-semibold">{article.author}</p>
                        <p className="text-muted-foreground">{article.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Information Grid */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-headline font-bold mb-4">Sve što trebate znati</h2>
              <p className="text-muted-foreground">Od povijesti do praktičnih turističkih savjeta.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {INFO_CATEGORIES.map((cat) => (
                <Link key={cat} href={`/info/${cat.toLowerCase().replace(/ /g, '-')}`}>
                  <div className="bg-white p-6 rounded-xl text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-transparent hover:border-primary/20">
                    <TrendingUp className="size-6 mx-auto mb-3 text-primary/40" />
                    <span className="text-sm font-semibold">{cat}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-white py-24 border-t border-white/10">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h2 className="font-headline text-3xl font-bold">CroatiaBest</h2>
            <p className="text-white/60 font-light leading-relaxed">
              Vodeći portal za informiranje turista i lokalnog stanovništva u Republici Hrvatskoj. 
              Povezujemo najbolje objekte s vašim potrebama.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Istraži</h4>
            <ul className="space-y-4 text-white/60 font-light">
              <li><Link href="/explore" className="hover:text-white transition-colors">Interaktivna Karta</Link></li>
              <li><Link href="/top-destinations" className="hover:text-white transition-colors">Top Destinacije</Link></li>
              <li><Link href="/magazin" className="hover:text-white transition-colors">Magazin</Link></li>
              <li><Link href="/add-listing" className="hover:text-white transition-colors">Dodaj svoj objekt</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Podrška</h4>
            <ul className="space-y-4 text-white/60 font-light">
              <li><Link href="/contact" className="hover:text-white transition-colors">Kontakt</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Česta Pitanja</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privatnost</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Uvjeti Korištenja</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold mb-6 text-lg">Newsletter</h4>
            <div className="flex gap-2">
              <Input placeholder="Vaš email" className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />
              <Button className="bg-accent hover:bg-accent/90">Prijava</Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-24 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
          &copy; {new Date().getFullYear()} CroatiaBest. Sva prava pridržana.
        </div>
      </footer>
    </div>
  );
}