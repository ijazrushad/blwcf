import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: '/', destination: '/en', permanent: false }];
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
  },
};

export default nextConfig;
