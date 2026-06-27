
import type {Metadata} from 'next';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import { PocketBaseProvider } from '@/pocketbase';
import { DEFAULT_LISTING_IMAGE } from '@/app/lib/constants';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://croatiabest.com.hr'),
  title: 'CroatiaBest - Premium vodič kroz Hrvatsku',
  description: 'Istražite najbolje skrivene plaže, luksuzne restorane i vrhunske hotele u Hrvatskoj uz našu interaktivnu kartu i stručne vodiče.',
  keywords: ['Hrvatska', 'Putovanja', 'Plaže', 'Restorani', 'Hoteli', 'Jadran', 'Turizam', 'Iznajmljivanje'],
  authors: [{ name: 'CroatiaBest Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'CroatiaBest - Vaš ultimativni jadranski vodič',
    description: 'Pronađite najbolje od Hrvatske na našoj interaktivnoj karti uživo.',
    url: 'https://croatiabest.com.hr',
    siteName: 'CroatiaBest',
    images: [
      {
        url: DEFAULT_LISTING_IMAGE,
        width: 1200,
        height: 630,
        alt: 'CroatiaBest Travel Guide',
      },
    ],
    locale: 'hr_HR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CroatiaBest - Otkrijte dušu Hrvatske',
    description: 'Stručni vodiči i interaktivna karta za savršeno ljetovanje.',
    images: [DEFAULT_LISTING_IMAGE],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
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
      <body suppressHydrationWarning className="font-body antialiased selection:bg-primary selection:text-white">
        <PocketBaseProvider>
          <LanguageProvider>
            <div className="flex flex-col min-h-screen">
              {children}
              <Footer />
            </div>
            <Toaster />
          </LanguageProvider>
        </PocketBaseProvider>
      </body>
    </html>
  );
}
