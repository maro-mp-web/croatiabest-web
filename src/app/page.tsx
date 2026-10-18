import type { Metadata } from 'next';
import HomeView from '@/components/home/HomeView';

export const metadata: Metadata = {
  metadataBase: new URL('https://croatiabest.com.hr'),
  title: 'CroatiaBest - Premium vodič kroz Hrvatsku',
  description: 'Istražite najbolje skrivene plaže, luksuzne restorane i vrhunske hotele u Hrvatskoj uz našu interaktivnu kartu i stručne vodiče.',
  keywords: [
    'CroatiaBest',
    'Croatia Best',
    'croatiabest.com.hr',
    'vodič kroz Hrvatsku',
    'Hrvatska',
    'Putovanja',
    'Plaže',
    'Restorani',
    'Hoteli',
    'Jadran',
    'Turizam',
    'Iznajmljivanje',
    'Croatia travel guide',
    'Best of Croatia'
  ],
  alternates: {
    canonical: 'https://croatiabest.com.hr',
    languages: {
      'hr': 'https://croatiabest.com.hr',
      'en': 'https://croatiabest.com.hr/en',
      'x-default': 'https://croatiabest.com.hr/en',
    },
  },
  openGraph: {
    title: 'CroatiaBest - Premium vodič kroz Hrvatsku',
    description: 'Istražite najbolje skrivene plaže, luksuzne restorane i vrhunske hotele u Hrvatskoj.',
    url: 'https://croatiabest.com.hr',
    siteName: 'CroatiaBest',
    images: [
      {
        url: '/hero-dubrovnik.jpg',
        width: 1200,
        height: 630,
        alt: 'CroatiaBest vodič kroz Hrvatsku',
      },
    ],
    locale: 'hr_HR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CroatiaBest - Premium vodič kroz Hrvatsku',
    description: 'Istražite skrivene uvale, plaže i vrhunske restorane diljem Hrvatske.',
    images: ['/hero-dubrovnik.jpg'],
  },
};

export default function Home() {
  return <HomeView forcedLanguage="hr" />;
}
