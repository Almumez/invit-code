import { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { LayoutGrid, Code2, HomeIcon, Settings } from 'lucide-react'

export default function DashboardLayout({
  children
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animated-gradient overflow-hidden">
      {/* تأثيرات زخرفية في الخلفية */}
      <div className="absolute inset-0 overflow-hidden z-0 opacity-50">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="flex min-h-screen relative z-10">
        {/* Sidebar */}
        <div className="hidden w-72 glass-effect border-l border-white/20 md:flex flex-col">
          <div className="p-6 border-b border-white/10">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <LayoutGrid className="h-6 w-6 ml-2 text-purple-300" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300">
                لوحة التحكم
              </span>
            </h1>
          </div>
          <div className="flex-1 py-8">
            <nav className="px-4 space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-all group"
              >
                <Code2 className="h-5 w-5 ml-3 text-purple-300 group-hover:scale-110 transition-transform" />
                <span>رموز الدعوة</span>
              </Link>
              <Link
                href="/"
                className="flex items-center px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-all group"
              >
                <HomeIcon className="h-5 w-5 ml-3 text-purple-300 group-hover:scale-110 transition-transform" />
                <span>الصفحة الرئيسية</span>
              </Link>
              <div className="flex items-center px-4 py-3 text-white/50 rounded-lg">
                <Settings className="h-5 w-5 ml-3 text-purple-300/50" />
                <span>الإعدادات</span>
              </div>
            </nav>
          </div>
          <div className="p-4 mt-auto border-t border-white/10">
            <div className="text-xs text-white/50 text-center">
              نظام رموز الدعوة v1.0
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile header */}
          <header className="md:hidden glass-effect p-4 border-b border-white/20 sticky top-0 z-50">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-medium text-white flex items-center">
                <LayoutGrid className="h-5 w-5 ml-2 text-purple-300" />
                <span>لوحة التحكم</span>
              </h1>
              <nav className="flex space-x-6">
                <Link href="/" className="text-white hover:text-purple-300 transition-colors">
                  <HomeIcon className="h-5 w-5" />
                </Link>
                <Link href="/dashboard" className="text-white hover:text-purple-300 transition-colors">
                  <Code2 className="h-5 w-5" />
                </Link>
              </nav>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
} 