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
  
  // التحقق مما إذا كان هناك معلمة في العنوان للسماح باستخدام الصفحة الرئيسية حتى للمستخدمين المسجلين
  const hasFromDashboardParam = request.nextUrl.searchParams.has('from_dashboard')
  
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
  
  // السماح بالوصول إلى الصفحة الرئيسية إذا كان المستخدم غير مسجل أو إذا كان الوصول من لوحة التحكم
  if (request.nextUrl.pathname === '/' && isUserLoggedIn && !hasFromDashboardParam) {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }
  
  return NextResponse.next()
}

// تحديد المسارات التي يتم تطبيق الوسيط عليها
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 