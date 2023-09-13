/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    removeConsole: true,
  },
  output: 'export',
};

module.exports = nextConfig;
