import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE_BUNDLE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfigBase = {
    reactStrictMode: true,
    distDir: 'build',
    images: {
        unoptimized: true,
    },
};

/** @type {import('next').NextConfig} */
const nextConfigProduction = {
    ...nextConfigBase,
};

/** @type {import('next').NextConfig} */
const nextConfigDev = {
    ...nextConfigBase,
    rewrites: async () => [
        {
            source: '/server/:path*',
            destination: 'https://admin.soulike.tech/server/:path*',
        },
    ],
};

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer(
    process.env.NODE_ENV === 'development'
        ? nextConfigDev
        : nextConfigProduction,
);

export default nextConfig;
