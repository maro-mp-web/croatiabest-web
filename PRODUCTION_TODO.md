# Priprema za Produkciju (CroatiaBest)

Ovaj dokument sadrži popis zadataka koje moramo odraditi kada server (Hetzner VPS) i domena (`croatiabest.com.hr`) budu spremni.

## 1. PocketBase i Server (Backend)
- [ ] **PocketBase Instalacija:** Postaviti PocketBase na Hetzner VPS serveru.
- [ ] **Sigurnost Baze:** Zaključati `media` kolekciju u PocketBaseu tako da samo prijavljeni korisnici mogu slati datoteke (`createRule: "@request.auth.id != ''"`).
- [ ] **Admin Lozinka:** Promijeniti lozinku za glavnog admina (`maro.webdeveloper@gmail.com`) iz defaultne `pass123456` u sigurnu lozinku na produkcijskom serveru.
- [ ] **Migracija Podataka:** Prebaciti trenutnu strukturu baze (`pb_migrations`) na produkcijski server.
- [ ] **Brisanje Testnih Podataka:** Obrisati sve "Test" objekte i slike iz baze.

## 2. Next.js Aplikacija (Frontend)
- [ ] **Environment Varijable:** Kreirati `.env.production` datoteku u Next.js projektu s `NEXT_PUBLIC_POCKETBASE_URL=https://baza.croatiabest.com.hr` (ili gdje god će točno PB biti hostan).
- [ ] **Domene Slika:** Dodati pravu domenu (npr. `baza.croatiabest.com.hr`) u `next.config.ts` pod dozvoljene domene za slike (`remotePatterns`).
- [ ] **Deployment:** Povezati Vercel s GitHub repozitorijem (ili podesiti build na VPS-u ako hostaš Next.js na istom serveru) i preusmjeriti `croatiabest.com.hr` na Vercel projekt.

## 3. SEO i Marketing
- [ ] **Globalni SEO Tagovi:** Dodati `<title>`, `<meta name="description">` i ključne riječi u `src/app/layout.tsx`.
- [ ] **OpenGraph/Socijalne mreže:** Podesiti og tagove kako bi se pri dijeljenju na WhatsApp/Facebooku prikazivala odgovarajuća slika i naslov projekta.
- [ ] **Dinamički SEO:** Podesiti `generateMetadata` za stranicu `/listing/[id]` kako bi se svaki oglas (npr. restoran u Zagrebu) pravilno indeksirao na Googleu pod svojim nazivom.

## 4. Finalna Validacija
- [ ] Provjeriti pokreće li se `npm run build` bez grešaka koje bi mogle spriječiti deployment.
- [ ] Testirati učitavanje slika i odobravanje oglasa u produkcijskom okruženju.
