import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/scan-invite - Scan an invite code
export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'رمز الدعوة مطلوب' },
        { status: 400 }
      )
    }

    // البحث عن الرمز
    const inviteCode = await prisma.inviteCode.findUnique({
      where: { code }
    })

    // التحقق من وجود الرمز
    if (!inviteCode) {
      return NextResponse.json(
        { success: false, message: 'رمز الدعوة غير موجود' },
        { status: 404 }
      )
    }

    // التحقق من أن الرمز نشط
    if (!inviteCode.isActive) {
      return NextResponse.json(
        { success: false, message: 'رمز الدعوة غير نشط' },
        { status: 400 }
      )
    }

    // بدلاً من استخدام حقل isScanned، سنعتبر الرمز تم مسحه إذا كان غير نشط
    // تحديث حالة الرمز إلى غير نشط لدلالة على أنه تم مسحه
    const updatedCode = await prisma.inviteCode.update({
      where: { id: inviteCode.id },
      data: { 
        isActive: false,
        updatedAt: new Date() // تحديث وقت التعديل
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم مسح رمز الدعوة بنجاح',
      code: updatedCode
    })
  } catch (error) {
    console.error('خطأ في مسح رمز الدعوة:', error)
    return NextResponse.json(
      { success: false, message: 'فشل في مسح رمز الدعوة' },
      { status: 500 }
    )
  }
} 