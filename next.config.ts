import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Content Security Policy.
 *
 * `script-src` has to keep `'unsafe-inline'`. Next.js streams the RSC payload
 * to the client as inline `self.__next_f.push(...)` scripts, and the only way
 * to nonce those is middleware that stamps a fresh nonce per request — which
 * makes every page dynamic and throws away the fully prerendered HTML this
 * site is built on. The trade is deliberate: there is no user input anywhere
 * on the site, no third-party script, no analytics and no external origin, so
 * the injection surface an inline-script allowance would widen is empty.
 *
 * Everything else is locked to `'self'`. `next/font` self-hosts the Google
 * fonts at build time, so no font or connection ever leaves the origin.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "manifest-src 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  // `unsafe-eval` is the dev overlay and React Refresh only
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  // websockets are HMR in dev; production talks to nothing
  `connect-src 'self'${isDev ? ' ws: wss:' : ''}`,
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value:
      'accelerometer=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(), geolocation=(), gyroscope=(), microphone=(), midi=(), payment=(), usb=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* the server advertises nothing about what it runs on */
  poweredByHeader: false,

  async redirects() {
    return [{ source: '/', destination: '/en', permanent: false }];
  },

  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        /*
         * The scans never change in place — a better scan arrives under a new
         * entry in src/content/site.ts — so the originals behind the CSS
         * `background-image` and the optimiser can sit in cache for a year.
         */
        source: '/archive/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/logo.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=2592000',
          },
        ],
      },
    ];
  },

  images: {
    /*
     * The archival scans top out at 1290px wide, so there is no point
     * generating 2048/3840 variants — they would only upscale mush.
     */
    /* the scans are already soft, so they are encoded well above the default 75 */
    qualities: [75, 80, 88, 92, 95, 100],
    deviceSizes: [360, 420, 640, 750, 828, 1080, 1200, 1440],
    imageSizes: [96, 160, 231, 256, 384, 526, 651, 720],
    formats: ['image/avif', 'image/webp'],
    /* same reasoning as the header above: the sources are immutable */
    minimumCacheTTL: 31536000,
    /* SVG never reaches the optimiser, so keep it off entirely */
    dangerouslyAllowSVG: false,
  },
};

export default nextConfig;
