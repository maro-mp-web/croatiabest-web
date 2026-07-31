
import type {Metadata} from 'next';
import { Alegreya, Belleza } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import { PocketBaseProvider } from '@/pocketbase';
import { DEFAULT_LISTING_IMAGE } from '@/app/lib/constants';
import Footer from '@/components/layout/Footer';
import Script from 'next/script';
import { HreflangManager } from '@/components/seo/HreflangManager';

const alegreya = Alegreya({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
});

const belleza = Belleza({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://croatiabest.com.hr'),
  title: 'CroatiaBest - Premium vodič kroz Hrvatsku',
  description: 'Istražite najbolje skrivene plaže, luksuzne restorane i vrhunske hotele u Hrvatskoj uz našu interaktivnu kartu i stručne vodiče.',
  keywords: ['Hrvatska', 'Putovanja', 'Plaže', 'Restorani', 'Hoteli', 'Jadran', 'Turizam', 'Iznajmljivanje'],
  authors: [{ name: 'CroatiaBest Team' }],
  robots: 'index, follow',
  alternates: {
    canonical: 'https://croatiabest.com.hr',
  },
  openGraph: {
    title: 'CroatiaBest - Vaš ultimativni jadranski vodič',
    description: 'Pronađite najbolje od Hrvatske na našoj interaktivnoj karti uživo.',
    url: 'https://croatiabest.com.hr',
    siteName: 'CroatiaBest',
    images: [
      {
        url: '/hero-dubrovnik.jpg',
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
    images: ['/hero-dubrovnik.jpg'],
  },
  verification: {
    google: 'X7N4-HcZlH3zbfNOD1ZtwpvUIkbUr7ZcEKmtGfJ0SaM',
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
      <body suppressHydrationWarning className={`${alegreya.variable} ${belleza.variable} font-body antialiased selection:bg-primary selection:text-white`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-S2JR7QWYN4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-S2JR7QWYN4');
          `}
        </Script>
        <PocketBaseProvider>
          <LanguageProvider>
            <HreflangManager />
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
