import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // حذف البيانات الموجودة أولاً لتجنب التكرار
  await prisma.inviteCode.deleteMany({})

  // إضافة بيانات رموز الدعوة التجريبية
  const demoInviteCodes = [
    {
      code: 'WELCOME2024',
      isActive: true
    },
    {
      code: 'VIP-ACCESS',
      isActive: true
    },
    {
      code: 'BETA-TESTER',
      isActive: true
    },
    {
      code: 'EARLYBIRD',
      isActive: false
    },
    {
      code: 'PREMIUM-USER',
      isActive: true
    },
    {
      code: 'SPECIAL-OFFER',
      isActive: false
    },
    {
      code: 'FRIENDS-ONLY',
      isActive: true
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