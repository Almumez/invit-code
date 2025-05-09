const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // حذف البيانات الموجودة أولاً لتجنب التكرار
  await prisma.inviteCode.deleteMany({})

  // إضافة بيانات رموز الدعوة التجريبية
  const demoInviteCodes = [
    {
      code: 'WELCOME2024',
      isActive: true,
      isScanned: false
    },
    {
      code: 'VIP-ACCESS',
      isActive: true,
      isScanned: true
    },
    {
      code: 'BETA-TESTER',
      isActive: true,
      isScanned: false
    },
    {
      code: 'EARLYBIRD',
      isActive: false,
      isScanned: false
    },
    {
      code: 'PREMIUM-USER',
      isActive: true,
      isScanned: true
    },
    {
      code: 'SPECIAL-OFFER',
      isActive: false,
      isScanned: false
    },
    {
      code: 'FRIENDS-ONLY',
      isActive: true,
      isScanned: false
    }
  ]

  for (const inviteCode of demoInviteCodes) {
    await prisma.inviteCode.create({
      data: inviteCode
    })
  }

  console.log('تم إضافة البيانات التجريبية بنجاح!')
}

main()
  .catch((e) => {
    console.error('حدث خطأ أثناء إضافة البيانات التجريبية:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 