import type { Metadata } from 'next';
import PocketBase from 'pocketbase';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');
  let city;
  
  try {
    city = await pb.collection('cities').getFirstListItem(`slug="${resolvedParams.slug}"`);
  } catch (e) {
    return { title: 'Gradovi - CroatiaBest' };
  }

  if (!city) {
    return { title: 'Gradovi - CroatiaBest' };
  }

  // Use the HR description, fallback to first 160 chars
  const description = city.description 
    ? (city.description.length > 155 ? city.description.substring(0, 155) + '...' : city.description)
    : `Otkrijte sve što ${city.name} nudi - najbolje lokacije, restorani i znamenitosti.`;

  const title = `${city.name} - CroatiaBest Vodič`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: city.image ? [
        {
          url: city.image,
          width: 1200,
          height: 630,
          alt: city.name,
        }
      ] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: city.image ? [city.image] : [],
    }
  };
}

export default function CityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
