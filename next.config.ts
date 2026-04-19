import type { NextConfig } from "next";
import { defaultLocale } from "./lib/i18n/messages";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'artwork.captivate.fm' },
    ],
  },
  async redirects() {
    return [
      { source: '/', destination: `/${defaultLocale}`, permanent: false },
    ];
  },
};

export default nextConfig;
