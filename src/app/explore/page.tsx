import React from 'react';
import type { Metadata } from 'next';
import ExplorePage from './ExploreClient';

export const metadata: Metadata = {
  title: 'Istražite Hrvatsku | Interaktivna karta, plaže i atrakcije | CroatiaBest',
  description: 'Pretražite interaktivnu kartu Hrvatske s više od 2000 lokacija: najljepše plaže, restorani, hoteli, vidikovci, marine i kulturna baština.',
  alternates: {
    canonical: 'https://croatiabest.com.hr/explore',
    languages: {
      'hr': 'https://croatiabest.com.hr/istrazi',
      'en': 'https://croatiabest.com.hr/explore',
      'x-default': 'https://croatiabest.com.hr/explore',
    },
  },
  openGraph: {
    title: 'Istražite Hrvatsku | CroatiaBest',
    description: 'Interaktivna karta Hrvatske s preko 2000 lokacija, plaža i znamenitosti.',
    url: 'https://croatiabest.com.hr/explore',
    siteName: 'CroatiaBest',
    locale: 'hr_HR',
    type: 'website',
    images: [{ url: 'https://croatiabest.com.hr/hero-dubrovnik.jpg', width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <ExplorePage />;
}
