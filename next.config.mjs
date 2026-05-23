/** @type {import('next').NextConfig} */

const nextConfig = {
  trailingSlash: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '3000' },
      { protocol: 'https', hostname: 'localhost', port: '3000' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'gmr-teal.vercel.app' },
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
