"use client"

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 py-24 max-w-4xl">
        <h1 className="text-6xl font-headline font-black mb-12">Polica Privatnosti (GDPR)</h1>
        <div className="prose prose-xl font-body leading-loose space-y-8">
          <p className="italic text-primary font-bold">Zadnje ažuriranje: 24. veljače 2024.</p>
          
          <section className="space-y-4">
            <h2 className="text-3xl font-black">1. Prikupljanje podataka</h2>
            <p>CroatiaBest portal prikuplja podatke potrebne za pružanje usluga listinga, uključujući ime, email adresu i lokaciju objekta. Ovi podaci se koriste isključivo za rad portala i komunikaciju s korisnicima.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-black">2. Kako koristimo vaše podatke</h2>
            <p>Vaši podaci nam omogućuju da personaliziramo vaše iskustvo, obrađujemo transakcije putem Stripe sustava i poboljšavamo naše usluge pomoću AI asistenata.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-black">3. Sigurnost podataka</h2>
            <p>Koristimo najmodernije sigurnosne protokole Firebase i Google Cloud platforme kako bismo osigurali da su vaši podaci zaštićeni od neovlaštenog pristupa.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-black">4. Vaša prava</h2>
            <p>U svakom trenutku imate pravo zatražiti uvid u svoje podatke, njihovu izmjenu ili potpuno brisanje iz našeg sustava slanjem zahtjeva na naš email.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
