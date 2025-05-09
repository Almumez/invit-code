'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth-store'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { AlertCircle, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { isLoggedIn, login } = useAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // إذا كان المستخدم مسجل الدخول، فقم بتوجيهه إلى لوحة التحكم
  useEffect(() => {
    // التحقق من تسجيل الدخول من المتجر والتخزين المحلي
    const checkAuth = () => {
      if (isLoggedIn || (typeof window !== 'undefined' && localStorage.getItem('user-logged-in') === 'true')) {
        // محاولة التوجيه بطريقتين لضمان عمل إحداهما
        try {
          router.push('/dashboard')
        } catch (error) {
          // استخدم window.location كخطة بديلة إذا فشل router
          window.location.href = '/dashboard'
        }
      }
    }
    
    checkAuth()
  }, [isLoggedIn, router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    // تأخير قصير لمحاكاة عملية التحقق من الخادم
    setTimeout(() => {
      const success = login(username, password)
      setIsLoading(false)
      
      if (success) {
        // تأخير قصير جدًا للتأكد من اكتمال تحديث حالة تسجيل الدخول
        // ثم التوجيه مباشرة إلى لوحة التحكم
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 100)
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة')
      }
    }, 800)
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-dashboard-sidebar">
      <div className="w-full max-w-md mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dashboard-text mb-2">نظام رموز الدعوة</h1>
          <p className="text-dashboard-text-muted">تسجيل الدخول إلى لوحة التحكم</p>
        </div>
        
        <Card className="bg-white shadow-lg border-dashboard-border overflow-hidden">
          <CardHeader className="space-y-1 bg-primary-50 border-b border-dashboard-border p-6">
            <CardTitle className="text-xl font-bold text-dashboard-text flex items-center">
              <LogIn className="h-5 w-5 ml-2 text-primary-500" />
              تسجيل الدخول
            </CardTitle>
            <CardDescription className="text-dashboard-text-muted">
              أدخل بيانات الدخول للوصول إلى لوحة التحكم
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  className="bg-dashboard-bg border-dashboard-border"
                  required
                  autoComplete="username"
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="bg-dashboard-bg border-dashboard-border"
                  required
                  autoComplete="current-password"
                />
              </div>
              
              {error && (
                <div className="p-3 rounded-md flex items-center gap-2 text-sm bg-red-50 text-red-600 border border-red-100">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full mt-6 bg-dashboard-accent hover:bg-dashboard-accent-hover text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-20 border-t-white rounded-full"></div>
                    جاري تسجيل الدخول...
                  </div>
                ) : (
                  <span>تسجيل الدخول</span>
                )}
              </Button>
              
              <div className="text-center mt-4 text-xs text-dashboard-text-muted">
                <p>بيانات تسجيل الدخول للاختبار:</p>
                <p className="mt-1">اسم المستخدم: <span className="font-bold">admin</span></p>
                <p>كلمة المرور: <span className="font-bold">123456</span></p>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center mt-4 text-dashboard-text-muted text-sm">
          جميع الحقوق محفوظة © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  )
} 