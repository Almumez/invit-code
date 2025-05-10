import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// إضافة generateStaticParams للتوافق مع الإخراج الثابت
export function generateStaticParams() {
  return [{ id: 'static' }]
}

// Function to generate a random string of specified length with customization options
function generateRandomCode(
  length: number, 
  options: { 
    includeNumbers?: boolean, 
    includeUppercase?: boolean, 
    includeLowercase?: boolean 
  } = { 
    includeNumbers: true, 
    includeUppercase: true, 
    includeLowercase: false 
  }
): string {
  let characters = '';
  
  // إضافة الأرقام إذا تم تحديدها
  if (options.includeNumbers) {
    characters += '0123456789';
  }
  
  // إضافة الأحرف الكبيرة إذا تم تحديدها
  if (options.includeUppercase) {
    characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }
  
  // إضافة الأحرف الصغيرة إذا تم تحديدها
  if (options.includeLowercase) {
    characters += 'abcdefghijklmnopqrstuvwxyz';
  }
  
  // إذا لم يتم تحديد أي خيارات، استخدم الأرقام والأحرف الكبيرة افتراضيًا
  if (characters.length === 0) {
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  }
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const { count, length, options } = await request.json()
    
    // Validate input
    if (!count || !length || count <= 0 || length <= 0 || count > 1000) {
      return NextResponse.json(
        { error: 'عدد الرموز أو طول الرمز غير صالح. الحد الأقصى هو 1000 رمز.' },
        { status: 400 }
      )
    }
    
    // التحقق من تحديد خيار واحد على الأقل
    const characterOptions = options || { 
      includeNumbers: true, 
      includeUppercase: true, 
      includeLowercase: false 
    };
    
    if (!characterOptions.includeNumbers && 
        !characterOptions.includeUppercase && 
        !characterOptions.includeLowercase) {
      return NextResponse.json(
        { error: 'يجب تحديد نوع واحد على الأقل من الأحرف/الأرقام.' },
        { status: 400 }
      )
    }

    // Generate unique codes
    const generatedCodes: string[] = []
    for (let i = 0; i < count; i++) {
      let code: string = '';
      let isUnique = false;
      
      // Keep generating until we get a unique code
      while (!isUnique) {
        code = generateRandomCode(length, characterOptions)
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