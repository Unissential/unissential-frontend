/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com'],
  },
};

module.exports = nextConfig;
