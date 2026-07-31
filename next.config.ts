
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
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8090',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8090',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'app.croatiabest.com.hr',
        port: '',
        pathname: '/**',
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
        source: '/magazin/:slug*',
        destination: '/blog/:slug*',
      },
      {
        source: '/vijesti/:slug*',
        destination: '/vijesti/:slug*', // Already named vijesti, just map for consistency
      },
      {
        source: '/news/:slug*',
        destination: '/vijesti/:slug*', // EN mapping to actual file path
      },
      {
        source: '/o-nama',
        destination: '/about',
      },
    ];
  },
};

export default nextConfig;
