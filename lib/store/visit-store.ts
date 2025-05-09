import { create } from 'zustand'

interface VisitStats {
  total: number
  today: number
  weekly: number
  paths: { path: string; _count: { path: number } }[]
}

interface VisitState {
  isLoading: boolean
  error: string | null
  stats: VisitStats
  fetchVisitStats: () => Promise<void>
  recordVisit: (path: string) => Promise<void>
}

export const useVisitStore = create<VisitState>((set) => ({
  isLoading: false,
  error: null,
  stats: {
    total: 0,
    today: 0,
    weekly: 0,
    paths: []
  },
  
  fetchVisitStats: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await fetch('/api/visits')
      const data = await response.json()
      
      if (data.success) {
        set({ stats: data.stats, isLoading: false })
      } else {
        set({ 
          error: data.error || 'حدث خطأ أثناء جلب إحصائيات الزيارات',
          isLoading: false 
        })
      }
    } catch (error) {
      console.error('Error fetching visit stats:', error)
      set({ 
        error: error instanceof Error ? error.message : 'حدث خطأ أثناء جلب إحصائيات الزيارات',
        isLoading: false 
      })
    }
  },
  
  recordVisit: async (path: string) => {
    try {
      const response = await fetch('/api/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ path })
      })
      
      const data = await response.json()
      
      if (!data.success) {
        console.error('Failed to record visit:', data.error)
      }
    } catch (error) {
      console.error('Error recording visit:', error)
    }
  }
})) 