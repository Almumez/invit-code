import { create } from 'zustand'

// نوع بيانات رموز الدعوة
export type CodesStatsData = {
  total: number
  active: number
  used: number
  today: number
  yesterday: number
  week: number
  month: number
  todayUsed: number
  weeklyStats: Array<{
    date: string
    added: number
    used: number
  }>
}

// نوع بيانات الزيارات
export type VisitsStatsData = {
  total: number
  today: number
  week: number
  pathStats: Array<{
    path: string
    _count: {
      path: number
    }
  }>
  hourlyVisits: Array<{
    hour: number
    _count: {
      id: number
    }
  }>
  dailyVisits: Array<{
    date: string
    visits: number
  }>
}

// نوع بيانات إحصائيات لوحة التحكم
export type DashboardStatsData = {
  codes: CodesStatsData
  visits: VisitsStatsData
}

// تعريف المتجر
interface DashboardStore {
  stats: DashboardStatsData
  isLoading: boolean
  error: string | null
  fetchDashboardStats: () => Promise<void>
}

// إنشاء القيم الافتراضية
const defaultCodesStats: CodesStatsData = {
  total: 0,
  active: 0,
  used: 0,
  today: 0,
  yesterday: 0,
  week: 0,
  month: 0,
  todayUsed: 0,
  weeklyStats: []
}

const defaultVisitsStats: VisitsStatsData = {
  total: 0,
  today: 0,
  week: 0,
  pathStats: [],
  hourlyVisits: [],
  dailyVisits: []
}

// إنشاء المتجر
export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: {
    codes: defaultCodesStats,
    visits: defaultVisitsStats
  },
  isLoading: false,
  error: null,
  
  // جلب إحصائيات لوحة التحكم
  fetchDashboardStats: async () => {
    set({ isLoading: true })
    try {
      const response = await fetch('/api/dashboard/stats')
      if (!response.ok) throw new Error('فشل في جلب إحصائيات لوحة التحكم')
      
      const stats = await response.json()
      set({ stats, isLoading: false })
    } catch (error) {
      console.error('خطأ في جلب إحصائيات لوحة التحكم:', error)
      set({ 
        error: error instanceof Error ? error.message : 'فشل في جلب إحصائيات لوحة التحكم',
        isLoading: false 
      })
    }
  }
}))