import React from 'react';
import type { Metadata } from 'next';
import ExplorePage from '../explore/ExploreClient';

export const metadata: Metadata = {
  title: 'Istražite Hrvatsku | Karta, plaže, restorani i atrakcije | CroatiaBest',
  description: 'Istražite interaktivnu kartu Hrvatske s više od 2000 lokacija: najljepše plaže, restorani, hoteli, vidikovci, marine i kulturna baština.',
  alternates: {
    canonical: 'https://croatiabest.com.hr/istrazi',
    languages: {
      'hr': 'https://croatiabest.com.hr/istrazi',
      'en': 'https://croatiabest.com.hr/explore',
      'x-default': 'https://croatiabest.com.hr/explore',
    },
  },
  openGraph: {
    title: 'Istražite Hrvatsku | CroatiaBest',
    description: 'Interaktivna karta Hrvatske s preko 2000 lokacija, plaža i znamenitosti.',
    url: 'https://croatiabest.com.hr/istrazi',
    siteName: 'CroatiaBest',
    locale: 'hr_HR',
    type: 'website',
    images: [{ url: 'https://croatiabest.com.hr/hero-dubrovnik.jpg', width: 1200, height: 630 }],
  },
};

export default function IstraziPage() {
  return <ExplorePage />;
}
