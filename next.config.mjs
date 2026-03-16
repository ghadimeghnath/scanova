/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "rhoda-intersoluble-leftwardly.ngrok-free.dev",
    "localhost:3000"
  ],

  // ── CRITICAL: Allow camera for WebXR AR ──────────────────────────────
  async headers() {
    return [
      {
        source: "/ar/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: "camera=*, xr-spatial-tracking=*, microphone=()",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;