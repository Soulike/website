import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE_BUNDLE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
    reactStrictMode: true,
    distDir: 'build',
    async rewrites() {
        return process.env.NODE_ENV === 'development'
            ? [
                  {
                      source: '/server/:path*',
                      destination: 'https://admin.soulike.tech/server/:path*',
                  },
              ]
            : [];
    },
});

export default nextConfig;
