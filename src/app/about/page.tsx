import React from 'react';
import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us | CroatiaBest — Premium Travel Guide to Croatia',
  description: 'Learn about CroatiaBest - our mission, vision and curated digital guide to the most authentic beaches, restaurants, and hidden gems across Croatia.',
  alternates: {
    canonical: 'https://croatiabest.com.hr/about',
    languages: {
      'hr': 'https://croatiabest.com.hr/o-nama',
      'en': 'https://croatiabest.com.hr/about',
      'x-default': 'https://croatiabest.com.hr/about',
    },
  },
  openGraph: {
    title: 'About Us | CroatiaBest',
    description: 'Learn about CroatiaBest - our mission, vision and curated digital guide to Croatia.',
    url: 'https://croatiabest.com.hr/about',
    siteName: 'CroatiaBest',
    locale: 'en_US',
    type: 'website',
    images: [{ url: 'https://croatiabest.com.hr/hero-dubrovnik.jpg', width: 1200, height: 630 }],
  },
};

export default function AboutPage() {
  return <AboutClient initialLang="en" />;
}
