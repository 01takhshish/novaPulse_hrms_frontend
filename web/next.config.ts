import type { NextConfig } from "next";

/**
 * Static marketing site, so the CSP is a fixed header rather than a per-request
 * nonce (a nonce would force every route to render dynamically). `unsafe-inline`
 * on script-src is required by Next's hydration bootstrap; the value here still
 * blocks third-party script injection, framing, and plugin content.
 */
const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  // React's dev build needs eval(), and the dev server needs a websocket for
  // HMR. Neither is permitted in production.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: http://localhost:* http://127.0.0.1:*" : ""}`,
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  // Would rewrite http://127.0.0.1 and the HMR websocket to https during
  // local development.
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // Next 16 rejects dev asset requests from origins it was not started on.
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // The legacy site served these paths; keep old links and any indexed
      // search results pointing at the new routes.
      { source: "/products.html", destination: "/products", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/privacy-policy.html", destination: "/privacy-policy", permanent: true },
      { source: "/terms-conditions.html", destination: "/terms-conditions", permanent: true },
    ];
  },
};

export default nextConfig;
