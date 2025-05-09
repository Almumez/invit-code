'use client'

import { useState, useEffect } from 'react'
import { useInviteStore } from '@/lib/store/invite-store'
import { useVisitStore } from '@/lib/store/visit-store'
import { useDashboardStore } from '@/lib/store/dashboard-store'
import React from 'react'
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
import {
  ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'

export default function DashboardPage() {
  const { fetchInviteCodes } = useInviteStore()
  const { fetchVisitStats } = useVisitStore()
  const { 
    stats, 
    isLoading: isLoadingDashboard, 
    fetchDashboardStats 
  } = useDashboardStore()
  
  // استخدام useRef لمنع تكرار الاستدعاء
  const initialized = React.useRef(false);
  
  useEffect(() => {
    if (!initialized.current) {
      fetchDashboardStats()
      initialized.current = true;
    }
  }, [fetchDashboardStats])
  
  // نسبة الرموز المستخدمة
  const scannedPercentage = stats.codes.total > 0 
    ? Math.round((stats.codes.used / stats.codes.total) * 100) 
    : 0
    
  const activePercentage = stats.codes.total > 0 
    ? Math.round((stats.codes.active / stats.codes.total) * 100) 
    : 0
  
  // بيانات للمخطط الدائري
  const pieData = [
    { name: 'الرموز المستخدمة', value: stats.codes.used, color: '#4f46e5' },
    { name: 'الرموز المتبقية', value: stats.codes.active, color: '#93c5fd' }
  ]
  
  // بيانات المخطط الخطي - استخدام البيانات الحقيقية من الإحصائيات
  const weeklyData = React.useMemo(() => {
    if (stats.codes.weeklyStats.length === 0) {
      // بيانات تمثيلية في حالة عدم وجود إحصائيات
      const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      return days.map((day, index) => {
        // بيانات تمثيلية - في الواقع ستأتي من قاعدة البيانات
        const scanned = Math.floor(Math.random() * 15) + 1;
        const active = Math.floor(Math.random() * 10) + 1;
        return {
          name: day,
          'رموز مستخدمة': scanned,
          'رموز متبقية': active,
          'رموز جديدة': Math.floor(Math.random() * 5)
        };
      });
    }
    
    // استخدام البيانات الحقيقية
    return stats.codes.weeklyStats.map(day => {
      // تحويل التاريخ إلى اسم اليوم بالعربية
      const date = new Date(day.date);
      const dayName = date.toLocaleDateString('ar-SA', { weekday: 'long' });
      
      return {
        name: dayName,
        'رموز مستخدمة': day.used,
        'رموز جديدة': day.added,
        date: day.date
      };
    }).reverse(); // عكس الترتيب ليكون التاريخ الأحدث على اليمين
  }, [stats.codes.weeklyStats]);
  
  // بيانات للمخطط الشريطي - توزيع الزيارات
  const visitData = React.useMemo(() => {
    if (stats.visits.pathStats.length > 0) {
      return stats.visits.pathStats.map(item => ({
        path: item.path === '/' ? 'الرئيسية' : item.path.replace('/', ''),
        زيارات: item._count.path
      })).slice(0, 5); // أخذ أعلى 5 مسارات زيارة
    }
    // بيانات افتراضية في حالة عدم وجود بيانات
    return [
      { path: 'الرئيسية', زيارات: 45 },
      { path: 'المسح', زيارات: 30 },
      { path: 'لوحة التحكم', زيارات: 20 },
      { path: 'الملف الشخصي', زيارات: 10 },
      { path: 'الإعدادات', زيارات: 5 }
    ];
  }, [stats.visits.pathStats]);
  
  // بيانات زيارات الأيام
  const dailyVisitData = React.useMemo(() => {
    if (stats.visits.dailyVisits.length > 0) {
      return stats.visits.dailyVisits.map(day => {
        // تحويل التاريخ إلى اسم اليوم بالعربية
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('ar-SA', { weekday: 'long' });
        
        return {
          name: dayName,
          زيارات: day.visits,
          date: day.date
        };
      }).reverse(); // عكس الترتيب ليكون التاريخ الأحدث على اليمين
    }
    return [];
  }, [stats.visits.dailyVisits]);
  
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <Card className="border-0 bg-gradient-to-r from-primary-500/90 to-primary-700 text-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">مرحباً بك في لوحة التحكم</h1>
              <p className="text-white/80">
                هنا يمكنك إدارة رموز الدعوة ومتابعة الإحصائيات
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-md border-dashboard-border hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-dashboard-text-muted text-sm font-medium mb-1">إجمالي الرموز</div>
                <div className="text-3xl font-bold text-dashboard-text mb-2">
                  {isLoadingDashboard ? (
                    <LoaderIcon className="h-6 w-6 animate-spin text-primary-500" />
                  ) : stats.codes.total}
                </div>
                <div className="text-xs text-dashboard-text-muted">
                  جميع الرموز في النظام
                </div>
              </div>
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 w-12 h-12 rounded-lg flex items-center justify-center shadow-sm">
                <TicketIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* كارد الرموز المتبقية */}
        <Card className="bg-white shadow-md border-dashboard-border hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-dashboard-text-muted text-sm font-medium mb-1">الرموز المتبقية</div>
                <div className="text-3xl font-bold text-dashboard-text mb-2">
                  {isLoadingDashboard ? (
                    <LoaderIcon className="h-6 w-6 animate-spin text-primary-500" />
                  ) : stats.codes.active}
                </div>
                <div className="text-xs text-dashboard-text-muted">
                  <span className="text-green-500">{activePercentage}%</span> من إجمالي الرموز
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 w-12 h-12 rounded-lg flex items-center justify-center shadow-sm">
                <TicketIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* شريط تقدم المتبقي */}
            <div className="mt-4">
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                <div className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full" style={{ width: `${activePercentage}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-dashboard-text-muted">
                <div>نسبة المتبقي</div>
                <div className="font-medium">{activePercentage}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* كارد الرموز التي تم مسحها */}
        <Card className="bg-white shadow-md border-dashboard-border hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-dashboard-text-muted text-sm font-medium mb-1">الرموز المستخدمة</div>
                <div className="text-3xl font-bold text-dashboard-text mb-2">
                  {isLoadingDashboard ? (
                    <LoaderIcon className="h-6 w-6 animate-spin text-primary-500" />
                  ) : stats.codes.used}
                </div>
                <div className="text-xs text-dashboard-text-muted">
                  <span className="text-primary-600">{scannedPercentage}%</span> من إجمالي الرموز
                </div>
              </div>
              <div className="bg-gradient-to-r from-primary-400 to-primary-600 w-12 h-12 rounded-lg flex items-center justify-center shadow-sm">
                <BarChart4 className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* شريط تقدم المستخدم */}
            <div className="mt-4">
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                <div className="bg-gradient-to-r from-primary-400 to-primary-600 h-2.5 rounded-full" style={{ width: `${scannedPercentage}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-dashboard-text-muted">
                <div>نسبة المسح</div>
                <div className="font-medium">{scannedPercentage}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* كارد الزيارات */}
        <Card className="bg-white shadow-md border-dashboard-border hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-dashboard-text-muted text-sm font-medium mb-1">الزيارات</div>
                <div className="text-3xl font-bold text-dashboard-text mb-2">
                  {isLoadingDashboard ? (
                    <LoaderIcon className="h-6 w-6 animate-spin text-primary-500" />
                  ) : stats.visits.total}
                </div>
                <div className="text-xs text-dashboard-text-muted">
                  <span className="text-green-500">+{stats.visits.today}</span> اليوم،{' '}
                  <span className="text-primary-600">{stats.visits.week}</span> هذا الأسبوع
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center shadow-sm">
                <Globe className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* شريط تقدم الزيارات */}
            <div className="mt-4">
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-2.5 rounded-full" style={{ width: `${Math.min(stats.visits.week / (stats.visits.total || 1) * 100, 100)}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-dashboard-text-muted">
                <div>زيارات الأسبوع</div>
                <div className="font-medium">{Math.round(stats.visits.week / (stats.visits.total || 1) * 100)}%</div>
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
              <select className="bg-dashboard-bg text-dashboard-text text-xs rounded-md px-2 py-1 border border-dashboard-border">
                <option>آخر 7 أيام</option>
                <option>آخر 30 يوم</option>
                <option>هذا العام</option>
              </select>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative h-[340px]">
                {isLoadingDashboard ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoaderIcon className="h-8 w-8 animate-spin text-primary-500" />
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row items-center justify-center h-full">
                    <div className="w-full h-full">
                      <div className="mb-4 text-sm font-medium text-dashboard-text">رموز الدعوة - آخر 7 أيام</div>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart
                          data={weeklyData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorScanned" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                              borderRadius: '0.5rem',
                              border: '1px solid #f1f5f9',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="رموز مستخدمة" 
                            stroke="#4f46e5" 
                            fillOpacity={1} 
                            fill="url(#colorScanned)" 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="رموز جديدة" 
                            stroke="#10b981" 
                            fillOpacity={1} 
                            fill="url(#colorNew)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
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
              <CardTitle className="text-lg font-semibold text-dashboard-text">توزيع الرموز</CardTitle>
              <button className="text-primary-500 text-sm font-medium">
                عرض الكل
              </button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[260px] flex items-center justify-center">
                {isLoadingDashboard ? (
                  <LoaderIcon className="h-8 w-8 animate-spin text-primary-500" />
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={60}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [value, name]}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                          borderRadius: '0.5rem',
                          border: '1px solid #f1f5f9',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center p-2 rounded-lg bg-indigo-50 border border-indigo-100">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 mr-3"></div>
                  <div className="flex-1 text-sm text-dashboard-text-muted">تم مسحها</div>
                  <div className="font-medium text-dashboard-text">{stats.codes.used}</div>
                </div>
                
                <div className="flex items-center p-2 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="w-3 h-3 rounded-full bg-blue-300 mr-3"></div>
                  <div className="flex-1 text-sm text-dashboard-text-muted">متبقية</div>
                  <div className="font-medium text-dashboard-text">{stats.codes.active}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* إضافة قسم إحصائيات متقدمة */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-white shadow-sm border-dashboard-border">
          <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-0">
            <CardTitle className="text-lg font-semibold text-dashboard-text">تحليل الزيارات والاستخدام</CardTitle>
            <div className="flex space-x-2">
              <select className="bg-dashboard-bg text-dashboard-text text-xs rounded-md px-2 py-1 border border-dashboard-border">
                <option>اليوم</option>
                <option>هذا الأسبوع</option>
                <option>هذا الشهر</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* مخطط شريطي للزيارات */}
              <div className="space-y-2">
                <h3 className="text-base font-medium text-dashboard-text">توزيع الزيارات حسب الصفحات</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={visitData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="path" width={100} />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                          borderRadius: '0.5rem',
                          border: '1px solid #f1f5f9',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="زيارات" 
                        fill="#8884d8" 
                        radius={[0, 4, 4, 0]}
                        background={{ fill: '#f9fafb' }}
                      >
                        {visitData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index % 2 ? '#4f46e5' : '#818cf8'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* مخطط خطي للزيارات اليومية */}
              <div className="space-y-2">
                <h3 className="text-base font-medium text-dashboard-text">الزيارات اليومية</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dailyVisitData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                          borderRadius: '0.5rem',
                          border: '1px solid #f1f5f9',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="زيارات" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6, stroke: '#8884d8', strokeWidth: 2, fill: 'white' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* معلومات إضافية */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-dashboard-bg rounded-lg p-4 border border-dashboard-border">
                <div className="text-sm text-dashboard-text-muted">رموز مضافة هذا الأسبوع</div>
                <div className="text-2xl font-bold text-dashboard-text mt-2">
                  {stats.codes.week}
                </div>
                <div className="text-xs text-green-500 mt-1">
                  ↑ {stats.codes.todayUsed} تم استخدامها اليوم
                </div>
              </div>
              
              <div className="bg-dashboard-bg rounded-lg p-4 border border-dashboard-border">
                <div className="text-sm text-dashboard-text-muted">معدل الاستخدام اليومي</div>
                <div className="text-2xl font-bold text-dashboard-text mt-2">
                  {stats.codes.yesterday > 0 
                    ? Math.round((stats.codes.todayUsed / stats.codes.yesterday) * 100) 
                    : 0}%
                </div>
                <div className="text-xs text-blue-500 mt-1">
                  مقارنة بالأمس
                </div>
              </div>
              
              <div className="bg-dashboard-bg rounded-lg p-4 border border-dashboard-border">
                <div className="text-sm text-dashboard-text-muted">نسبة النمو الشهرية</div>
                <div className="text-2xl font-bold text-dashboard-text mt-2">
                  {stats.codes.month > 0 
                    ? Math.round((stats.codes.week / stats.codes.month) * 100) 
                    : 0}%
                </div>
                <div className="text-xs text-green-500 mt-1">
                  مقارنة بالشهر الماضي
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 