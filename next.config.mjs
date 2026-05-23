/** @type {import('next').NextConfig} */

const nextConfig = {
  trailingSlash: true,
  eslint: { 
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '3000' },
      { protocol: 'https', hostname: 'localhost', port: '3000' }, 
    ],
  },
  async redirects() {
    return [
      {
        source: '/app/gmr',
        destination: '/gmr',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
