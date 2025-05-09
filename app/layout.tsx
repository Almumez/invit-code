import './globals.css';
import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import { ReactNode } from 'react'
import ThemeRegistry from '@/components/ThemeRegistry'

const tajawal = Tajawal({ 
  subsets: ['arabic'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  display: 'swap'
});

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
    <html lang="ar" dir="rtl">
      <body className={tajawal.className}>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
