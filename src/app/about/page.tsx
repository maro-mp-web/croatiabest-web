"use client"

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  const { language } = useLanguage();
  const isHr = language === 'hr';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-20 max-w-4xl">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-black italic tracking-tighter">
              {isHr ? 'O Nama' : 'About Us'}
            </h1>
            <p className="text-xl text-muted-foreground font-medium">
              {isHr 
                ? 'Dobrodošli na CroatiaBest - vaš premium digitalni vodič kroz najljepše tajne Jadrana.'
                : 'Welcome to CroatiaBest - your premium digital guide to the most beautiful secrets of the Adriatic.'}
            </p>
          </div>

          <div className="relative h-[400px] w-full rounded-[3rem] overflow-hidden shadow-2xl">
            <Image 
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop" 
              alt="Croatia" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:italic text-foreground/80">
            {isHr ? (
              <>
                <h2>Naša Vizija</h2>
                <p>
                  Hrvatska obala obiluje nevjerojatnim lokacijama, bogatom poviješću i vrhunskom gastronomijom. 
                  Međutim, pronalazak onih doista posebnih, autentičnih i visokokvalitetnih mjesta često je izazov u moru generičkih turističkih ponuda. 
                  Tako je nastao <strong>CroatiaBest</strong>.
                </p>
                <p>
                  Naš cilj je stvoriti kurirani, pažljivo odabrani vodič koji spaja luksuz i autentičnost. Od skrivenih konoba koje poslužuju svježu ribu ulovljenu tog jutra, do ekskluzivnih hotela s pogledom na otvoreno more i povijesnih znamenitosti koje ostavljaju bez daha - mi vam donosimo samo najbolje.
                </p>

                <h2>Za Vlasnike Objekata</h2>
                <p>
                  Ako ste vlasnik premium restorana, hotela ili nudite vrhunsko iskustvo turistima, CroatiaBest je idealna platforma za vas. Nudimo napredne mogućnosti oglašavanja, isticanja na našoj interaktivnoj karti te izravnu vezu s gostima koji traže upravo ono što vi nudite.
                </p>
              </>
            ) : (
              <>
                <h2>Our Vision</h2>
                <p>
                  The Croatian coast is rich with incredible locations, history, and top-tier gastronomy. 
                  However, finding those truly special, authentic, and high-quality places is often a challenge in a sea of generic tourist offers. 
                  That is how <strong>CroatiaBest</strong> was born.
                </p>
                <p>
                  Our goal is to create a curated, carefully selected guide that combines luxury and authenticity. From hidden taverns serving fish caught that morning, to exclusive hotels overlooking the open sea and historical landmarks that leave you breathless - we bring you only the best.
                </p>

                <h2>For Business Owners</h2>
                <p>
                  If you own a premium restaurant, hotel, or offer a top-tier experience to tourists, CroatiaBest is the ideal platform for you. We offer advanced advertising options, highlighting on our interactive map, and a direct connection with guests looking for exactly what you offer.
                </p>
              </>
            )}
          </div>

          <div className="bg-secondary/5 rounded-[3rem] p-12 mt-12 border border-secondary/10">
            <h3 className="text-3xl font-black italic mb-8">{isHr ? 'Kontaktirajte nas' : 'Contact Us'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-4 rounded-2xl"><Mail className="text-primary size-6" /></div>
                <div>
                  <p className="font-bold text-sm text-muted-foreground">Email</p>
                  <p className="text-lg font-black">info@croatiabest.com.hr</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-4 rounded-2xl"><MapPin className="text-primary size-6" /></div>
                <div>
                  <p className="font-bold text-sm text-muted-foreground">{isHr ? 'Sjedište' : 'Headquarters'}</p>
                  <p className="text-lg font-black">Dubrovnik, Croatia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
