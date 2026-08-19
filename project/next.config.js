/** @type {import('next').NextConfig} */
const nextConfig = {
  // تم إزالة output: 'export' للسماح بتشغيل السيرفر الديناميكي وتفادي مشاكل الكاش والـ Chunks
  typescript: {
    ignoreBuildErrors: true, // يتجاوز أخطاء TypeScript لتسريع عملية البناء
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true 
  },
};

module.exports = nextConfig;
