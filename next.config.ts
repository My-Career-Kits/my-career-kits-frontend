import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   transpilePackages: ["geist"],
// };

// export default nextConfig;
// const nextConfig = {
//   output: "standalone",
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
//       },
//     ];
//   },
// };

// export default nextConfig;



// const nextConfig = {
//   output: "standalone",
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: `${process.env.API_URL}/api/:path*`,
//       },
//     ];
//   },
// };

// export default nextConfig;


// const nextConfig = {
//   output: "standalone",
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: "http://localhost:8000/api/:path*",
//       },
//     ];
//   },
// };

// export default nextConfig;



// const nextConfig = {
//   output: "standalone",
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*/",
//         destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*/`,
//       },
//       {
//         source: "/api/:path*",
//         destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*/`,
//       },
//     ];
//   },
//   async headers() {
//     return [
//       {
//         source: "/api/:path*",
//         headers: [
//           { key: "Access-Control-Allow-Credentials", value: "true" },
//           { key: "Access-Control-Allow-Origin", value: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000" },
//         ],
//       },
//     ];
//   },
// };
// export default nextConfig;



// const nextConfig = {
//   output: "standalone",
//   skipTrailingSlashRedirect: true,
// };


// module.exports = {
//   allowedDevOrigins: ['192.168.1.3'],
//   skipTrailingSlashRedirect: true,
// }

// export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
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


