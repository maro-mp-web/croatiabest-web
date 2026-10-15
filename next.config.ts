
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
        source: '/gradovi/:slug*',
        destination: '/cities/:slug*',
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
    ];
  },
};

export default nextConfig;
