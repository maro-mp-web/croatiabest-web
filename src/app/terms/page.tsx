"use client"

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TermsPage() {
  const { language } = useLanguage();
  const isHr = language === 'hr';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-20 max-w-4xl">
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-black italic tracking-tighter">
              {isHr ? 'Uvjeti Korištenja' : 'Terms of Service'}
            </h1>
            <p className="text-xl text-muted-foreground font-medium">
              {isHr ? 'Posljednja izmjena: Lipanj 2026.' : 'Last updated: June 2026.'}
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-foreground/80">
            {isHr ? (
              <>
                <p>Dobrodošli na CroatiaBest. Korištenjem ove web stranice prihvaćate sljedeće uvjete i odredbe. Molimo vas da ih pažljivo pročitate.</p>
                
                <h3>1. Opće Odredbe</h3>
                <p>CroatiaBest je digitalna platforma namijenjena pretraživanju turističkih usluga, objekata i znamenitosti u Hrvatskoj. Platforma omogućuje vlasnicima objekata objavu vlastitih oglasa i ponuda.</p>

                <h3>2. Odgovornost Korisnika</h3>
                <p>Korisnici se obvezuju koristiti platformu u skladu s važećim zakonima Republike Hrvatske. Zabranjeno je objavljivanje uvredljivog, netočnog ili ilegalnog sadržaja, te lažno predstavljanje.</p>

                <h3>3. Objava Oglasa i Sadržaja</h3>
                <p>Vlasnici objekata koji objavljuju premium (plaćene) ili besplatne oglase odgovorni su za točnost objavljenih podataka (cijene, fotografije, opisi). CroatiaBest zadržava pravo uklanjanja oglasa koji krše naša pravila bez prethodne najave.</p>

                <h3>4. Intelektualno Vlasništvo</h3>
                <p>Svi tekstovi, dizajn, grafike i kod na stranici vlasništvo su CroatiaBest platforme (osim sadržaja koji dodaju sami korisnici) i ne smiju se kopirati ili reproducirati bez pisanog dopuštenja.</p>

                <h3>5. Ograničenje Odgovornosti</h3>
                <p>CroatiaBest služi isključivo kao informativni posrednik. Ne odgovaramo za kvalitetu usluga koje pružaju treće strane (restorani, hoteli, itd.) oglašene na našoj platformi. Sve rezervacije i dogovori obavljaju se isključivo između korisnika i vlasnika objekta.</p>

                <h3>6. Izmjene Uvjeta</h3>
                <p>Zadržavamo pravo izmjene ovih Uvjeta u bilo kojem trenutku. Ažurirani uvjeti bit će objavljeni na ovoj stranici, a nastavak korištenja stranice znači da se slažete s izmjenama.</p>
              </>
            ) : (
              <>
                <p>Welcome to CroatiaBest. By using this website, you accept the following terms and conditions. Please read them carefully.</p>
                
                <h3>1. General Provisions</h3>
                <p>CroatiaBest is a digital platform designed for searching tourist services, facilities, and landmarks in Croatia. The platform allows business owners to publish their own listings and offers.</p>

                <h3>2. User Responsibility</h3>
                <p>Users agree to use the platform in accordance with the applicable laws of the Republic of Croatia. Publishing offensive, inaccurate, or illegal content, as well as false representation, is prohibited.</p>

                <h3>3. Publishing Listings and Content</h3>
                <p>Business owners who publish premium (paid) or free listings are responsible for the accuracy of the published data (prices, photos, descriptions). CroatiaBest reserves the right to remove listings that violate our rules without prior notice.</p>

                <h3>4. Intellectual Property</h3>
                <p>All text, design, graphics, and code on the site are the property of the CroatiaBest platform (except for content added by users themselves) and may not be copied or reproduced without written permission.</p>

                <h3>5. Limitation of Liability</h3>
                <p>CroatiaBest serves solely as an informational intermediary. We are not responsible for the quality of services provided by third parties (restaurants, hotels, etc.) advertised on our platform. All reservations and agreements are made exclusively between the user and the business owner.</p>

                <h3>6. Changes to Terms</h3>
                <p>We reserve the right to modify these Terms at any time. Updated terms will be published on this page, and continued use of the site means you agree to the changes.</p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
