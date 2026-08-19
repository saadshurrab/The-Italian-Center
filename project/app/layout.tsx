import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'المركز الإيطالي للبصريات | نظام الإدارة',
  description: 'نظام إدارة شامل للمركز الإيطالي للبصريات',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* إعادة تحميل الصفحة تلقائياً إذا فشل المتصفح في جلب Chunk قديم بعد الرفع */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e.message && e.message.includes('Loading chunk')) {
                  window.location.reload();
                }
              }, true);
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
