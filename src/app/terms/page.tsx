
"use client"

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 py-24 max-w-4xl">
        <h1 className="text-6xl font-headline font-black mb-12 uppercase tracking-tighter">Uvjeti Korištenja</h1>
        <div className="prose prose-xl font-body leading-loose space-y-8">
          <p className="italic text-primary font-bold">Verzija: 1.0 | Datum: 24. veljače 2024.</p>
          
          <section className="space-y-4">
            <h2 className="text-3xl font-black">1. Opće odredbe</h2>
            <p>CroatiaBest je platforma koja povezuje turiste s pružateljima usluga u Hrvatskoj. Korištenjem ovog portala pristajete na sve navedene uvjete.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-black">2. Obveze oglašivača</h2>
            <p>Svi plaćeni i besplatni oglasi moraju sadržavati točne i provjerene informacije. Zabranjeno je postavljanje uvredljivog ili netočnog sadržaja.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-black">3. Odricanje od odgovornosti</h2>
            <p>CroatiaBest ne odgovara za kvalitetu usluge koju pružaju oglašivači na portalu, već služi isključivo kao informativni posrednik.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-black">4. Intelektualno vlasništvo</h2>
            <p>Svi logotipovi, tekstovi i dizajn portala zaštićeni su autorskim pravima. Neovlašteno kopiranje bit će zakonski procesuirano.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
