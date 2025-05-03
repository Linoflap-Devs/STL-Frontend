import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
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
        source: '/betting-summary/:path',
        destination: '/Protected/betting-summary/:path', 
      },
      {
        source: '/bets-comparisons',
        destination: '/Protected/betting-comparisons', 
      },
      {
        source: '/draw-summary',
        destination: '/Protected/draw-summary',
      },
      {
        source: '/draw-summary/:path',
        destination: '/Protected/draw-summary/:path'
      },
      {
        source: '/winning-summary/:path',
        destination: '/Protected/winning-summary/:path',
      },
      {
        source: '/wins-comparisons',
        destination: '/Protected/winning-comparisons', 
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
};

export default nextConfig;