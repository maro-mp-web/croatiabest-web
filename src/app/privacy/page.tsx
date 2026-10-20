import React from 'react';
import type { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Pravila Privatnosti | Zaštita podataka | CroatiaBest',
  description: 'Pravila privatnosti i zaštite osobnih podataka na CroatiaBest digitalnoj platformi.',
  alternates: {
    canonical: 'https://croatiabest.com.hr/privacy',
  },
  openGraph: {
    title: 'Pravila Privatnosti | CroatiaBest',
    description: 'Pravila privatnosti i zaštite podataka na CroatiaBest platformi.',
    url: 'https://croatiabest.com.hr/privacy',
    siteName: 'CroatiaBest',
    locale: 'hr_HR',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
