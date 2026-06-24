import PocketBase from 'pocketbase';
import IslandClient from './IslandClient';
import { notFound } from 'next/navigation';

export default async function IslandPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const pb = new PocketBase('http://127.0.0.1:8090');
  
  let island;
  try {
    island = await pb.collection('islands').getFirstListItem(`slug="${resolvedParams.slug}"`, { requestKey: null });
  } catch (e) {
    return notFound();
  }

  let listings = [];
  try {
    listings = await pb.collection('listings').getFullList({
      filter: `city="${island.name}" && status="active"`,
      sort: '-created',
      requestKey: null
    });
  } catch (e) {
    // ignore
  }

  return <IslandClient island={island} listings={listings} />;
}
