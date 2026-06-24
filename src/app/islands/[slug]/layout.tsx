import type { Metadata } from 'next';
import PocketBase from 'pocketbase';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const pb = new PocketBase('http://127.0.0.1:8090');
  let island;
  
  try {
    island = await pb.collection('islands').getFirstListItem(`slug="${resolvedParams.slug}"`);
  } catch (e) {
    return { title: 'Otoci - CroatiaBest' };
  }

  if (!island) {
    return { title: 'Otoci - CroatiaBest' };
  }

  const description = island.description 
    ? (island.description.length > 155 ? island.description.substring(0, 155) + '...' : island.description)
    : `Otkrijte sve što otok ${island.name} nudi - najbolje skrivene plaže, restorani i lokalne znamenitosti.`;

  const title = `Otok ${island.name} - CroatiaBest Vodič`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: island.image ? [
        {
          url: island.image,
          width: 1200,
          height: 630,
          alt: island.name,
        }
      ] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: island.image ? [island.image] : [],
    }
  };
}

export default function IslandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
