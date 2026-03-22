// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // Comprehensive CORS and security headers for AR experiences
//   async headers() {
//     return [
//       {
//         // MindAR AR viewer with proper permissions
//         source: "/ar/:path*",
//         headers: [
//           { key: "Permissions-Policy", value: "camera=(self), xr-spatial-tracking=(self), microphone=()" },
//           { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
//           { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
//           { key: "X-Content-Type-Options", value: "nosniff" },
//           { key: "X-Frame-Options", value: "SAMEORIGIN" },
//         ],
//       },
//       {
//         // Sticker AR viewer - relaxed CORS for CDN assets
//         source: "/sticker/:path*",
//         headers: [
//           { key: "Permissions-Policy", value: "camera=(self), microphone=()" },
//           { key: "X-Content-Type-Options", value: "nosniff" },
//           { key: "X-Frame-Options", value: "SAMEORIGIN" },
//         ],
//       },
//       {
//         // Admin dashboard security
//         source: "/admin/:path*",
//         headers: [
//           { key: "X-Content-Type-Options", value: "nosniff" },
//           { key: "X-Frame-Options", value: "DENY" },
//           { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, proxy-revalidate" },
//         ],
//       },
//     ];
//   },

//   images: {
//     remotePatterns: [
//       { protocol: "https", hostname: "res.cloudinary.com" },
//       { protocol: "https", hostname: "upload.wikimedia.org" },
//       { protocol: "https", hostname: "cdn.jsdelivr.net" },
//     ],
//   },

//   // Optimize for production
//   productionBrowserSourceMaps: false,
//   compress: true,
//   swcMinify: true,
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "*.ngrok-free.dev",
    "localhost:3000",
  ],

  async headers() {
    return [
      {
        // WebXR keychain route — needs COEP for SharedArrayBuffer
        source: "/ar/:path*",
        headers: [
          { key: "Permissions-Policy",        value: "camera=*, xr-spatial-tracking=*, microphone=()" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Opener-Policy",   value: "same-origin" },
        ],
      },
      {
        // MindAR sticker route — NO COEP (CDN scripts lack CORP headers)
        // NO COOP either — iframe postMessage needs relaxed origin policy
        source: "/sticker/:path*",
        headers: [
          { key: "Permissions-Policy", value: "camera=*, microphone=()" },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
};

export default nextConfig;