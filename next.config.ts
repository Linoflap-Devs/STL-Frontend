import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        destination: '/Protected/users/executive',
      },
      {
        source: '/managers',
        destination: '/Protected/users/managers',
      },
      {
        source: '/betting-summary',
        destination: '/Protected/betting-summary',
      },
      {
        source: '/draw-summary',
        destination: '/Protected/draw-summary',
      },
      {
        source: '/dashboard',
        destination: '/Protected/dashboard',
      },
      {
        source: '/operators',
        destination: '/Protected/operators',
      },
      {
        source: '/draw-selected',
        destination: '/Protected/draw-selected',
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;