import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const disallowedPaths = [
    '/dashboard/',
    '/admin/',
    '/api/',
    '/*?*q=*',
    '/*?*category=*',
    '/*{search_term_string}*',
    '/explore?*',
    '/istrazi?*',
    '/en/explore?*',
  ];

  return {
    rules: [
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: disallowedPaths,
      },
      {
        userAgent: [
          'Googlebot',
          'Googlebot-Image',
          'Googlebot-News',
          'Google-InspectionTool',
          'Storebot-Google',
          'AdsBot-Google',
          'Mediapartners-Google',
        ],
        allow: '/',
        disallow: disallowedPaths,
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowedPaths,
      },
    ],
    sitemap: 'https://croatiabest.com.hr/sitemap.xml',
  };
}
