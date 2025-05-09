import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/invite-codes - Fetch all invite codes
export async function GET() {
  try {
    const inviteCodes = await prisma.inviteCode.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(inviteCodes)
  } catch (error) {
    console.error('خطأ في جلب رموز الدعوة:', error)
    return NextResponse.json(
      { error: 'فشل في جلب رموز الدعوة' },
      { status: 500 }
    )
  }
}

// POST /api/invite-codes - Create a new invite code
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'الرمز مطلوب' },
        { status: 400 }
      )
    }

    // Check if code already exists
    const existingCode = await prisma.inviteCode.findUnique({
      where: { code }
    })

    if (existingCode) {
      return NextResponse.json(
        { error: 'رمز الدعوة موجود بالفعل' },
        { status: 400 }
      )
    }

    const newInviteCode = await prisma.inviteCode.create({
      data: { code }
    })

    return NextResponse.json(newInviteCode, { status: 201 })
  } catch (error) {
    console.error('خطأ في إنشاء رمز الدعوة:', error)
    return NextResponse.json(
      { error: 'فشل في إنشاء رمز الدعوة' },
      { status: 500 }
    )
  }
} 