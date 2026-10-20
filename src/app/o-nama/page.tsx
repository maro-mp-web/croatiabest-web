import React from 'react';
import type { Metadata } from 'next';
import AboutClient from '../about/AboutClient';

export const metadata: Metadata = {
  title: 'O Nama | CroatiaBest — Premium digitalni vodič kroz Hrvatsku',
  description: 'Upoznajte CroatiaBest - našu viziju, misiju i kurirani vodič kroz najljepše plaže, restorane, hotele i skrivene dragulje Jadrana i Hrvatske.',
  alternates: {
    canonical: 'https://croatiabest.com.hr/o-nama',
    languages: {
      'hr': 'https://croatiabest.com.hr/o-nama',
      'en': 'https://croatiabest.com.hr/about',
      'x-default': 'https://croatiabest.com.hr/about',
    },
  },
  openGraph: {
    title: 'O Nama | CroatiaBest',
    description: 'Upoznajte CroatiaBest - našu viziju, misiju i kurirani vodič kroz Hrvatsku.',
    url: 'https://croatiabest.com.hr/o-nama',
    siteName: 'CroatiaBest',
    locale: 'hr_HR',
    type: 'website',
    images: [{ url: 'https://croatiabest.com.hr/hero-dubrovnik.jpg', width: 1200, height: 630 }],
  },
};

export default function ONamaPage() {
  return <AboutClient initialLang="hr" />;
}
