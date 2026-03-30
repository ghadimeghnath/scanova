

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "*.ngrok-free.dev",
    "localhost:3000",
  ],

  async headers() {
    return [
      {
        // MindAR keychain route — needs COEP for module imports from CDN
        source: "/ar/:path*",
        headers: [
          { key: "Permissions-Policy",        value: "camera=*" },
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