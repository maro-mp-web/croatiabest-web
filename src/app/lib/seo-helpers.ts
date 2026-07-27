import { generateListingUrl } from '@/app/lib/utils/slug';

export const getCategorySchemaType = (categoryId: string): string => {
  const schemaMap: Record<string, string> = {
    restaurants: 'Restaurant',
    hotels: 'Hotel',
    bars: 'BarOrPub',
    nightclubs: 'NightClub',
    boat_rentals: 'AutoRental',
    rent_a_car: 'AutoRental',
    tours: 'TravelAgency',
    wellness: 'HealthAndBeautyBusiness',
    culture: 'Museum',
    shops: 'Store',
    mechanics: 'AutoRepair',
    it: 'ProfessionalService',
    marketing: 'ProfessionalService',
    digital: 'ProfessionalService',
    accounting: 'AccountingService',
    hairdressers: 'HairSalon',
    beauty: 'BeautySalon',
    pharmacy: 'Pharmacy',
    emergency: 'Hospital',
    police: 'PoliceStation',
    firefighters: 'FireStation',
    beaches: 'TouristAttraction',
    wineries: 'Winery',
    opgs: 'LocalBusiness',
    viewpoints: 'TouristAttraction',
    landmarks: 'TouristAttraction',
    homeland_war: 'TouristAttraction',
    bus_stations: 'BusStation',
    train_stations: 'TrainStation',
    ferry_ports: 'TravelAgency',
    marinas: 'LocalBusiness',
  };
  return schemaMap[categoryId] || 'LocalBusiness';
};

export const generateListingSchema = (listing: any) => {
  const schemaType = getCategorySchemaType(listing.locationCategoryId || listing.categoryId);
  let photos = listing.photoUrls || [];
  if (typeof photos === 'string') {
    try { photos = JSON.parse(photos); } catch (e) { photos = [photos]; }
  }

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: listing.name,
    description: listing.description ? listing.description.split('\n\n')[0] : '',
    url: typeof window !== 'undefined' ? window.location.href : `https://croatiabest.com.hr${generateListingUrl(listing.locationCategoryId || listing.categoryId, listing.name)}`,
  };

  if (photos && photos.length > 0) {
    schema.image = photos[0];
  }

  if (listing.address || listing.city) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: listing.address || '',
      addressLocality: listing.city || '',
      addressRegion: listing.region || '',
      addressCountry: 'HR',
    };
  }

  if (listing.latitude && listing.longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: listing.latitude,
      longitude: listing.longitude,
    };
  }

  if (listing.contactPhone && listing.locationCategoryType !== 'free') {
    schema.telephone = listing.contactPhone;
  }

  if (listing.webAddress && listing.locationCategoryType !== 'free') {
    schema.sameAs = listing.webAddress;
  }

  // Add Products/Menu Integration
  let products = listing.products || [];
  if (typeof products === 'string') {
    try { products = JSON.parse(products); } catch (e) { products = []; }
  }
  if (Array.isArray(products) && products.length > 0) {
    schema.hasMenu = {
      '@type': 'Menu',
      name: 'Meni / Ponuda',
      hasMenuItem: products.map((p: any) => ({
        '@type': 'MenuItem',
        name: p.name,
        offers: {
          '@type': 'Offer',
          price: p.price ? p.price.replace(/[^0-9.]/g, '') : '',
          priceCurrency: 'EUR'
        }
      }))
    };
  }

  // Add FAQ Integration
  let faqs = listing.faq || [];
  if (typeof faqs === 'string') {
    try { faqs = JSON.parse(faqs); } catch (e) { faqs = []; }
  }
  if (Array.isArray(faqs) && faqs.length > 0) {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f: any) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer
        }
      }))
    };
    return [schema, faqSchema];
  }

  return schema;
};

export const generateArticleSchema = (article: any) => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    datePublished: article.created,
    dateModified: article.updated,
    author: [{
      '@type': 'Person',
      name: article.author || 'CroatiaBest',
    }],
    publisher: {
      '@type': 'Organization',
      name: 'CroatiaBest',
      logo: {
        '@type': 'ImageObject',
        url: 'https://croatiabest.com.hr/logo.png', // Update to real absolute URL if exists
      }
    },
    description: article.excerpt || '',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://croatiabest.com.hr/blog/${article.slug || article.id}`
    }
  };

  if (article.image) {
    schema.image = [article.image];
  }

  return schema;
};
