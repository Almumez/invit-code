'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/store/auth-store'
import { 
  Home, 
  LogOut,
  Search,
  Bell, 
  Clock,
  TicketIcon,
  Globe,
  QrCode
} from 'lucide-react'

export default function DashboardLayout({
  children
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuthStore()
  
  const handleLogout = () => {
    logout()
    
    // استخدام router.replace بدلاً من router.push لضمان الانتقال بشكل صحيح
    router.replace('/login')
    
    // خطة بديلة إذا فشل router.replace
    setTimeout(() => {
      if (!window.location.pathname.includes('/login')) {
        window.location.replace('/login')
      }
    }, 300)
  }

  return (
    <div className="min-h-screen bg-dashboard-bg text-dashboard-text">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex h-screen sticky top-0 flex-col w-64 bg-dashboard-sidebar border-r border-dashboard-border shadow-md">
          <div className="p-5 flex items-center gap-2">
            <div className="bg-gradient-to-r from-primary-500 to-primary-700 w-9 h-9 rounded-md flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-xl text-primary-600">MATERIO</span>
            <div className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-md font-medium shadow-sm">FREE</div>
          </div>
          
          <div className="p-3 mt-2">
            <div className="bg-white mx-2 p-2.5 rounded-lg flex items-center shadow-sm border border-dashboard-border">
              <Search className="h-4 w-4 text-dashboard-text-muted mr-2" />
              <input 
                type="text" 
                placeholder="بحث..." 
                className="bg-transparent w-full text-sm outline-none border-none text-dashboard-text placeholder:text-dashboard-text-muted"
              />
            </div>
          </div>
          
          <div className="flex-1 py-4 px-3">
            <div className="flex flex-col space-y-1.5">
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-dashboard-text transition-colors group",
                  pathname === "/dashboard" 
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-sm" 
                    : "hover:bg-dashboard-bg"
                )}
              >
                <Home className={cn(
                  "h-5 w-5 ml-3", 
                  pathname === "/dashboard" 
                    ? "text-white" 
                    : "text-dashboard-text-muted group-hover:text-primary-500 transition-colors"
                )} />
                <span>لوحة التحكم</span>
              </Link>
              
              <Link
                href="/dashboard/codes"
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-dashboard-text transition-colors group",
                  pathname === "/dashboard/codes" 
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-sm" 
                    : "hover:bg-dashboard-bg"
                )}
              >
                <QrCode className={cn(
                  "h-5 w-5 ml-3", 
                  pathname === "/dashboard/codes" 
                    ? "text-white" 
                    : "text-dashboard-text-muted group-hover:text-primary-500 transition-colors"
                )} />
                <span>إدارة رموز الدعوة</span>
              </Link>
              
              <Link
                href="/dashboard/generate"
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-dashboard-text transition-colors group",
                  pathname === "/dashboard/generate" 
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-sm" 
                    : "hover:bg-dashboard-bg"
                )}
              >
                <TicketIcon className={cn(
                  "h-5 w-5 ml-3", 
                  pathname === "/dashboard/generate" 
                    ? "text-white" 
                    : "text-dashboard-text-muted group-hover:text-primary-500 transition-colors"
                )} />
                <span>توليد رموز الدعوة</span>
              </Link>
              
              <Link
                href="/?from_dashboard=true"
                target="_blank"
                className="flex items-center px-3 py-2.5 rounded-lg text-dashboard-text hover:bg-dashboard-bg transition-colors group"
              >
                <Globe className="h-5 w-5 ml-3 text-dashboard-text-muted group-hover:text-green-500 transition-colors" />
                <span className="group-hover:text-green-500 transition-colors">زيارة الموقع</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2.5 rounded-lg text-dashboard-text hover:bg-dashboard-bg transition-colors group w-full text-right"
              >
                <LogOut className="h-5 w-5 ml-3 text-dashboard-text-muted group-hover:text-red-500 transition-colors" />
                <span className="group-hover:text-red-500 transition-colors">تسجيل الخروج</span>
              </button>
            </div>
          </div>

          {/* Developer Info */}
          <div className="mt-auto p-4 border-t border-dashboard-border">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-center mb-3">
                <div className="h-12 w-12 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-sm border-2 border-primary-200">
                  <span className="text-primary-600 font-bold text-xl">A</span>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-medium text-dashboard-text">تطوير وتصميم</h4>
                <p className="text-sm text-dashboard-text-muted mb-3">عبدالخالق الحرازي</p>
                <a 
                  href="https://protfilo-xi.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-primary-200 text-sm text-primary-600 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-colors shadow-sm"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>بوابة التواصل</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Topbar */}
          <header className="h-16 bg-white border-b border-dashboard-border flex items-center justify-between px-6 shadow-md">
            <div>
              {/* Mobile Menu Button (if needed) */}
            </div>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <button className="text-dashboard-text-muted hover:text-primary-500 p-2 rounded-full hover:bg-primary-50/50 transition-colors">
                <Clock className="w-5 h-5" />
              </button>
              <button className="text-dashboard-text-muted hover:text-primary-500 p-2 rounded-full hover:bg-primary-50/50 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 bg-red-500 w-2 h-2 rounded-full"></span>
              </button>
              <div className="h-10 w-10 bg-primary-50 rounded-full overflow-hidden flex items-center justify-center shadow-sm border border-primary-200">
                <span className="text-primary-600 font-semibold text-sm">AD</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-dashboard-text-muted hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
} 