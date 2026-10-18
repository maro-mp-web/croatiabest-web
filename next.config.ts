
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/dodaj-objekt',
        destination: '/submit',
      },
      {
        source: '/istrazi',
        destination: '/explore',
      },
      {
        source: '/gradovi',
        destination: '/cities',
      },
      {
        source: '/gradovi/:slug*',
        destination: '/cities/:slug*',
      },
      {
        source: '/otoci',
        destination: '/islands',
      },
      {
        source: '/otoci/:slug*',
        destination: '/islands/:slug*',
      },
      {
        source: '/magazin',
        destination: '/blog',
      },
      {
        source: '/magazin/:slug*',
        destination: '/blog/:slug*',
      },
      {
        source: '/objekt/:slug*',
        destination: '/listing/:slug*',
      },
      {
        source: '/news',
        destination: '/vijesti',
      },
      {
        source: '/news/:slug*',
        destination: '/vijesti/:slug*',
      },
      {
        source: '/o-nama',
        destination: '/about',
      },
      {
        source: '/en/cities',
        destination: '/cities',
      },
      {
        source: '/en/cities/:slug*',
        destination: '/cities/:slug*',
      },
      {
        source: '/en/gradovi',
        destination: '/cities',
      },
      {
        source: '/en/gradovi/:slug*',
        destination: '/cities/:slug*',
      },
      {
        source: '/en/islands',
        destination: '/islands',
      },
      {
        source: '/en/islands/:slug*',
        destination: '/islands/:slug*',
      },
      {
        source: '/en/otoci',
        destination: '/islands',
      },
      {
        source: '/en/otoci/:slug*',
        destination: '/islands/:slug*',
      },
      {
        source: '/en/explore',
        destination: '/explore',
      },
      {
        source: '/en/about',
        destination: '/about',
      },
      {
        source: '/en/blog/:slug*',
        destination: '/blog/:slug*',
      },
      {
        source: '/en/news/:slug*',
        destination: '/vijesti/:slug*',
      },
    ];
  },
};

export default nextConfig;
