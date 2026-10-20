import React from 'react';
import type { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Uvjeti Korištenja | CroatiaBest',
  description: 'Opći uvjeti poslovanja i korištenja CroatiaBest digitalne platforme.',
  alternates: {
    canonical: 'https://croatiabest.com.hr/terms',
  },
  openGraph: {
    title: 'Uvjeti Korištenja | CroatiaBest',
    description: 'Opći uvjeti korištenja CroatiaBest platforme.',
    url: 'https://croatiabest.com.hr/terms',
    siteName: 'CroatiaBest',
    locale: 'hr_HR',
    type: 'website',
  },
};

export default function TermsPage() {
  return <TermsClient />;
}
