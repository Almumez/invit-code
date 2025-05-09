'use client'

import { useState, useEffect } from 'react'
import { useInviteStore } from '@/lib/store/invite-store'
import { useVisitStore } from '@/lib/store/visit-store'
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
  const { inviteCodes, isLoading: isLoadingInvites, fetchInviteCodes } = useInviteStore()
  const { stats, isLoading: isLoadingVisits, fetchVisitStats } = useVisitStore()
  
  // استخدام useRef لمنع تكرار الاستدعاء
  const initialized = React.useRef(false);
  
  useEffect(() => {
    if (!initialized.current) {
      fetchInviteCodes()
      fetchVisitStats()
      initialized.current = true;
    }
  }, [fetchInviteCodes, fetchVisitStats])
  
  // إحصائيات للرموز
  const totalCodes = inviteCodes.length
  const activeCodes = inviteCodes.filter(code => code.isActive).length
  const scannedCodes = inviteCodes.filter(code => !code.isActive).length
  
  // نسبة الرموز المستخدمة
  const scannedPercentage = totalCodes > 0 ? Math.round((scannedCodes / totalCodes) * 100) : 0
  const activePercentage = totalCodes > 0 ? Math.round((activeCodes / totalCodes) * 100) : 0
  
  // بيانات للمخطط الدائري
  const pieData = [
    { name: 'الرموز المستخدمة', value: scannedCodes, color: '#4f46e5' },
    { name: 'الرموز المتبقية', value: activeCodes, color: '#93c5fd' }
  ]
  
  // بيانات للمخطط الخطي - بيانات تمثيلية للأيام السبعة الماضية
  const generateWeeklyData = () => {
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days.map((day, index) => {
      // بيانات تمثيلية - في الواقع ستأتي من قاعدة البيانات
      const scanned = Math.floor(Math.random() * 15) + 1;
      const active = Math.floor(Math.random() * 10) + 1;
      const total = scanned + active;
      return {
        name: day,
        'رموز مستخدمة': scanned,
        'رموز متبقية': active,
        'رموز جديدة': Math.floor(Math.random() * 5)
      };
    });
  };
  
  const weeklyData = React.useMemo(() => generateWeeklyData(), []);
  
  // بيانات للمخطط الشريطي - توزيع الزيارات
  const visitData = React.useMemo(() => {
    if (stats.paths && stats.paths.length > 0) {
      return stats.paths.map(item => ({
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
  }, [stats.paths]);
  
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
              <select className="bg-dashboard-bg text-dashboard-text text-xs rounded-md px-2 py-1 border border-dashboard-border">
                <option>آخر 7 أيام</option>
                <option>آخر 30 يوم</option>
                <option>هذا العام</option>
              </select>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative h-[340px]">
                {isLoadingInvites ? (
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
                            dataKey="رموز متبقية" 
                            stroke="#60a5fa" 
                            fillOpacity={1} 
                            fill="url(#colorActive)" 
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
                {isLoadingInvites ? (
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
                  <div className="font-medium text-dashboard-text">{scannedCodes}</div>
                </div>
                
                <div className="flex items-center p-2 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="w-3 h-3 rounded-full bg-blue-300 mr-3"></div>
                  <div className="flex-1 text-sm text-dashboard-text-muted">متبقية</div>
                  <div className="font-medium text-dashboard-text">{activeCodes}</div>
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
              
              {/* مخطط خطي للأداء */}
              <div className="space-y-2">
                <h3 className="text-base font-medium text-dashboard-text">معدل مسح الرموز</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={weeklyData}
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
                        dataKey="رموز مستخدمة" 
                        stroke="#4f46e5" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 2, fill: 'white' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="رموز جديدة" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: 'white' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* معلومات إضافية */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-dashboard-bg rounded-lg p-4 border border-dashboard-border">
                <div className="text-sm text-dashboard-text-muted">معدل المسح اليومي</div>
                <div className="text-2xl font-bold text-dashboard-text mt-2">
                  {totalCodes > 0 ? Math.round((scannedCodes / totalCodes) * 100) / 100 : 0}%
                </div>
                <div className="text-xs text-green-500 mt-1">
                  ↑ 12% مقارنة بالأسبوع الماضي
                </div>
              </div>
              
              <div className="bg-dashboard-bg rounded-lg p-4 border border-dashboard-border">
                <div className="text-sm text-dashboard-text-muted">وقت الذروة</div>
                <div className="text-2xl font-bold text-dashboard-text mt-2">
                  17:00 - 19:00
                </div>
                <div className="text-xs text-blue-500 mt-1">
                  30% من الرموز تستخدم خلال هذه الفترة
                </div>
              </div>
              
              <div className="bg-dashboard-bg rounded-lg p-4 border border-dashboard-border">
                <div className="text-sm text-dashboard-text-muted">نسبة النجاح</div>
                <div className="text-2xl font-bold text-dashboard-text mt-2">
                  98.5%
                </div>
                <div className="text-xs text-green-500 mt-1">
                  ↑ 2.5% تحسن منذ آخر تحديث
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 