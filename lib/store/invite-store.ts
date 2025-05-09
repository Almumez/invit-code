import { create } from 'zustand'

export type InviteCode = {
  id: string
  code: string
  isActive: boolean
  isScanned: boolean
  createdAt: Date
  updatedAt: Date
}

export type PaginationData = {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type StatsData = {
  total: number
  active: number
  used: number
  today: number
  week: number
  month: number
}

type InviteStore = {
  inviteCodes: InviteCode[]
  pagination: PaginationData
  stats: StatsData
  isLoading: boolean
  isLoadingStats: boolean
  error: string | null
  
  // Pagination and filtering state
  currentPage: number
  searchTerm: string
  filterStatus: string
  
  // Methods
  fetchInviteCodes: (options?: { page?: number, search?: string, status?: string }) => Promise<void>
  fetchStats: () => Promise<void>
  setPage: (page: number) => void
  setSearchTerm: (term: string) => void
  setFilterStatus: (status: string) => void
  
  addInviteCode: (code: string) => Promise<void>
  updateInviteCode: (id: string, data: Partial<InviteCode>) => Promise<void>
  deleteInviteCode: (id: string) => Promise<void>
  verifyInviteCode: (code: string) => Promise<boolean>
  generateInviteCodes: (count: number, length: number, options?: { 
    includeNumbers?: boolean, 
    includeUppercase?: boolean,
    includeLowercase?: boolean
  }) => Promise<void>
  scanInviteCode: (code: string) => Promise<{success: boolean, message: string}>
}

export const useInviteStore = create<InviteStore>((set, get) => ({
  inviteCodes: [],
  pagination: {
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  stats: {
    total: 0,
    active: 0,
    used: 0,
    today: 0,
    week: 0,
    month: 0
  },
  isLoading: false,
  isLoadingStats: false,
  error: null,
  
  // Pagination and filtering state
  currentPage: 1,
  searchTerm: '',
  filterStatus: 'all',

  // Fetch stats for dashboard
  fetchStats: async () => {
    set({ isLoadingStats: true })
    try {
      const response = await fetch('/api/invite-codes/stats')
      if (!response.ok) throw new Error('فشل في جلب إحصائيات رموز الدعوة')
      
      const stats = await response.json()
      set({ stats, isLoadingStats: false })
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error)
      set({ isLoadingStats: false })
    }
  },

  // Set pagination page
  setPage: (page: number) => {
    set({ currentPage: page })
    get().fetchInviteCodes({ page })
  },
  
  // Set search term
  setSearchTerm: (term: string) => {
    set({ searchTerm: term, currentPage: 1 })
    get().fetchInviteCodes({ page: 1, search: term })
  },
  
  // Set filter status
  setFilterStatus: (status: string) => {
    set({ filterStatus: status, currentPage: 1 })
    get().fetchInviteCodes({ page: 1, status })
  },

  fetchInviteCodes: async (options = {}) => {
    set({ isLoading: true, error: null })
    try {
      const { currentPage, searchTerm, filterStatus } = get()
      
      // Use provided options or fall back to current state
      const page = options.page || currentPage
      const search = options.search !== undefined ? options.search : searchTerm
      const status = options.status || filterStatus
      
      // Build query params
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', '20')
      
      if (search) {
        params.append('search', search)
      }
      
      if (status !== 'all') {
        params.append('status', status)
      }
      
      const response = await fetch(`/api/invite-codes?${params.toString()}`)
      if (!response.ok) throw new Error('فشل في جلب رموز الدعوة')
      
      const { data, pagination } = await response.json()
      
      set({ 
        inviteCodes: data, 
        pagination,
        currentPage: pagination.page,
        isLoading: false 
      })

      // تحديث الإحصائيات بعد الحصول على البيانات
      await get().fetchStats()
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  addInviteCode: async (code: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/invite-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      if (!response.ok) throw new Error('فشل في إضافة رمز الدعوة')
      await get().fetchInviteCodes()
      await get().fetchStats() // تحديث الإحصائيات
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  updateInviteCode: async (id: string, data: Partial<InviteCode>) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/invite-codes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('فشل في تحديث رمز الدعوة')
      await get().fetchInviteCodes()
      await get().fetchStats() // تحديث الإحصائيات
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  deleteInviteCode: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/invite-codes/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('فشل في حذف رمز الدعوة')
      await get().fetchInviteCodes()
      await get().fetchStats() // تحديث الإحصائيات
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  verifyInviteCode: async (code: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/verify-invite?code=${encodeURIComponent(code)}`)
      if (!response.ok) throw new Error('فشل في التحقق من رمز الدعوة')
      const data = await response.json()
      set({ isLoading: false })
      return data.valid
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      return false
    }
  },

  generateInviteCodes: async (count: number, length: number, options = { 
    includeNumbers: true, 
    includeUppercase: true,
    includeLowercase: false
  }) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/invite-codes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count, length, options })
      })
      if (!response.ok) throw new Error('فشل في توليد رموز الدعوة')
      await get().fetchInviteCodes()
      await get().fetchStats() // تحديث الإحصائيات
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  scanInviteCode: async (code: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/scan-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      if (!response.ok) throw new Error('فشل في التحقق من رمز الدعوة')
      const data = await response.json()
      
      if (data.success) {
        await get().fetchInviteCodes()
        await get().fetchStats() // تحديث الإحصائيات
      }
      
      set({ isLoading: false })
      return data
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      return { success: false, message: 'فشل في التحقق من رمز الدعوة' }
    }
  }
})) 