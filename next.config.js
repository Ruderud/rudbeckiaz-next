const withTwin = require('./withTwin.js');

/** @type {import('next').NextConfig} */
const nextConfig = withTwin({
  reactStrictMode: false,
  compiler: {
    // removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  output: 'export',
  images: {
    unoptimized: true,
  },
});

module.exports = nextConfig;
