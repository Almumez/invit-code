import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// تسجيل زيارة جديدة
export async function POST(request: NextRequest) {
  try {
    const { path = '/' } = await request.json()
    
    // الحصول على IP و User Agent (إذا كانا متاحين)
    const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // نسجل كل الزيارات ولا نمنع التكرار بناءً على IP
    const visit = await prisma.visit.create({
      data: {
        path,
        ip: ip.toString(),
        userAgent
      }
    })

    return NextResponse.json({ success: true, visit }, { status: 201 })
  } catch (error) {
    console.error('Error recording visit:', error)
    return NextResponse.json({ success: false, error: 'Failed to record visit' }, { status: 500 })
  }
}

// الحصول على إحصائيات الزيارات
export async function GET() {
  try {
    // إجمالي عدد الزيارات
    const totalVisits = await prisma.visit.count()
    
    // الزيارات اليوم
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayVisits = await prisma.visit.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    })
    
    // الزيارات هذا الأسبوع
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)
    const weeklyVisits = await prisma.visit.count({
      where: {
        createdAt: {
          gte: lastWeek
        }
      }
    })
    
    // الزيارات حسب المسار (URL)
    const pathStats = await prisma.visit.groupBy({
      by: ['path'],
      _count: {
        path: true
      }
    })
    
    return NextResponse.json({
      success: true,
      stats: {
        total: totalVisits,
        today: todayVisits,
        weekly: weeklyVisits,
        paths: pathStats
      }
    })
  } catch (error) {
    console.error('Error getting visit stats:', error)
    return NextResponse.json({ success: false, error: 'Failed to get visit statistics' }, { status: 500 })
  }
} 