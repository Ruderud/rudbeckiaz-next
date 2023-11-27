const withTwin = require('./withTwin.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.rudbeckiaz.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'rudbeckiaz-main-asset.s3.amazonaws.com',
        port: '',
        pathname: '*',
      },
    ],
  },
  experimental: {
    turbo: {},
  },
};

module.exports = nextConfig;
