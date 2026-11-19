import type { NextConfig } from "next";

// Build-time API URL for CSP connect-src (same-origin + API backend)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const connectSrc = ["'self'", API_URL].filter(Boolean).join(" ");

const FRONTEND_URL = new URL(process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000");

// Events and SDK scripts go through the /ingest proxy; only the toolbar talks to these hosts directly.
const POSTHOG_ORIGINS = "https://eu.posthog.com https://eu-assets.i.posthog.com";

const nextConfig: NextConfig = {
  output: 'standalone',
  // PostHog's API paths end in a slash; Next's redirect would break the proxied requests.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: 'https://eu-assets.i.posthog.com/static/:path*' },
      { source: '/ingest/:path*', destination: 'https://eu.i.posthog.com/:path*' },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: `www.${FRONTEND_URL.hostname}` }],
        destination: `${FRONTEND_URL.origin}/:path*`,
        permanent: true,
      },
    ];
  },
  async headers() {
    const securityHeaders = [
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${POSTHOG_ORIGINS}`,
          `style-src 'self' 'unsafe-inline' ${POSTHOG_ORIGINS}`,
          "img-src 'self' data: blob: https:",
          `font-src 'self' data: ${POSTHOG_ORIGINS}`,
          `connect-src ${connectSrc} ${POSTHOG_ORIGINS}`,
          "worker-src 'self' blob: data:",
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
