import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// إضافة generateStaticParams للتوافق مع الإخراج الثابت
export function generateStaticParams() {
  return [{ id: 'static' }]
}

// GET /api/invite-codes/[id] - Get a specific invite code
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const inviteCode = await prisma.inviteCode.findUnique({
      where: { id }
    })

    if (!inviteCode) {
      return NextResponse.json(
        { error: 'رمز الدعوة غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json(inviteCode)
  } catch (error) {
    console.error('خطأ في جلب رمز الدعوة:', error)
    return NextResponse.json(
      { error: 'فشل في جلب رمز الدعوة' },
      { status: 500 }
    )
  }
}

// PATCH /api/invite-codes/[id] - Update a specific invite code
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    const { code, isActive } = body

    // Check if invite code exists
    const existingInviteCode = await prisma.inviteCode.findUnique({
      where: { id }
    })

    if (!existingInviteCode) {
      return NextResponse.json(
        { error: 'رمز الدعوة غير موجود' },
        { status: 404 }
      )
    }

    // If updating code, check if new code already exists
    if (code && code !== existingInviteCode.code) {
      const duplicateCode = await prisma.inviteCode.findUnique({
        where: { code }
      })

      if (duplicateCode) {
        return NextResponse.json(
          { error: 'رمز الدعوة موجود بالفعل' },
          { status: 400 }
        )
      }
    }

    // Update invite code
    const updatedInviteCode = await prisma.inviteCode.update({
      where: { id },
      data: {
        ...(code && { code }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json(updatedInviteCode)
  } catch (error) {
    console.error('خطأ في تحديث رمز الدعوة:', error)
    return NextResponse.json(
      { error: 'فشل في تحديث رمز الدعوة' },
      { status: 500 }
    )
  }
}

// DELETE /api/invite-codes/[id] - Delete a specific invite code
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Check if invite code exists
    const existingInviteCode = await prisma.inviteCode.findUnique({
      where: { id }
    })

    if (!existingInviteCode) {
      return NextResponse.json(
        { error: 'رمز الدعوة غير موجود' },
        { status: 404 }
      )
    }

    // Delete invite code
    await prisma.inviteCode.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'تم حذف رمز الدعوة بنجاح' },
      { status: 200 }
    )
  } catch (error) {
    console.error('خطأ في حذف رمز الدعوة:', error)
    return NextResponse.json(
      { error: 'فشل في حذف رمز الدعوة' },
      { status: 500 }
    )
  }
} 