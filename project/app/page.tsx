'use client';

import dynamic from 'next/dynamic';

// تحميل المكون ديناميكياً مع إيقاف الـ Server-Side Rendering
// لضمان عدم حدوث أي تعارض مع خصائص المتصفح أثناء مرحلة البناء على Render
const AppShell = dynamic(
  () => import('@/components/app-shell').then((mod) => mod.AppShell),
  { ssr: false }
);

export default function Home() {
  return <AppShell />;
}
