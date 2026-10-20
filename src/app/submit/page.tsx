import React from 'react';
import type { Metadata } from 'next';
import SubmitClient from './SubmitClient';

export const metadata: Metadata = {
  title: 'List Your Business or Property | CroatiaBest',
  description: 'Add your hotel, restaurant, vacation rental, beach bar or tourism service to CroatiaBest and connect with thousands of travelers.',
  alternates: {
    canonical: 'https://croatiabest.com.hr/submit',
    languages: {
      'hr': 'https://croatiabest.com.hr/dodaj-objekt',
      'en': 'https://croatiabest.com.hr/submit',
      'x-default': 'https://croatiabest.com.hr/submit',
    },
  },
  openGraph: {
    title: 'List Your Property | CroatiaBest',
    description: 'Add your property to CroatiaBest.',
    url: 'https://croatiabest.com.hr/submit',
    siteName: 'CroatiaBest',
    locale: 'en_US',
    type: 'website',
    images: [{ url: 'https://croatiabest.com.hr/hero-dubrovnik.jpg', width: 1200, height: 630 }],
  },
};

export default function SubmitPage() {
  return <SubmitClient />;
}
