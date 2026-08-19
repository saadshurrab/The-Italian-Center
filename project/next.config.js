/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ينشئ مجلد out تلقائياً عند البناء
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true 
  },
};

module.exports = nextConfig;
