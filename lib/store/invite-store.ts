import { create } from 'zustand'

export type InviteCode = {
  id: string
  code: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

type InviteStore = {
  inviteCodes: InviteCode[]
  isLoading: boolean
  error: string | null
  fetchInviteCodes: () => Promise<void>
  addInviteCode: (code: string) => Promise<void>
  updateInviteCode: (id: string, data: Partial<InviteCode>) => Promise<void>
  deleteInviteCode: (id: string) => Promise<void>
  verifyInviteCode: (code: string) => Promise<boolean>
}

export const useInviteStore = create<InviteStore>((set, get) => ({
  inviteCodes: [],
  isLoading: false,
  error: null,

  fetchInviteCodes: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/invite-codes')
      if (!response.ok) throw new Error('فشل في جلب رموز الدعوة')
      const data = await response.json()
      set({ inviteCodes: data, isLoading: false })
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
  }
})) 