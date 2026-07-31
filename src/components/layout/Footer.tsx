"use client"

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Music, MapPin, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedUrl } from '@/lib/i18n-routes';

export default function Footer() {
  const { t, language } = useLanguage();

  const isHr = language === 'hr';

  return (
    <footer className="bg-foreground text-background py-16 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="md:col-span-1 space-y-6">
            <h2 className="text-3xl font-black italic tracking-tighter">CroatiaBest.</h2>
            <p className="text-sm text-background/70 leading-relaxed font-medium">
              {isHr 
                ? 'Vaš premium vodič kroz najbolje što Hrvatska može ponuditi. Otkrijte skrivene dragulje, luksuzne restorane i savršen smještaj.'
                : 'Your premium guide through the best Croatia has to offer. Discover hidden gems, luxurious restaurants, and perfect accommodation.'}
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">{isHr ? 'Istraži' : 'Explore'}</h3>
            <ul className="space-y-3 text-sm text-background/70 font-medium">
              <li><Link href="/" className="hover:text-primary transition-colors">{isHr ? 'Naslovnica' : 'Home'}</Link></li>
              <li><Link href={getLocalizedUrl("/explore", language)} className="hover:text-primary transition-colors">{isHr ? 'Karta' : 'Map'}</Link></li>
              <li><Link href={getLocalizedUrl("/about", language)} className="hover:text-primary transition-colors">{isHr ? 'O nama' : 'About Us'}</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">{isHr ? 'Pravno' : 'Legal'}</h3>
            <ul className="space-y-3 text-sm text-background/70 font-medium">
              <li><Link href="/terms" className="hover:text-primary transition-colors">{isHr ? 'Uvjeti korištenja' : 'Terms of Service'}</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">{isHr ? 'Pravila privatnosti' : 'Privacy Policy'}</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">{isHr ? 'Kontakt' : 'Contact'}</h3>
            <div className="space-y-3 text-sm text-background/70 font-medium">
              <p className="flex items-center gap-2"><MapPin className="size-4 text-primary" /> Dubrovnik, Croatia</p>
              <p className="flex items-center gap-2"><Mail className="size-4 text-primary" /> info@croatiabest.com.hr</p>
            </div>
            <div className="flex gap-4 pt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Posjetite našu Facebook stranicu" className="bg-background/10 p-3 rounded-xl hover:bg-primary hover:text-white transition-all text-background/80">
                <Facebook className="size-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Posjetite našu Instagram stranicu" className="bg-background/10 p-3 rounded-xl hover:bg-primary hover:text-white transition-all text-background/80">
                <Instagram className="size-5" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="Posjetite našu TikTok stranicu" className="bg-background/10 p-3 rounded-xl hover:bg-primary hover:text-white transition-all text-background/80">
                <Music className="size-5" /> {/* TikTok icon */}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-background/50 font-medium">
          <p>&copy; {new Date().getFullYear()} CroatiaBest. {isHr ? 'Sva prava pridržana.' : 'All rights reserved.'}</p>
          <p>{isHr ? 'Dizajnirano s ljubavlju u Dalmaciji.' : 'Designed with love in Dalmatia.'}</p>
        </div>
      </div>
    </footer>
  );
}
