import {env} from 'node:process';

import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from 'next/constants.js';

/** @type {import('next').NextConfig} */
const nextConfigProduction = {
  reactStrictMode: true,
  distDir: 'build',
  compiler: {
    styledComponents: true,
  },
};

export default async (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    /** @type {import('next').NextConfig} */
    const nextConfigDev = {
      ...nextConfigProduction,
      rewrites: async () => [
        {
          source: '/server/:path*',
          destination: 'https://soulike.tech/server/:path*',
        },
      ],
    };
    return nextConfigDev;
  } else if (phase === PHASE_PRODUCTION_BUILD) {
    if (env.ANALYZE_BUNDLE) {
      const {default: bundleAnalyzer} = await import('@next/bundle-analyzer');
      const withBundleAnalyzer = bundleAnalyzer({
        enabled: true,
      });
      return withBundleAnalyzer(nextConfigProduction);
    }
  }

  return nextConfigProduction;
};
