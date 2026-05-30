# CroatiaBest - Premium Travel Guide

Ovo je produkcijski spreman portal za turističke informacije i listinge u Hrvatskoj.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI, Lucide Icons
- **Backend**: PocketBase
- **AI**: Genkit & Google Gemini
- **Maps**: Google Maps JavaScript API

## Lokalno pokretanje

1. **Klonirajte repozitorij**
2. **Instalirajte ovisnosti**:
   ```bash
   npm install
   ```
3. **Konfigurirajte .env.local**:
   Kreirajte `.env.local` datoteku u korijenu projekta i dodajte svoje ključeve:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=vaš_google_maps_ključ
   GOOGLE_GENAI_API_KEY=vaš_gemini_ključ
   ```
4. **Pokrenite razvojni poslužitelj**:
   ```bash
   npm run dev
   ```
5. **Otvorite [http://localhost:9002](http://localhost:9002)** u pregledniku.

## Struktura projekta
- `/src/app`: Next.js rute i stranice.
- `/src/components`: Višekratne UI komponente.
- `/src/pocketbase`: Konfiguracija i kuke za PocketBase bazu podataka.
- `/src/ai`: Genkit flowovi za AI asistente.
