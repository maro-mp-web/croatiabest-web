import PocketBase from 'pocketbase';
import CityClient from './CityClient';
import { notFound } from 'next/navigation';

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const pb = new PocketBase('http://127.0.0.1:8090');
  
  let city;
  try {
    city = await pb.collection('cities').getFirstListItem(`slug="${resolvedParams.slug}"`, { requestKey: null });
  } catch (e) {
    return notFound();
  }

  let cityListings = [];
  try {
    cityListings = await pb.collection('listings').getFullList({
      filter: `city="${city.name}" && status="active"`,
      sort: '-created',
      requestKey: null
    });
  } catch (e) {
    // ignore
  }

  let globalSpecialListings = [];
  try {
    globalSpecialListings = await pb.collection('listings').getFullList({
      filter: `(locationCategoryId="homeland_war" || locationCategoryId="national_parks") && status="active"`,
      requestKey: null
    });
  } catch (e) {
    // ignore
  }

  let allBlogs = [];
  try {
    allBlogs = await pb.collection('blogs').getFullList({
      sort: '-created',
      requestKey: null
    });
  } catch (e) {
    // ignore
  }

  return (
    <CityClient 
      city={city} 
      cityListings={cityListings} 
      globalSpecialListings={globalSpecialListings}
      allBlogs={allBlogs}
    />
  );
}
