// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org', pathname: '/t/p/**' },
    ],
    unoptimized: true,
  },
  experimental: { optimizePackageImports: ['lucide-react'] },
  devIndicators: false,
};

export default nextConfig;