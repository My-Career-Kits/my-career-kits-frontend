import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  turbopack: {
    root: __dirname,
  },
  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,
  allowedDevOrigins: ['192.168.1.3'],
};

export default nextConfig;