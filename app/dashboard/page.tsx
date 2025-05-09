'use client'

import { useState, useEffect } from 'react'
import { useInviteStore } from '@/lib/store/invite-store'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { format } from 'date-fns'
import { arSA } from 'date-fns/locale'
import { 
  TicketIcon, 
  LoaderIcon, 
  BarChart4,
  Users,
  ShoppingBag,
  MoreVertical,
  ArrowRightIcon,
} from 'lucide-react'

export default function DashboardPage() {
  const { inviteCodes, isLoading, fetchInviteCodes } = useInviteStore()
  
  useEffect(() => {
    fetchInviteCodes()
  }, [fetchInviteCodes])

  // إحصائيات للرموز
  const totalCodes = inviteCodes.length
  const activeCodes = inviteCodes.filter(code => code.isActive).length
  const scannedCodes = inviteCodes.filter(code => !code.isActive).length
  
  return (
    <div className="space-y-8">
      {/* Header & Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="materio-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-dashboard-text-muted text-sm font-medium mb-1">إجمالي الرموز</div>
                <div className="text-3xl font-bold text-dashboard-text mb-2">
                  {totalCodes}
                </div>
                <div className="text-xs text-dashboard-text-muted">
                  <span className="text-green-500">+{activeCodes}</span> نشطة،{' '}
                  <span className="text-blue-500">{scannedCodes}</span> مستخدمة
                </div>
              </div>
              <div className="materio-gradient-primary w-12 h-12 rounded-lg flex items-center justify-center shadow-sm">
                <TicketIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="materio-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-dashboard-text-muted text-sm font-medium mb-1">المستخدمين</div>
                <div className="text-3xl font-bold text-dashboard-text mb-2">
                  18
                </div>
                <div className="text-xs text-dashboard-text-muted">
                  <span className="text-green-500">+4</span> هذا الأسبوع
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center shadow-sm">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="materio-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-dashboard-text-muted text-sm font-medium mb-1">معدل الاستخدام</div>
                <div className="text-3xl font-bold text-dashboard-text mb-2">
                  {scannedCodes > 0 ? Math.round((scannedCodes / totalCodes) * 100) : 0}%
                </div>
                <div className="text-xs text-dashboard-text-muted">
                  معدل الاستخدام اليومي
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 w-12 h-12 rounded-lg flex items-center justify-center shadow-sm">
                <BarChart4 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="materio-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-dashboard-text-muted text-sm font-medium mb-1">الطلبات</div>
                <div className="text-3xl font-bold text-dashboard-text mb-2">
                  36
                </div>
                <div className="text-xs text-dashboard-text-muted">
                  <span className="text-green-500">+12</span> هذا الشهر
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-400 w-12 h-12 rounded-lg flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-sm border-dashboard-border">
            <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-0">
              <CardTitle className="text-lg font-semibold text-dashboard-text">إحصائيات الاستخدام</CardTitle>
              <button>
                <MoreVertical className="h-5 w-5 text-dashboard-text-muted" />
              </button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative h-64">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoaderIcon className="h-8 w-8 animate-spin text-primary-500" />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-dashboard-text-muted">
                    <div className="text-center">
                      <BarChart4 className="h-16 w-16 mx-auto mb-4 text-primary-100" />
                      <p className="text-lg font-medium">إحصائيات الاستخدام</p>
                      <p className="text-sm">سيتم عرض الرسم البياني قريبًا</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="bg-white shadow-sm border-dashboard-border h-full">
            <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-0">
              <CardTitle className="text-lg font-semibold text-dashboard-text">أحدث النشاطات</CardTitle>
              <button className="text-primary-500 text-sm font-medium">
                عرض الكل
              </button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center p-3 border-b border-dashboard-border hover:bg-dashboard-bg rounded-lg transition-colors">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                    <span className="text-primary-500 font-medium">ع م</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-dashboard-text">تم استخدام الرمز ABC123</div>
                    <div className="text-xs text-dashboard-text-muted">منذ 2 ساعة</div>
                  </div>
                  <div className="text-dashboard-text-muted">
                    <ArrowRightIcon className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-center p-3 border-b border-dashboard-border hover:bg-dashboard-bg rounded-lg transition-colors">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <span className="text-green-500 font-medium">س ن</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-dashboard-text">تم إنشاء رمز جديد XYZ789</div>
                    <div className="text-xs text-dashboard-text-muted">منذ 5 ساعات</div>
                  </div>
                  <div className="text-dashboard-text-muted">
                    <ArrowRightIcon className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-center p-3 hover:bg-dashboard-bg rounded-lg transition-colors">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                    <span className="text-red-500 font-medium">م ك</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-dashboard-text">تم حذف الرمز DEF456</div>
                    <div className="text-xs text-dashboard-text-muted">منذ يوم واحد</div>
                  </div>
                  <div className="text-dashboard-text-muted">
                    <ArrowRightIcon className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 