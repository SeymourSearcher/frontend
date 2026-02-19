import type { NextConfig } from "next";

// Build-time API URL for CSP connect-src (same-origin + API backend)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const connectSrc = ["'self'", API_URL].filter(Boolean).join(" ");

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    optimizeCss: {
      inlineFonts: true,
    },
  },
  async headers() {
    const securityHeaders = [
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https:",
          "font-src 'self' data:",
          `connect-src ${connectSrc}`,
          "frame-ancestors 'self'",
          "base-uri 'self'",
          "form-action 'self'",
          "object-src 'none'",
        ].join("; "),
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      },
      {
        key: 'Cross-Origin-Opener-Policy',
        value: 'same-origin',
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
    ];

    return [
      {
        source: '/fonts/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
