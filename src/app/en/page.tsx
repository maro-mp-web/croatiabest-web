import type { Metadata } from 'next';
import HomeView from '@/components/home/HomeView';

export const metadata: Metadata = {
  metadataBase: new URL('https://croatiabest.com.hr'),
  title: 'CroatiaBest - Premium Croatia Travel Guide & Hidden Gems',
  description: 'Explore the best hidden beaches, top restaurants, luxury hotels, historic cities, and Adriatic islands in Croatia with our live interactive map and local expert guides.',
  keywords: [
    'CroatiaBest',
    'Croatia travel guide',
    'Best of Croatia',
    'Croatia beaches',
    'Croatia restaurants',
    'Croatia hotels',
    'Adriatic sea',
    'Croatia islands',
    'Visit Croatia',
    'Croatia tourism',
    'Things to do in Croatia',
    'Croatia vacation'
  ],
  alternates: {
    canonical: 'https://croatiabest.com.hr/en',
    languages: {
      'hr': 'https://croatiabest.com.hr',
      'en': 'https://croatiabest.com.hr/en',
      'x-default': 'https://croatiabest.com.hr/en',
    },
  },
  openGraph: {
    title: 'CroatiaBest - Discover the Soul of Croatia',
    description: 'Expert travel guides, hidden beaches, Michelin restaurants, and interactive map for your dream holiday in Croatia.',
    url: 'https://croatiabest.com.hr/en',
    siteName: 'CroatiaBest',
    images: [
      {
        url: '/hero-dubrovnik.jpg',
        width: 1200,
        height: 630,
        alt: 'CroatiaBest Travel Guide',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CroatiaBest - Discover the Soul of Croatia',
    description: 'Expert guides and live interactive map for your perfect Croatian holiday.',
    images: ['/hero-dubrovnik.jpg'],
  },
};

export default function EnglishHomePage() {
  return <HomeView forcedLanguage="en" />;
}
