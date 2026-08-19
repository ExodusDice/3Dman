import { withSentryConfig } from '@sentry/nextjs';

const isStaticExport = process.env.STATIC_EXPORT === 'true' || Boolean(process.env.GITHUB_ACTIONS);
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (isStaticExport ? '/3dman' : '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: isStaticExport ? 'export' : undefined,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  typescript: {
    // Prevent build failures on CI
    ignoreBuildErrors: true,
  },
  eslint: {
    // Prevent build failures on CI
    ignoreDuringBuilds: true,
  },
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

const sentryOptions = {
  org: '3dman-thailand',
  project: '3dman-web',
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
};

export default process.env.SENTRY_AUTH_TOKEN
  ? withSentryConfig(nextConfig, sentryOptions)
  : nextConfig;
