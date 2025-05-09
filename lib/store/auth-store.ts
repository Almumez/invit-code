import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthStore = {
  isLoggedIn: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      
      login: (username: string, password: string) => {
        // تحقق من بيانات تسجيل الدخول المحددة مسبقًا
        if (username === 'admin' && password === '123456') {
          set({ isLoggedIn: true })
          return true
        }
        return false
      },
      
      logout: () => {
        set({ isLoggedIn: false })
      }
    }),
    {
      name: 'auth-storage', // اسم المفتاح في localStorage
    }
  )
) 