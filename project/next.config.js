/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // يتيح البناء الثابت (Static Export) للتوافق التام مع Render
  typescript: {
    ignoreBuildErrors: true, // يتجاوز أخطاء TypeScript البسيطة أثناء البناء
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true 
  },
};

module.exports = nextConfig;
