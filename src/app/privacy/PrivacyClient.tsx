"use client"

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrivacyPage() {
  const { language } = useLanguage();
  const isHr = language === 'hr';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-20 max-w-4xl">
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-black italic tracking-tighter">
              {isHr ? 'Pravila Privatnosti' : 'Privacy Policy'}
            </h1>
            <p className="text-xl text-muted-foreground font-medium">
              {isHr ? 'Posljednja izmjena: Lipanj 2026.' : 'Last updated: June 2026.'}
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-foreground/80">
            {isHr ? (
              <>
                <p>Ova Pravila privatnosti opisuju kako CroatiaBest prikuplja, koristi i štiti vaše osobne podatke kada koristite našu web stranicu.</p>
                
                <h3>1. Podaci koje prikupljamo</h3>
                <p>Kada se registrirate kao korisnik ili vlasnik objekta, možemo prikupiti podatke poput vašeg imena, e-mail adrese, broja telefona i podataka o vašem objektu. Ako samo pregledavate stranicu, prikupljamo anonimne analitičke podatke (npr. IP adresa, tip preglednika) za poboljšanje usluge.</p>

                <h3>2. Kako koristimo vaše podatke</h3>
                <p>Prikupljene podatke koristimo u sljedeće svrhe:</p>
                <ul>
                  <li>Za kreiranje i upravljanje vašim korisničkim računom i oglasima.</li>
                  <li>Za obradu vaših upita poslanih putem kontakt formi.</li>
                  <li>Za poboljšanje naše platforme i korisničkog iskustva.</li>
                  <li>Za slanje važnih obavijesti o vašem računu.</li>
                </ul>

                <h3>3. Dijeljenje podataka s trećim stranama</h3>
                <p>Vaše osobne podatke ne prodajemo trećim stranama. Podaci poput adrese, imena objekta i telefona (ako odobrite) bit će javno vidljivi na vašem oglasu. E-mail adrese korištene u kontakt formama prosljeđuju se izravno vlasnicima objekata i ne koristimo ih u marketinške svrhe bez pristanka.</p>

                <h3>4. Kolačići (Cookies)</h3>
                <p>Naša web stranica koristi "kolačiće" kako bi poboljšala vaše iskustvo. Kolačići nam pomažu zapamtiti vaše postavke jezika (Hrvatski/Engleski) i analizirati promet na stranici.</p>

                <h3>5. Sigurnost</h3>
                <p>Koristimo razumne tehničke i organizacijske mjere kako bismo zaštitili vaše podatke od neovlaštenog pristupa. Sve lozinke su kriptirane (hasched) u našoj bazi podataka.</p>

                <h3>6. Vaša prava</h3>
                <p>Imate pravo zatražiti pristup, ispravak ili brisanje vaših osobnih podataka iz našeg sustava. Za ostvarivanje tih prava, kontaktirajte nas na <strong>info@croatiabest.com.hr</strong>.</p>
              </>
            ) : (
              <>
                <p>This Privacy Policy describes how CroatiaBest collects, uses, and protects your personal data when you use our website.</p>
                
                <h3>1. Information We Collect</h3>
                <p>When you register as a user or business owner, we may collect information such as your name, email address, phone number, and details about your business. If you are just browsing, we collect anonymous analytical data (e.g., IP address, browser type) to improve our service.</p>

                <h3>2. How We Use Your Information</h3>
                <p>We use the collected information for the following purposes:</p>
                <ul>
                  <li>To create and manage your user account and listings.</li>
                  <li>To process your inquiries sent via contact forms.</li>
                  <li>To improve our platform and user experience.</li>
                  <li>To send important notifications about your account.</li>
                </ul>

                <h3>3. Sharing Data with Third Parties</h3>
                <p>We do not sell your personal data to third parties. Information such as address, business name, and phone number (if approved) will be publicly visible on your listing. Email addresses used in contact forms are forwarded directly to business owners and are not used for marketing without consent.</p>

                <h3>4. Cookies</h3>
                <p>Our website uses cookies to enhance your experience. Cookies help us remember your language preferences (Croatian/English) and analyze website traffic.</p>

                <h3>5. Security</h3>
                <p>We use reasonable technical and organizational measures to protect your data from unauthorized access. All passwords are encrypted (hashed) in our database.</p>

                <h3>6. Your Rights</h3>
                <p>You have the right to request access, correction, or deletion of your personal data from our system. To exercise these rights, please contact us at <strong>info@croatiabest.com.hr</strong>.</p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
