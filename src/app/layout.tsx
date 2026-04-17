
import type {Metadata} from 'next';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'CroatiaBest - Premium Guide to Croatia',
  description: 'Explore the best hidden beaches, luxury restaurants, and top hotels in Croatia with our interactive map and expert guides.',
  keywords: ['Croatia', 'Travel', 'Beaches', 'Restaurants', 'Hotels', 'Adriatic Sea', 'Tourism'],
  openGraph: {
    title: 'CroatiaBest - Your Ultimate Adriatic Guide',
    description: 'Pin the best of Croatia on our live interactive map.',
    url: 'https://croatiabest.hr',
    siteName: 'CroatiaBest',
    images: [
      {
        url: 'https://picsum.photos/seed/cb-og/1200/630',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'hr_HR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CroatiaBest - Discover the Soul of Croatia',
    description: 'Expert travel guides and interactive map for Croatia.',
    images: ['https://picsum.photos/seed/cb-og/1200/630'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary selection:text-white">
        <FirebaseClientProvider>
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
