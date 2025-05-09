import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

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
          // حفظ حالة تسجيل الدخول في localStorage بشكل مباشر أيضًا للتأكيد
          if (typeof window !== 'undefined') {
            localStorage.setItem('user-logged-in', 'true')
          }
          return true
        }
        return false
      },
      
      logout: () => {
        set({ isLoggedIn: false })
        // إزالة العنصر من localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user-logged-in')
        }
      }
    }),
    {
      name: 'auth-storage', // اسم المفتاح في localStorage
      storage: createJSONStorage(() => localStorage),
      skipHydration: false, // تحميل فوري للبيانات
    }
  )
) 