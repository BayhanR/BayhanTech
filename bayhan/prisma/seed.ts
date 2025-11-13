import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed başlatılıyor...')

  // Şirketleri oluştur
  const tezerperde = await prisma.company.upsert({
    where: { category: 'perdeci' },
    update: {},
    create: {
      name: 'Tezerperde.com',
      category: 'perdeci',
      logoPath: '/tezerlogo.png',
    },
  })

  const brew = await prisma.company.upsert({
    where: { category: 'brew' },
    update: {},
    create: {
      name: 'Brew Gayrimenkul',
      category: 'brew',
      logoPath: '/logobrew.png',
    },
  })

  const mina = await prisma.company.upsert({
    where: { category: 'mina' },
    update: {},
    create: {
      name: 'Mina Giyim',
      category: 'mina',
      logoPath: null, // Henüz logo yok
    },
  })

  console.log('✅ Şirketler oluşturuldu:', { tezerperde, brew, mina })

  // Örnek kullanıcı oluştur (şifre: "test123" - production'da değiştir!)
  const hashedPassword = await bcrypt.hash('test123', 10)

  const testUser = await prisma.user.upsert({
    where: { email: 'erditezer@gmail.com' },
    update: {},
    create: {
      email: 'erditezer@gmail.com',
      passwordHash: hashedPassword,
      profile: {
        create: {
          companyId: tezerperde.id, // Perdeci'ye atanmış
        },
      },
    },
  })

  console.log('✅ Test kullanıcısı oluşturuldu:', testUser.email)

  // Abonelik örneği (1 yıl sonra bitiyor)
  const expiresAt = new Date()
  expiresAt.setFullYear(expiresAt.getFullYear() + 1)

  await prisma.subscription.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      expiresAt,
    },
  })

  console.log('✅ Abonelik oluşturuldu')

  console.log('🎉 Seed tamamlandı!')
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

