import React from 'react';
import type { Metadata } from 'next';
import SubmitClient from '../submit/SubmitClient';

export const metadata: Metadata = {
  title: 'Dodajte Vaš Objekt | Prijavite smještaj ili restoran | CroatiaBest',
  description: 'Prijavite svoj hotel, vilu, apartman, restoran ili turistički objekt na CroatiaBest platformu i dosegnite tisuće posjetitelja.',
  alternates: {
    canonical: 'https://croatiabest.com.hr/dodaj-objekt',
    languages: {
      'hr': 'https://croatiabest.com.hr/dodaj-objekt',
      'en': 'https://croatiabest.com.hr/submit',
      'x-default': 'https://croatiabest.com.hr/submit',
    },
  },
  openGraph: {
    title: 'Dodajte Vaš Objekt | CroatiaBest',
    description: 'Prijavite svoj objekt na CroatiaBest i dosegnite tisuće posjetitelja.',
    url: 'https://croatiabest.com.hr/dodaj-objekt',
    siteName: 'CroatiaBest',
    locale: 'hr_HR',
    type: 'website',
    images: [{ url: 'https://croatiabest.com.hr/hero-dubrovnik.jpg', width: 1200, height: 630 }],
  },
};

export default function DodajObjektPage() {
  return <SubmitClient />;
}
