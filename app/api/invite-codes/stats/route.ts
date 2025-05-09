import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/invite-codes/stats - للحصول على إحصائيات رموز الدعوة
export async function GET() {
  try {
    // الحصول على عدد جميع الرموز (بدون تقسيم صفحي)
    const totalCount = await prisma.inviteCode.count()
    
    // الحصول على عدد الرموز النشطة
    const activeCount = await prisma.inviteCode.count({
      where: { isActive: true }
    })
    
    // الحصول على عدد الرموز المستخدمة (غير نشطة)
    const usedCount = await prisma.inviteCode.count({
      where: { isActive: false }
    })
    
    // رموز حسب الفترة الزمنية (اليوم، الأسبوع، الشهر)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)
    lastWeek.setHours(0, 0, 0, 0)
    
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    lastMonth.setHours(0, 0, 0, 0)
    
    const todayCount = await prisma.inviteCode.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    })
    
    const weekCount = await prisma.inviteCode.count({
      where: {
        createdAt: {
          gte: lastWeek
        }
      }
    })
    
    const monthCount = await prisma.inviteCode.count({
      where: {
        createdAt: {
          gte: lastMonth
        }
      }
    })
    
    return NextResponse.json({
      total: totalCount,
      active: activeCount,
      used: usedCount,
      today: todayCount,
      week: weekCount,
      month: monthCount
    })
  } catch (error) {
    console.error('خطأ في جلب إحصائيات رموز الدعوة:', error)
    return NextResponse.json(
      { error: 'فشل في جلب إحصائيات رموز الدعوة' },
      { status: 500 }
    )
  }
} 