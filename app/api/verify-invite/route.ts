import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/verify-invite?code=XXX - Verify an invite code
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { error: 'رمز الدعوة مطلوب' },
        { status: 400 }
      )
    }

    const inviteCode = await prisma.inviteCode.findUnique({
      where: { code }
    })

    const valid = !!inviteCode && inviteCode.isActive

    return NextResponse.json({ valid })
  } catch (error) {
    console.error('خطأ في التحقق من رمز الدعوة:', error)
    return NextResponse.json(
      { error: 'فشل في التحقق من رمز الدعوة' },
      { status: 500 }
    )
  }
} 