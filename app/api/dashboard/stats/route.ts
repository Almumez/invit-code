import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/dashboard/stats - للحصول على إحصائيات لوحة التحكم
export async function GET() {
  try {
    // إحصائيات رموز الدعوة
    // ===================
    
    // عدد جميع الرموز
    const totalCodes = await prisma.inviteCode.count()
    
    // الرموز النشطة
    const activeCodes = await prisma.inviteCode.count({
      where: { isActive: true }
    })
    
    // الرموز المستخدمة
    const usedCodes = await prisma.inviteCode.count({
      where: { isActive: false }
    })
    
    // توزيع الرموز خلال الوقت
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)
    
    const lastMonth = new Date(today)
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    
    // رموز أنشئت اليوم
    const todayCodes = await prisma.inviteCode.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    })
    
    // رموز أنشئت أمس
    const yesterdayCodes = await prisma.inviteCode.count({
      where: {
        createdAt: {
          gte: yesterday,
          lt: today
        }
      }
    })
    
    // رموز أنشئت خلال الأسبوع الماضي
    const weekCodes = await prisma.inviteCode.count({
      where: {
        createdAt: {
          gte: lastWeek
        }
      }
    })
    
    // رموز أنشئت خلال الشهر الماضي
    const monthCodes = await prisma.inviteCode.count({
      where: {
        createdAt: {
          gte: lastMonth
        }
      }
    })
    
    // رموز استخدمت اليوم
    const todayUsedCodes = await prisma.inviteCode.count({
      where: {
        isActive: false,
        updatedAt: {
          gte: today
        }
      }
    })
    
    // إحصائيات على مدار الأسبوع
    const weeklyStats = await Promise.all(
      Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        
        const prevDay = new Date(date)
        prevDay.setDate(prevDay.getDate() - 1)
        
        return Promise.all([
          // الرموز المضافة في هذا اليوم
          prisma.inviteCode.count({
            where: {
              createdAt: {
                gte: prevDay,
                lt: date
              }
            }
          }),
          // الرموز المستخدمة في هذا اليوم
          prisma.inviteCode.count({
            where: {
              isActive: false,
              updatedAt: {
                gte: prevDay,
                lt: date
              }
            }
          })
        ]).then(([added, used]) => ({
          date: prevDay.toISOString().split('T')[0],
          added,
          used
        }))
      })
    )
    
    // إحصائيات الزيارات
    // ===================
    
    // إجمالي الزيارات
    const totalVisits = await prisma.visit.count()
    
    // زيارات اليوم
    const todayVisits = await prisma.visit.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    })
    
    // زيارات الأسبوع الماضي
    const weekVisits = await prisma.visit.count({
      where: {
        createdAt: {
          gte: lastWeek
        }
      }
    })
    
    // توزيع الزيارات حسب المسار (أعلى 10)
    const pathStats = await prisma.visit.groupBy({
      by: ['path'],
      _count: {
        path: true
      },
      orderBy: {
        _count: {
          path: 'desc'
        }
      },
      take: 10
    })
    
    // توزيع الزيارات بالساعة - نقوم بالاستعلام عن جميع الزيارات ثم نقوم بتجميعها حسب الساعة في الكود
    const allVisits = await prisma.visit.findMany({
      select: {
        createdAt: true
      }
    })
    
    // تجميع الزيارات حسب الساعة
    const hoursByVisit = allVisits.reduce((acc, visit) => {
      const hour = new Date(visit.createdAt).getHours()
      if (!acc[hour]) {
        acc[hour] = 0
      }
      acc[hour]++
      return acc
    }, {})
    
    // تحويل البيانات إلى التنسيق المطلوب
    const hourlyVisits = Object.entries(hoursByVisit).map(([hour, count]) => ({
      hour: parseInt(hour),
      _count: {
        id: count
      }
    })).sort((a, b) => a.hour - b.hour)
    
    // توزيع الزيارات اليومية خلال الأسبوع
    const dailyVisits = await Promise.all(
      Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        
        const prevDay = new Date(date)
        prevDay.setDate(prevDay.getDate() - 1)
        
        return prisma.visit.count({
          where: {
            createdAt: {
              gte: prevDay,
              lt: date
            }
          }
        }).then(count => ({
          date: prevDay.toISOString().split('T')[0],
          visits: count
        }))
      })
    )
    
    return NextResponse.json({
      codes: {
        total: totalCodes,
        active: activeCodes,
        used: usedCodes,
        today: todayCodes,
        yesterday: yesterdayCodes,
        week: weekCodes,
        month: monthCodes,
        todayUsed: todayUsedCodes,
        weeklyStats
      },
      visits: {
        total: totalVisits,
        today: todayVisits,
        week: weekVisits,
        pathStats,
        hourlyVisits,
        dailyVisits
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'فشل في جلب إحصائيات لوحة التحكم' },
      { status: 500 }
    )
  }
} 