'use client'

import { useState, useEffect } from 'react'
import { useInviteStore } from '@/lib/store/invite-store'
import { useVisitStore } from '@/lib/store/visit-store'
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
  MoreVertical,
  ArrowRightIcon,
  Globe
} from 'lucide-react'

export default function DashboardPage() {
  const { inviteCodes, isLoading: isLoadingInvites, fetchInviteCodes } = useInviteStore()
  const { stats, isLoading: isLoadingVisits, fetchVisitStats } = useVisitStore()
  
  useEffect(() => {
    fetchInviteCodes()
    fetchVisitStats()
  }, [fetchInviteCodes, fetchVisitStats])
  
  // إحصائيات للرموز
  const totalCodes = inviteCodes.length
  const activeCodes = inviteCodes.filter(code => code.isActive).length
  const scannedCodes = inviteCodes.filter(code => !code.isActive).length
  
  // نسبة الرموز المستخدمة
  const scannedPercentage = totalCodes > 0 ? Math.round((scannedCodes / totalCodes) * 100) : 0
  const activePercentage = totalCodes > 0 ? Math.round((activeCodes / totalCodes) * 100) : 0
  
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
                  جميع الرموز في النظام
                </div>
              </div>
              <div className="materio-gradient-primary w-12 h-12 rounded-lg flex items-center justify-center shadow-sm">
                <TicketIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* كارد الرموز المتبقية */}
        <Card className="materio-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-dashboard-text-muted text-sm font-medium mb-1">الرموز المتبقية</div>
                <div className="text-3xl font-bold text-dashboard-text mb-2">
                  {activeCodes}
                </div>
                <div className="text-xs text-dashboard-text-muted">
                  <span className="text-green-500">{activePercentage}%</span> من إجمالي الرموز
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-400 w-12 h-12 rounded-lg flex items-center justify-center shadow-sm">
                <TicketIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* شريط تقدم المتبقي */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${activePercentage}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-dashboard-text-muted">
                <div>نسبة المتبقي</div>
                <div className="font-medium">{activePercentage}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* كارد الرموز التي تم مسحها */}
        <Card className="materio-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-dashboard-text-muted text-sm font-medium mb-1">الرموز المستخدمة</div>
                <div className="text-3xl font-bold text-dashboard-text mb-2">
                  {scannedCodes}
                </div>
                <div className="text-xs text-dashboard-text-muted">
                  <span className="text-blue-500">{scannedPercentage}%</span> من إجمالي الرموز
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-400 w-12 h-12 rounded-lg flex items-center justify-center shadow-sm">
                <BarChart4 className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* شريط تقدم المستخدم */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${scannedPercentage}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-dashboard-text-muted">
                <div>نسبة المسح</div>
                <div className="font-medium">{scannedPercentage}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* كارد الزيارات */}
        <Card className="materio-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-dashboard-text-muted text-sm font-medium mb-1">الزيارات</div>
                <div className="text-3xl font-bold text-dashboard-text mb-2">
                  {isLoadingVisits ? (
                    <LoaderIcon className="h-6 w-6 animate-spin text-primary-500" />
                  ) : stats.total}
                </div>
                <div className="text-xs text-dashboard-text-muted">
                  <span className="text-green-500">+{stats.today}</span> اليوم،{' '}
                  <span className="text-blue-500">{stats.weekly}</span> هذا الأسبوع
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-fuchsia-400 w-12 h-12 rounded-lg flex items-center justify-center shadow-sm">
                <Globe className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* شريط تقدم الزيارات اليوم مقارنة بالأسبوع */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-purple-500 h-2.5 rounded-full" 
                  style={{ width: `${stats.weekly ? Math.min(100, (stats.today / stats.weekly) * 100) : 0}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-dashboard-text-muted">
                <div>اليوم</div>
                <div className="font-medium">{isLoadingVisits ? '...' : stats.weekly ? Math.round((stats.today / stats.weekly) * 100) : 0}% من الأسبوع</div>
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
                {isLoadingInvites ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoaderIcon className="h-8 w-8 animate-spin text-primary-500" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-40 h-40 relative">
                      {/* دائرة رسم بياني بسيطة */}
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path 
                          className="stroke-current text-blue-100 fill-none" 
                          strokeWidth="3.8" 
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path 
                          className="stroke-current text-indigo-500 fill-none" 
                          strokeWidth="3.8" 
                          strokeDasharray={`${scannedPercentage}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <text x="18" y="20.5" className="fill-current text-dashboard-text text-lg font-medium" textAnchor="middle">
                          {scannedPercentage}%
                        </text>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-dashboard-text">{scannedPercentage}%</div>
                          <div className="text-xs text-dashboard-text-muted">تم المسح</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-8">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                          <div className="text-sm text-dashboard-text-muted">
                            تم مسحها <span className="font-medium text-dashboard-text">{scannedCodes}</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-100 mr-2"></div>
                          <div className="text-sm text-dashboard-text-muted">
                            متبقية <span className="font-medium text-dashboard-text">{activeCodes}</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-gray-200 mr-2"></div>
                          <div className="text-sm text-dashboard-text-muted">
                            المجموع <span className="font-medium text-dashboard-text">{totalCodes}</span>
                          </div>
                        </div>
                      </div>
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