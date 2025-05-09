import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// منع توليد الصفحة بشكل ثابت لأننا نستخدم request.json()
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// Function to generate a random string of specified length
function generateRandomCode(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export async function POST(request: Request) {
  try {
    const { count, length } = await request.json()
    
    // Validate input
    if (!count || !length || count <= 0 || length <= 0 || count > 100) {
      return NextResponse.json(
        { error: 'عدد الرموز أو طول الرمز غير صالح. الحد الأقصى هو 100 رمز.' },
        { status: 400 }
      )
    }

    // Generate unique codes
    const generatedCodes = []
    for (let i = 0; i < count; i++) {
      let code
      let isUnique = false
      
      // Keep generating until we get a unique code
      while (!isUnique) {
        code = generateRandomCode(length)
        // Check if code already exists in database
        const existingCode = await prisma.inviteCode.findUnique({
          where: { code }
        })
        isUnique = !existingCode
      }
      
      generatedCodes.push(code)
    }

    // Save generated codes to database
    const createdCodes = await Promise.all(
      generatedCodes.map(code => 
        prisma.inviteCode.create({
          data: {
            code,
            isActive: true
          }
        })
      )
    )

    return NextResponse.json(createdCodes)
  } catch (error) {
    console.error('Error generating invite codes:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء توليد رموز الدعوة' },
      { status: 500 }
    )
  }
} 