// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
// };

// export default nextConfig;

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  // async headers() {
  //   return [
  //     {
  //       // Define the source(s) to apply these headers to.
  //       // For example, '/api/:path*' will match all API routes.
  //       source: "/api/:path*",
  //       headers: [
  //         { key: "Access-Control-Allow-Credentials", value: "true" },
  //         // Replace with your allowed origin(s), or '*' for all (use with caution).
  //         { key: "Access-Control-Allow-Origin", value: "https://your-frontend-domain.com" },
  //         { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
  //         { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
  //       ],
  //     },
  //   ];
  // },
};

module.exports = nextConfig;