import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // الحصول على قيمة التخزين المؤقت للتحقق من تسجيل الدخول
  const isAuthenticated = request.cookies.get('auth-storage')?.value
  const isLoggedInCookie = isAuthenticated && JSON.parse(isAuthenticated)?.state?.isLoggedIn
  
  // قراءة البديل الاحتياطي المباشر من ملف تعريف الارتباط الثاني الذي نحفظه
  const directUserLoggedInCookie = request.cookies.get('user-logged-in')?.value === 'true'
  
  // اعتبر المستخدم مسجل الدخول إذا كان أي من ملفات تعريف الارتباط يشير إلى ذلك
  const isUserLoggedIn = isLoggedInCookie || directUserLoggedInCookie
  
  // التحقق مما إذا كان المستخدم يحاول الوصول إلى لوحة التحكم
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')
  const isLoginRoute = request.nextUrl.pathname.startsWith('/login')
  
  // إذا كان المستخدم يحاول الوصول إلى لوحة التحكم وليس مصادقًا، قم بإعادة توجيهه إلى صفحة تسجيل الدخول
  if (isDashboardRoute && !isUserLoggedIn) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
  
  // إذا كان المستخدم مسجل الدخول ويحاول الوصول إلى صفحة تسجيل الدخول، وجهه إلى لوحة التحكم
  if (isLoginRoute && isUserLoggedIn) {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }
  
  // إذا كان المستخدم في الجذر، قم بإعادة توجيهه إلى لوحة التحكم إذا كان مسجل الدخول أو إلى صفحة تسجيل الدخول إذا لم يكن كذلك
  if (request.nextUrl.pathname === '/') {
    if (isUserLoggedIn) {
      const dashboardUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    } else {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

// تحديد المسارات التي يتم تطبيق الوسيط عليها
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 