"use client"

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQSectionProps {
  type: 'city' | 'island' | 'listing' | 'blog';
  name: string;
  cityContext?: string;
  zipCode?: string;
  population?: string;
  isFreeCategory?: boolean;
}

export default function FAQSection({ type, name, cityContext, zipCode, population, isFreeCategory }: FAQSectionProps) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const getFaqs = (): FAQItem[] => {
    switch (type) {
      case 'city':
        return [
          {
            q: isEn ? `What is the best way to travel to ${name}?` : `Koji je najbolji način za putovanje u ${name}?`,
            a: isEn 
              ? `${name} is well connected by highways, state roads, and public transport. The main bus and train connections offer daily lines, which you can easily inspect on our location maps.` 
              : `${name} je odlično povezan autocestama, državnim cestama i javnim prijevozom. Glavne autobusne i željezničke linije nude svakodnevne polaske koje možete vidjeti na našoj karti.`
          },
          {
            q: isEn ? `What are the must-see attractions in ${name}?` : `Koje su najpoznatije atrakcije u gradu ${name}?`,
            a: isEn 
              ? `You should explore the historical landmarks, cultural museums, viewpoints, and local gourmet restaurants. Check out the "Heritage & Attractions" tab on this guide to see the best spots.` 
              : `Preporučujemo posjet povijesnim znamenitostima, muzejima, lokalnim vidikovcima i autentičnim restoranima. Pogledajte našu karticu "Kulturna Baština & Atrakcije" u ovom vodiču.`
          },
          {
            q: isEn ? `Where is the tourist board or official info center in ${name}?` : `Gdje se nalazi turistička zajednica u gradu ${name}?`,
            a: isEn 
              ? `The official tourist info center is located in the city center. You can also visit their official website listed in our info panel for maps, brochures, and seasonal event programs.` 
              : `Službeni turistički informativni centar nalazi se u samom centru grada. Također možete posjetiti njihove službene stranice navedene u našem info panelu za brošure i program događanja.`
          },
          {
            q: isEn ? `What is the zip code and population of ${name}?` : `Koji je poštanski broj i broj stanovnika za ${name}?`,
            a: isEn 
              ? `${name} has a postal zip code of ${zipCode || 'N/A'} and a registered population of approximately ${population || 'N/A'} residents, making it a vibrant destination.` 
              : `${name} ima poštanski broj ${zipCode || 'N/A'} i broji otprilike ${population || 'N/A'} stanovnika, što ga čini izrazito živopisnom destinacijom.`
          },
          {
            q: isEn ? `What emergency services can I contact in ${name}?` : `Koje hitne službe mogu kontaktirati u gradu ${name}?`,
            a: isEn 
              ? `For any emergency, you can call the general European rescue number 112, Police on 192, Firefighters on 193, or Ambulance on 194 directly from our emergency section.` 
              : `Za hitne slučajeve možete nazvati jedinstveni europski broj 112, policiju na 192, vatrogasce na 193 ili hitnu pomoć na 194 izravno iz našeg popisa hitnih službi.`
          }
        ];
      case 'island':
        return [
          {
            q: isEn ? `How do I get to the island of ${name}?` : `Kako doći do otoka ${name}?`,
            a: isEn 
              ? `The island of ${name} is accessible via regular ferry and catamaran lines departing from mainland coastal hubs. Detailed ferry routes and terminal maps are listed in our guide.` 
              : `Otok ${name} je dostupan redovitim trajektnim i brzobrodskim linijama koje polaze iz obalnih središta. Detaljne trajektne linije i karte pristaništa možete pronaći u našem vodiču.`
          },
          {
            q: isEn ? `What are the best beaches on ${name}?` : `Koje su najljepše plaže na otoku ${name}?`,
            a: isEn 
              ? `${name} offers stunning natural pebble and sandy beaches. Look at our beaches list under exclusive categories to find hidden coves and premium beach bars.` 
              : `${name} nudi prekrasne šljunčane i pješčane plaže. Pogledajte naš popis plaža pod ekskluzivnim kategorijama kako biste pronašli skrivene uvale i najbolje plaže.`
          },
          {
            q: isEn ? `Is it necessary to rent a car or scooter on ${name}?` : `Je li potrebno unajmiti automobil ili skuter na otoku ${name}?`,
            a: isEn 
              ? `While there is local bus transport connecting main towns on ${name}, renting a car or a scooter is highly recommended to explore remote landscapes, viewpoints, and OPG farms.` 
              : `Iako lokalni autobus povezuje veća mjesta na otoku ${name}, toplo preporučujemo najam automobila ili skutera kako biste istražili skrivene uvale, vidikovce i domaća OPG imanja.`
          },
          {
            q: isEn ? `What local food and wine specialties should I try on ${name}?` : `Koje lokalne specijalitete i vina trebam kušati na otoku ${name}?`,
            a: isEn 
              ? `Don't miss out on trying olive oil, fresh sea bass, peka, and indigenous wine varieties directly from local wineries and tavern partners listed in our gastronomy section.` 
              : `Ne propustite kušati maslinovo ulje, svježu ribu, jela pod pekom i autohtone sorte vina izravno od naših lokalnih vinarija i konoba koje su izlistane u gastro kategoriji.`
          },
          {
            q: isEn ? `Are there emergency services and pharmacies on the island?` : `Postoje li hitne službe i ljekarne na otoku ${name}?`,
            a: isEn 
              ? `Yes, the main settlements on ${name} have local medical clinics and pharmacies. For complex emergencies, sea and air rescue services are fully coordinated with mainland hospitals.` 
              : `Da, veća mjesta na otoku ${name} imaju ambulante i ljekarne. Za hitne slučajeve osigurana je koordinirana medicinska pomoć s kopnenim bolnicama.`
          }
        ];
      case 'listing':
        return [
          {
            q: isEn ? `Where is ${name} located and how do I get there?` : `Gdje se točno nalazi ${name} i kako doći do tamo?`,
            a: isEn 
              ? `${name} is located in ${cityContext || 'Croatia'}. You can find the exact geographical coordinates and click the "Get Directions" button on our integrated map to open navigation.` 
              : `${name} se nalazi u mjestu ${cityContext || 'Hrvatska'}. Možete vidjeti točnu lokaciju na našoj karti i kliknuti gumb "Upute za vožnju" za pokretanje navigacije.`
          },
          {
            q: isEn ? `What makes ${name} a unique place to visit?` : `Što čini ${name} posebnim mjestom za posjet?`,
            a: isEn 
              ? `It offers authentic experience, natural or cultural value, and great highlights. Check out our description and photo gallery above to learn about its history and features.` 
              : `Nudi autentičan doživljaj, prirodnu ili kulturnu vrijednost i izvanrednu lokaciju. Pogledajte opis i galeriju fotografija iznad kako biste saznali više o povijesti i detaljima.`
          },
          isFreeCategory ? {
            q: isEn ? `Is there an entrance fee or ticket required for ${name}?` : `Plaća li se ulaznica za posjet ${name}?`,
            a: isEn 
              ? `Most natural locations, beaches, viewpoints, and public monuments are freely accessible year-round. Certain protected nature parks or specific heritage museums may have nominal local entrance fees.` 
              : `Većina javnih znamenitosti, plaža, vidikovaca i spomenika slobodna je za posjet tijekom cijele godine bez naknade, dok zaštićeni parkovi ili muzeji mogu imati lokalne ulaznice.`
          } : {
            q: isEn ? `How can I contact the management or book services at ${name}?` : `Kako mogu stupiti u kontakt ili rezervirati uslugu kod ${name}?`,
            a: isEn 
              ? `You can use the verified contact details or the inquiry form on this page to reach the owners directly.` 
              : `Možete koristiti provjerene kontakt podatke ili poslati upit izravno putem forme na ovoj stranici.`
          },
          isFreeCategory ? {
            q: isEn ? `When is the best time of day to visit ${name}?` : `Kada je najbolje vrijeme u danu za posjet ${name}?`,
            a: isEn 
              ? `Early mornings and golden sunset hours usually offer the most peaceful atmosphere, mild temperatures, and the best natural lighting for photography.` 
              : `Rana jutra i poslijepodneva u vrijeme zalaska sunca nude najugodniji mir, ugodnije temperature i najbolje osvjetljenje za fotografiranje i uživanje.`
          } : {
            q: isEn ? `Is booking or reservation required for ${name}?` : `Je li potrebna prethodna rezervacija ili najava za posjet ${name}?`,
            a: isEn 
              ? `We recommend contacting them in advance, especially during the high summer season, to check availability and ensure you get the best seating or accommodation.` 
              : `Preporučujemo da ih kontaktirate unaprijed, posebno tijekom ljetne turističke sezone, kako biste provjerili slobodne termine ili osigurali mjesto.`
          },
          {
            q: isEn ? `Are there other tourist attractions or points of interest nearby?` : `Nalaze li se u blizini druge turističke atrakcije?`,
            a: isEn 
              ? `Yes! Our map showcases all other premium restaurants, beaches, viewpoints, and historical monuments situated in the vicinity, allowing you to plan a full day schedule.` 
              : `Da! Naša karta prikazuje sve ostale restorane, plaže, vidikovce i povijesne spomenike u neposrednoj blizini kako biste lakše organizirali izlet.`
          }
        ];
      case 'blog':
        return [
          {
            q: isEn ? `Who wrote the article "${name}"?` : `Tko je autor članka "${name}"?`,
            a: isEn 
              ? `The article was prepared and verified by the CroatiaBest editorial team, featuring insights from local tourist guides and cultural historians.` 
              : `Članak je pripremio i provjerio urednički tim CroatiaBest u suradnji s lokalnim turističkim vodičima i povjesničarima umjetnosti.`
          },
          {
            q: isEn ? `Are the tips and recommendations in this article up to date?` : `Jesu li preporuke i savjeti iz ovog članka i dalje točni?`,
            a: isEn 
              ? `Yes, our editors continuously review and update our travel guides and magazine articles to reflect the latest seasonal opening hours, ticket prices, and routes.` 
              : `Da, naši urednici redovito pregledavaju i ažuriraju putopise i članke kako bi osigurali točne informacije o radnim vremenima, cijenama ulaznica i rutama.`
          },
          {
            q: isEn ? `Can I share or reuse the contents of this article?` : `Mogu li podijeliti ili koristiti sadržaj ovog članka?`,
            a: isEn 
              ? `You can freely share this article using the page URL. Commercial reuse of the text or images without our written consent is protected under copyright law.` 
              : `Slobodno možete podijeliti ovaj članak slanjem poveznice. Komercijalno korištenje tekstova ili slika bez pismenog dopuštenja podliježe autorskim pravima.`
          },
          {
            q: isEn ? `Where can I find objects or locations mentioned in this article?` : `Gdje mogu pronaći objekte i lokacije koji se spominju u članku?`,
            a: isEn 
              ? `All specific restaurants, monuments, beaches, or historic parks mentioned here are fully indexed in our Explore Map. You can click on their names to view detailed guides.` 
              : `Svi restorani, spomenici, plaže ili parkovi koji se spominju u tekstu nalaze se u našoj tražilici. Možete ih pretražiti na karti za detaljne upute.`
          },
          {
            q: isEn ? `How long does it take to read this guide?` : `Koliko je vremena potrebno za čitanje ovog vodiča?`,
            a: isEn 
              ? `The estimated reading time for this article is about 5 to 7 minutes, packed with practical tips and historical facts.` 
              : `Predviđeno vrijeme čitanja ovog članka je između 5 i 7 minuta, a sadrži pregršt praktičnih savjeta i povijesnih činjenica.`
          }
        ];
      default:
        return [];
    }
  };

  const faqs = getFaqs();

  if (faqs.length === 0) return null;

  return (
    <section className="w-full py-16 bg-slate-50 border-t border-b border-black/5 rounded-[3rem] mt-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12 space-y-3">
          <Badge className="bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest">
            FAQ
          </Badge>
          <h3 className="text-3xl md:text-4xl font-headline font-black italic tracking-tighter text-foreground">
            {isEn ? 'Frequently Asked Questions' : 'Često postavljana pitanja'}
          </h3>
          <p className="text-muted-foreground text-sm font-body italic">
            {isEn ? `Useful information and guide details regarding ${name}` : `Korisne informacije i detalji vodiča vezani uz ${name}`}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                className="bg-white border border-black/5 rounded-3xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 flex items-center justify-between gap-4 text-left font-bold text-base md:text-lg text-foreground hover:text-primary transition-colors focus:outline-none"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="size-5 text-primary/60 flex-shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown 
                    className={`size-5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} 
                  />
                </button>

                <div 
                  className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? 'max-h-[300px] border-t border-slate-50' : 'max-h-0'
                  }`}
                >
                  <div className="p-6 text-sm md:text-base text-muted-foreground leading-relaxed font-body whitespace-pre-wrap bg-slate-50/50">
                    {faq.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
