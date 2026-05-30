export type FieldType = 'text' | 'number' | 'select' | 'checkbox';

export interface CategoryField {
  id: string;
  label: string;
  type: FieldType;
  options?: string[]; // Used for 'select' type
}

export const CATEGORY_FIELDS: Record<string, CategoryField[]> = {
  restaurants: [
    { id: 'cuisineType', label: 'Vrsta kuhinje', type: 'select', options: ['Mediteranska', 'Tradicionalna', 'Riblja', 'Fast Food', 'Pizzeria', 'Fine Dining', 'Internacionalna'] },
    { id: 'hasDelivery', label: 'Mogućnost dostave', type: 'checkbox' },
    { id: 'dressCode', label: 'Dress Code', type: 'select', options: ['Ležerno', 'Smart Casual', 'Formalno'] },
  ],
  hotels: [
    { id: 'stars', label: 'Broj zvjezdica', type: 'select', options: ['1', '2', '3', '4', '5'] },
    { id: 'hasPool', label: 'Bazen', type: 'checkbox' },
    { id: 'hasSpa', label: 'Spa i Wellness', type: 'checkbox' },
    { id: 'hasParking', label: 'Besplatan Parking', type: 'checkbox' },
    { id: 'checkInTime', label: 'Vrijeme prijave (Check-in)', type: 'text' },
    { id: 'checkOutTime', label: 'Vrijeme odjave (Check-out)', type: 'text' },
  ],
  bars: [
    { id: 'barType', label: 'Vrsta bara', type: 'select', options: ['Beach Bar', 'Lounge Bar', 'Caffe Bar', 'Pub', 'Wine Bar'] },
    { id: 'hasHappyHour', label: 'Happy Hour', type: 'checkbox' },
    { id: 'hasLiveMusic', label: 'Živa glazba', type: 'checkbox' },
  ],
  nightclubs: [
    { id: 'musicGenre', label: 'Glavni žanr glazbe', type: 'select', options: ['House/Techno', 'Komercijalna', 'Domaća', 'R&B/Hip-Hop', 'Razno'] },
    { id: 'entryFee', label: 'Naplaćuje se ulaz', type: 'checkbox' },
    { id: 'vipTables', label: 'VIP Stolovi', type: 'checkbox' },
    { id: 'ageLimit', label: 'Dobna granica', type: 'select', options: ['Nema', '18+', '21+'] },
  ],
  boat_rentals: [
    { id: 'boatTypes', label: 'Vrste plovila u ponudi', type: 'text' },
    { id: 'licenseRequired', label: 'Potrebna dozvola', type: 'checkbox' },
    { id: 'skipperAvailable', label: 'Mogućnost najma skipera', type: 'checkbox' },
    { id: 'fuelIncluded', label: 'Gorivo uključeno u cijenu', type: 'checkbox' },
  ],
  rent_a_car: [
    { id: 'vehicleTypes', label: 'Vrste vozila', type: 'text' },
    { id: 'depositRequired', label: 'Potreban depozit', type: 'checkbox' },
    { id: 'insuranceIncluded', label: 'Osiguranje uključeno', type: 'checkbox' },
    { id: 'minAge', label: 'Minimalna dob vozača', type: 'number' },
  ],
  tours: [
    { id: 'tourDuration', label: 'Trajanje izleta', type: 'select', options: ['Do 2 sata', 'Pola dana', 'Cijeli dan', 'Višednevno'] },
    { id: 'tourDifficulty', label: 'Težina izleta', type: 'select', options: ['Lagano', 'Srednje', 'Teško'] },
    { id: 'languages', label: 'Jezici vodiča', type: 'text' },
    { id: 'familyFriendly', label: 'Prikladno za djecu', type: 'checkbox' },
  ],
  wellness: [
    { id: 'wellnessServices', label: 'Glavne usluge (Masaža, Sauna...)', type: 'text' },
    { id: 'reservationRequired', label: 'Obavezna rezervacija', type: 'checkbox' },
    { id: 'couplesMassage', label: 'Masaža za parove', type: 'checkbox' },
  ],
  culture: [
    { id: 'institutionType', label: 'Vrsta ustanove', type: 'select', options: ['Muzej', 'Galerija', 'Kazalište', 'Kino', 'Spomenik'] },
    { id: 'guidedTours', label: 'Grupni vodič', type: 'checkbox' },
    { id: 'studentDiscount', label: 'Studentski popust', type: 'checkbox' },
  ],
  shops: [
    { id: 'shopType', label: 'Vrsta trgovine', type: 'select', options: ['Suveniri', 'Odjeća i obuća', 'Nakit', 'Lokalni proizvodi', 'Mješovita roba'] },
    { id: 'localProducts', label: 'Prodaja autohtonih proizvoda', type: 'checkbox' },
    { id: 'taxFree', label: 'Tax Free', type: 'checkbox' },
  ],
  mechanics: [
    { id: 'towingService', label: 'Vučna služba (0-24)', type: 'checkbox' },
    { id: 'replacementVehicle', label: 'Zamjensko vozilo', type: 'checkbox' },
    { id: 'repairTypes', label: 'Vrste popravaka', type: 'text' },
  ],
  it: [
    { id: 'softwareDev', label: 'Razvoj softvera', type: 'checkbox' },
    { id: 'hardwareSupport', label: 'Održavanje opreme', type: 'checkbox' },
    { id: 'fieldWork', label: 'Terenski rad', type: 'checkbox' },
  ],
  marketing: [
    { id: 'seo', label: 'SEO Optimizacija', type: 'checkbox' },
    { id: 'socialMedia', label: 'Vođenje društvenih mreža', type: 'checkbox' },
    { id: 'videoProd', label: 'Video produkcija', type: 'checkbox' },
  ],
  digital: [
    { id: 'webDesign', label: 'Web dizajn', type: 'checkbox' },
    { id: 'hosting', label: 'Web Hosting', type: 'checkbox' },
    { id: 'graphicDesign', label: 'Grafički dizajn', type: 'checkbox' },
  ],
  accounting: [
    { id: 'taxConsulting', label: 'Porezno savjetovanje', type: 'checkbox' },
    { id: 'annualReports', label: 'Izrada završnog računa', type: 'checkbox' },
  ],
  hairdressers: [
    { id: 'salonType', label: 'Tip salona (Muški/Ženski)', type: 'select', options: ['Muški', 'Ženski', 'Unisex'] },
    { id: 'barber', label: 'Barber usluge', type: 'checkbox' },
    { id: 'hairColoring', label: 'Bojanje kose', type: 'checkbox' },
  ],
  beauty: [
    { id: 'massage', label: 'Masaža', type: 'checkbox' },
    { id: 'nails', label: 'Nokti (Manikura/Pedikura)', type: 'checkbox' },
    { id: 'depilation', label: 'Depilacija', type: 'checkbox' },
  ],
};
