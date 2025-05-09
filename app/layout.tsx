import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react'
import ThemeRegistry from '@/components/ThemeRegistry'
import { RTL } from '@/components/RTL'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Metadata
export const metadata: Metadata = {
  title: 'نظام التحقق من رموز الدعوة',
  description: 'تطبيق للتحقق من صلاحية رموز الدعوة',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className="light">
      <body className="font-sans antialiased bg-dashboard-bg">
        <RTL>
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </RTL>
      </body>
    </html>
  );
}
