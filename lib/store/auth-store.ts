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
          // تعيين الحالة بشكل متزامن
          set({ isLoggedIn: true })
          
          // حفظ حالة تسجيل الدخول في localStorage بشكل مباشر للتأكيد
          if (typeof window !== 'undefined') {
            localStorage.setItem('user-logged-in', 'true')
            // حفظ مباشر لبيانات Zustand في localStorage أيضًا للتأكد من تزامنها
            localStorage.setItem('auth-storage', JSON.stringify({
              state: { isLoggedIn: true }
            }))
          }
          return true
        }
        return false
      },
      
      logout: () => {
        set({ isLoggedIn: false })
        
        // إزالة البيانات من localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user-logged-in')
          localStorage.removeItem('auth-storage')
          
          // إزالة ملف تعريف الارتباط أيضًا
          document.cookie = "user-logged-in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie = "auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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