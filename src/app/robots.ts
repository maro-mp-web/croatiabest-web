import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/admin/', '/api/'],
    },
    sitemap: 'https://croatiabest.com.hr/sitemap.xml',
  };
}
