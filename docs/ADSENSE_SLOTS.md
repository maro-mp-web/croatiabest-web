# Evidencija i raspored pozicija za Google AdSense

> **Status:** Demo / placeholder oglasi su **privremeno isključeni** iz prikaza kako Google AdSense tim ne bi odbio prijavu (prema pravilu *Valuable Inventory: Under Construction / Scaffolding / Dummy Ads*).
> 
> Sve pozicije su **točno zapamćene i mapirane u kodu**. Čim Google odobri račun, aktivacija se radi u jednom koraku.

---

## 📌 Popis zapamćenih pozicija na stranici

| # | Pozicija ID (`positionId`) | Stranica | Točna lokacija | Preporučeni Google AdSense format |
|---|---|---|---|---|
| 1 | `HOMEPAGE_HORIZONTAL_MID` | **Naslovnica (`/`)** | Između popisa gradova i sekcije Kulturna baština | **Responsive Horizontal Leaderboard** (728×90 / Auto) |
| 2 | `LISTING_SIDEBAR_RECTANGLE` | **Objekt (`/listing/[category]/[slug]`)** | Desni stupac, ispod radnog vremena i kontakta | **Medium Rectangle** (300×250) |
| 3 | `LISTING_BOTTOM_HORIZONTAL` | **Objekt (`/listing/[category]/[slug]`)** | Dno stranice, iznad "Istaknuto u blizini" | **Responsive Horizontal Leaderboard** (728×90 / Auto) |
| 4 | `CITY_IN_CONTENT_RECTANGLE` | **Grad (`/cities/[slug]`)** | Glavni stupac, između vijesti i spomenika | **In-Article Responsive / Rectangle** (300×250 ili 336×280) |
| 5 | `CITY_SIDEBAR_VERTICAL` | **Grad (`/cities/[slug]`)** | Desni stupac, ispod interaktivne karte grada | **Vertical Skyscraper / Half Page** (300×600) |
| 6 | `ISLAND_IN_CONTENT_RECTANGLE` | **Otok (`/islands/[slug]`)** | Glavni stupac, ispod popisa atrakcija | **In-Article Responsive / Rectangle** (300×250) |
| 7 | `ISLAND_SIDEBAR_VERTICAL` | **Otok (`/islands/[slug]`)** | Desni stupac, ispod karte otoka | **Vertical Skyscraper / Half Page** (300×600) |
| 8 | `BLOG_ARTICLE_SIDEBAR_VERTICAL` | **Magazin Članak (`/blog/[id]`)** | Desni stupac, ispod newsletter forme | **Vertical Skyscraper / Half Page** (300×600) |

---

## 🚀 Kako aktivirati Google AdSense kada dobijete odobrenje

Čim dobijete potvrdu od Googlea, u vašu produkcijsku okolinu (npr. Vercel Environment Variables ili `.env.local` na serveru) dodajte:

```env
NEXT_PUBLIC_ENABLE_ADSENSE=true
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
```

*(Zamijenite `ca-pub-XXXXXXXXXXXXXXXX` vašim stvarnim AdSense Publisher ID-jem)*

### Što se tada događa:
* Komponenta `AdBanner` automatski počinje renderirati službene Google `<ins class="adsbygoogle" ...>` oznake.
* Oglasi se odmah pojavljuju na svim gore navedenim pozicijama bez potrebe za ručnim prepravljanjem koda.
