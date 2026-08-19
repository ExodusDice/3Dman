import { withSentryConfig } from '@sentry/nextjs';

const isStaticExport = process.env.STATIC_EXPORT === 'true' || Boolean(process.env.GITHUB_ACTIONS);
const basePath = isStaticExport ? '/3dman' : (process.env.NEXT_PUBLIC_BASE_PATH || '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: isStaticExport ? 'export' : undefined,
  basePath: basePath,
  assetPrefix: basePath,
  trailingSlash: isStaticExport ? true : false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: '3dman-thailand',
  project: '3dman-web',
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
});
