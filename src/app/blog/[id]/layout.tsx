import type { Metadata } from 'next';
import PocketBase from 'pocketbase';
import { generateArticleSchema } from '@/app/lib/seo-helpers';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

export default async function BlogLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  let schemaJson = null;
  if (id) {
    try {
      let article;
      try {
        article = await pb.collection('blogs').getOne(id, { requestKey: null });
      } catch (e) {
        article = await pb.collection('blogs').getFirstListItem(`slug="${id}"`, { requestKey: null });
      }
      const schemaObj = generateArticleSchema(article);
      schemaJson = JSON.stringify(schemaObj);
    } catch (error) {
      console.error('Schema generation error:', error);
    }
  }

  return (
    <>
      {schemaJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaJson }}
        />
      )}
      {children}
    </>
  );
}
