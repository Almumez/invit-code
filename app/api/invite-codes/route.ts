import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/invite-codes - Fetch invite codes with pagination and filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    
    // Filter parameters
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    
    // Build where conditions
    const whereConditions: any = {}
    
    // Add search condition if provided
    if (search) {
      whereConditions.code = {
        contains: search,
        mode: 'insensitive'
      }
    }
    
    // Add status filter
    if (status === 'active') {
      whereConditions.isActive = true
    } else if (status === 'inactive') {
      whereConditions.isActive = false
    } else if (status === 'scanned') {
      whereConditions.isActive = false // Assuming scanned codes are inactive
    } else if (status === 'not_scanned') {
      whereConditions.isActive = true // Assuming non-scanned codes are active
    }
    
    // Get total count for pagination
    const totalCount = await prisma.inviteCode.count({
      where: whereConditions
    })
    
    // Get invite codes with pagination and filtering
    const inviteCodes = await prisma.inviteCode.findMany({
      where: whereConditions,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    
    return NextResponse.json({
      data: inviteCodes,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    })
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