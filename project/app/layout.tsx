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
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
