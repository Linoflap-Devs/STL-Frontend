import type { NextConfig } from "next";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/email-verification',
        destination: '/Auth/email-verification',
      },
      {
        source: '/forgot-password',
        destination: '/Auth/forgot-password',
      },
      {
        source: '/password-reset',
        destination: '/Auth/password-reset',
      },
      {
        source: '/set-password',
        destination: '/Auth/set-password',
      },
      {
        source: '/executives',
        destination: '/Protected/executives',
      },
      {
        source: '/managers',
        destination: '/Protected/managers',
      },
    ];
  },
};

export default nextConfig;
